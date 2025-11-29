import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const ApplicantDashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="applicant-dashboard">
      <h1>Welcome back, {user?.name}!</h1>
      
      <div className="dashboard-cards">
        <Link to="/applicant/browse-jobs" className="dashboard-card">
          <h3>Browse Jobs</h3>
          <p>Explore available opportunities</p>
        </Link>

        <Link to="/applicant/my-applications" className="dashboard-card">
          <h3>My Applications</h3>
          <p>Track your applications</p>
        </Link>
      </div>
    </div>
  );
};

export default ApplicantDashboard;