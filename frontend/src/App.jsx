import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import Navbar from './components/Common/Navbar';
import Home from './components/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import EmployerDashboard from './components/Employer/EmployerDashboard';
import PostJob from './components/Employer/PostJob';
import EditJob from './components/Employer/EditJob';
import JobApplications from './components/Employer/JobApplications';
import ApplicantDashboard from './components/Applicant/ApplicantDashboard';
import BrowseJobs from './components/Applicant/BrowseJobs';
import JobDetail from './components/Applicant/JobDetail';
import ApplyJob from './components/Applicant/ApplyJob';
import MyApplications from './components/Applicant/MyApplications';
import './App.css';

function AppContent() {
  const { loading } = useContext(AuthContext);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/employer/dashboard" element={<ProtectedRoute requiredRole="employer"><EmployerDashboard /></ProtectedRoute>} />
          <Route path="/employer/post-job" element={<ProtectedRoute requiredRole="employer"><PostJob /></ProtectedRoute>} />
          <Route path="/employer/edit-job/:jobId" element={<ProtectedRoute requiredRole="employer"><EditJob /></ProtectedRoute>} />
          <Route path="/employer/applications/:jobId" element={<ProtectedRoute requiredRole="employer"><JobApplications /></ProtectedRoute>} />

          <Route path="/applicant/dashboard" element={<ProtectedRoute requiredRole="applicant"><ApplicantDashboard /></ProtectedRoute>} />
          <Route path="/applicant/browse-jobs" element={<ProtectedRoute requiredRole="applicant"><BrowseJobs /></ProtectedRoute>} />
          <Route path="/job/:jobId" element={<ProtectedRoute requiredRole="applicant"><JobDetail /></ProtectedRoute>} />
          <Route path="/job/:jobId/apply" element={<ProtectedRoute requiredRole="applicant"><ApplyJob /></ProtectedRoute>} />
          <Route path="/applicant/my-applications" element={<ProtectedRoute requiredRole="applicant"><MyApplications /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;