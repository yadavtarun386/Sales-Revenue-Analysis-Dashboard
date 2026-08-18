import React from 'react';
import { Lightbulb, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';

export function InsightsWidget({ insights = [] }) {
  if (!insights || insights.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center text-slate-400 text-xs">
        No business insights generated yet.
      </div>
    );
  }

  const getImportanceBadge = (importance) => {
    switch (importance) {
      case 'high':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">Key Insight</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Performance</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">Observation</span>;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Lightbulb className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Automated Business Insights</h3>
        </div>
        <span className="text-[11px] text-slate-500">Derived dynamically via Pandas</span>
      </div>

      <div className="mt-4 space-y-3 max-h-[380px] overflow-y-auto pr-1">
        {insights.map((item, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-200">{item.title}</span>
              {getImportanceBadge(item.importance)}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              «"{item.text}"»
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
