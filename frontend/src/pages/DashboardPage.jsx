import React from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  ShoppingCart, 
  TrendingUp, 
  Users, 
  Percent, 
  Award,
  Layers,
  MapPin
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  CartesianGrid 
} from 'recharts';
import { KPICard } from '../components/dashboard/KPICard';
import { InsightsWidget } from '../components/dashboard/InsightsCard';
import { DataTable } from '../components/tables/DataTable';
import { formatINR, formatNumber } from '../utils/formatters';

const PIE_COLORS = ['#6366F1', '#10B981', '#F59E0B', '#3B82F6', '#8B5CF6', '#EC4899'];

export function DashboardPage({ kpis, trends, categories, products, regions, insights, filters }) {
  const topProductsList = products?.top_revenue?.slice(0, 5) || [];

  return (
    <div className="space-y-6 pb-12">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        <KPICard
          title="Total Revenue"
          value={kpis?.total_revenue_formatted || '₹0'}
          growth={kpis?.revenue_growth}
          subtext="Period revenue total"
          icon={DollarSign}
          color="indigo"
        />
        <KPICard
          title="Total Profit"
          value={kpis?.total_profit_formatted || '₹0'}
          growth={kpis?.profit_growth}
          subtext={`Margin: ${kpis?.profit_margin || 0}%`}
          icon={TrendingUp}
          color="emerald"
        />
        <KPICard
          title="Total Orders"
          value={kpis?.total_orders_formatted || '0'}
          growth={kpis?.orders_growth}
          subtext="Unique transaction orders"
          icon={ShoppingCart}
          color="sky"
        />
        <KPICard
          title="Total Sales Vol"
          value={formatNumber(kpis?.total_sales || 0)}
          subtext="Units sold across catalog"
          icon={ShoppingBag}
          color="amber"
        />
        <KPICard
          title="Avg Order Value"
          value={kpis?.avg_order_value_formatted || '₹0'}
          subtext="Revenue per order (AOV)"
          icon={Award}
          color="purple"
        />
        <KPICard
          title="Total Customers"
          value={formatNumber(kpis?.total_customers || 0)}
          subtext="Unique purchasing clients"
          icon={Users}
          color="indigo"
        />
        <KPICard
          title="Profit Margin"
          value={`${kpis?.profit_margin || 0}%`}
          subtext="Net profitability %"
          icon={Percent}
          color="emerald"
        />
      </div>

      {/* Main Charts Row: Revenue & Profit Trend + Insights Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Area Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Revenue & Profit Trend Over Time</h3>
              <p className="text-xs text-slate-400 mt-0.5">Aggregated by {filters.time_grain || 'Monthly'}</p>
            </div>
            <div className="flex items-center space-x-4 text-xs">
              <span className="flex items-center space-x-1.5 text-indigo-400 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block"></span>
                <span>Revenue</span>
              </span>
              <span className="flex items-center space-x-1.5 text-emerald-400 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                <span>Profit</span>
              </span>
            </div>
          </div>

          <div className="h-72 mt-4 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="period" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={(val) => formatINR(val, true)} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(val) => [formatINR(val), '']}
                />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#6366F1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="profit" name="Profit" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorProf)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Business Insights Column */}
        <div className="lg:col-span-1">
          <InsightsWidget insights={insights} />
        </div>
      </div>

      {/* Category & Regional Distribution Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Category Share Donut Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-2 pb-4 border-b border-slate-800">
            <Layers className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Revenue by Category</h3>
          </div>
          <div className="h-60 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categories}
                  dataKey="revenue"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                >
                  {categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(val) => [formatINR(val), 'Revenue']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
            {categories.slice(0, 6).map((c, i) => (
              <div key={c.category} className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}></span>
                <span className="text-slate-300 truncate">{c.category} ({c.revenue_share}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Performance Bar Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-2 pb-4 border-b border-slate-800">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Revenue by Region</h3>
          </div>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regions} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={(val) => formatINR(val, true)} />
                <YAxis dataKey="region" type="category" stroke="#64748b" tick={{ fontSize: 11 }} width={60} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(val) => [formatINR(val), 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#10B981" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 5 Revenue Products Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Top 5 Products</h3>
            <span className="text-xs text-indigo-400 font-semibold">By Revenue</span>
          </div>
          <div className="mt-4 space-y-3">
            {topProductsList.map((p, idx) => (
              <div key={p.product} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <div className="flex items-center space-x-3 overflow-hidden">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-indigo-400 text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div className="truncate">
                    <p className="text-xs font-medium text-slate-200 truncate">{p.product}</p>
                    <p className="text-[10px] text-slate-400">{p.category}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-slate-100">{p.revenue_compact}</p>
                  <p className="text-[10px] text-emerald-400">{p.profit_margin}% margin</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Sales Data Table */}
      <DataTable filters={filters} />
    </div>
  );
}
