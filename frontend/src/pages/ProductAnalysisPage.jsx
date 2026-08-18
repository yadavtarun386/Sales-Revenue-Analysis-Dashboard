import React, { useState } from 'react';
import { Package, Award, TrendingDown, DollarSign, Layers, AlertCircle } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { formatINR, formatNumber } from '../utils/formatters';

export function ProductAnalysisPage({ productData }) {
  const [activeSubTab, setActiveSubTab] = useState('revenue'); // revenue, quantity, profit

  const topRevenue = productData?.top_revenue || [];
  const topQuantity = productData?.top_quantity || [];
  const topProfit = productData?.top_profit || [];
  const bottomPerformers = productData?.bottom_performers || [];

  const getCurrentList = () => {
    switch (activeSubTab) {
      case 'quantity': return topQuantity;
      case 'profit': return topProfit;
      default: return topRevenue;
    }
  };

  const currentList = getCurrentList();

  return (
    <div className="space-y-6 pb-12">
      {/* Tab Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Product Performance Rankings</h3>
            <p className="text-xs text-slate-400">Analyze top 10 SKUs ranked dynamically by Revenue, Quantity, and Profit</p>
          </div>
        </div>

        <div className="flex items-center space-x-1 mt-3 sm:mt-0 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveSubTab('revenue')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
              activeSubTab === 'revenue' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Top by Revenue
          </button>
          <button
            onClick={() => setActiveSubTab('quantity')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
              activeSubTab === 'quantity' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Top by Quantity
          </button>
          <button
            onClick={() => setActiveSubTab('profit')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
              activeSubTab === 'profit' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Top by Profit
          </button>
        </div>
      </div>

      {/* Product Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="pb-4 border-b border-slate-800 flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Top 10 Products by {activeSubTab.toUpperCase()}
          </h4>
          <span className="text-[11px] text-slate-400">Values in INR (₹) or Units</span>
        </div>

        <div className="h-80 mt-4 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={currentList} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                type="number"
                stroke="#64748b"
                tick={{ fontSize: 11 }}
                tickFormatter={(val) => activeSubTab === 'quantity' ? formatNumber(val) : formatINR(val, true)}
              />
              <YAxis dataKey="product" type="category" stroke="#64748b" tick={{ fontSize: 11 }} width={170} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                formatter={(val) => [activeSubTab === 'quantity' ? `${formatNumber(val)} units` : formatINR(val), '']}
              />
              <Bar
                dataKey={activeSubTab === 'quantity' ? 'quantity' : activeSubTab}
                fill={activeSubTab === 'profit' ? '#10B981' : activeSubTab === 'quantity' ? '#F59E0B' : '#6366F1'}
                radius={[0, 6, 6, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Products Table Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ranked Products Detail List */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="pb-4 border-b border-slate-800 flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Product Detailed Metrics ({activeSubTab.toUpperCase()})
            </h4>
            <span className="text-xs text-slate-500 font-mono">Top 10 SKUs</span>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-3 py-2.5">#</th>
                  <th className="px-3 py-2.5">Product Name</th>
                  <th className="px-3 py-2.5">Category</th>
                  <th className="px-3 py-2.5 text-right">Revenue</th>
                  <th className="px-3 py-2.5 text-right">Profit</th>
                  <th className="px-3 py-2.5 text-right">Qty</th>
                  <th className="px-3 py-2.5 text-right">Margin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {currentList.map((p, idx) => (
                  <tr key={p.product} className="hover:bg-slate-800/40">
                    <td className="px-3 py-2.5 text-slate-500 font-mono">{idx + 1}</td>
                    <td className="px-3 py-2.5 font-semibold text-slate-100">{p.product}</td>
                    <td className="px-3 py-2.5 text-slate-400">{p.category}</td>
                    <td className="px-3 py-2.5 text-right font-bold text-slate-200">{p.revenue_formatted}</td>
                    <td className="px-3 py-2.5 text-right font-bold text-emerald-400">{p.profit_formatted}</td>
                    <td className="px-3 py-2.5 text-right text-slate-300 font-medium">{formatNumber(p.quantity)}</td>
                    <td className="px-3 py-2.5 text-right font-bold text-indigo-300">{p.profit_margin}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Performers Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-2 pb-4 border-b border-slate-800">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Bottom Performers</h4>
          </div>
          <p className="text-xs text-slate-400 mt-2 mb-4">Lowest revenue generating products requiring sales intervention</p>

          <div className="space-y-3">
            {bottomPerformers.map((bp) => (
              <div key={bp.product} className="p-3 rounded-lg bg-slate-950 border border-rose-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200 truncate">{bp.product}</span>
                  <span className="text-xs font-bold text-rose-400">{bp.revenue_compact}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                  <span>{bp.category}</span>
                  <span>{formatNumber(bp.quantity)} units sold</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
