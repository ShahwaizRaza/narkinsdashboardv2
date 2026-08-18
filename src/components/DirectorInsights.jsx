import React from 'react';
import { formatCurrency, formatNumber } from '../utils/dataProcessing';

const DirectorInsights = ({ insights, trend }) => {
  if (!insights) return null;

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        💼 Director's Dashboard - Key Insights
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Performance */}
        <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">Today vs Average</h3>
            <span className={`text-2xl ${insights.todayPerformance.trend === 'up' ? '🔥' : '📉'}`}>
              {insights.todayPerformance.trend === 'up' ? '📈' : '📉'}
            </span>
          </div>
          <p className="text-3xl font-bold">{insights.todayPerformance.value}%</p>
          <p className="text-xs opacity-80 mt-1">{insights.todayPerformance.label}</p>
        </div>

        {/* Top Category */}
        <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">Top Category</h3>
            <span className="text-2xl">🏆</span>
          </div>
          <p className="text-lg font-bold truncate">{insights.topCategory.name}</p>
          <p className="text-xs opacity-80 mt-1">{insights.topCategory.contribution}% of sales</p>
        </div>

        {/* Top Branch */}
        <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">Top Branch</h3>
            <span className="text-2xl">📍</span>
          </div>
          <p className="text-lg font-bold truncate">{insights.topBranch.name}</p>
          <p className="text-xs opacity-80 mt-1">{insights.topBranch.contribution}% contribution</p>
        </div>

        {/* Avg Order Value */}
        <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">Avg Transaction Value</h3>
            <span className="text-2xl">💰</span>
          </div>
          <p className="text-2xl font-bold">{formatCurrency(insights.avgOrderValue)}</p>
          <p className="text-xs opacity-80 mt-1">
            {formatNumber(insights.totalOrders)} transactions
          </p>
        </div>
      </div>

      {/* 7-Day Trend */}
      {trend && trend.length > 0 && (
        <div className="mt-6 bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
          <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
            📊 Last 7 Days Sales Trend
          </h3>
          <div className="flex items-end justify-between h-24 gap-1">
            {trend.map((day, index) => {
              const maxSales = Math.max(...trend.map(d => d.sales));
              const height = maxSales > 0 ? (day.sales / maxSales) * 100 : 0;
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-1">
                  <div className="relative w-full">
                    <div
                      className="bg-white bg-opacity-60 rounded-t hover:bg-opacity-80 transition-all cursor-pointer"
                      style={{ height: `${height}px`, minHeight: '4px' }}
                      title={`${day.dayName}: ${formatCurrency(day.sales)}`}
                    />
                  </div>
                  <span className="text-xs opacity-75">{day.dayName}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DirectorInsights;
