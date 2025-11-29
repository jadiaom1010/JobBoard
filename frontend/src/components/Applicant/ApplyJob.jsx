import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../api/axios';

const ApplyJob = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    resume_url: '',
    cover_letter: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      alert('Application submitted successfully!');
      navigate('/applicant/my-applications');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="apply-job">
      <h1>Apply for Job</h1>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Resume URL</label>
          <input
            type="url"
            name="resume_url"
            placeholder="Link to your resume (e.g., Google Drive, Dropbox)"
            value={formData.resume_url}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Cover Letter (Optional)</label>
          <textarea
            name="cover_letter"
            placeholder="Tell us why you're interested in this role..."
            value={formData.cover_letter}
            onChange={handleChange}
            rows="6"
          ></textarea>
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
};

export default ApplyJob;