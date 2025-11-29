import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../../api/axios';

const JobDetail = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJob();
  }, [jobId]);

  const fetchJob = async () => {
    try {
      const response = await API.get(`/jobs/${jobId}`);
      setJob(response.data.job);
    } catch (error) {
      console.error('Error fetching job:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!job) return <p>Job not found</p>;

  return (
    <div className="job-detail">
      <h1>{job.title}</h1>
      <p className="company">{job.company_name}</p>
      
      <div className="details-grid">
        <div><strong>Location:</strong> {job.location}</div>
        <div><strong>Job Type:</strong> {job.job_type}</div>
        <div><strong>Salary:</strong> ${job.salary_min} - ${job.salary_max}</div>
        <div><strong>Deadline:</strong> {new Date(job.deadline).toLocaleDateString()}</div>
      </div>

      <div className="job-content">
        <h2>Description</h2>
        <p>{job.description}</p>

        <h2>Requirements</h2>
        <p>{job.requirements}</p>
      </div>

      <Link to={`/job/${jobId}/apply`} className="btn btn-primary">
        Apply Now
      </Link>
    </div>
  );
};

export default JobDetail;