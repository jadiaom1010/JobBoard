import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    viewsThisMonth: 0
  });
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await API.get('/jobs/employer/my-jobs');
      const jobsList = response.data.jobs;
      setJobs(jobsList);

      // Calculate stats
      const totalApplications = jobsList.reduce((sum, job) => sum + (job.applications_count || 0), 0);
      setStats({
        totalJobs: jobsList.length,
        totalApplications: totalApplications,
        viewsThisMonth: jobsList.length * 15 // Mock data
      });
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    try {
      await API.delete(`/jobs/${jobId}`);
      setJobs(jobs.filter(job => job._id !== jobId));
      setDeleteConfirm(null);
      alert('Job deleted successfully!');
    } catch (error) {
      alert('Error deleting job');
    }
  };

  const getApplicationStatus = (count) => {
    if (count === 0) return { text: 'No applications', color: '#999' };
    if (count < 5) return { text: 'Low interest', color: '#ffc107' };
    if (count < 10) return { text: 'Good interest', color: '#00d4ff' };
    return { text: 'High interest', color: '#28a745' };
  };

  const getDaysPosted = (postedDate) => {
    const days = Math.floor((new Date() - new Date(postedDate)) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  };

  return (
    <div className="employer-dashboard-container">
      {/* HERO SECTION */}
      <div className="dashboard-hero">
        <h1>👨‍💼 Welcome to Your Employer Dashboard</h1>
        <p>Manage your job postings and track applications</p>
      </div>

      {/* STATS CARDS */}
      <div className="stats-grid">
        <div className="stat-card stat-card-1">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalJobs}</div>
            <div className="stat-label">Active Jobs</div>
          </div>
        </div>

        <div className="stat-card stat-card-2">
          <div className="stat-icon">📧</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalApplications}</div>
            <div className="stat-label">Total Applications</div>
          </div>
        </div>

        <div className="stat-card stat-card-3">
          <div className="stat-icon">👁️</div>
          <div className="stat-content">
            <div className="stat-value">{stats.viewsThisMonth}</div>
            <div className="stat-label">Views This Month</div>
          </div>
        </div>
      </div>

      {/* POST JOB BUTTON */}
      <div className="post-job-section">
        <Link to="/employer/post-job" className="btn-post-job">
          <span className="btn-icon">➕</span>
          <span className="btn-text">Post New Job</span>
          <span className="btn-arrow">→</span>
        </Link>
      </div>

      {/* JOBS SECTION */}
      <div className="jobs-section">
        <h2 className="section-title">Your Job Postings</h2>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading your jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🚀</div>
            <h3>No Jobs Posted Yet</h3>
            <p>Start by creating your first job posting</p>
            <Link to="/employer/post-job" className="btn btn-primary">
              Post Your First Job
            </Link>
          </div>
        ) : (
          <div className="jobs-cards-grid">
            {jobs.map((job) => {
              const appStatus = getApplicationStatus(job.applications_count || 0);
              const daysPosted = getDaysPosted(job.created_at);

              return (
                <div key={job._id} className="job-posting-card">
                  {/* CARD HEADER */}
                  <div className="card-header">
                    <div className="job-info">
                      <h3 className="job-title">{job.title}</h3>
                      <div className="job-meta">
                        <span className="meta-item">📍 {job.location}</span>
                        <span className="meta-item">⏱️ {daysPosted}</span>
                      </div>
                    </div>
                    <span className="status-badge">{job.job_type}</span>
                  </div>

                  {/* CARD BODY */}
                  <div className="card-body">
                    <p className="job-description">
                      {job.description.substring(0, 80)}...
                    </p>

                    {/* APPLICATIONS INFO */}
                    <Link 
                      to={`/employer/applications/${job._id}`}
                      className="applications-link"
                      style={{ borderLeftColor: appStatus.color }}
                    >
                      <div className="app-count">{job.applications_count || 0}</div>
                      <div className="app-info">
                        <div className="app-label">Applications</div>
                        <div className="app-status" style={{ color: appStatus.color }}>
                          {appStatus.text}
                        </div>
                      </div>
                    </Link>
                  </div>

                  {/* CARD FOOTER */}
                  <div className="card-footer">
                    <Link 
                      to={`/employer/edit-job/${job._id}`} 
                      className="action-btn edit-btn"
                    >
                      ✏️ Edit
                    </Link>
                    <button
                      onClick={() => setDeleteConfirm(job._id)}
                      className="action-btn delete-btn"
                    >
                      🗑️ Delete
                    </button>
                  </div>

                  {/* DELETE CONFIRMATION */}
                  {deleteConfirm === job._id && (
                    <div className="delete-confirmation">
                      <p>Delete this job?</p>
                      <div className="confirm-actions">
                        <button
                          onClick={() => handleDelete(job._id)}
                          className="confirm-yes"
                        >
                          Yes, Delete
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="confirm-no"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerDashboard;