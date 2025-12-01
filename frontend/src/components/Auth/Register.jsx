import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../../api/axios';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'applicant',
    company: '',
    phone: '',
    location: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (role) => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await API.post('/auth/register', formData);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const isStep1Complete = formData.name && formData.email && formData.password;
  const isStep2Complete = (formData.role === 'applicant') || (formData.role === 'employer' && formData.company);

  return (
    <div className="register-container">
      {/* LEFT SIDE - BRANDING */}
      <div className="register-brand-section">
        <div className="brand-content">
          <div className="brand-icon">🚀</div>
          <h1>Join JobBoard</h1>
          <p>Start your career journey today</p>
          
          <div className="brand-benefits">
            <div className="benefit">
              <span className="benefit-icon">✨</span>
              <span>Access to 10K+ opportunities</span>
            </div>
            <div className="benefit">
              <span className="benefit-icon">📈</span>
              <span>Grow your professional network</span>
            </div>
            <div className="benefit">
              <span className="benefit-icon">🎯</span>
              <span>Find the perfect fit</span>
            </div>
            <div className="benefit">
              <span className="benefit-icon">⚡</span>
              <span>Quick and easy process</span>
            </div>
          </div>

          <div className="brand-quote">
            <p>"The best career move is the one you take today"</p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - REGISTER FORM */}
      <div className="register-form-section">
        <div className="register-card">
          {/* HEADER */}
          <div className="register-header">
            <h2>Create Your Account</h2>
            <p>Join thousands of professionals on JobBoard</p>
          </div>

          {/* PROGRESS INDICATOR */}
          <div className="progress-indicator">
            <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
              <span className="step-number">1</span>
              <span className="step-label">Account</span>
            </div>
            <div className="progress-line"></div>
            <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
              <span className="step-number">2</span>
              <span className="step-label">Profile</span>
            </div>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="error-alert">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="register-form">
            {/* STEP 1: BASIC INFO */}
            {step === 1 && (
              <div className="form-step">
                <div className="form-group">
                  <label className="form-label">
                    <span className="label-icon">👤</span>
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span className="label-icon">📧</span>
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span className="label-icon">🔒</span>
                    Password
                  </label>
                  <div className="password-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="form-input"
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? '👁️‍🗨️' : '👁️'}
                    </button>
                  </div>
                  <span className="field-hint">At least 6 characters</span>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!isStep1Complete}
                  className="btn-next"
                >
                  Next <span>→</span>
                </button>
              </div>
            )}

            {/* STEP 2: ROLE & PROFILE */}
            {step === 2 && (
              <div className="form-step">
                <div className="form-group">
                  <label className="form-label">
                    <span className="label-icon">👔</span>
                    I am a...
                  </label>
                  <div className="role-selector">
                    <button
                      type="button"
                      className={`role-button ${formData.role === 'applicant' ? 'active' : ''}`}
                      onClick={() => handleRoleChange('applicant')}
                    >
                      <span className="role-icon">👤</span>
                      <span className="role-title">Job Seeker</span>
                      <span className="role-desc">Looking for opportunities</span>
                    </button>
                    <button
                      type="button"
                      className={`role-button ${formData.role === 'employer' ? 'active' : ''}`}
                      onClick={() => handleRoleChange('employer')}
                    >
                      <span className="role-icon">👨‍💼</span>
                      <span className="role-title">Employer</span>
                      <span className="role-desc">Hiring talent</span>
                    </button>
                  </div>
                </div>

                {/* EMPLOYER ONLY FIELD */}
                {formData.role === 'employer' && (
                  <div className="form-group">
                    <label className="form-label">
                      <span className="label-icon">🏢</span>
                      Company Name
                    </label>
                    <input
                      type="text"
                      name="company"
                      placeholder="Your company name"
                      value={formData.company}
                      onChange={handleChange}
                      required
                      className="form-input"
                    />
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">
                    <span className="label-icon">📍</span>
                    Location <span className="optional">(optional)</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    placeholder="City, Country"
                    value={formData.location}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span className="label-icon">📱</span>
                    Phone <span className="optional">(optional)</span>
                  </label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-buttons">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="btn-back"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !isStep2Complete}
                    className="btn-register"
                  >
                    <span className="btn-icon">
                      {loading ? '⏳' : '🚀'}
                    </span>
                    <span className="btn-text">
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* LOGIN LINK */}
          <div className="auth-redirect">
            <p>Already have an account? <Link to="/login">Sign in here</Link></p>
          </div>

          {/* TERMS */}
          <div className="register-terms">
            <p>By registering, you agree to our <a href="#terms">Terms</a> and <a href="#privacy">Privacy Policy</a></p>
          </div>
        </div>
      </div>

      {/* BACKGROUND DECORATION */}
      <div className="register-decoration">
        <div className="decoration-shape shape-1"></div>
        <div className="decoration-shape shape-2"></div>
        <div className="decoration-shape shape-3"></div>
      </div>
    </div>
  );
};

export default Register;