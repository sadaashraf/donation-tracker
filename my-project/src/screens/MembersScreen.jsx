import { useState } from "react";
import { Bell, Search, UserPlus } from "lucide-react";
import AppLogo from "../components/ui/AppLogo";
import { membersData } from "../data/dummyData";

export default function MembersScreen({ setModal }) {
  const [activeFilter, setActiveFilter] = useState("All Status");
  const [search, setSearch] = useState("");
  const filters = ["All Status", "Active", "Pending", "Expired"];

  const filtered = membersData.filter(m =>
    (activeFilter === "All Status" || m.status === activeFilter) &&
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const statusStyle = (s) => ({
    Active: "bg-green-50 text-green-600",
    Pending: "bg-orange-50 text-orange-500",
    Expired: "bg-red-50 text-red-500",
  }[s] ?? "bg-gray-100 text-gray-500");

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-gray-50">
      {/* Header */}
      <div className="bg-white px-5 pt-5 pb-4 flex items-center justify-between border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-3 md:hidden">
          <AppLogo />
          <span className="text-lg font-bold text-gray-900">Members Portal</span>
        </div>
        <div className="hidden md:block">
          <h1 className="text-xl font-bold text-gray-900">Members Portal</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative p-1"><Bell size={22} className="text-gray-500" /></button>
          <div className="w-9 h-9 rounded-full bg-teal-600 flex items-center justify-center text-white text-sm font-bold">A</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 md:px-6 xl:px-8 pt-4 pb-4 space-y-3 max-w-5xl xl:max-w-6xl mx-auto w-full">
        {/* Search bar */}
        <div className="flex items-center gap-2 bg-white rounded-2xl px-4 py-3 border border-gray-100 shadow-sm">
          <Search size={16} className="text-gray-400 flex-shrink-0" />
          <input
            className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-400 bg-transparent"
            placeholder="Search members by name or ID"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all
                          ${activeFilter === f
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-gray-500 border border-gray-200 hover:border-blue-300"}`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between px-1">
          <p className="text-xs text-gray-400 font-medium">{filtered.length} members found</p>
          <button className="text-xs text-blue-600 font-semibold">Sort by</button>
        </div>

        {/* Member cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
          {filtered.map(m => (
            <div key={m.id} className="bg-white rounded-2xl px-4 py-4 flex items-center gap-3 shadow-sm border border-gray-100 hover:border-blue-100 transition-colors">
              <div className={`w-11 h-11 rounded-full ${m.color} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                {m.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{m.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-gray-400">{m.plan}</span>
                  <span className="text-gray-200">•</span>
                  <span className="text-xs text-gray-400">ID #{1000 + m.id}</span>
                </div>
              </div>
              <span className={`flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle(m.status)}`}>
                {m.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* FAB */}
      <button
        onClick={() => setModal(true)}
        className="fixed bottom-20 md:bottom-6 right-4 md:right-6 w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center
                   hover:bg-blue-700 active:scale-95 transition-all z-10"
        style={{ boxShadow: "0 6px 20px rgba(37,99,235,0.4)" }}
      >
        <UserPlus size={22} className="text-white" />
      </button>
    </div>
  );
}