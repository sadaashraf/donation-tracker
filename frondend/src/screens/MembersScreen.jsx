import { useState, useEffect, useCallback } from "react";
import { Bell, Search, UserPlus, ChevronDown, Pencil, Trash2, X, User, Users, Phone } from "lucide-react";
import AppLogo from "../components/ui/AppLogo";
import InputField from "../components/ui/InputField";
import { fetchMembers, fetchMemberSummary, fetchYearPlans, updateMember, deleteMember } from "../api";

const COLORS = ["bg-green-500","bg-blue-400","bg-purple-400","bg-orange-400","bg-teal-500","bg-pink-400","bg-red-400","bg-indigo-400"];
const colorFor  = (id)   => COLORS[id % COLORS.length];
const initials  = (name) => name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

const statusStyle = s => ({
  Paid:    "bg-green-50 text-green-600",
  Partial: "bg-orange-50 text-orange-500",
  Unpaid:  "bg-red-50 text-red-500",
}[s] ?? "bg-gray-100 text-gray-500");

// ── Edit member modal ─────────────────────────────────────
function EditMemberModal({ member, onClose, onSaved }) {
  const [form, setForm]   = useState({ name: member.name, fatherName: member.fatherName ?? "", phone: member.phone ?? "" });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState("");
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSave = async () => {
    if (!form.name.trim()) { setError("Name is required"); return; }
    setSaving(true);
    try {
      await updateMember(member.id, form);
      onSaved();
      onClose();
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Edit Member</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
            <X size={16} className="text-gray-500" />
          </button>
        </div>
        <div className="px-5 py-4 space-y-4">
          {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
          <InputField label="Member Name" placeholder="Full name" icon={User} value={form.name} onChange={set("name")} />
          <InputField label="Father's Name" placeholder="Father's full name" icon={Users} value={form.fatherName} onChange={set("fatherName")} />
          <InputField label="Phone Number" placeholder="+92 000 0000000" icon={Phone} value={form.phone} onChange={set("phone")} type="tel" />
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <button onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-all">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50">
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Member card ───────────────────────────────────────────
function MemberCard({ member, year, onEdit, onDelete }) {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    if (!year) return;
    fetchMemberSummary(member.id, year).then(setSummary).catch(() => setSummary(null));
  }, [member.id, year]);

  return (
    <div className="bg-white rounded-2xl px-4 py-4 shadow-sm border border-gray-100 hover:border-blue-100 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`w-11 h-11 rounded-full ${colorFor(member.id)} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
          {initials(member.name)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{member.name}</p>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            {member.fatherName && <span className="text-xs text-gray-400">S/O {member.fatherName}</span>}
            <span className="text-gray-200">•</span>
            <span className="text-xs text-gray-400">ID #{1000 + member.id}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {summary && (
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusStyle(summary.status)}`}>
              {summary.status}
            </span>
          )}
          <button onClick={() => onEdit(member)}
            className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all" title="Edit">
            <Pencil size={13} />
          </button>
          <button onClick={() => onDelete(member)}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Delete">
            <Trash2 size={13} />
          </button>
        </div>
      </div>
      {summary && year && (
        <div className="mt-3 pt-3 border-t border-gray-50 grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-[10px] text-gray-400 font-medium">Required</p>
            <p className="text-xs font-bold text-gray-700">PKR {summary.totalRequired.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-medium">Paid</p>
            <p className="text-xs font-bold text-green-600">PKR {summary.totalPaid.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-medium">Remaining</p>
            <p className="text-xs font-bold text-red-500">PKR {summary.remaining.toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main screen ───────────────────────────────────────────
export default function MembersScreen({ setModal, refresh }) {
  const [search, setSearch]             = useState("");
  const [year, setYear]                 = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [members, setMembers]           = useState([]);
  const [plans, setPlans]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [editMember, setEditMember]     = useState(null);
  const statusFilters = ["All", "Paid", "Partial", "Unpaid"];

  useEffect(() => {
    fetchYearPlans().then(p => {
      setPlans(p);
      if (p.length > 0) setYear(p[0].year);
    }).catch(console.error);
  }, []);

  const load = useCallback(() => {
    setLoading(true);
    fetchMembers(search, year, statusFilter)
      .then(setMembers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search, year, statusFilter]);

  useEffect(() => { load(); }, [load, refresh]);

  const handleDelete = async (member) => {
    if (!confirm(`Delete ${member.name}? This will also delete all their payments.`)) return;
    await deleteMember(member.id);
    load();
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-gray-50">
      <div className="bg-white px-5 pt-5 pb-4 flex items-center justify-between border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-3 md:hidden"><AppLogo /><span className="text-lg font-bold text-gray-900">Members</span></div>
        <div className="hidden md:block"><h1 className="text-xl font-bold text-gray-900">Members Portal</h1></div>
        <div className="flex items-center gap-3">
          <button className="relative p-1"><Bell size={22} className="text-gray-500" /></button>
          <div className="w-9 h-9 rounded-full bg-teal-600 flex items-center justify-center text-white text-sm font-bold">A</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 md:px-6 xl:px-8 pt-4 pb-4 space-y-3 max-w-5xl xl:max-w-6xl mx-auto w-full">
        <div className="flex gap-2">
          <div className="flex items-center gap-2 flex-1 bg-white rounded-2xl px-4 py-3 border border-gray-100 shadow-sm">
            <Search size={16} className="text-gray-400 flex-shrink-0" />
            <input className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-400 bg-transparent"
              placeholder="Search members by name" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="relative">
            <select value={year} onChange={e => setYear(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-2xl px-3 py-3 pr-7 text-sm text-gray-700 outline-none shadow-sm">
              <option value="">All Years</option>
              {plans.map(p => <option key={p.year} value={p.year}>{p.year}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {statusFilters.map(f => (
            <button key={f} onClick={() => setStatusFilter(f)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all
                ${statusFilter === f ? "bg-blue-600 text-white shadow-sm" : "bg-white text-gray-500 border border-gray-200 hover:border-blue-300"}`}>
              {f}
            </button>
          ))}
        </div>

        <p className="text-xs text-gray-400 font-medium px-1">{members.length} members found</p>

        {loading ? (
          <div className="text-center py-10 text-sm text-gray-400">Loading...</div>
        ) : members.length === 0 ? (
          <div className="text-center py-10 text-sm text-gray-400">No members found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {members.map(m => (
              <MemberCard key={m.id} member={m} year={year}
                onEdit={setEditMember}
                onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      <button onClick={() => setModal(true)}
        className="fixed bottom-20 md:bottom-6 right-4 md:right-6 w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center
                   hover:bg-blue-700 active:scale-95 transition-all z-10"
        style={{ boxShadow: "0 6px 20px rgba(37,99,235,0.4)" }}>
        <UserPlus size={22} className="text-white" />
      </button>

      {editMember && (
        <EditMemberModal member={editMember} onClose={() => setEditMember(null)} onSaved={load} />
      )}
    </div>
  );
}
