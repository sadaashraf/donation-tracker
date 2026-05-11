import { useState, useEffect, useCallback } from "react";
import { Bell, Search, ChevronDown, Pencil, Trash2, X, Users, Plus, AlertCircle } from "lucide-react";
import AppLogo from "../components/ui/AppLogo";
import { fetchMembers, fetchMemberSummary, fetchYearPlans, createMember, updateMember, deleteMember } from "../api";

const COLORS = ["bg-green-500","bg-blue-400","bg-purple-400","bg-orange-400","bg-teal-500","bg-pink-400","bg-red-400","bg-indigo-400"];
const colorFor = (id)   => COLORS[id % COLORS.length];
const initials = (name) => name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

const statusStyle = s => ({
  Paid:    "bg-green-50 text-green-600",
  Partial: "bg-orange-50 text-orange-500",
  Unpaid:  "bg-red-50 text-red-500",
}[s] ?? "bg-gray-100 text-gray-500");

// ── Validation ────────────────────────────────────────────
function validateMemberForm({ name, fatherName, phone }) {
  const errors = {};
  if (!name.trim()) {
    errors.name = "Full name is required.";
  } else if (name.trim().split(/\s+/).filter(Boolean).length < 3) {
    errors.name = "Name must be at least 3 words.";
  } else if (!/^[A-Z]/.test(name.trim())) {
    errors.name = "Name must start with an uppercase letter.";
  }
  if (fatherName.trim()) {
    if (fatherName.trim().split(/\s+/).filter(Boolean).length < 3) {
      errors.fatherName = "Father's name must be at least 3 words.";
    } else if (!/^[A-Z]/.test(fatherName.trim())) {
      errors.fatherName = "Father's name must start with an uppercase letter.";
    }
  }
  if (phone.trim()) {
    if (!/^\d{11}$/.test(phone.trim())) {
      errors.phone = "Phone must be exactly 11 digits.";
    }
  }
  return errors;
}

function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <p className="flex items-center gap-1 text-xs text-red-500 mt-1 font-medium">
      <AlertCircle size={11} /> {msg}
    </p>
  );
}

function MemberForm({ initial = { name: "", fatherName: "", phone: "" }, onSubmit, saving, submitLabel }) {
  const [form, setForm]   = useState(initial);
  const [errors, setErrors] = useState({});
  const set = k => e => {
    let val = e.target.value;
    if (k === "phone") val = val.replace(/\D/g, "").slice(0, 11);
    setForm(f => ({ ...f, [k]: val }));
    if (errors[k]) setErrors(prev => ({ ...prev, [k]: "" }));
  };

  const handleSubmit = () => {
    const errs = validateMemberForm(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSubmit(form);
  };

  const inputClass = (field) =>
    `w-full border rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition-all
     ${errors[field] ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-50" : "border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-50"}`;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input placeholder="e.g. Muhammad Ali" value={form.name} onChange={set("name")} className={inputClass("name")} />
          <FieldError msg={errors.name} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Father's Name</label>
          <input placeholder="e.g. Muhammad Akbar" value={form.fatherName} onChange={set("fatherName")} className={inputClass("fatherName")} />
          <FieldError msg={errors.fatherName} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
          <input type="tel" inputMode="numeric" placeholder="03001234567" value={form.phone} onChange={set("phone")} className={inputClass("phone")} maxLength={11} />
          <FieldError msg={errors.phone} />
        </div>
      </div>
      <div className="mt-3 flex justify-end">
        <button onClick={handleSubmit} disabled={saving}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 hover:bg-blue-700 transition-all disabled:opacity-50">
          <Plus size={16} /> {saving ? "Saving..." : submitLabel}
        </button>
      </div>
    </>
  );
}

// ── Edit member modal ─────────────────────────────────────
function EditMemberModal({ member, onClose, onSaved }) {
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState("");

  const handleSubmit = async (form) => {
    setSaving(true);
    try { await updateMember(member.id, form); onSaved(); onClose(); }
    catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Edit Member</h2>
            <p className="text-xs text-gray-400 mt-0.5">Update the member's information below</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
            <X size={16} className="text-gray-500" />
          </button>
        </div>
        <div className="px-6 py-5">
          {error && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4"><p className="text-xs text-red-600 font-medium">{error}</p></div>}
          <MemberForm
            initial={{ name: member.name, fatherName: member.fatherName ?? "", phone: member.phone ?? "" }}
            onSubmit={handleSubmit}
            saving={saving}
            submitLabel="Save Changes"
          />
        </div>
      </div>
    </div>
  );
}

// ── Simple card (All tab) ─────────────────────────────────
function SimpleCard({ member, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100 hover:border-blue-100 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full ${colorFor(member.id)} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
          {initials(member.name)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{member.name}</p>
          {member.fatherName && <p className="text-xs text-gray-400 mt-0.5">S/O {member.fatherName}</p>}
          <p className="text-[10px] text-gray-300 mt-0.5">ID: {member.id}</p>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button onClick={() => onEdit(member)} className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"><Pencil size={13} /></button>
          <button onClick={() => onDelete(member)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={13} /></button>
        </div>
      </div>
    </div>
  );
}

// ── Detail card (Paid / Partial / Unpaid tabs) ────────────
function DetailCard({ member, year, onEdit, onDelete }) {
  const [summary, setSummary] = useState(null);
  useEffect(() => {
    if (!year) return;
    fetchMemberSummary(member.id, year).then(setSummary).catch(() => setSummary(null));
  }, [member.id, year]);

  return (
    <div className="bg-white rounded-2xl px-4 py-4 shadow-sm border border-gray-100 hover:border-blue-100 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full ${colorFor(member.id)} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
          {initials(member.name)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{member.name}</p>
          {member.fatherName && <p className="text-xs text-gray-400 mt-0.5">S/O {member.fatherName}</p>}
          <p className="text-[10px] text-gray-300 mt-0.5">ID: {member.id}</p>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {summary && <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusStyle(summary.status)}`}>{summary.status}</span>}
          <button onClick={() => onEdit(member)} className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"><Pencil size={13} /></button>
          <button onClick={() => onDelete(member)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={13} /></button>
        </div>
      </div>
      {summary && (
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
export default function MembersScreen({ refresh }) {
  const [search, setSearch]             = useState("");
  const [year, setYear]                 = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [members, setMembers]           = useState([]);
  const [plans, setPlans]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [editMember, setEditMember]     = useState(null);
  const [saving, setSaving]             = useState(false);
  const [formError, setFormError]       = useState("");
  const [formKey, setFormKey]           = useState(0);
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

  const handleAdd = async (form) => {
    setSaving(true); setFormError("");
    try {
      await createMember(form);
      setFormKey(k => k + 1);
      load();
    } catch (e) { setFormError(e.message); }
    finally { setSaving(false); }
  };

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

      <div className="flex-1 overflow-y-auto px-4 md:px-6 xl:px-8 pt-4 pb-4 space-y-4 max-w-5xl xl:max-w-6xl mx-auto w-full">

        {/* Add New Member */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Users size={18} className="text-blue-600" />
            <h2 className="text-base font-bold text-gray-900">Add New Member</h2>
          </div>
          {formError && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-3"><p className="text-xs text-red-600 font-medium">{formError}</p></div>}
          <MemberForm key={formKey} onSubmit={handleAdd} saving={saving} submitLabel="Add Member" />
        </div>

        {/* Filters */}
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
            {members.map(m => statusFilter === "All"
              ? <SimpleCard key={m.id} member={m} onEdit={setEditMember} onDelete={handleDelete} />
              : <DetailCard key={m.id} member={m} year={year} onEdit={setEditMember} onDelete={handleDelete} />
            )}
          </div>
        )}
      </div>

      {editMember && <EditMemberModal member={editMember} onClose={() => setEditMember(null)} onSaved={load} />}
    </div>
  );
}
