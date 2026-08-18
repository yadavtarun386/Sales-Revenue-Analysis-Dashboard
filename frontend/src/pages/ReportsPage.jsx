import React from 'react';
import { FileText, Download, BarChart2, Calculator } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { apiService } from '../services/api';
import { formatINR, formatNumber } from '../utils/formatters';

export function ReportsPage({ edaData, filters }) {
  const statistics = edaData?.statistics || [];
  const histograms = edaData?.histograms || {};

  const revBins = histograms.Revenue || [];
  const profBins = histograms.Profit || [];

  const handleDownload = async (fmt) => {
    try {
      await apiService.exportData(filters, fmt);
    } catch (err) {
      alert(`Export failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner with Download Actions */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 uppercase tracking-wider">Exploratory Data Analysis (EDA) & Reports</h3>
            <p className="text-xs text-slate-400">Statistical distribution summaries and executive PDF/Excel report exports</p>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleDownload('csv')}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => handleDownload('excel')}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold border border-slate-700 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Excel</span>
          </button>
          <button
            onClick={() => handleDownload('pdf')}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/25 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Executive PDF Report</span>
          </button>
        </div>
      </div>

      {/* EDA Statistical Summary Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center space-x-2 pb-4 border-b border-slate-800">
          <Calculator className="w-4 h-4 text-indigo-400" />
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Descriptive Statistics Summary (Pandas Calculations)
          </h4>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Metric Column</th>
                <th className="px-4 py-3 text-right">Mean</th>
                <th className="px-4 py-3 text-right">Median</th>
                <th className="px-4 py-3 text-right">Min</th>
                <th className="px-4 py-3 text-right">Max</th>
                <th className="px-4 py-3 text-right">Std Dev</th>
                <th className="px-4 py-3 text-right">Sum Total</th>
                <th className="px-4 py-3 text-right">Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-sans">
              {statistics.map((s) => (
                <tr key={s.column} className="hover:bg-slate-800/40">
                  <td className="px-4 py-3 font-semibold text-slate-100">{s.column}</td>
                  <td className="px-4 py-3 text-right font-bold text-indigo-300">{s.formatted_mean}</td>
                  <td className="px-4 py-3 text-right text-slate-300">{s.median}</td>
                  <td className="px-4 py-3 text-right text-slate-400">{s.min}</td>
                  <td className="px-4 py-3 text-right text-emerald-400 font-medium">{s.max}</td>
                  <td className="px-4 py-3 text-right text-slate-400">{s.std_dev}</td>
                  <td className="px-4 py-3 text-right font-bold text-slate-100">{s.formatted_total}</td>
                  <td className="px-4 py-3 text-right text-slate-400">{formatNumber(s.count)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Distribution Histograms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Revenue Distribution Histogram */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-2 pb-4 border-b border-slate-800">
            <BarChart2 className="w-4 h-4 text-indigo-400" />
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Revenue Value Distribution</h4>
          </div>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revBins} margin={{ top: 10, right: 10, left: 0, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="bin_range" stroke="#64748b" tick={{ fontSize: 9 }} interval={0} angle={-20} textAnchor="end" />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(val) => [`${val} orders`, 'Frequency']}
                />
                <Bar dataKey="count" fill="#6366F1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Profit Distribution Histogram */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-2 pb-4 border-b border-slate-800">
            <BarChart2 className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Profit Value Distribution</h4>
          </div>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={profBins} margin={{ top: 10, right: 10, left: 0, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="bin_range" stroke="#64748b" tick={{ fontSize: 9 }} interval={0} angle={-20} textAnchor="end" />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(val) => [`${val} orders`, 'Frequency']}
                />
                <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
