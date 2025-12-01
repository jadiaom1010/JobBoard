import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import API from '../../api/axios';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await API.post('/auth/login', formData);
      login(response.data.user, response.data.token);
      navigate(response.data.user.role === 'employer' ? '/employer/dashboard' : '/applicant/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* LEFT SIDE - BRANDING */}
      <div className="login-brand-section">
        <div className="brand-content">
          <div className="brand-icon">💼</div>
          <h1>JobBoard</h1>
          <p>Find Your Dream Job</p>
          
          <div className="brand-features">
            <div className="feature">
              <span className="feature-icon">🔍</span>
              <span>Browse Opportunities</span>
            </div>
            <div className="feature">
              <span className="feature-icon">📋</span>
              <span>Post Positions</span>
            </div>
            <div className="feature">
              <span className="feature-icon">✅</span>
              <span>Hire Top Talent</span>
            </div>
          </div>

          <div className="brand-stats">
            <div className="stat">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Jobs</span>
            </div>
            <div className="stat">
              <span className="stat-number">5K+</span>
              <span className="stat-label">Companies</span>
            </div>
            <div className="stat">
              <span className="stat-number">50K+</span>
              <span className="stat-label">Users</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - LOGIN FORM */}
      <div className="login-form-section">
        <div className="login-card">
          {/* HEADER */}
          <div className="login-header">
            <h2>Welcome Back</h2>
            <p>Sign in to your account</p>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="error-alert">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="login-form">
            {/* EMAIL FIELD */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <span className="label-icon">📧</span>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
                disabled={loading}
              />
            </div>

            {/* PASSWORD FIELD */}
            <div className="form-group">
              <div className="password-header">
                <label htmlFor="password" className="form-label">
                  <span className="label-icon">🔒</span>
                  Password
                </label>
              </div>
              <div className="password-wrapper">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="form-input"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? '👁️‍🗨️' : '👁️'}
                </button>
              </div>
            </div>



            {/* SUBMIT BUTTON */}
            <button 
              type="submit" 
              disabled={loading} 
              className="btn-login"
            >
              <span className="btn-icon">
                {loading ? '⏳' : '🚀'}
              </span>
              <span className="btn-text">
                {loading ? 'Signing in...' : 'Sign In'}
              </span>
            </button>
          </form>

          {/* DIVIDER */}
          <div className="divider">
            <span>or</span>
          </div>

          {/* SIGN UP LINK */}
          <div className="auth-redirect">
            <p>New to JobBoard?</p>
            <Link to="/register" className="btn-signup">
              Create Account
            </Link>
          </div>

          {/* FOOTER */}
          <div className="login-footer">
            <p>By signing in, you agree to our <a href="#terms">Terms</a> and <a href="#privacy">Privacy Policy</a></p>
          </div>
        </div>
      </div>

      {/* BACKGROUND DECORATION */}
      <div className="login-decoration">
        <div className="decoration-shape shape-1"></div>
        <div className="decoration-shape shape-2"></div>
        <div className="decoration-shape shape-3"></div>
      </div>
    </div>
  );
};

export default Login;