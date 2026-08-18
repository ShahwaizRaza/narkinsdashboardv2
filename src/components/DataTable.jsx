import React from 'react';
import { formatCurrency, formatNumber } from '../utils/dataProcessing';

const DataTable = ({ title, data, columns, maxHeight = '400px' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">{title}</h2>
        <p className="text-gray-500 text-center py-8">No data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      </div>
      
      <div className="table-responsive" style={{ maxHeight, overflowY: 'auto' }}>
        <table className="w-full border-collapse">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300">
                #
              </th>
              {columns.map((col, index) => (
                <th 
                  key={index}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap border border-gray-300"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm text-gray-500 border border-gray-300">
                  {rowIndex + 1}
                </td>
                {columns.map((col, colIndex) => {
                  const value = col.accessor(row);
                  const displayValue = col.isCurrency 
                    ? formatCurrency(value) 
                    : col.isNumber 
                    ? formatNumber(value) 
                    : value;
                  
                  return (
                    <td 
                      key={colIndex}
                      className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap border border-gray-300"
                    >
                      {displayValue}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
