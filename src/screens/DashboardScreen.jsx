import { useState } from "react";
import { Users, CreditCard, Bell, User, ChevronDown } from "lucide-react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import AppLogo from "../components/ui/AppLogo";
import StatCard from "../components/shared/StatCard";
import Avatar from "../components/ui/Avatar";
import CustomBar from "../components/ui/CustomBar";
import { revenueData, upcomingPayments } from "../data/dummyData";

export default function DashboardScreen() {
  return (
    <div className="flex flex-col flex-1 overflow-y-auto bg-gray-50">
      {/* Header */}
      <div className="bg-white px-5 pt-5 pb-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-3 md:hidden">
          <AppLogo />
          <span className="text-lg font-bold text-gray-900">MemberFlow</span>
        </div>
        <div className="hidden md:block">
          <h1 className="text-xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-400 text-sm">Welcome back, here is what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative p-1">
            <Bell size={22} className="text-gray-600" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
            <User size={16} className="text-gray-500" />
          </div>
        </div>
      </div>

      <div className="px-4 md:px-6 xl:px-8 py-5 space-y-4 max-w-5xl xl:max-w-6xl mx-auto w-full">
        <div className="md:hidden">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-400 text-sm mt-0.5">Welcome back, here is what's happening today.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard icon={Users} label="Total Members" value="1,284" subtitle="Active memberships across 12 plans" badge="+12%" badgeType="up" />
          <StatCard icon={CreditCard} label="Payments YTD" value="$42,500" subtitle="Total revenue collected this year" badge="-5%" badgeType="down" />
        </div>

        {/* Revenue Growth Chart */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900">Revenue Growth</h2>
            <button className="flex items-center gap-1 text-sm text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5">
              Monthly <ChevronDown size={14} />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueData} barSize={28}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <Tooltip
                cursor={{ fill: "rgba(0,0,0,0.04)" }}
                contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }}
                formatter={(v) => [`$${(v / 1000).toFixed(0)}k`]}
              />
              <Bar dataKey="value" shape={<CustomBar />}>
                {revenueData.map((e, i) => (
                  <Cell key={i} fill={e.month === "MAY" ? "#2563eb" : e.month === "JUN" ? "#e5e7eb" : "#93c5fd"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Upcoming Payments */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-900">Upcoming Due Payments</h2>
            <button className="text-blue-600 text-sm font-semibold hover:text-blue-700 transition-colors">View All</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
            {upcomingPayments.map(p => (
              <div key={p.id} className="bg-white rounded-xl px-4 py-3.5 flex items-center justify-between shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <Avatar initials={p.name.split(" ").map(n => n[0]).join("")} size="sm" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.plan} • {p.due}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{p.amount}</p>
                  <span className="text-xs font-semibold text-orange-500">PENDING</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}