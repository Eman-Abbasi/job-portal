'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import { jobsAPI } from '../../../lib/api';
import { isAuthenticated } from '../../../lib/auth';
import { formatDate } from '../../../lib/utils';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [userStatus, setUserStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    loadJob();
  }, [params.id]);

  const loadJob = async () => {
    try {
      const response = await jobsAPI.getJobById(params.id);
      setJob(response.data.job);
      setUserStatus(response.data.userStatus);
    } catch (error) {
      console.error('Error loading job:', error);
      if (error.response?.status === 404) {
        router.push('/jobs');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    setApplying(true);
    try {
      await jobsAPI.applyToJob(params.id);
      alert('Application submitted successfully!');
      loadJob(); // Reload to update status
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to apply to job');
    } finally {
      setApplying(false);
    }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    try {
      await jobsAPI.bookmarkJob(params.id);
      loadJob(); // Reload to update status
    } catch (error) {
      console.error('Error bookmarking job:', error);
    }
  };

  const handleNotInterested = async () => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    try {
      await jobsAPI.markNotInterested(params.id);
      router.push('/jobs');
    } catch (error) {
      console.error('Error marking as not interested:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <p className="text-dark-text-muted">Loading job details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-dark-bg">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <p className="text-dark-text-muted">Job not found</p>
            <Link href="/jobs" className="text-blue-500 hover:text-blue-400 mt-4 inline-block">
              Back to Jobs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/jobs"
          className="text-blue-500 hover:text-blue-400 mb-6 inline-block"
        >
          ← Back to Jobs
        </Link>

        <div className="bg-dark-card border border-dark-border rounded-lg p-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">{job.title}</h1>
              <p className="text-xl text-dark-text-muted mb-4">{job.company}</p>
              <div className="flex flex-wrap gap-4 text-dark-text-muted">
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {job.location}
                </span>
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {job.salary}
                </span>
                <span className="capitalize">{job.jobType.replace('-', ' ')}</span>
                <span className="capitalize">{job.experienceLevel}</span>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex gap-3">
              {isAuthenticated() && (
                <>
                  <button
                    onClick={handleBookmark}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      userStatus?.bookmarked
                        ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                        : 'bg-dark-surface hover:bg-dark-border text-white border border-dark-border'
                    }`}
                  >
                    {userStatus?.bookmarked ? 'Bookmarked' : 'Bookmark'}
                  </button>
                  <button
                    onClick={handleNotInterested}
                    className="px-4 py-2 rounded-lg bg-dark-surface hover:bg-dark-border text-white border border-dark-border transition-colors"
                  >
                    Not Interested
                  </button>
                </>
              )}
              <button
                onClick={handleApply}
                disabled={applying || userStatus?.applied}
                className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold transition-colors"
              >
                {applying
                  ? 'Applying...'
                  : userStatus?.applied
                  ? `Applied - ${userStatus.applicationStatus}`
                  : 'Apply Now'}
              </button>
            </div>
          </div>

          <div className="border-t border-dark-border pt-6 mt-6">
            <h2 className="text-2xl font-semibold text-white mb-4">Job Description</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-dark-text-muted whitespace-pre-wrap">{job.description}</p>
            </div>
          </div>

          <div className="border-t border-dark-border pt-6 mt-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-dark-text-muted mb-2">Category</h3>
                <p className="text-white">{job.category}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-dark-text-muted mb-2">Posted</h3>
                <p className="text-white">{formatDate(job.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
