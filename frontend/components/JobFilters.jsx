'use client';

export default function JobFilters({ filters, onFilterChange, onClearFilters }) {
  const jobTypes = ['full-time', 'part-time', 'contract'];
  const experienceLevels = ['entry', 'mid', 'senior', 'executive'];
  const categories = ['Technology', 'Finance', 'Healthcare', 'Education', 'Marketing', 'Sales', 'Other'];

  const hasActiveFilters = filters.jobType || filters.location || filters.category || filters.experienceLevel;

  return (
    <div className="bg-dark-card border border-dark-border rounded-lg p-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        {/* Job Type Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-dark-text-muted whitespace-nowrap">Job Type:</span>
          <div className="flex gap-2 flex-wrap">
            {jobTypes.map((type) => (
              <button
                key={type}
                onClick={() => onFilterChange('jobType', filters.jobType === type ? '' : type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filters.jobType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-dark-surface text-dark-text-muted hover:bg-dark-border hover:text-white border border-dark-border'
                }`}
              >
                {type.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Location Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-dark-text-muted whitespace-nowrap">Location:</span>
          <select
            value={filters.location || 'all'}
            onChange={(e) => onFilterChange('location', e.target.value)}
            className="bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all min-w-[140px]"
          >
            <option value="all">All Locations</option>
            <option value="remote">Remote</option>
            <option value="new york">New York</option>
            <option value="san francisco">San Francisco</option>
            <option value="london">London</option>
            <option value="tokyo">Tokyo</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-dark-text-muted whitespace-nowrap">Category:</span>
          <select
            value={filters.category || ''}
            onChange={(e) => onFilterChange('category', e.target.value)}
            className="bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all min-w-[140px]"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Experience Level Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-dark-text-muted whitespace-nowrap">Experience:</span>
          <div className="flex gap-2 flex-wrap">
            {experienceLevels.map((level) => (
              <button
                key={level}
                onClick={() => onFilterChange('experienceLevel', filters.experienceLevel === level ? '' : level)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                  filters.experienceLevel === level
                    ? 'bg-blue-600 text-white'
                    : 'bg-dark-surface text-dark-text-muted hover:bg-dark-border hover:text-white border border-dark-border'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="ml-auto px-4 py-2 text-sm text-blue-500 hover:text-blue-400 font-medium transition-colors whitespace-nowrap"
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  );
}
