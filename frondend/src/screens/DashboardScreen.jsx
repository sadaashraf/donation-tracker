import { useState, useEffect } from "react";
import { Users, TrendingUp, Wallet, AlertCircle, CheckCircle, Clock, ChevronDown, ArrowUpRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import AppLogo from "../components/ui/AppLogo";
import CustomBar from "../components/ui/CustomBar";
import { fetchDashboardStats, fetchYearPlans } from "../api";

const MONTH_ORDER = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function StatCard({ icon: Icon, label, value, iconBg, iconColor, trend }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>
          <Icon size={19} className={iconColor} />
        </div>
        {trend && (
          <span className="flex items-center gap-0.5 text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
            <ArrowUpRight size={11} /> {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-xs text-gray-400 font-medium">{label}</p>
        <p className="text-xl font-bold text-gray-900 mt-0.5 leading-tight">{value}</p>
      </div>
    </div>
  );
}

function StatusBadge({ icon: Icon, label, count, bg, border, iconColor, textColor, countColor }) {
  return (
    <div className={`${bg} ${border} border rounded-2xl p-4 flex items-center gap-3`}>
      <div className={`w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm flex-shrink-0`}>
        <Icon size={17} className={iconColor} />
      </div>
      <div>
        <p className={`text-2xl font-bold ${countColor} leading-none`}>{count}</p>
        <p className={`text-xs font-semibold ${textColor} mt-0.5`}>{label}</p>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-lg">
      <p className="text-xs text-gray-400 font-medium">{label}</p>
      <p className="text-sm font-bold text-gray-900">PKR {payload[0].value.toLocaleString()}</p>
    </div>
  );
};

export default function DashboardScreen() {
  const [stats, setStats]     = useState(null);
  const [plans, setPlans]     = useState([]);
  const [year, setYear]       = useState(new Date().getFullYear().toString());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchYearPlans().then(p => {
      setPlans(p);
      if (p.length > 0 && !p.find(x => x.year === year)) setYear(p[0].year);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchDashboardStats(year).then(setStats).catch(console.error).finally(() => setLoading(false));
  }, [year]);

  const chartData = (stats?.chartData ?? [])
    .map(d => ({ month: d.month.slice(0,3), value: parseFloat(d.value) }))
    .sort((a, b) => MONTH_ORDER.indexOf(a.month) - MONTH_ORDER.indexOf(b.month));

  const collectionRate = stats?.totalRequired > 0
    ? Math.round((stats.totalReceived / stats.totalRequired) * 100)
    : 0;

  return (
    <div className="flex flex-col flex-1 overflow-y-auto bg-gray-50">
      {/* Header */}
      <div className="bg-white px-5 pt-5 pb-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-3 md:hidden"><AppLogo /><span className="text-lg font-bold text-gray-900">MMS</span></div>
        <div className="hidden md:block">
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-xs text-gray-400 mt-0.5">Overview for {year}</p>
        </div>
        <div className="relative">
          <select value={year} onChange={e => setYear(e.target.value)}
            className="appearance-none border border-gray-200 rounded-xl px-3 py-2 pr-7 text-sm font-semibold text-gray-700 outline-none focus:border-blue-400 transition-all bg-white">
            {plans.length === 0
              ? <option value={year}>{year}</option>
              : plans.map(p => <option key={p.year} value={p.year}>{p.year}</option>)
            }
          </select>
          <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div className="px-4 md:px-6 xl:px-8 py-5 space-y-4 max-w-5xl xl:max-w-6xl mx-auto w-full">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3 text-gray-400">
              <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
              <p className="text-sm">Loading dashboard...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Financial stat cards */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
              <StatCard icon={Users}      label="Total Members"   value={stats?.totalMembers ?? 0}                              iconBg="bg-blue-50"   iconColor="text-blue-600" />
              <StatCard icon={TrendingUp} label="Total Expected"  value={`PKR ${(stats?.totalRequired ?? 0).toLocaleString()}`} iconBg="bg-violet-50" iconColor="text-violet-600" />
              <StatCard icon={Wallet}     label="Total Received"  value={`PKR ${(stats?.totalReceived ?? 0).toLocaleString()}`} iconBg="bg-emerald-50" iconColor="text-emerald-600" />
              <StatCard icon={AlertCircle} label="Remaining"      value={`PKR ${(stats?.remaining ?? 0).toLocaleString()}`}    iconBg="bg-rose-50"   iconColor="text-rose-600" />
            </div>

            {/* Collection progress */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-bold text-gray-900">Collection Progress</p>
                <span className="text-sm font-bold text-blue-600">{collectionRate}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div
                  className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-700"
                  style={{ width: `${Math.min(collectionRate, 100)}%` }}
                />
              </div>
              <div className="flex justify-between mt-2">
                <p className="text-xs text-gray-400">PKR {(stats?.totalReceived ?? 0).toLocaleString()} collected</p>
                <p className="text-xs text-gray-400">PKR {(stats?.totalRequired ?? 0).toLocaleString()} target</p>
              </div>
            </div>

            {/* Status counts */}
            <div className="grid grid-cols-3 gap-3">
              <StatusBadge icon={CheckCircle} label="Paid"    count={stats?.paid ?? 0}    bg="bg-emerald-50" border="border-emerald-100" iconColor="text-emerald-600" textColor="text-emerald-600" countColor="text-emerald-700" />
              <StatusBadge icon={Clock}       label="Partial" count={stats?.partial ?? 0} bg="bg-amber-50"   border="border-amber-100"   iconColor="text-amber-500"  textColor="text-amber-600"   countColor="text-amber-700" />
              <StatusBadge icon={AlertCircle} label="Unpaid"  count={stats?.unpaid ?? 0}  bg="bg-rose-50"    border="border-rose-100"    iconColor="text-rose-500"   textColor="text-rose-600"    countColor="text-rose-700" />
            </div>

            {/* Monthly chart */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-bold text-gray-900">Monthly Collections</h2>
                  <p className="text-xs text-gray-400 mt-0.5">{year} — PKR per month</p>
                </div>
              </div>
              {chartData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2 text-gray-300">
                  <Wallet size={28} />
                  <p className="text-sm text-gray-400">No payment data for {year}</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData} barSize={24} barCategoryGap="30%">
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af" }} />
                    <YAxis hide />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.03)", radius: 8 }} />
                    <Bar dataKey="value" shape={<CustomBar />} radius={[6,6,0,0]}>
                      {chartData.map((_, i) => (
                        <Cell key={i} fill={i === chartData.length - 1 ? "#2563eb" : "#bfdbfe"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
