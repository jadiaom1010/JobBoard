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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await API.post('/jobs', formData);
      alert('Job posted successfully!');
      navigate('/employer/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-job">
      <h1>Post a New Job</h1>
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Job Title *</label>
          <input
            type="text"
            name="title"
            placeholder="e.g., Senior React Developer"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Job Type *</label>
            <select name="job_type" value={formData.job_type} onChange={handleChange} required>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
            </select>
          </div>

          <div className="form-group">
            <label>Location *</label>
            <input
              type="text"
              name="location"
              placeholder="e.g., New York, Remote"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Minimum Salary *</label>
            <input
              type="number"
              name="salary_min"
              placeholder="50000"
              value={formData.salary_min}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Maximum Salary *</label>
            <input
              type="number"
              name="salary_max"
              placeholder="100000"
              value={formData.salary_max}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            name="description"
            placeholder="Describe the job role and responsibilities..."
            value={formData.description}
            onChange={handleChange}
            rows="6"
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label>Requirements *</label>
          <textarea
            name="requirements"
            placeholder="List required skills and qualifications..."
            value={formData.requirements}
            onChange={handleChange}
            rows="6"
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label>Application Deadline *</label>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? 'Posting...' : 'Post Job'}
        </button>
      </form>
    </div>
  );
};

export default PostJob;