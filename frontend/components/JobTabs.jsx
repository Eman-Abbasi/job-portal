'use client';

export default function JobTabs({ activeTab, onTabChange, isAuthenticated }) {
  if (!isAuthenticated) return null;

  const tabs = [
    { id: 'all', label: 'All Jobs' },
    { id: 'bookmarked', label: 'Bookmarked' },
    { id: 'applied', label: 'Applied' },
    { id: 'not-interested', label: 'Not Interested' },
  ];

  return (
    <div className="border-b border-dark-border mb-6">
      <div className="flex space-x-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-dark-text-muted hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
