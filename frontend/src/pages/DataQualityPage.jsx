import React from 'react';
import { ShieldCheck, AlertCircle, FileCheck, CheckCircle2, RefreshCw } from 'lucide-react';
import { formatNumber } from '../utils/formatters';

export function DataQualityPage({ qualityReport }) {
  const score = qualityReport?.quality_score ?? 100;
  const missingMap = qualityReport?.missing_values_before || {};
  const totalMissing = Object.values(missingMap).reduce((a, b) => a + b, 0);

  const getScoreColor = (s) => {
    if (s >= 90) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (s >= 75) return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/40 bg-rose-500/10';
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center space-x-3">
        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Calculated Data Quality & Health Audit</h3>
          <p className="text-xs text-slate-400">Algorithmic quality rating derived dynamically from Pandas structural checks</p>
        </div>
      </div>

      {/* Main Quality Score Gauge & Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Score Card */}
        <div className={`p-6 rounded-xl border flex flex-col items-center justify-center text-center ${getScoreColor(score)}`}>
          <ShieldCheck className="w-12 h-12 mb-2 opacity-90" />
          <span className="text-xs font-semibold uppercase tracking-wider">Calculated Data Quality Score</span>
          <div className="text-5xl font-black tracking-tight my-2">{score}%</div>
          <span className="text-[11px] font-medium opacity-80">
            {score >= 90 ? 'Excellent Integrity • Enterprise Grade' : 'Moderate Quality • Auto-Cleaned'}
          </span>
        </div>

        {/* Dataset Health Summary Cards */}
        <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium uppercase">Cleaned Valid Rows</span>
            <p className="text-xl font-bold text-slate-100 mt-1">{formatNumber(qualityReport?.valid_rows || 0)}</p>
            <span className="text-[10px] text-emerald-400 mt-1 inline-block">Ready for Analytics</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium uppercase">Total Columns</span>
            <p className="text-xl font-bold text-indigo-400 mt-1">{qualityReport?.initial_columns || 0}</p>
            <span className="text-[10px] text-slate-500 mt-1 inline-block">Schema mapped</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium uppercase">Duplicate Rows</span>
            <p className="text-xl font-bold text-amber-400 mt-1">{qualityReport?.duplicate_rows_removed || 0}</p>
            <span className="text-[10px] text-amber-400 mt-1 inline-block">De-duplicated</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium uppercase">Missing Values Fixed</span>
            <p className="text-xl font-bold text-indigo-300 mt-1">{formatNumber(totalMissing)}</p>
            <span className="text-[10px] text-slate-400 mt-1 inline-block">Imputed / Normalized</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium uppercase">Invalid Dates Coerced</span>
            <p className="text-xl font-bold text-sky-400 mt-1">{qualityReport?.invalid_dates_fixed || 0}</p>
            <span className="text-[10px] text-sky-400 mt-1 inline-block">Parsed to YYYY-MM-DD</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium uppercase">Revenue Recalculated</span>
            <p className="text-xl font-bold text-emerald-400 mt-1">{qualityReport?.recalculated_revenue_count || 0}</p>
            <span className="text-[10px] text-emerald-400 mt-1 inline-block">Qty × Unit Price</span>
          </div>
        </div>
      </div>

      {/* Column Missing Values Breakdown Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">
          Column-wise Missingness & Data Type Mapping
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Column Name</th>
                <th className="px-4 py-3">Pandas Data Type</th>
                <th className="px-4 py-3 text-right">Missing Values Count</th>
                <th className="px-4 py-3 text-right">Health Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-sans">
              {Object.entries(qualityReport?.column_types || {}).map(([col, dtype]) => {
                const missingCount = missingMap[col] || 0;
                return (
                  <tr key={col} className="hover:bg-slate-800/40">
                    <td className="px-4 py-2.5 font-semibold text-slate-200">{col}</td>
                    <td className="px-4 py-2.5 font-mono text-indigo-300 text-[11px]">{dtype}</td>
                    <td className="px-4 py-2.5 text-right font-medium text-slate-300">{missingCount}</td>
                    <td className="px-4 py-2.5 text-right font-bold">
                      {missingCount === 0 ? (
                        <span className="text-emerald-400">100% Clean</span>
                      ) : (
                        <span className="text-amber-400">Fixed</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
