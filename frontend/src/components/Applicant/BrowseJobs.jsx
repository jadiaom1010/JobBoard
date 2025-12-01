import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';

const BrowseJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    fetchJobs();
  }, [search, location, jobType]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (location) params.append('location', location);
      if (jobType) params.append('job_type', jobType);

      const response = await API.get(`/jobs?${params}`);
      let sortedJobs = response.data.jobs;

      if (sortBy === 'salary') {
        sortedJobs = [...sortedJobs].sort((a, b) => b.salary_max - a.salary_max);
      }

      setJobs(sortedJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSalaryRange = (min, max) => {
    if (max >= 1000000) return '$1M+';
    if (max >= 100000) return `$${Math.floor(max / 1000)}K+`;
    return `$${min} - $${max}`;
  };

  const getJobTypeColor = (type) => {
    return type === 'full-time' ? 'badge-full-time' : 'badge-part-time';
  };

  return (
    <div className="browse-jobs-container">
      {/* HERO SECTION */}
      <div className="browse-hero">
        <h1 className="hero-title">Find Your Next Opportunity</h1>
        <p className="hero-subtitle">Explore thousands of job openings from top companies</p>
      </div>

      {/* FILTERS SECTION */}
      <div className="filters-section">
        <div className="filters-header">
          <h2>Filter Jobs</h2>
          <button 
            className="reset-filters-btn"
            onClick={() => {
              setSearch('');
              setLocation('');
              setJobType('');
              setSortBy('recent');
            }}
          >
            ↻ Reset
          </button>
        </div>

        <div className="filters-grid">
          {/* Search Filter */}
          <div className="filter-item">
            <label>🔍 Search</label>
            <input
              type="text"
              placeholder="Job title, company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="filter-input"
            />
          </div>

          {/* Location Filter */}
          <div className="filter-item">
            <label>📍 Location</label>
            <input
              type="text"
              placeholder="City, country..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="filter-input"
            />
          </div>

          {/* Job Type Filter */}
          <div className="filter-item">
            <label>📋 Job Type</label>
            <select 
              value={jobType} 
              onChange={(e) => setJobType(e.target.value)}
              className="filter-select"
            >
              <option value="">All Types</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
            </select>
          </div>

          {/* Sort Filter */}
          <div className="filter-item">
            <label>↕️ Sort By</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="recent">Most Recent</option>
              <option value="salary">Highest Salary</option>
            </select>
          </div>
        </div>
      </div>

      {/* JOBS DISPLAY */}
      <div className="jobs-display">
        {/* LOADING STATE */}
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Searching for amazing opportunities...</p>
          </div>
        ) : jobs.length === 0 ? (
          /* NO RESULTS STATE */
          <div className="no-results">
            <div className="no-results-icon">😢</div>
            <h3>No Jobs Found</h3>
            <p>Try adjusting your filters or search terms</p>
            <button 
              className="btn btn-primary"
              onClick={() => {
                setSearch('');
                setLocation('');
                setJobType('');
              }}
            >
              View All Jobs
            </button>
          </div>
        ) : (
          /* JOBS LIST */
          <div>
            <div className="jobs-count">
              Found <span className="count-badge">{jobs.length}</span> job{jobs.length !== 1 ? 's' : ''}
            </div>
            <div className="jobs-list">
              {jobs.map((job, index) => (
                <Link 
                  key={job._id} 
                  to={`/job/${job._id}`} 
                  className="job-card"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* CARD HEADER */}
                  <div className="job-card-header">
                    <div className="job-title-section">
                      <h3 className="job-title">{job.title}</h3>
                      <span className={`job-type-badge ${getJobTypeColor(job.job_type)}`}>
                        {job.job_type}
                      </span>
                    </div>
                    <div className="job-salary-badge">
                      {getSalaryRange(job.salary_min, job.salary_max)}
                    </div>
                  </div>

                  {/* CARD COMPANY */}
                  <div className="job-company">
                    <span className="company-name">{job.company_name}</span>
                  </div>

                  {/* CARD DETAILS */}
                  <div className="job-details">
                    <div className="detail-item">
                      <span className="detail-icon">📍</span>
                      <span>{job.location}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">📅</span>
                      <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* CARD DESCRIPTION */}
                  <p className="job-description">
                    {job.description.substring(0, 120)}...
                  </p>

                  {/* CARD FOOTER */}
                  <div className="job-card-footer">
                    <div className="view-btn">
                      View Details →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseJobs;