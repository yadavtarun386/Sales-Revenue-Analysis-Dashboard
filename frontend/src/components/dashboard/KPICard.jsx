import React from 'react';
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

export function KPICard({ title, value, growth, icon: Icon, subtext, color = 'indigo' }) {
  const isPositive = growth > 0;
  const isNegative = growth < 0;

  const colorClasses = {
    indigo: 'from-indigo-500/10 to-indigo-500/0 border-indigo-500/30 text-indigo-400',
    emerald: 'from-emerald-500/10 to-emerald-500/0 border-emerald-500/30 text-emerald-400',
    sky: 'from-sky-500/10 to-sky-500/0 border-sky-500/30 text-sky-400',
    amber: 'from-amber-500/10 to-amber-500/0 border-amber-500/30 text-amber-400',
    purple: 'from-purple-500/10 to-purple-500/0 border-purple-500/30 text-purple-400',
  }[color] || 'from-indigo-500/10 to-indigo-500/0 border-indigo-500/30 text-indigo-400';

  return (
    <div className={`relative overflow-hidden bg-slate-900 rounded-xl border border-slate-800 p-5 bg-gradient-to-b ${colorClasses} shadow-sm transition hover:border-slate-700`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</span>
        {Icon && (
          <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <div className="text-2xl font-bold text-slate-100 tracking-tight">{value}</div>

        {growth !== undefined && growth !== 0 && (
          <div
            className={`flex items-center space-x-0.5 text-xs font-semibold px-2 py-0.5 rounded-md ${
              isPositive
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : isNegative
                ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {isPositive ? (
              <ArrowUpRight className="w-3.5 h-3.5" />
            ) : isNegative ? (
              <ArrowDownRight className="w-3.5 h-3.5" />
            ) : null}
            <span>{Math.abs(growth)}%</span>
          </div>
        )}
      </div>

      {subtext && (
        <p className="mt-2 text-[11px] text-slate-500 flex items-center space-x-1">
          <span>{subtext}</span>
        </p>
      )}
    </div>
  );
}
