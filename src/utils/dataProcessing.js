// Calculate today's sales
export const getTodaysSales = (data) => {
  const today = new Date().toISOString().split('T')[0];
  return data
    .filter(item => item.Date && item.Date.startsWith(today))
    .reduce((sum, item) => sum + (item['Total Sales'] || 0), 0);
};

// Calculate today's units
export const getTodaysUnits = (data) => {
  const today = new Date().toISOString().split('T')[0];
  return data
    .filter(item => item.Date && item.Date.startsWith(today))
    .reduce((sum, item) => sum + (item['SOLD QTY'] || 0), 0);
};

// Calculate monthly sales
export const getMonthlySales = (data) => {
  return data.reduce((sum, item) => sum + (item['Total Sales'] || 0), 0);
};

// Calculate total units sold
export const getTotalUnitsSold = (data) => {
  return data.reduce((sum, item) => sum + (item['SOLD QTY'] || 0), 0);
};

// Get today's sales by category
export const getTodaysCategorySales = (data) => {
  const today = new Date().toISOString().split('T')[0];
  const todayData = data.filter(item => item.Date && item.Date.startsWith(today));
  
  const categoryMap = {};
  todayData.forEach(item => {
    const category = item.Category || 'Unknown';
    if (!categoryMap[category]) {
      categoryMap[category] = {
        category,
        soldQty: 0,
        totalSales: 0,
        count: 0
      };
    }
    categoryMap[category].soldQty += item['SOLD QTY'] || 0;
    categoryMap[category].totalSales += item['Total Sales'] || 0;
    categoryMap[category].count += 1;
  });
  
  const total = Object.values(categoryMap).reduce((sum, c) => sum + c.totalSales, 0);
  
  return Object.values(categoryMap).map(cat => ({
    ...cat,
    contribution: total > 0 ? ((cat.totalSales / total) * 100).toFixed(2) : 0
  })).sort((a, b) => b.totalSales - a.totalSales);
};

// Get monthly sales by category
export const getMonthlyCategorySales = (data) => {
  const categoryMap = {};
  
  data.forEach(item => {
    const category = item.Category || 'Unknown';
    if (!categoryMap[category]) {
      categoryMap[category] = {
        category,
        soldQty: 0,
        totalSales: 0,
        count: 0
      };
    }
    categoryMap[category].soldQty += item['SOLD QTY'] || 0;
    categoryMap[category].totalSales += item['Total Sales'] || 0;
    categoryMap[category].count += 1;
  });
  
  const total = Object.values(categoryMap).reduce((sum, c) => sum + c.totalSales, 0);
  
  return Object.values(categoryMap).map(cat => ({
    ...cat,
    contribution: total > 0 ? ((cat.totalSales / total) * 100).toFixed(2) : 0
  })).sort((a, b) => b.totalSales - a.totalSales);
};

// Get top products by revenue
export const getTopProductsByRevenue = (data, limit = 10) => {
  const productMap = {};
  
  data.forEach(item => {
    const product = cleanProductName(item['Product Name'] || 'Unknown');
    if (!productMap[product]) {
      productMap[product] = {
        product,
        totalSales: 0
      };
    }
    productMap[product].totalSales += item['Total Sales'] || 0;
  });
  
  return Object.values(productMap)
    .sort((a, b) => b.totalSales - a.totalSales)
    .slice(0, limit);
};

// Get products by type - Enhanced with better filtering
export const getProductsByType = (data, type, limit = 10) => {
  // Debug: Log what we're looking for (remove these after debugging)
  if (data.length > 0) {
    console.log(`🔍 Looking for type: "${type}"`);
    console.log('📋 Sample data item:', data[0]);
    console.log('🏷️ Available Type values (first 10):',
      [...new Set(data.map(d => d.Type || d.type || 'N/A'))].slice(0, 10)
    );
  }
  
  const filteredData = data.filter(item => {
    // Check multiple possible field names
    const itemType = item.Type || item.type || item.Symbol || item.symbol || '';
    const itemCategory = item.Category || item.category || '';
    const itemProductName = item['Product Name'] || item.ProductName || '';
    
    const searchType = type.toLowerCase();
    const typeMatch = itemType.toLowerCase().includes(searchType);
    const categoryMatch = itemCategory.toLowerCase().includes(searchType);
    const nameMatch = itemProductName.toLowerCase().includes(searchType);
    
    return typeMatch || categoryMatch || nameMatch;
  });
  
  console.log(`✅ Found ${filteredData.length} items for type "${type}"`);
  
  const productMap = {};
  
  filteredData.forEach(item => {
    const product = item['Product Name'] || item.ProductName || 'Unknown';
    if (!productMap[product]) {
      productMap[product] = {
        product,
        soldQty: 0,
        totalSales: 0
      };
    }
    productMap[product].soldQty += item['SOLD QTY'] || item.soldQuantity || 0;
    productMap[product].totalSales += item['Total Sales'] || item.includingTaxAmount || 0;
  });
  
  return Object.values(productMap)
    .sort((a, b) => b.totalSales - a.totalSales)
    .slice(0, limit);
};

// Format currency
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-PK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

// Format number
export const formatNumber = (value) => {
  return new Intl.NumberFormat('en-PK').format(value);
};

// Alternative: Get products by category keyword
export const getProductsByCategory = (data, keyword, limit = 10) => {
  const filteredData = data.filter(item => {
    const category = (item.Category || '').toLowerCase();
    return category.includes(keyword.toLowerCase());
  });
  
  const productMap = {};
  
  filteredData.forEach(item => {
    const product = cleanProductName(item['Product Name'] || 'Unknown');
    if (!productMap[product]) {
      productMap[product] = {
        product,
        soldQty: 0,
        totalSales: 0
      };
    }
    productMap[product].soldQty += item['SOLD QTY'] || 0;
    productMap[product].totalSales += item['Total Sales'] || 0;
  });
  
  return Object.values(productMap)
    .sort((a, b) => b.totalSales - a.totalSales)
    .slice(0, limit);
};

// Clean product name - remove color and attributes but KEEP size
export const cleanProductName = (productName) => {
  if (!productName) return 'Unknown';
  
  // Split by pipe (|) and take only the first part (product code with size)
  const parts = productName.split('|');
  const productWithSize = parts[0].trim();
  
  return productWithSize;
};

// Get Today's Sale by Branch
export const getTodaysSaleByBranch = (data) => {
  const today = new Date().toISOString().split('T')[0];
  const todayData = data.filter(item => item.Date && item.Date.startsWith(today));
  
  const branchMap = {};
  
  todayData.forEach(item => {
    const branch = item.Branch || 'Unknown';
    if (!branchMap[branch]) {
      branchMap[branch] = {
        branch,
        soldQty: 0,
        totalSales: 0
      };
    }
    branchMap[branch].soldQty += item['SOLD QTY'] || 0;
    branchMap[branch].totalSales += item['Total Sales'] || 0;
  });
  
  const total = Object.values(branchMap).reduce((sum, b) => sum + b.totalSales, 0);
  
  return Object.values(branchMap).map(branch => ({
    ...branch,
    contribution: total > 0 ? ((branch.totalSales / total) * 100).toFixed(2) : 0
  })).sort((a, b) => b.totalSales - a.totalSales);
};

// Get Monthly Sale by Branch
export const getMonthlySaleByBranch = (data) => {
  const branchMap = {};
  
  data.forEach(item => {
    const branch = item.Branch || 'Unknown';
    if (!branchMap[branch]) {
      branchMap[branch] = {
        branch,
        soldQty: 0,
        totalSales: 0,
        contribution: 0
      };
    }
    branchMap[branch].soldQty += item['SOLD QTY'] || 0;
    branchMap[branch].totalSales += item['Total Sales'] || 0;
  });
  
  const total = Object.values(branchMap).reduce((sum, b) => sum + b.totalSales, 0);
  
  return Object.values(branchMap).map(branch => ({
    ...branch,
    contribution: total > 0 ? ((branch.totalSales / total) * 100).toFixed(2) : 0
  })).sort((a, b) => b.totalSales - a.totalSales);
};

// ========================================
// DIRECTOR INSIGHTS & ANALYTICS
// ========================================

// Get Key Performance Insights
export const getDirectorInsights = (data) => {
  const today = new Date().toISOString().split('T')[0];
  const todayData = data.filter(item => item.Date && item.Date.startsWith(today));
  
  // Calculate today vs monthly average
  const daysInMonth = new Date().getDate();
  const monthlySales = getMonthlySales(data);
  const dailyAverage = monthlySales / daysInMonth;
  const todaysSales = getTodaysSales(data);
  const todayPerformance = dailyAverage > 0 ? ((todaysSales / dailyAverage - 1) * 100).toFixed(1) : 0;
  
  // Top performing category
  const categories = getMonthlyCategorySales(data);
  const topCategory = categories[0] || { category: 'N/A', contribution: 0 };
  
  // Top performing branch
  const branches = getMonthlySaleByBranch(data);
  const topBranch = branches[0] || { branch: 'N/A', contribution: 0 };
  
  // Average order value - IMPROVED CALCULATION
  // Method 1: If you have invoice/order numbers (uncomment if available)
  // const uniqueOrders = [...new Set(data.map(item => item.InvoiceNumber || item.OrderID))];
  // const avgOrderValue = uniqueOrders.length > 0 ? monthlySales / uniqueOrders.length : 0;
  
  // Method 2: Estimate based on transactions per day per branch
  // Assumption: Each unique Date+Branch combination is likely one or more transactions
  const uniqueTransactions = {};
  data.forEach(item => {
    const key = `${item.Date}-${item.Branch}`;
    if (!uniqueTransactions[key]) {
      uniqueTransactions[key] = { sales: 0, items: 0 };
    }
    uniqueTransactions[key].sales += item['Total Sales'] || 0;
    uniqueTransactions[key].items += 1;
  });
  
  // Average sales per date-branch combination
  const transactionCount = Object.keys(uniqueTransactions).length;
  const avgOrderValue = transactionCount > 0 ? monthlySales / transactionCount : 0;
  
  // Sales velocity (units per day)
  const totalUnits = getTotalUnitsSold(data);
  const salesVelocity = totalUnits / daysInMonth;
  
  // Total line items (for reference)
  const totalLineItems = data.length;
  
  return {
    todayPerformance: {
      value: todayPerformance,
      trend: todayPerformance >= 0 ? 'up' : 'down',
      label: todayPerformance >= 0 ? 'Above Average' : 'Below Average'
    },
    topCategory: {
      name: topCategory.category,
      contribution: topCategory.contribution
    },
    topBranch: {
      name: topBranch.branch,
      contribution: topBranch.contribution
    },
    avgOrderValue: avgOrderValue,
    salesVelocity: salesVelocity.toFixed(1),
    totalOrders: transactionCount, // Estimated unique transactions
    totalLineItems: totalLineItems  // Total product lines sold
  };
};

// Get Sales Trend (Last 7 Days)
export const getSalesTrend = (data) => {
  const last7Days = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const daySales = data
      .filter(item => item.Date && item.Date.startsWith(dateStr))
      .reduce((sum, item) => sum + (item['Total Sales'] || 0), 0);
    
    last7Days.push({
      date: dateStr,
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      sales: daySales
    });
  }
  
  return last7Days;
};

// Get underperforming branches (bottom 3)
export const getUnderperformingBranches = (data) => {
  const branches = getMonthlySaleByBranch(data);
  return branches.slice(-3).reverse(); // Get last 3, reverse to show worst first
};

// Get inventory risk (slow-moving products)
export const getSlowMovingProducts = (data, limit = 10) => {
  const productMap = {};
  
  data.forEach(item => {
    const product = cleanProductName(item['Product Name'] || 'Unknown');
    if (!productMap[product]) {
      productMap[product] = {
        product,
        soldQty: 0,
        totalSales: 0
      };
    }
    productMap[product].soldQty += item['SOLD QTY'] || 0;
    productMap[product].totalSales += item['Total Sales'] || 0;
  });
  
  // Get products with sales but low quantity
  return Object.values(productMap)
    .filter(p => p.soldQty > 0 && p.soldQty < 20) // Low movement threshold
    .sort((a, b) => a.soldQty - b.soldQty)
    .slice(0, limit);
};

// Get category performance matrix
export const getCategoryPerformanceMatrix = (data) => {
  const categories = getMonthlyCategorySales(data);
  const avgContribution = 100 / categories.length;
  
  return categories.map(cat => ({
    ...cat,
    performance: parseFloat(cat.contribution) >= avgContribution ? 'High' : 'Low',
    status: parseFloat(cat.contribution) >= avgContribution ? '🟢' : '🔴'
  }));
};
