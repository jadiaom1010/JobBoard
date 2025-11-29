import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await API.get('/jobs/employer/my-jobs');
      setJobs(response.data.jobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await API.delete(`/jobs/${jobId}`);
        setJobs(jobs.filter(job => job._id !== jobId));
        alert('Job deleted successfully!');
      } catch (error) {
        alert('Error deleting job');
      }
    }
  };

  return (
    <div className="employer-dashboard">
      <h1>Employer Dashboard</h1>
      <Link to="/employer/post-job" className="btn btn-primary">
        + Post New Job
      </Link>

      {loading ? (
        <p>Loading...</p>
      ) : jobs.length === 0 ? (
        <p>You haven't posted any jobs yet. <Link to="/employer/post-job">Post one now</Link></p>
      ) : (
        <div className="jobs-table">
          <table>
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Location</th>
                <th>Applications</th>
                <th>Posted On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job._id}>
                  <td>{job.title}</td>
                  <td>{job.location}</td>
                  <td>
                    <Link to={`/employer/applications/${job._id}`}>
                      {job.applications_count || 0} applications
                    </Link>
                  </td>
                  <td>{new Date(job.created_at).toLocaleDateString()}</td>
                  <td>
                    <Link to={`/employer/edit-job/${job._id}`} className="btn btn-sm">Edit</Link>
                    <button
                      onClick={() => handleDelete(job._id)}
                      className="btn btn-sm btn-danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EmployerDashboard;