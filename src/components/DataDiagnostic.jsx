import React from 'react';

const DataDiagnostic = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="bg-yellow-100 border border-yellow-400 p-4 rounded">No data to diagnose</div>;
  }

  const firstItem = data[0];
  const fields = Object.keys(firstItem);
  
  // Get unique values for Type/Symbol field
  const uniqueTypes = [...new Set(data.map(d => d.Type || d.type || d.Symbol || d.symbol || 'N/A'))];
  const uniqueCategories = [...new Set(data.map(d => d.Category || 'N/A'))];

  return (
    <div className="bg-blue-50 border border-blue-300 p-6 rounded-lg mb-6">
      <h2 className="text-xl font-bold mb-4 text-blue-900">🔍 Data Diagnostic Tool</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded">
          <h3 className="font-semibold mb-2 text-gray-700">Available Fields:</h3>
          <ul className="text-sm space-y-1">
            {fields.map(field => (
              <li key={field} className="font-mono text-xs bg-gray-100 p-1 rounded">
                {field}: {typeof firstItem[field]}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-4 rounded">
          <h3 className="font-semibold mb-2 text-gray-700">First Data Item:</h3>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-64">
            {JSON.stringify(firstItem, null, 2)}
          </pre>
        </div>

        <div className="bg-white p-4 rounded">
          <h3 className="font-semibold mb-2 text-gray-700">Unique Type/Symbol Values (first 20):</h3>
          <ul className="text-sm space-y-1 max-h-64 overflow-auto">
            {uniqueTypes.slice(0, 20).map((type, idx) => (
              <li key={idx} className="font-mono text-xs bg-gray-100 p-1 rounded">
                {type || '(empty)'}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-4 rounded">
          <h3 className="font-semibold mb-2 text-gray-700">Unique Categories (first 20):</h3>
          <ul className="text-sm space-y-1 max-h-64 overflow-auto">
            {uniqueCategories.slice(0, 20).map((cat, idx) => (
              <li key={idx} className="font-mono text-xs bg-gray-100 p-1 rounded">
                {cat || '(empty)'}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 bg-green-50 border border-green-300 p-4 rounded">
        <h3 className="font-semibold mb-2 text-green-900">📝 Instructions:</h3>
        <ol className="text-sm space-y-1 list-decimal list-inside">
          <li>Check the "Type/Symbol Values" - these are what the filter is looking for</li>
          <li>If the values contain "UNSTITCHED", "STITCHED", etc., the filter should work</li>
          <li>If not, check the "Categories" section</li>
          <li>Update the filter keywords in App.jsx to match the actual values</li>
          <li>Remove this diagnostic component once fixed</li>
        </ol>
      </div>
    </div>
  );
};

export default DataDiagnostic;
