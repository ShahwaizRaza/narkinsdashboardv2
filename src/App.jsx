import React from 'react';
import { useSalesData } from './hooks/useSalesData';
import Header from './components/Header';
import KPICard from './components/KPICard';
import DataTable from './components/DataTable';
import DirectorInsights from './components/DirectorInsights';
import ActionAlerts from './components/ActionAlerts';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';
import {
  getTodaysSales,
  getTodaysUnits,
  getMonthlySales,
  getTotalUnitsSold,
  getTodaysCategorySales,
  getMonthlyCategorySales,
  getTodaysSaleByBranch,
  getMonthlySaleByBranch,
  getTopProductsByRevenue,
  getProductsByCategory,
  getDirectorInsights,
  getSalesTrend,
  getUnderperformingBranches,
  getSlowMovingProducts
} from './utils/dataProcessing';

function App() {
  const { data, loading, error, lastUpdated, refetch } = useSalesData();

  if (loading && data.length === 0) {
    return <LoadingSpinner />;
  }

  if (error && data.length === 0) {
    return <ErrorDisplay error={error} onRetry={refetch} />;
  }

  // Calculate KPIs
  const todaysSales = getTodaysSales(data);
  const todaysUnits = getTodaysUnits(data);
  const monthlySales = getMonthlySales(data);
  const totalUnitsSold = getTotalUnitsSold(data);

  // Get Director Insights
  const directorInsights = getDirectorInsights(data);
  const salesTrend = getSalesTrend(data);
  const underperformingBranches = getUnderperformingBranches(data);
  const slowMovingProducts = getSlowMovingProducts(data, 10);

  // Get Today's Sale data
  const todaysSaleByBranch = getTodaysSaleByBranch(data);
  const todaysCategorySales = getTodaysCategorySales(data);

  // Get Monthly Sale data
  const monthlySaleByBranch = getMonthlySaleByBranch(data);
  const monthlyCategorySales = getMonthlyCategorySales(data);

  // Get top products
  const topProducts = getTopProductsByRevenue(data, 10);

  // Get products by category
  const unstitchedProducts = getProductsByCategory(data, 'NARMIN UNSTITCHED', 10);
  const stitchedProducts = getProductsByCategory(data, 'NARMIN STITCHED', 10);
  const cottonProducts = getProductsByCategory(data, 'COTTON', 10);
  const blendedProducts = getProductsByCategory(data, 'BLENDED', 10);
  const winterProducts = getProductsByCategory(data, 'WINTER', 10);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        lastUpdated={lastUpdated} 
        onRefresh={refetch} 
        isRefreshing={loading}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Director Insights */}
        <DirectorInsights insights={directorInsights} trend={salesTrend} />

        {/* Action Alerts */}
        <ActionAlerts 
          underperformingBranches={underperformingBranches}
          slowMovingProducts={slowMovingProducts}
        />

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <KPICard title="Today's Sales" value={todaysSales} isCurrency={true} />
          <KPICard title="Today's Units" value={todaysUnits} />
          <KPICard title="Monthly Sales" value={monthlySales} isCurrency={true} />
          <KPICard title="Total Units Sold" value={totalUnitsSold} />
        </div>

        {/* Today's Sale Section - 2 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <DataTable
            title="📌 Today's Sale"
            data={todaysSaleByBranch}
            columns={[
              { header: 'Branch', accessor: (row) => row.branch },
              { header: 'SOLD QTY', accessor: (row) => row.soldQty, isNumber: true },
              { header: 'Total Sales', accessor: (row) => row.totalSales, isCurrency: true },
              { header: 'Contrib %', accessor: (row) => row.contribution, isNumber: true }
            ]}
            maxHeight="400px"
          />
          
          <DataTable
            title="Today's Category Sale"
            data={todaysCategorySales}
            columns={[
              { header: 'Category', accessor: (row) => row.category },
              { header: 'SOLD QTY', accessor: (row) => row.soldQty, isNumber: true },
              { header: 'Total Sales', accessor: (row) => row.totalSales, isCurrency: true },
              { header: 'Contrib %', accessor: (row) => row.contribution, isNumber: true }
            ]}
            maxHeight="400px"
          />
        </div>

        {/* Monthly Sale Section - 2 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <DataTable
            title="Monthly Sale"
            data={monthlySaleByBranch}
            columns={[
              { header: 'Branch', accessor: (row) => row.branch },
              { header: 'SOLD QTY', accessor: (row) => row.soldQty, isNumber: true },
              { header: 'Total Sales', accessor: (row) => row.totalSales, isCurrency: true },
              { header: 'Contrib %', accessor: (row) => row.contribution, isNumber: true }
            ]}
            maxHeight="400px"
          />
          
          <DataTable
            title="Monthly Category Sale"
            data={monthlyCategorySales}
            columns={[
              { header: 'Category', accessor: (row) => row.category },
              { header: 'SOLD QTY', accessor: (row) => row.soldQty, isNumber: true },
              { header: 'Total Sales', accessor: (row) => row.totalSales, isCurrency: true },
              { header: 'Contrib %', accessor: (row) => row.contribution, isNumber: true }
            ]}
            maxHeight="400px"
          />
        </div>

        {/* Top Products */}
        <div className="mb-6">
          <DataTable
            title="⭐ Top 10 Products by Revenue"
            data={topProducts}
            columns={[
              { header: 'Main Product', accessor: (row) => row.product },
              { header: 'Total Sales', accessor: (row) => row.totalSales, isCurrency: true }
            ]}
            maxHeight="500px"
          />
        </div>

        {/* Products by Category - Unstitched & Stitched */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <DataTable
            title="Top 10 Narmin Unstitched"
            data={unstitchedProducts}
            columns={[
              { header: 'Main Product', accessor: (row) => row.product },
              { header: 'SOLD QTY', accessor: (row) => row.soldQty, isNumber: true },
              { header: 'Total Sales', accessor: (row) => row.totalSales, isCurrency: true }
            ]}
            maxHeight="500px"
          />
          
          <DataTable
            title="Top 10 Narmin Stitched"
            data={stitchedProducts}
            columns={[
              { header: 'Main Product', accessor: (row) => row.product },
              { header: 'SOLD QTY', accessor: (row) => row.soldQty, isNumber: true },
              { header: 'Total Sales', accessor: (row) => row.totalSales, isCurrency: true }
            ]}
            maxHeight="500px"
          />
        </div>

        {/* Products by Category - Cotton & Blended */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <DataTable
            title="Top 10 Cotton"
            data={cottonProducts}
            columns={[
              { header: 'Main Product', accessor: (row) => row.product },
              { header: 'SOLD QTY', accessor: (row) => row.soldQty, isNumber: true },
              { header: 'Total Sales', accessor: (row) => row.totalSales, isCurrency: true }
            ]}
            maxHeight="500px"
          />
          
          <DataTable
            title="Top 10 Blended"
            data={blendedProducts}
            columns={[
              { header: 'Main Product', accessor: (row) => row.product },
              { header: 'SOLD QTY', accessor: (row) => row.soldQty, isNumber: true },
              { header: 'Total Sales', accessor: (row) => row.totalSales, isCurrency: true }
            ]}
            maxHeight="500px"
          />
        </div>

        {/* Winter Products */}
        <div className="mb-6">
          <DataTable
            title="Top 10 Winter"
            data={winterProducts}
            columns={[
              { header: 'Main Product', accessor: (row) => row.product },
              { header: 'SOLD QTY', accessor: (row) => row.soldQty, isNumber: true },
              { header: 'Total Sales', accessor: (row) => row.totalSales, isCurrency: true }
            ]}
            maxHeight="500px"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-inner mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-gray-500 text-sm">
            © 2026 Narkins / Narmin Sales Dashboard • Auto-refreshes every 60 seconds
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
