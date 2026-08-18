import React from 'react';
import { RefreshCw, Download, ShieldCheck, Database } from 'lucide-react';
import { apiService } from '../../services/api';

const pageTitles = {
  dashboard: { title: 'Executive Sales Dashboard', desc: 'Real-time revenue, order volume, profit trends & key business metrics' },
  sales: { title: 'Sales & Revenue Analysis', desc: 'Multi-dimensional trend aggregation & revenue channel matrix' },
  products: { title: 'Product Analytics & Performance', desc: 'Top performing SKUs by Revenue, Profitability, and Sales Volume' },
  customers: { title: 'Customer Demographics & Value', desc: 'Top spending accounts, customer frequency, and regional distribution' },
  import: { title: 'Data Import & Pipeline', desc: 'Upload CSV or XLSX sales files for automated validation & Pandas cleaning' },
  quality: { title: 'Dataset Health & Quality Audit', desc: 'Calculated data quality score, missing value metrics & data integrity' },
  reports: { title: 'Exploratory Analysis & Reports', desc: 'Summary statistics, metric distribution histograms, and PDF/CSV export' },
};

export function Header({ activeTab, qualityReport, refreshData, filters }) {
  const pageInfo = pageTitles[activeTab] || { title: 'Analytics Dashboard', desc: 'Business Performance Insights' };
  const score = qualityReport?.quality_score ?? 100;
  const rowsCount = qualityReport?.cleaned_rows ?? 0;

  const handleExport = async (format) => {
    try {
      await apiService.exportData(filters, format);
    } catch (err) {
      alert(`Export failed: ${err.message}`);
    }
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 px-8 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h2 className="text-xl font-bold text-slate-100 tracking-tight">{pageInfo.title}</h2>
        <p className="text-xs text-slate-400 mt-0.5">{pageInfo.desc}</p>
      </div>

      <div className="flex items-center space-x-3">
        {/* Quality Score Indicator Badge */}
        <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-400">Data Quality:</span>
          <span className="font-semibold text-emerald-400">{score}%</span>
        </div>

        {/* Rows Counter Badge */}
        <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
          <Database className="w-4 h-4 text-indigo-400" />
          <span className="text-slate-400">Records:</span>
          <span className="font-semibold text-slate-200">{rowsCount}</span>
        </div>

        {/* Refresh Data Button */}
        <button
          onClick={refreshData}
          title="Refresh Analysis"
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">Refresh</span>
        </button>

        {/* Quick Export Dropdown Buttons */}
        <div className="flex items-center space-x-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
          <button
            onClick={() => handleExport('csv')}
            className="px-2.5 py-1 rounded text-[11px] font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition flex items-center space-x-1"
          >
            <Download className="w-3 h-3 text-slate-400" />
            <span>CSV</span>
          </button>
          <button
            onClick={() => handleExport('excel')}
            className="px-2.5 py-1 rounded text-[11px] font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition flex items-center space-x-1"
          >
            <Download className="w-3 h-3 text-emerald-400" />
            <span>Excel</span>
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="px-2.5 py-1 rounded text-[11px] font-semibold text-indigo-300 hover:bg-indigo-600 hover:text-white transition flex items-center space-x-1"
          >
            <Download className="w-3 h-3 text-indigo-400" />
            <span>PDF Report</span>
          </button>
        </div>
      </div>
    </header>
  );
}
