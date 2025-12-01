import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="navbar-enhanced">
      <div className="nav-container">
        {/* LOGO */}
        <Link to="/" className="nav-logo" onClick={() => setMenuOpen(false)}>
          <span className="logo-icon">💼</span>
          <span className="logo-text">JobBoard</span>
        </Link>

        {/* HAMBURGER MENU */}
        <button 
          className={`hamburger ${menuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* NAV MENU */}
        <ul className={`nav-menu ${menuOpen ? 'active' : ''}`}>
          {!user ? (
            <>
              {/* NOT LOGGED IN */}
              <li className="nav-item">
                <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/login" className="nav-link nav-link-login" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link nav-link-register" onClick={() => setMenuOpen(false)}>
                  Sign Up
                </Link>
              </li>
            </>
          ) : (
            <>
              {/* EMPLOYER MENU */}
              {user.role === 'employer' && (
                <>
                  <li className="nav-item">
                    <Link 
                      to="/employer/dashboard" 
                      className="nav-link"
                      onClick={() => setMenuOpen(false)}
                    >
                      📊 Dashboard
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link 
                      to="/employer/post-job" 
                      className="nav-link nav-link-cta"
                      onClick={() => setMenuOpen(false)}
                    >
                      ➕ Post Job
                    </Link>
                  </li>
                </>
              )}

              {/* APPLICANT MENU */}
              {user.role === 'applicant' && (
                <>
                  <li className="nav-item">
                    <Link 
                      to="/applicant/dashboard" 
                      className="nav-link"
                      onClick={() => setMenuOpen(false)}
                    >
                      🏠 Dashboard
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link 
                      to="/applicant/browse-jobs" 
                      className="nav-link"
                      onClick={() => setMenuOpen(false)}
                    >
                      🔍 Browse Jobs
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link 
                      to="/applicant/my-applications" 
                      className="nav-link"
                      onClick={() => setMenuOpen(false)}
                    >
                      📋 Applications
                    </Link>
                  </li>
                </>
              )}

              {/* USER PROFILE DROPDOWN */}
              <li className="nav-item nav-item-dropdown">
                <button 
                  className="nav-link nav-user-btn"
                  onClick={toggleDropdown}
                >
                  <span className="user-avatar">{user.name.charAt(0)}</span>
                  <span className="user-name">{user.name}</span>
                  <span className={`dropdown-arrow ${dropdownOpen ? 'open' : ''}`}>▼</span>
                </button>

                {/* DROPDOWN MENU */}
                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <div className="dropdown-header">
                      <span className="dropdown-user-avatar">{user.name.charAt(0)}</span>
                      <div>
                        <p className="dropdown-name">{user.name}</p>
                        <p className="dropdown-email">{user.role}</p>
                      </div>
                    </div>
                    <div className="dropdown-divider"></div>
                    <button 
                      className="dropdown-item logout-item"
                      onClick={handleLogout}
                    >
                      <span>🚪 Logout</span>
                    </button>
                  </div>
                )}
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;