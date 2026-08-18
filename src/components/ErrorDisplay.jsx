import React from 'react';

const ErrorDisplay = ({ error, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Data</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <button 
          onClick={onRetry}
          className="bg-primary hover:bg-secondary text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );
};

export default ErrorDisplay;
