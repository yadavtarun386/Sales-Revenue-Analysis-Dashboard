import React from 'react';
import { useSalesData } from './hooks/useSalesData';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { FilterPanel } from './components/filters/FilterPanel';
import { DashboardPage } from './pages/DashboardPage';
import { SalesAnalysisPage } from './pages/SalesAnalysisPage';
import { ProductAnalysisPage } from './pages/ProductAnalysisPage';
import { CustomerAnalysisPage } from './pages/CustomerAnalysisPage';
import { DataImportPage } from './pages/DataImportPage';
import { DataQualityPage } from './pages/DataQualityPage';
import { ReportsPage } from './pages/ReportsPage';
import { Loader2, AlertCircle } from 'lucide-react';

export default function App() {
  const {
    activeTab,
    setActiveTab,
    filters,
    updateFilter,
    resetFilters,
    filterOptions,
    kpiData,
    trendsData,
    categoryData,
    productData,
    regionData,
    channelData,
    customerData,
    edaData,
    insightsData,
    qualityReport,
    loading,
    error,
    refreshData,
    reloadSampleData
  } = useSalesData();

  const renderActivePage = () => {
    switch (activeTab) {
      case 'sales':
        return (
          <SalesAnalysisPage
            trends={trendsData}
            categories={categoryData}
            regions={regionData}
            channelData={channelData}
            filters={filters}
            updateFilter={updateFilter}
          />
        );
      case 'products':
        return <ProductAnalysisPage productData={productData} />;
      case 'customers':
        return <CustomerAnalysisPage customerData={customerData} regions={regionData} />;
      case 'import':
        return (
          <DataImportPage
            qualityReport={qualityReport}
            refreshData={refreshData}
            reloadSampleData={reloadSampleData}
          />
        );
      case 'quality':
        return <DataQualityPage qualityReport={qualityReport} />;
      case 'reports':
        return <ReportsPage edaData={edaData} filters={filters} />;
      default:
        return (
          <DashboardPage
            kpis={kpiData}
            trends={trendsData}
            categories={categoryData}
            products={productData}
            regions={regionData}
            insights={insightsData}
            filters={filters}
          />
        );
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Header Bar */}
        <Header
          activeTab={activeTab}
          qualityReport={qualityReport}
          refreshData={refreshData}
          filters={filters}
        />

        {/* Global Interactive Filter Panel */}
        <FilterPanel
          filters={filters}
          updateFilter={updateFilter}
          resetFilters={resetFilters}
          filterOptions={filterOptions}
        />

        {/* Dynamic Page View Area */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {loading && !kpiData ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-3">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
              <p className="text-xs text-slate-400 font-medium">Computing Pandas Data Analytics...</p>
            </div>
          ) : (
            renderActivePage()
          )}
        </main>
      </div>
    </div>
  );
}
