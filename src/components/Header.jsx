import React from 'react';

const Header = ({ lastUpdated, onRefresh, isRefreshing }) => {
  const formatTime = (date) => {
    if (!date) return 'Never';
    return new Intl.DateTimeFormat('en-PK', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  return (
    <header className="bg-white shadow-sm"> {/*sticky top-0 z-20*/}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              📊 Narkins / Narmin Monthly Sales Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Last updated: {formatTime(lastUpdated)}
            </p>
          </div>
          
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="bg-primary hover:bg-secondary disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2 justify-center"
          >
            <svg 
              className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            </svg>
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
