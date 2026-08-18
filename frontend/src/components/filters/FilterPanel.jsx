import React from 'react';
import { RotateCcw, Calendar, Filter } from 'lucide-react';

export function FilterPanel({ filters, updateFilter, resetFilters, filterOptions }) {
  // Count how many non-default filters are active
  const activeCount = Object.entries(filters).filter(([k, v]) => {
    if (k === 'time_grain') return false;
    if (k === 'product' || k === 'category' || k === 'region' || k === 'customer' || k === 'sales_channel' || k === 'payment_method') {
      return v !== 'All' && v !== '';
    }
    return Boolean(v);
  }).length;

  return (
    <div className="bg-slate-900 border-b border-slate-800 px-8 py-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Title and Filter label */}
        <div className="flex items-center space-x-2 shrink-0">
          <Filter className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Interactive Data Filters</span>
          {activeCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold">
              {activeCount} Active
            </span>
          )}
        </div>

        {/* Filters Controls Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 flex-1 items-center">
          {/* Start Date */}
          <div>
            <label className="block text-[10px] font-medium text-slate-400 mb-1">Start Date</label>
            <div className="relative">
              <input
                type="date"
                value={filters.date_start || ''}
                onChange={(e) => updateFilter('date_start', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-md px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* End Date */}
          <div>
            <label className="block text-[10px] font-medium text-slate-400 mb-1">End Date</label>
            <div className="relative">
              <input
                type="date"
                value={filters.date_end || ''}
                onChange={(e) => updateFilter('date_end', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-md px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-[10px] font-medium text-slate-400 mb-1">Category</label>
            <select
              value={filters.category || 'All'}
              onChange={(e) => updateFilter('category', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-md px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {filterOptions.categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Product Dropdown */}
          <div>
            <label className="block text-[10px] font-medium text-slate-400 mb-1">Product</label>
            <select
              value={filters.product || 'All'}
              onChange={(e) => updateFilter('product', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-md px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 truncate"
            >
              {filterOptions.products.map((prod) => (
                <option key={prod} value={prod}>{prod}</option>
              ))}
            </select>
          </div>

          {/* Region Dropdown */}
          <div>
            <label className="block text-[10px] font-medium text-slate-400 mb-1">Region</label>
            <select
              value={filters.region || 'All'}
              onChange={(e) => updateFilter('region', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-md px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {filterOptions.regions.map((reg) => (
                <option key={reg} value={reg}>{reg}</option>
              ))}
            </select>
          </div>

          {/* Sales Channel Dropdown */}
          <div>
            <label className="block text-[10px] font-medium text-slate-400 mb-1">Sales Channel</label>
            <select
              value={filters.sales_channel || 'All'}
              onChange={(e) => updateFilter('sales_channel', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-md px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {filterOptions.sales_channels.map((ch) => (
                <option key={ch} value={ch}>{ch}</option>
              ))}
            </select>
          </div>

          {/* Time Grain (Aggregation) */}
          <div>
            <label className="block text-[10px] font-medium text-slate-400 mb-1">Aggregation</label>
            <select
              value={filters.time_grain || 'Monthly'}
              onChange={(e) => updateFilter('time_grain', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-md px-2.5 py-1.5 text-xs text-indigo-300 font-semibold focus:outline-none focus:border-indigo-500"
            >
              <option value="Daily">Daily</option>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </div>
        </div>

        {/* Clearly Visible Reset Filters Button */}
        <div className="shrink-0 pt-2 lg:pt-[18px]">
          <button
            onClick={resetFilters}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border transition ${
              activeCount > 0
                ? 'bg-rose-500/10 border-rose-500/40 text-rose-300 hover:bg-rose-500 hover:text-white'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
}
