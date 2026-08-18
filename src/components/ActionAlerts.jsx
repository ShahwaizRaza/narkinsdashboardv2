import React from 'react';
import { formatCurrency, formatNumber } from '../utils/dataProcessing';

const ActionAlerts = ({ underperformingBranches, slowMovingProducts }) => {
  const hasAlerts = (underperformingBranches && underperformingBranches.length > 0) || 
                    (slowMovingProducts && slowMovingProducts.length > 0);

  if (!hasAlerts) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Underperforming Branches Alert */}
      {underperformingBranches && underperformingBranches.length > 0 && (
        <div className="bg-orange-50 border-l-4 border-orange-500 rounded-lg shadow-md overflow-hidden">
          <div className="bg-orange-100 px-4 py-3 border-b border-orange-200">
            <h3 className="font-semibold text-orange-900 flex items-center gap-2">
              ⚠️ Branches Needing Attention
            </h3>
          </div>
          <div className="p-4">
            <p className="text-sm text-orange-800 mb-3">
              These branches are underperforming. Consider targeted promotions or staff training.
            </p>
            <div className="space-y-2">
              {underperformingBranches.map((branch, idx) => (
                <div key={idx} className="flex justify-between items-center bg-white p-2 rounded border border-orange-200">
                  <span className="font-medium text-gray-900">{branch.branch}</span>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      {formatCurrency(branch.totalSales)}
                    </div>
                    <div className="text-xs text-gray-500">{branch.contribution}% contrib</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Slow Moving Products Alert */}
      {slowMovingProducts && slowMovingProducts.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg shadow-md overflow-hidden">
          <div className="bg-yellow-100 px-4 py-3 border-b border-yellow-200">
            <h3 className="font-semibold text-yellow-900 flex items-center gap-2">
              🐌 Slow-Moving Inventory
            </h3>
          </div>
          <div className="p-4">
            <p className="text-sm text-yellow-800 mb-3">
              These products have low sales velocity. Consider discounts or bundle offers.
            </p>
            <div className="space-y-2">
              {slowMovingProducts.slice(0, 5).map((product, idx) => (
                <div key={idx} className="flex justify-between items-center bg-white p-2 rounded border border-yellow-200">
                  <span className="font-medium text-gray-900 text-sm truncate flex-1">
                    {product.product}
                  </span>
                  <div className="text-right ml-2">
                    <div className="text-xs font-semibold text-gray-900">
                      {formatNumber(product.soldQty)} units
                    </div>
                    <div className="text-xs text-gray-500">{formatCurrency(product.totalSales)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionAlerts;
