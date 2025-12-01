import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import API from '../../api/axios';

const ApplicantDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    acceptedApplications: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await API.get('/applications/my-applications');
      const applications = response.data.applications;
      
      setStats({
        totalApplications: applications.length,
        pendingApplications: applications.filter(app => app.status === 'pending').length,
        acceptedApplications: applications.filter(app => app.status === 'accepted').length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="applicant-dashboard-container">
      {/* HERO WELCOME SECTION */}
      <div className="dashboard-hero">
        <div className="hero-content">
          <h1 className="hero-greeting">
            {getGreeting()}, <span className="user-name">{user?.name}</span>! 👋
          </h1>
          <p className="hero-subtitle">
            Discover amazing job opportunities and track your applications
          </p>
        </div>
        <div className="hero-decoration">
          <div className="decoration-circle circle-1"></div>
          <div className="decoration-circle circle-2"></div>
          <div className="decoration-circle circle-3"></div>
        </div>
      </div>

      {/* STATS SECTION */}
      <div className="dashboard-stats">
        <div className="stat-card stat-total">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <div className="stat-number">{loading ? '...' : stats.totalApplications}</div>
            <div className="stat-label">Total Applications</div>
          </div>
        </div>

        <div className="stat-card stat-pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <div className="stat-number">{loading ? '...' : stats.pendingApplications}</div>
            <div className="stat-label">Pending Review</div>
          </div>
        </div>

        <div className="stat-card stat-accepted">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <div className="stat-number">{loading ? '...' : stats.acceptedApplications}</div>
            <div className="stat-label">Accepted</div>
          </div>
        </div>
      </div>

      {/* MAIN CARDS SECTION */}
      <div className="dashboard-content">
        <h2 className="section-title">What would you like to do?</h2>
        
        <div className="dashboard-cards">
          {/* Browse Jobs Card */}
          <Link to="/applicant/browse-jobs" className="dashboard-card card-browse">
            <div className="card-header">
              <div className="card-icon icon-search">🔍</div>
              <div className="card-badge">Popular</div>
            </div>
            <div className="card-body">
              <h3>Browse Jobs</h3>
              <p>Explore thousands of job opportunities from top companies</p>
              <div className="card-features">
                <span className="feature">🌍 Worldwide</span>
                <span className="feature">⭐ Verified</span>
                <span className="feature">🔥 Latest</span>
              </div>
            </div>
            <div className="card-footer">
              <span className="card-action">Start Exploring →</span>
            </div>
          </Link>

          {/* My Applications Card */}
          <Link to="/applicant/my-applications" className="dashboard-card card-applications">
            <div className="card-header">
              <div className="card-icon icon-track">📊</div>
              <div className="card-badge badge-new">New</div>
            </div>
            <div className="card-body">
              <h3>My Applications</h3>
              <p>Track your applications and see their current status in real-time</p>
              <div className="card-features">
                <span className="feature">📈 Progress</span>
                <span className="feature">⚡ Real-time</span>
                <span className="feature">📱 Updates</span>
              </div>
            </div>
            <div className="card-footer">
              <span className="card-action">View Status →</span>
            </div>
          </Link>
        </div>
      </div>

      {/* QUICK TIPS SECTION */}
      <div className="quick-tips">
        <h3>💡 Quick Tips</h3>
        <div className="tips-grid">
          <div className="tip">
            <span className="tip-number">1</span>
            <p>Use filters to find jobs that match your skills and experience</p>
          </div>
          <div className="tip">
            <span className="tip-number">2</span>
            <p>Add a compelling resume link to increase your chances</p>
          </div>
          <div className="tip">
            <span className="tip-number">3</span>
            <p>Check your applications regularly for status updates</p>
          </div>
          <div className="tip">
            <span className="tip-number">4</span>
            <p>Apply to roles that genuinely interest you</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantDashboard;