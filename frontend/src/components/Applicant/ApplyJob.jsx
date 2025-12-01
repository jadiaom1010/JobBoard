import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../api/axios';

const ApplyJob = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [formData, setFormData] = useState({
    resume_url: '',
    cover_letter: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [jobLoading, setJobLoading] = useState(true);

  useEffect(() => {
    fetchJobDetails();
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      const response = await API.get(`/jobs/${jobId}`);
      setJob(response.data.job);
    } catch (error) {
      console.error('Error fetching job:', error);
    } finally {
      setJobLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = {
        job_id: jobId,
        ...formData
      };
      await API.post('/applications', data);
      setSuccess(true);
      setTimeout(() => {
        navigate('/applicant/my-applications');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  if (jobLoading) {
    return (
      <div className="apply-job-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading job details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="apply-job-container">
      {/* SUCCESS MESSAGE */}
      {success && (
        <div className="success-animation">
          <div className="success-card">
            <div className="success-icon">✅</div>
            <h2>Application Submitted!</h2>
            <p>Redirecting to your applications...</p>
          </div>
        </div>
      )}

      {/* JOB PREVIEW CARD */}
      {job && (
        <div className="job-preview-card">
          <div className="preview-header">
            <h2>{job.title}</h2>
            <span className="company-badge">{job.company_name}</span>
          </div>
          <div className="preview-details">
            <div className="preview-item">
              <span className="icon">📍</span>
              <span>{job.location}</span>
            </div>
            <div className="preview-item">
              <span className="icon">💼</span>
              <span>{job.job_type}</span>
            </div>
            <div className="preview-item">
              <span className="icon">💰</span>
              <span>${job.salary_min} - ${job.salary_max}</span>
            </div>
          </div>
        </div>
      )}

      {/* APPLICATION FORM */}
      <div className="apply-job-form-container">
        <div className="form-header">
          <h1>Submit Your Application</h1>
          <p>Complete the form below to apply for this position</p>
        </div>

        {error && (
          <div className="error-message-alert">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="apply-form">
          {/* RESUME URL FIELD */}
          <div className="form-group-wrapper">
            <div className="form-group">
              <div className="label-wrapper">
                <label className="form-label">
                  <span className="label-icon">📄</span>
                  Resume URL
                </label>
                <span className="required">*Required</span>
              </div>
              <input
                type="url"
                name="resume_url"
                placeholder="https://drive.google.com/... or https://dropbox.com/..."
                value={formData.resume_url}
                onChange={handleChange}
                required
                className="form-input"
              />
              <div className="field-hint">
                Share a link to your resume hosted on Google Drive, Dropbox, or similar services
              </div>
            </div>
          </div>

          {/* COVER LETTER FIELD */}
          <div className="form-group-wrapper">
            <div className="form-group">
              <div className="label-wrapper">
                <label className="form-label">
                  <span className="label-icon">✍️</span>
                  Cover Letter
                </label>
                <span className="optional">(Optional)</span>
              </div>
              <textarea
                name="cover_letter"
                placeholder="Share your passion for this role... Why are you interested? What makes you a great fit?"
                value={formData.cover_letter}
                onChange={handleChange}
                rows="6"
                className="form-textarea"
              ></textarea>
              <div className="field-counter">
                {formData.cover_letter.length}/1000 characters
              </div>
            </div>
          </div>

          {/* FORM FOOTER */}
          <div className="form-footer">
            <button 
              type="submit" 
              disabled={loading || success} 
              className="btn-submit"
            >
              <span className="btn-icon">
                {loading ? '⏳' : '🚀'}
              </span>
              <span className="btn-text">
                {loading ? 'Submitting...' : 'Submit Application'}
              </span>
            </button>
          </div>

          {/* FORM TIPS */}
          <div className="form-tips">
            <h4>💡 Pro Tips</h4>
            <ul>
              <li>Make sure your resume URL is publicly accessible</li>
              <li>Write a personalized cover letter to stand out</li>
              <li>Double-check spelling and grammar before submitting</li>
              <li>Apply early - employers often review applications in order</li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyJob;