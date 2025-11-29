// ============= Home.jsx (Enhanced with Animations) =============
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="home">
      {/* HERO SECTION */}
      <div className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="title-word">Find</span>
              <span className="title-word">Your</span>
              <span className="title-word">Dream</span>
              <span className="title-word">Job</span>
            </h1>
            <p className="hero-subtitle">
              Connect with top employers and discover amazing career opportunities
            </p>
          </div>

          <div className="cta-buttons">
            {!user ? (
              <>
                <Link to="/register" className="btn btn-primary btn-large btn-animate">
                  Get Started
                </Link>
                <Link to="/login" className="btn btn-secondary btn-large btn-animate">
                  Login
                </Link>
              </>
            ) : user.role === 'applicant' ? (
              <Link to="/applicant/browse-jobs" className="btn btn-primary btn-large btn-animate">
                🔍 Browse Jobs
              </Link>
            ) : (
              <Link to="/employer/dashboard" className="btn btn-primary btn-large btn-animate">
                📊 Go to Dashboard
              </Link>
            )}
          </div>
        </div>

        <div className="hero-decoration">
          <div className="floating-box box-1"></div>
          <div className="floating-box box-2"></div>
          <div className="floating-box box-3"></div>
        </div>
      </div>

      {/* STATS SECTION */}
      <div className="stats-section">
        <div className="stat-card fade-in-up">
          <div className="stat-number">10K+</div>
          <div className="stat-label">Active Jobs</div>
        </div>
        <div className="stat-card fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="stat-number">5K+</div>
          <div className="stat-label">Companies</div>
        </div>
        <div className="stat-card fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="stat-number">50K+</div>
          <div className="stat-label">Job Seekers</div>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div className="features-section">
        <h2 className="section-title">Why Choose JobBoard?</h2>
        <div className="features-grid">
          <div className="feature-card feature-card-1">
            <div className="feature-icon">🔍</div>
            <h3>Easy Search</h3>
            <p>Find jobs by title, company, location, and job type with advanced filters</p>
            <div className="feature-hover-line"></div>
          </div>

          <div className="feature-card feature-card-2">
            <div className="feature-icon">📋</div>
            <h3>Manage Postings</h3>
            <p>Create, edit, and manage your job postings in one intuitive dashboard</p>
            <div className="feature-hover-line"></div>
          </div>

          <div className="feature-card feature-card-3">
            <div className="feature-icon">✉️</div>
            <h3>Track Applications</h3>
            <p>Review applications and manage candidate status efficiently</p>
            <div className="feature-hover-line"></div>
          </div>

          <div className="feature-card feature-card-4">
            <div className="feature-icon">🛡️</div>
            <h3>Secure & Reliable</h3>
            <p>Your data is protected with industry-standard security measures</p>
            <div className="feature-hover-line"></div>
          </div>

          <div className="feature-card feature-card-5">
            <div className="feature-icon">⚡</div>
            <h3>Fast & Responsive</h3>
            <p>Lightning-fast performance on all devices for smooth user experience</p>
            <div className="feature-hover-line"></div>
          </div>

          <div className="feature-card feature-card-6">
            <div className="feature-icon">🌟</div>
            <h3>Premium Features</h3>
            <p>Get access to exclusive tools and analytics to boost your success</p>
            <div className="feature-hover-line"></div>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS SECTION */}
      <div className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-container">
          <div className="step-card">
            <div className="step-number animated-number">1</div>
            <h3>Sign Up</h3>
            <p>Create your account as either a job seeker or employer</p>
            <div className="step-arrow">→</div>
          </div>

          <div className="step-card">
            <div className="step-number animated-number">2</div>
            <h3>Search or Post</h3>
            <p>Find jobs or post your job openings</p>
            <div className="step-arrow">→</div>
          </div>

          <div className="step-card">
            <div className="step-number animated-number">3</div>
            <h3>Connect</h3>
            <p>Apply or review applications</p>
            <div className="step-arrow">→</div>
          </div>

          <div className="step-card">
            <div className="step-number animated-number">4</div>
            <h3>Succeed</h3>
            <p>Land your dream job or hire the best talent</p>
          </div>
        </div>
      </div>

      {/* CTA SECTION */}
      <div className="final-cta">
        <h2>Ready to Get Started?</h2>
        <p>Join thousands of job seekers and employers on JobBoard</p>
        <div className="cta-buttons">
          {!user ? (
            <>
              <Link to="/register" className="btn btn-primary btn-large btn-animate">
                Sign Up Now
              </Link>
              <Link to="/login" className="btn btn-outline btn-large btn-animate">
                Already a member? Login
              </Link>
            </>
          ) : (
            <Link 
              to={user.role === 'applicant' ? '/applicant/browse-jobs' : '/employer/dashboard'} 
              className="btn btn-primary btn-large btn-animate"
            >
              Go to Dashboard
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;