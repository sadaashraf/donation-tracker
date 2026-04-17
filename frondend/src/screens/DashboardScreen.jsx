import { useState, useEffect } from "react";
import { Users, TrendingUp, Wallet, AlertCircle, CheckCircle, Clock, ChevronDown } from "lucide-react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import AppLogo from "../components/ui/AppLogo";
import CustomBar from "../components/ui/CustomBar";
import { fetchDashboardStats, fetchYearPlans } from "../api";

const MONTH_ORDER = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function StatCard({ icon: Icon, label, value, sub, color = "bg-blue-50", iconColor = "text-blue-500" }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
        <Icon size={20} className={iconColor} />
      </div>
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

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
    fetchDashboardStats(year)
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [year]);

  const chartData = (stats?.chartData ?? [])
    .map(d => ({ month: d.month.toUpperCase(), value: parseFloat(d.value) }))
    .sort((a, b) => MONTH_ORDER.indexOf(a.month.charAt(0) + a.month.slice(1).toLowerCase())
                  - MONTH_ORDER.indexOf(b.month.charAt(0) + b.month.slice(1).toLowerCase()));

  return (
    <div className="flex flex-col flex-1 overflow-y-auto bg-gray-50">
      <div className="bg-white px-5 pt-5 pb-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-3 md:hidden"><AppLogo /><span className="text-lg font-bold text-gray-900">MemberFlow</span></div>
        <div className="hidden md:block"><h1 className="text-xl font-bold text-gray-900">Dashboard</h1></div>
        <div className="relative">
          <select value={year} onChange={e => setYear(e.target.value)}
            className="appearance-none border border-gray-200 rounded-xl px-3 py-2 pr-7 text-sm font-semibold text-gray-700 outline-none focus:border-blue-400 transition-all">
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
          <div className="flex items-center justify-center py-16 text-gray-400 text-sm">Loading...</div>
        ) : (
          <>
            {/* Financial stats */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
              <StatCard icon={Users}       label="Total Members"    value={stats?.totalMembers ?? 0}                                          color="bg-blue-50"   iconColor="text-blue-500" />
              <StatCard icon={TrendingUp}  label="Total Expected"   value={`PKR ${(stats?.totalRequired ?? 0).toLocaleString()}`}             color="bg-purple-50" iconColor="text-purple-500" />
              <StatCard icon={Wallet}      label="Total Received"   value={`PKR ${(stats?.totalReceived ?? 0).toLocaleString()}`}             color="bg-green-50"  iconColor="text-green-500" />
              <StatCard icon={AlertCircle} label="Remaining"        value={`PKR ${(stats?.remaining ?? 0).toLocaleString()}`}                 color="bg-red-50"    iconColor="text-red-500" />
            </div>

            {/* Status counts */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-green-50 border border-green-100 rounded-2xl p-4 text-center">
                <CheckCircle size={20} className="text-green-500 mx-auto mb-1" />
                <p className="text-2xl font-bold text-green-700">{stats?.paid ?? 0}</p>
                <p className="text-xs text-green-600 font-semibold mt-0.5">Paid</p>
              </div>
              <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 text-center">
                <Clock size={20} className="text-orange-500 mx-auto mb-1" />
                <p className="text-2xl font-bold text-orange-700">{stats?.partial ?? 0}</p>
                <p className="text-xs text-orange-600 font-semibold mt-0.5">Partial</p>
              </div>
              <div className="bg-red-50 border border-red-100 rounded-2xl p-4 text-center">
                <AlertCircle size={20} className="text-red-500 mx-auto mb-1" />
                <p className="text-2xl font-bold text-red-700">{stats?.unpaid ?? 0}</p>
                <p className="text-xs text-red-600 font-semibold mt-0.5">Unpaid</p>
              </div>
            </div>

            {/* Revenue chart */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h2 className="text-base font-bold text-gray-900 mb-4">Monthly Collections — {year}</h2>
              {chartData.length === 0 ? (
                <p className="text-center text-sm text-gray-400 py-10">No payment data for {year}</p>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData} barSize={28}>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af" }} />
                    <Tooltip cursor={{ fill: "rgba(0,0,0,0.04)" }}
                      contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }}
                      formatter={v => [`PKR ${v.toLocaleString()}`]} />
                    <Bar dataKey="value" shape={<CustomBar />}>
                      {chartData.map((_, i) => (
                        <Cell key={i} fill={i === chartData.length - 1 ? "#2563eb" : "#93c5fd"} />
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
