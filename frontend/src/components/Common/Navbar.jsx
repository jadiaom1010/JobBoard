import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          💼 JobBoard
        </Link>
        <ul className="nav-menu">
          {!user ? (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link">Login</Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link">Register</Link>
              </li>
            </>
          ) : (
            <>
              {user.role === 'employer' && (
                <>
                  <li className="nav-item">
                    <Link to="/employer/dashboard" className="nav-link">Dashboard</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/employer/post-job" className="nav-link">Post Job</Link>
                  </li>
                </>
              )}
              {user.role === 'applicant' && (
                <>
                  <li className="nav-item">
                    <Link to="/applicant/dashboard" className="nav-link">Dashboard</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/applicant/browse-jobs" className="nav-link">Browse Jobs</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/applicant/my-applications" className="nav-link">My Applications</Link>
                  </li>
                </>
              )}
              <li className="nav-item">
                <span className="nav-user">{user.name}</span>
              </li>
              <li className="nav-item">
                <button onClick={handleLogout} className="nav-link logout-btn">Logout</button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
