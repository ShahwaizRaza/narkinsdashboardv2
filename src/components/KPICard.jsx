import React from 'react';
import { formatCurrency, formatNumber } from '../utils/dataProcessing';

const KPICard = ({ title, value, isCurrency = false }) => {
  const displayValue = isCurrency ? formatCurrency(value) : formatNumber(value);
  
  return (
    <div className="bg-primary text-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
      <h3 className="text-sm font-medium opacity-90 mb-2">{title}</h3>
      <p className="text-2xl md:text-3xl font-bold">{displayValue}</p>
    </div>
  );
};

export default KPICard;
