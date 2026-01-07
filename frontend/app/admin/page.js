'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import AdminJobForm from '../../components/AdminJobForm';
import { adminAPI } from '../../lib/api';
import { isAuthenticated, isAdmin, getUser } from '../../lib/auth';
import { formatDate } from '../../lib/utils';

export default function AdminPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  useEffect(() => {
    if (!isAuthenticated() || !isAdmin()) {
      router.push('/login');
      return;
    }
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const response = await adminAPI.getAllJobs();
      setJobs(response.data.jobs || []);
    } catch (error) {
      console.error('Error loading jobs:', error);
      if (error.response?.status === 403) {
        router.push('/');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    try {
      await adminAPI.deleteJob(id);
      loadJobs();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to delete job');
    }
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    setShowCreateForm(true);
  };

  const handleCreate = () => {
    setEditingJob(null);
    setShowCreateForm(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingJob) {
        await adminAPI.updateJob(editingJob.id, formData);
      } else {
        await adminAPI.createJob(formData);
      }
      setShowCreateForm(false);
      setEditingJob(null);
      loadJobs();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to save job');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <p className="text-dark-text-muted">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
          <button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Create New Job
          </button>
        </div>

        {showCreateForm && (
          <div className="bg-dark-card border border-dark-border rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-white mb-6">
              {editingJob ? 'Edit Job' : 'Create New Job'}
            </h2>
            <AdminJobForm
              job={editingJob}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setShowCreateForm(false);
                setEditingJob(null);
              }}
            />
          </div>
        )}

        <div className="bg-dark-card border border-dark-border rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-white mb-6">All Jobs</h2>
          {jobs.length === 0 ? (
            <p className="text-dark-text-muted">No jobs found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-border">
                    <th className="text-left py-3 px-4 text-dark-text-muted">Title</th>
                    <th className="text-left py-3 px-4 text-dark-text-muted">Company</th>
                    <th className="text-left py-3 px-4 text-dark-text-muted">Location</th>
                    <th className="text-left py-3 px-4 text-dark-text-muted">Posted</th>
                    <th className="text-left py-3 px-4 text-dark-text-muted">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.id} className="border-b border-dark-border hover:bg-dark-surface">
                      <td className="py-3 px-4 text-white">{job.title}</td>
                      <td className="py-3 px-4 text-dark-text-muted">{job.company}</td>
                      <td className="py-3 px-4 text-dark-text-muted">{job.location}</td>
                      <td className="py-3 px-4 text-dark-text-muted">{formatDate(job.createdAt)}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(job)}
                            className="text-blue-500 hover:text-blue-400"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(job.id)}
                            className="text-red-500 hover:text-red-400"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
