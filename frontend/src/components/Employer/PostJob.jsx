import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';

const PostJob = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    salary_min: '',
    salary_max: '',
    job_type: 'full-time',
    deadline: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formProgress, setFormProgress] = useState(0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    calculateProgress();
  };

  const calculateProgress = () => {
    const fields = Object.values(formData);
    const filledFields = fields.filter(field => field !== '').length;
    const progress = Math.round((filledFields / fields.length) * 100);
    setFormProgress(progress);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await API.post('/jobs', formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/employer/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="post-job-success">
        <div className="success-animation">
          <div className="success-icon">✅</div>
          <h2>Job Posted Successfully!</h2>
          <p>Your job posting is now live. Redirecting...</p>
          <div className="success-loader"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="post-job-container">
      {/* HEADER */}
      <div className="post-job-header">
        <h1>📝 Post a New Job</h1>
        <p>Fill in the details below to create your job posting</p>
      </div>

      {/* PROGRESS BAR */}
      <div className="progress-section">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${formProgress}%` }}></div>
        </div>
        <p className="progress-text">Form Progress: {formProgress}%</p>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="error-alert">
          <span className="error-icon">⚠️</span>
          <div>
            <strong>Error</strong>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* FORM */}
      <form onSubmit={handleSubmit} className="post-job-form">
        {/* SECTION 1: BASIC INFO */}
        <div className="form-section">
          <div className="section-header">
            <h3>📋 Basic Information</h3>
            <span className="section-number">1 of 3</span>
          </div>

          <div className="form-group-wrapper">
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">💼</span>
                Job Title
                <span className="required">*</span>
              </label>
              <input
                type="text"
                name="title"
                placeholder="e.g., Senior React Developer, Product Manager"
                value={formData.title}
                onChange={handleChange}
                required
                className="form-input"
              />
              <span className="field-hint">Make it clear and specific</span>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group-wrapper">
              <div className="form-group">
                <label className="form-label">
                  <span className="label-icon">📍</span>
                  Location
                  <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  placeholder="e.g., San Francisco, Remote, New York"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group-wrapper">
              <div className="form-group">
                <label className="form-label">
                  <span className="label-icon">📋</span>
                  Job Type
                  <span className="required">*</span>
                </label>
                <select 
                  name="job_type" 
                  value={formData.job_type} 
                  onChange={handleChange} 
                  required
                  className="form-select"
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: COMPENSATION */}
        <div className="form-section">
          <div className="section-header">
            <h3>💰 Compensation</h3>
            <span className="section-number">2 of 3</span>
          </div>

          <div className="form-row">
            <div className="form-group-wrapper">
              <div className="form-group">
                <label className="form-label">
                  <span className="label-icon">💵</span>
                  Minimum Salary
                  <span className="required">*</span>
                </label>
                <input
                  type="number"
                  name="salary_min"
                  placeholder="e.g., 50000"
                  value={formData.salary_min}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group-wrapper">
              <div className="form-group">
                <label className="form-label">
                  <span className="label-icon">💵</span>
                  Maximum Salary
                  <span className="required">*</span>
                </label>
                <input
                  type="number"
                  name="salary_max"
                  placeholder="e.g., 100000"
                  value={formData.salary_max}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {formData.salary_min && formData.salary_max && (
            <div className="salary-preview">
              <span className="preview-label">Salary Range Preview:</span>
              <span className="preview-value">${formData.salary_min} - ${formData.salary_max}</span>
            </div>
          )}
        </div>

        {/* SECTION 3: DETAILS */}
        <div className="form-section">
          <div className="section-header">
            <h3>📝 Job Details</h3>
            <span className="section-number">3 of 3</span>
          </div>

          <div className="form-group-wrapper">
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">📄</span>
                Description
                <span className="required">*</span>
              </label>
              <textarea
                name="description"
                placeholder="Describe the job role, responsibilities, and what you're looking for..."
                value={formData.description}
                onChange={handleChange}
                rows="5"
                required
                className="form-textarea"
              ></textarea>
              <span className="field-hint">
                {formData.description.length} characters
              </span>
            </div>
          </div>

          <div className="form-group-wrapper">
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">🎯</span>
                Requirements
                <span className="required">*</span>
              </label>
              <textarea
                name="requirements"
                placeholder="List required skills, experience, qualifications, and nice-to-haves..."
                value={formData.requirements}
                onChange={handleChange}
                rows="5"
                required
                className="form-textarea"
              ></textarea>
              <span className="field-hint">
                {formData.requirements.length} characters
              </span>
            </div>
          </div>

          <div className="form-group-wrapper">
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">📅</span>
                Application Deadline
                <span className="required">*</span>
              </label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                required
                className="form-input"
              />
              {formData.deadline && (
                <span className="field-hint">
                  Deadline: {new Date(formData.deadline).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="form-submit-section">
          <button 
            type="submit" 
            disabled={loading} 
            className="btn-submit"
          >
            <span className="submit-icon">
              {loading ? '⏳' : '🚀'}
            </span>
            <span className="submit-text">
              {loading ? 'Posting Job...' : 'Post Job Now'}
            </span>
          </button>
          <p className="form-note">
            ✨ Your job will be visible to all applicants immediately after posting
          </p>
        </div>
      </form>
    </div>
  );
};

export default PostJob;