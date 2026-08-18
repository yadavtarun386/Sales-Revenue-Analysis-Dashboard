import React from 'react';
import { Users, Award, MapPin, ShoppingBag } from 'lucide-react';
import { formatINR, formatNumber } from '../utils/formatters';

export function CustomerAnalysisPage({ customerData, regions }) {
  const topCustomers = customerData || [];

  return (
    <div className="space-y-6 pb-12">
      {/* Header card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center space-x-3">
        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Customer Value & Demographics</h3>
          <p className="text-xs text-slate-400">Analysis of top spending accounts, purchase frequency, and regional distribution</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Customers Table */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="pb-4 border-b border-slate-800 flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Top 15 Spending Customers</h4>
            <span className="text-xs text-slate-500 font-mono">Ranked by Total Revenue</span>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-3 py-2.5">Rank</th>
                  <th className="px-3 py-2.5">Customer Name</th>
                  <th className="px-3 py-2.5">Region</th>
                  <th className="px-3 py-2.5 text-right">Orders</th>
                  <th className="px-3 py-2.5 text-right">Items</th>
                  <th className="px-3 py-2.5 text-right">Total Spend</th>
                  <th className="px-3 py-2.5 text-right">Avg Order Spend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {topCustomers.map((c, idx) => (
                  <tr key={c.customer} className="hover:bg-slate-800/40">
                    <td className="px-3 py-2.5 font-mono text-slate-500">{idx + 1}</td>
                    <td className="px-3 py-2.5 font-semibold text-slate-100">{c.customer}</td>
                    <td className="px-3 py-2.5 text-slate-400">{c.region}</td>
                    <td className="px-3 py-2.5 text-right font-medium text-slate-200">{formatNumber(c.orders)}</td>
                    <td className="px-3 py-2.5 text-right text-slate-300">{formatNumber(c.items)}</td>
                    <td className="px-3 py-2.5 text-right font-bold text-indigo-400">{c.revenue_formatted}</td>
                    <td className="px-3 py-2.5 text-right font-bold text-slate-200">{c.aov_formatted}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Regional Customer Distribution */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 pb-4 border-b border-slate-800">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Customer Density by Region</h4>
          </div>

          <div className="space-y-3">
            {regions.map((reg) => (
              <div key={reg.region} className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">{reg.region}</span>
                  <span className="text-xs font-semibold text-emerald-400">{formatNumber(reg.customers)} Clients</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                  <span>Revenue Contribution:</span>
                  <span className="font-semibold text-slate-200">{reg.revenue_formatted}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                  <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${reg.share}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
