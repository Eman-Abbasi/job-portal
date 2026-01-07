'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import JobCard from '../../components/JobCard';
import JobFilters from '../../components/JobFilters';
import JobTabs from '../../components/JobTabs';
import { jobsAPI } from '../../lib/api';
import { isAuthenticated } from '../../lib/auth';

export default function JobsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    jobType: '',
    location: '',
    category: '',
    experienceLevel: '',
    sortBy: 'newest',
  });
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0 });

  useEffect(() => {
    loadJobs();
  }, [filters, activeTab]);

  const loadJobs = async () => {
    setLoading(true);
    try {
      let response;
      if (activeTab === 'bookmarked' && isAuthenticated()) {
        response = await jobsAPI.getBookmarkedJobs();
        setJobs(response.data.jobs || []);
      } else if (activeTab === 'applied' && isAuthenticated()) {
        response = await jobsAPI.getAppliedJobs();
        setJobs(response.data.jobs || []);
      } else if (activeTab === 'not-interested' && isAuthenticated()) {
        response = await jobsAPI.getNotInterestedJobs();
        setJobs(response.data.jobs || []);
      } else {
        response = await jobsAPI.getJobs({
          ...filters,
          page: pagination.page,
          limit: 10,
        });
        setJobs(response.data.jobs || []);
        setPagination(response.data.pagination || {});
      }
    } catch (error) {
      console.error('Error loading jobs:', error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setPagination({ ...pagination, page: 1 });
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      jobType: '',
      location: '',
      category: '',
      experienceLevel: '',
      sortBy: 'newest',
    });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'all') {
      loadJobs();
    }
  };

  const handleBookmark = async (jobId) => {
    try {
      await jobsAPI.bookmarkJob(jobId);
      loadJobs();
    } catch (error) {
      console.error('Error bookmarking job:', error);
    }
  };

  const handleApply = async (jobId) => {
    try {
      await jobsAPI.applyToJob(jobId);
      router.push(`/jobs/${jobId}`);
    } catch (error) {
      console.error('Error applying to job:', error);
      alert(error.response?.data?.error || 'Failed to apply to job');
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-6">Job Listings</h1>
          
          {/* Filter Navbar */}
          <JobFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />

          {/* Tabs and Sort */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6">
            <JobTabs
              activeTab={activeTab}
              onTabChange={handleTabChange}
              isAuthenticated={isAuthenticated()}
            />
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="bg-dark-card border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="newest">Newest First</option>
              <option value="salary">Highest Salary</option>
            </select>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1">

            {/* Jobs List */}
            {loading ? (
              <div className="text-center py-12">
                <p className="text-dark-text-muted">Loading jobs...</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-dark-text-muted">No jobs found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    showActions={isAuthenticated()}
                    onBookmark={handleBookmark}
                    onApply={handleApply}
                    userStatus={job.userStatus}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {activeTab === 'all' && pagination.pages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                <button
                  onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-dark-surface"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-dark-text-muted">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                  disabled={pagination.page === pagination.pages}
                  className="px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-dark-surface"
                >
                  Next
                </button>
              </div>
            )}
        </main>
      </div>
    </div>
  );
}
