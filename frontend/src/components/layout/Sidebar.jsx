import React from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Package, 
  Users, 
  UploadCloud, 
  ShieldCheck, 
  FileText,
  BarChart3
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'sales', label: 'Sales Analysis', icon: TrendingUp },
  { id: 'products', label: 'Product Performance', icon: Package },
  { id: 'customers', label: 'Customer Insights', icon: Users },
  { id: 'import', label: 'Data Import', icon: UploadCloud },
  { id: 'quality', label: 'Data Quality', icon: ShieldCheck },
  { id: 'reports', label: 'Executive Reports', icon: FileText },
];

export function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800/80 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-inner">
          <BarChart3 className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-slate-100 text-base tracking-wide leading-tight">Sales Pulse</h1>
          <p className="text-xs text-indigo-400 font-medium">Business Analytics Platform</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
          Analytics Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 border border-indigo-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer info */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/60 text-xs text-slate-500">
        <div className="flex items-center justify-between">
          <span>Engine: <strong className="text-slate-300">Pandas 2.2</strong></span>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            INR (₹)
          </span>
        </div>
      </div>
    </aside>
  );
}
