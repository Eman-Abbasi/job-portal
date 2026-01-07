'use client';

import Link from 'next/link';
import { formatDate } from '../lib/utils';

export default function JobCard({ job, showActions = false, onBookmark, onApply, onNotInterested, userStatus }) {
  return (
    <div className="bg-dark-card border border-dark-border rounded-lg p-6 hover:border-blue-600 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <Link href={`/jobs/${job.id}`}>
            <h3 className="text-xl font-semibold text-white hover:text-blue-500 mb-2">
              {job.title}
            </h3>
          </Link>
          <p className="text-dark-text-muted mb-2">{job.company}</p>
          <div className="flex flex-wrap gap-2 text-sm text-dark-text-muted">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {job.location}
            </span>
            <span>•</span>
            <span>{job.jobType}</span>
            <span>•</span>
            <span>{job.experienceLevel}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-green-400">{job.salary}</p>
          <p className="text-xs text-dark-text-muted mt-1">
            {formatDate(job.createdAt)}
          </p>
        </div>
      </div>

      <p className="text-dark-text-muted mb-4 line-clamp-2">
        {job.description?.substring(0, 150)}...
      </p>

      {showActions && (
        <div className="flex gap-2 mt-4">
          <Link
            href={`/jobs/${job.id}`}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-lg transition-colors"
          >
            View Details
          </Link>
          {onBookmark && (
            <button
              onClick={() => onBookmark(job.id)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                userStatus?.bookmarked
                  ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                  : 'bg-dark-surface hover:bg-dark-border text-dark-text-muted'
              }`}
            >
              {userStatus?.bookmarked ? 'Bookmarked' : 'Bookmark'}
            </button>
          )}
        </div>
      )}

      {userStatus?.applied && (
        <div className="mt-4">
          <span className="inline-block bg-green-900/30 text-green-400 px-3 py-1 rounded-full text-sm">
            Applied - {userStatus.applicationStatus}
          </span>
        </div>
      )}
    </div>
  );
}
