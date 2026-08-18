import React, { useState } from 'react';
import { UploadCloud, FileSpreadsheet, CheckCircle2, AlertTriangle, RefreshCw, Layers } from 'lucide-react';
import { apiService } from '../services/api';
import { formatNumber } from '../utils/formatters';

export function DataImportPage({ qualityReport, refreshData, reloadSampleData }) {
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);
    try {
      const res = await apiService.uploadFile(file);
      setUploadResult(res);
      await refreshData();
    } catch (err) {
      setUploadError(err.message || 'Failed to upload and process file');
    } finally {
      setUploading(false);
    }
  };

  const audit = uploadResult?.audit || qualityReport || {};
  const preview = uploadResult?.preview || [];

  return (
    <div className="space-y-6 pb-12">
      {/* File Upload Drop Zone */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center shadow-sm">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
            <UploadCloud className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Upload Sales Dataset</h3>
            <p className="text-xs text-slate-400 mt-1">
              Supports CSV & Excel (.xlsx, .xls) files. Automatically validated & cleaned using Python/Pandas.
            </p>
          </div>

          <div className="pt-2">
            <label className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs cursor-pointer shadow-md shadow-indigo-600/25 transition">
              <FileSpreadsheet className="w-4 h-4" />
              <span>{uploading ? 'Processing File...' : 'Select File (CSV / XLSX)'}</span>
              <input
                type="file"
                accept=".csv, .xlsx, .xls"
                onChange={handleFileChange}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>

          {/* Reset to Sample Data Button */}
          <div className="pt-2">
            <button
              onClick={reloadSampleData}
              className="text-xs text-slate-400 hover:text-indigo-300 font-medium inline-flex items-center space-x-1 underline"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset to Standard Sample Dataset (INR ₹650 records)</span>
            </button>
          </div>
        </div>

        {uploadError && (
          <div className="mt-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
            {uploadError}
          </div>
        )}
      </div>

      {/* Upload Processing & Audit Breakdown */}
      {audit && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium uppercase">Total Rows Processed</span>
              <p className="text-xl font-bold text-slate-100 mt-1">{formatNumber(audit.cleaned_rows || audit.initial_rows || 0)}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium uppercase">Total Columns</span>
              <p className="text-xl font-bold text-indigo-400 mt-1">{audit.initial_columns || 0}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium uppercase">Duplicates Removed</span>
              <p className="text-xl font-bold text-amber-400 mt-1">{audit.duplicate_rows_removed || 0}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium uppercase">Quality Score</span>
              <p className="text-xl font-bold text-emerald-400 mt-1">{audit.quality_score || 100}%</p>
            </div>
          </div>

          {/* Pandas Cleaning Audit Log */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
              Automated Pandas Data Cleaning Audit Actions
            </h4>
            <div className="space-y-2">
              {audit.data_issues_found?.length > 0 ? (
                audit.data_issues_found.map((issue, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-xs text-slate-300 p-2.5 rounded bg-slate-950 border border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{issue}</span>
                  </div>
                ))
              ) : (
                <div className="flex items-center space-x-2 text-xs text-emerald-400 p-2.5 rounded bg-slate-950 border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Dataset passed all structural validation checks cleanly with 0 defects.</span>
                </div>
              )}
            </div>
          </div>

          {/* Cleaned Dataset Preview Table */}
          {preview.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Cleaned Dataset Preview (First 20 Records)
                </h4>
                <span className="text-xs text-slate-400 font-mono">Sample Rows</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      {Object.keys(preview[0]).map((col) => (
                        <th key={col} className="px-3 py-2">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 font-sans">
                    {preview.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40">
                        {Object.values(row).map((val, i) => (
                          <td key={i} className="px-3 py-2 whitespace-nowrap text-slate-300">{String(val)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
