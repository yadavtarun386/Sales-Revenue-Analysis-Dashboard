import React from 'react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  BarChart, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { TrendingUp, CreditCard, ShoppingBag, Globe, DollarSign } from 'lucide-react';
import { formatINR, formatNumber } from '../utils/formatters';

const CHANNEL_COLORS = ['#6366F1', '#10B981', '#F59E0B', '#3B82F6', '#8B5CF6', '#EC4899'];

export function SalesAnalysisPage({ trends, categories, regions, channelData, filters, updateFilter }) {
  const channelsList = channelData?.channels || [];
  const paymentsList = channelData?.payments || [];

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Sales & Revenue Aggregations</h3>
            <p className="text-xs text-slate-400">Deep dive into sales trends, order volume, and channel distributions</p>
          </div>
        </div>

        {/* Aggregation Switcher Buttons */}
        <div className="flex items-center space-x-1 mt-3 sm:mt-0 bg-slate-950 p-1 rounded-lg border border-slate-800">
          {['Daily', 'Monthly', 'Yearly'].map((g) => (
            <button
              key={g}
              onClick={() => updateFilter('time_grain', g)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                filters.time_grain === g
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Main Composed Chart: Revenue, Profit & Order Volume */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Revenue, Profit & Order Volume Trend</h3>
            <p className="text-xs text-slate-400 mt-0.5">Dual-axis visualization showing financial totals vs order counts</p>
          </div>
          <div className="flex items-center space-x-4 text-xs font-medium">
            <span className="flex items-center space-x-1.5 text-indigo-400">
              <span className="w-2.5 h-2.5 rounded bg-indigo-500 inline-block"></span>
              <span>Revenue (₹)</span>
            </span>
            <span className="flex items-center space-x-1.5 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block"></span>
              <span>Profit (₹)</span>
            </span>
            <span className="flex items-center space-x-1.5 text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
              <span>Orders (Count)</span>
            </span>
          </div>
        </div>

        <div className="h-80 mt-4 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={trends} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="period" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="left" stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={(val) => formatINR(val, true)} />
              <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                formatter={(value, name) => [
                  name === 'Orders' ? formatNumber(value) : formatINR(value),
                  name
                ]}
              />
              <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill="#6366F1" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="left" dataKey="profit" name="Profit" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="orders" name="Orders" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Analysis Matrix Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Revenue vs Profit Bar Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-2 pb-4 border-b border-slate-800">
            <ShoppingBag className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Category Revenue & Profit Matrix</h3>
          </div>
          <div className="h-72 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categories} margin={{ top: 10, right: 10, left: 0, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="category" stroke="#64748b" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={(val) => formatINR(val, true)} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(val) => [formatINR(val), '']}
                />
                <Bar dataKey="revenue" name="Revenue" fill="#6366F1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="profit" name="Profit" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Regional Revenue & Profit Matrix */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-2 pb-4 border-b border-slate-800">
            <Globe className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Regional Revenue & Sales Volume</h3>
          </div>
          <div className="h-72 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regions} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="region" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={(val) => formatINR(val, true)} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(val) => [formatINR(val), 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Sales Channels & Payment Methods Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sales Channels Table & Donut */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-2 pb-4 border-b border-slate-800">
            <Globe className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Sales Channels Breakdown</h3>
          </div>
          <div className="mt-4 space-y-2.5">
            {channelsList.map((ch, idx) => (
              <div key={ch.channel} className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div className="flex items-center space-x-3">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: CHANNEL_COLORS[idx % CHANNEL_COLORS.length] }}></span>
                  <span className="text-xs font-semibold text-slate-200">{ch.channel}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-100">{ch.revenue_formatted}</span>
                  <span className="text-[11px] text-slate-400 ml-2">({ch.share}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-2 pb-4 border-b border-slate-800">
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Payment Methods Share</h3>
          </div>
          <div className="mt-4 space-y-2.5">
            {paymentsList.map((pm) => (
              <div key={pm.method} className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-xs font-semibold text-slate-200">{pm.method}</span>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-100">{pm.revenue_formatted}</span>
                  <span className="text-[11px] text-slate-400 ml-2">({pm.share}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
