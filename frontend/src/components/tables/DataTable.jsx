import React, { useState, useEffect, useCallback } from 'react';
import { Search, ArrowUpDown, ChevronLeft, ChevronRight, FileSpreadsheet } from 'lucide-react';
import { apiService } from '../../services/api';
import { formatINR, formatNumber } from '../../utils/formatters';

export function DataTable({ filters }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('Date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTableData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiService.getTableData({
        filters,
        search,
        sort_by: sortBy,
        sort_order: sortOrder,
        page,
        page_size: pageSize
      });
      setData(res.records || []);
      setTotalRecords(res.total_records || 0);
      setTotalPages(res.total_pages || 1);
    } catch (err) {
      console.error('Failed to load table data', err);
    } finally {
      setLoading(false);
    }
  }, [filters, search, sortBy, sortOrder, page, pageSize]);

  useEffect(() => {
    fetchTableData();
  }, [fetchTableData]);

  const handleSort = (columnKey) => {
    if (sortBy === columnKey) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(columnKey);
      setSortOrder('desc');
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
      {/* Table Header Controls */}
      <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-950/40">
        <div className="flex items-center space-x-2">
          <FileSpreadsheet className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Sales Transactions Data</h3>
          <span className="text-xs text-slate-500 font-medium">({formatNumber(totalRecords)} records)</span>
        </div>

        <div className="flex items-center space-x-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search order, product, customer..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 w-60"
            />
          </div>

          {/* Page Size Selector */}
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
            className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value={10}>10 / page</option>
            <option value={15}>15 / page</option>
            <option value={25}>25 / page</option>
            <option value={50}>50 / page</option>
          </select>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800 font-semibold text-[10px]">
            <tr>
              {[
                { label: 'Order ID', key: 'Order ID' },
                { label: 'Date', key: 'Date' },
                { label: 'Product', key: 'Product' },
                { label: 'Category', key: 'Category' },
                { label: 'Customer', key: 'Customer' },
                { label: 'Region', key: 'Region' },
                { label: 'Qty', key: 'Quantity' },
                { label: 'Revenue', key: 'Revenue' },
                { label: 'Profit', key: 'Profit' },
                { label: 'Channel', key: 'Sales Channel' },
                { label: 'Payment', key: 'Payment Method' },
              ].map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="px-4 py-3 cursor-pointer hover:bg-slate-900 transition"
                >
                  <div className="flex items-center space-x-1">
                    <span>{col.label}</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-sans">
            {loading ? (
              <tr>
                <td colSpan={11} className="py-8 text-center text-slate-400">
                  Loading sales data...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-8 text-center text-slate-500">
                  No transaction records found matching search and filters.
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition">
                  <td className="px-4 py-2.5 font-mono text-indigo-300 text-[11px]">{row['Order ID']}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap text-slate-400 text-[11px]">{row['Date']}</td>
                  <td className="px-4 py-2.5 font-medium text-slate-100">{row['Product']}</td>
                  <td className="px-4 py-2.5 text-slate-400">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px]">
                      {row['Category']}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-slate-300">{row['Customer']}</td>
                  <td className="px-4 py-2.5 text-slate-400">{row['Region']}</td>
                  <td className="px-4 py-2.5 font-medium text-slate-200">{formatNumber(row['Quantity'])}</td>
                  <td className="px-4 py-2.5 font-bold text-slate-100">{formatINR(row['Revenue'])}</td>
                  <td className="px-4 py-2.5 font-bold text-emerald-400">{formatINR(row['Profit'])}</td>
                  <td className="px-4 py-2.5 text-slate-400 text-[11px]">{row['Sales Channel']}</td>
                  <td className="px-4 py-2.5 text-slate-400 text-[11px]">{row['Payment Method']}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-950/40">
        <div className="text-xs text-slate-400">
          Page <strong className="text-slate-200">{page}</strong> of <strong className="text-slate-200">{totalPages}</strong>
        </div>
        <div className="flex items-center space-x-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
