import React, { useState, useEffect } from 'react';
import API from '../../api/axios';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await API.get('/applications/my-applications');
      setApplications(response.data.applications);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    return {
      pending: '#FFA500',
      accepted: '#28a745',
      rejected: '#dc3545'
    }[status] || '#6c757d';
  };

  return (
    <div className="my-applications">
      <h1>My Applications</h1>
      
      {loading ? (
        <p>Loading...</p>
      ) : applications.length === 0 ? (
        <p>You haven't applied to any jobs yet.</p>
      ) : (
        <table className="applications-table">
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Company</th>
              <th>Applied On</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app._id}>
                <td>{app.job_title}</td>
                <td>{app.company_name}</td>
                <td>{new Date(app.applied_at).toLocaleDateString()}</td>
                <td>
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(app.status) }}
                  >
                    {app.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyApplications;