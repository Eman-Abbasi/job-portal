'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import { usersAPI } from '../../lib/api';
import { isAuthenticated, getUser } from '../../lib/auth';
import { formatDate } from '../../lib/utils';

export default function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'profile';

  const [user, setUser] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    loadProfile();
    if (activeTab === 'resume') {
      loadResumes();
    }
  }, [activeTab]);

  const loadProfile = async () => {
    try {
      const currentUser = getUser();
      setUser(currentUser);
      setFormData({
        name: currentUser?.name || '',
        email: currentUser?.email || '',
      });

      const response = await usersAPI.getProfile();
      setUser(response.data.user);
      setFormData({
        name: response.data.user.name,
        email: response.data.user.email,
      });
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadResumes = async () => {
    try {
      const response = await usersAPI.getResumes();
      setResumes(response.data.resumes || []);
    } catch (error) {
      console.error('Error loading resumes:', error);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await usersAPI.updateProfile(formData);
      setSuccess('Profile updated successfully');
      loadProfile();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update profile');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Please upload PDF, DOC, or DOCX files.');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('resume', file);
      await usersAPI.uploadResume(formData);
      setSuccess('Resume uploaded successfully');
      loadResumes();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to upload resume');
    } finally {
      setUploading(false);
      e.target.value = ''; // Reset file input
    }
  };

  const handleDeleteResume = async (id) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;

    try {
      await usersAPI.deleteResume(id);
      setSuccess('Resume deleted successfully');
      loadResumes();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to delete resume');
    }
  };

  const handleDownloadResume = async (id, filename) => {
    try {
      const response = await usersAPI.downloadResume(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      setError('Failed to download resume');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <p className="text-dark-text-muted">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Profile</h1>

        {/* Tabs */}
        <div className="border-b border-dark-border mb-6">
          <div className="flex space-x-1">
            <button
              onClick={() => router.push('/profile?tab=profile')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'profile'
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-dark-text-muted hover:text-white'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => router.push('/profile?tab=resume')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'resume'
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-dark-text-muted hover:text-white'
              }`}
            >
              Resume
            </button>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-900/30 border border-green-700 text-green-200 px-4 py-3 rounded-lg mb-4">
            {success}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-dark-card border border-dark-border rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-white mb-6">Profile Information</h2>
            <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-dark-text-muted mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-dark-text-muted mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Update Profile
              </button>
            </form>
          </div>
        )}

        {/* Resume Tab */}
        {activeTab === 'resume' && (
          <div className="bg-dark-card border border-dark-border rounded-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-white">Resume Management</h2>
              <label className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg cursor-pointer transition-colors">
                {uploading ? 'Uploading...' : 'Upload Resume'}
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>

            {resumes.length === 0 ? (
              <p className="text-dark-text-muted">No resumes uploaded yet.</p>
            ) : (
              <div className="space-y-4">
                {resumes.map((resume) => (
                  <div
                    key={resume.id}
                    className="bg-dark-surface border border-dark-border rounded-lg p-4 flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <p className="text-white font-medium">{resume.filename}</p>
                      <p className="text-sm text-dark-text-muted">
                        Uploaded on {formatDate(resume.uploadedAt)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDownloadResume(resume.id, resume.filename)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        Download
                      </button>
                      <button
                        onClick={() => handleDeleteResume(resume.id)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
