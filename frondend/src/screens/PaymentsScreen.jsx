import { useState, useEffect, useRef } from "react";
import { Bell, CreditCard, ChevronDown, Search, Clock, Upload, Save, X, Eye, ImageOff, Trash2, Pencil, CheckCircle, UserSearch } from "lucide-react";
import ScreenHeader from "../components/ui/ScreenHeader";
import { fetchPayments, createPayment, updatePayment, deletePayment, fetchMembers, fetchYearPlans, fetchMemberSummary, proofUrl } from "../api";

// ── Member autocomplete search ────────────────────────────
function MemberSearch({ members, selectedId, onSelect }) {
  const [query, setQuery]       = useState("");
  const [open, setOpen]         = useState(false);
  const [focused, setFocused]   = useState(false);
  const wrapRef = useRef(null);

  // When a member is already selected, show their name in the input
  const selected = members.find(m => m.id === +selectedId);

  const filtered = query.trim() === ""
    ? []
    : members.filter(m => {
        const q = query.toLowerCase();
        return m.name.toLowerCase().includes(q) ||
               (m.fatherName ?? "").toLowerCase().includes(q);
      }).slice(0, 8);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = e => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (m) => {
    onSelect(m.id);
    setQuery("");
    setOpen(false);
  };

  const handleClear = () => { onSelect(""); setQuery(""); };

  return (
    <div ref={wrapRef} className="relative">
      {selected && !focused ? (
        // Show selected member as a chip
        <div className="flex items-center gap-2 border border-blue-400 ring-2 ring-blue-50 rounded-xl px-3 py-2.5 bg-white">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{selected.name}</p>
            {selected.fatherName && <p className="text-xs text-gray-400 truncate">S/O {selected.fatherName}</p>}
          </div>
          <button onClick={handleClear} className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0">
            <X size={14} />
          </button>
        </div>
      ) : (
        // Search input
        <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-3
                        focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-50 transition-all bg-white">
          <UserSearch size={14} className="text-gray-400 flex-shrink-0" />
          <input
            value={query}
            onChange={e => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => { setFocused(true); setOpen(true); }}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            placeholder="Type name or father's name..."
            className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent min-w-0"
          />
          {query && <button onClick={() => setQuery("")} className="text-gray-400 hover:text-gray-600"><X size={13} /></button>}
        </div>
      )}

      {/* Suggestions dropdown */}
      {open && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
          {filtered.map(m => (
            <button key={m.id} onMouseDown={() => handleSelect(m)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors text-left border-b border-gray-50 last:border-0">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold flex-shrink-0">
                {m.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{m.name}</p>
                {m.fatherName && <p className="text-xs text-gray-400 truncate">S/O {m.fatherName}</p>}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No results hint */}
      {open && query.trim() !== "" && filtered.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 px-4 py-3">
          <p className="text-xs text-gray-400">No members match "{query}"</p>
        </div>
      )}
    </div>
  );
}

const statusStyle = s => ({
  Paid:    "bg-green-50 text-green-600",
  Partial: "bg-orange-50 text-orange-500",
  Unpaid:  "bg-red-50 text-red-500",
}[s] ?? "bg-gray-100 text-gray-500");

// ── Toast ─────────────────────────────────────────────────
function Toast({ message, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2
                    bg-green-600 text-white px-5 py-3 rounded-2xl shadow-xl animate-fade-in">
      <CheckCircle size={16} />
      <span className="text-sm font-semibold">{message}</span>
    </div>
  );
}

// ── Receipt preview modal ─────────────────────────────────
function ReceiptModal({ src, onClose }) {
  const isImage = src && /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(src);
  const isPdf   = src && /\.pdf$/i.test(src);
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[200] p-4"
         onClick={onClose}>
      <div className="bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-lg"
           onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <p className="text-sm font-bold text-gray-900">Proof of Payment</p>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
            <X size={16} className="text-gray-500" />
          </button>
        </div>
        <div className="p-4 flex items-center justify-center min-h-[200px]">
          {isImage && <img src={src} alt="Receipt" className="w-full rounded-xl object-contain max-h-96" />}
          {isPdf   && <a href={src} target="_blank" rel="noreferrer"
                        className="text-blue-600 text-sm font-semibold underline">Open PDF Receipt</a>}
          {!isImage && !isPdf && src && <img src={src} alt="Receipt" className="w-full rounded-xl object-contain max-h-96" />}
          {!src && (
            <div className="flex flex-col items-center gap-2 text-gray-400">
              <ImageOff size={32} /><p className="text-sm">No receipt uploaded</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Edit payment modal ────────────────────────────────────
function EditPaymentModal({ payment, onClose, onSaved }) {
  const [amount, setAmount]   = useState(parseFloat(payment.amount).toString());
  const [date, setDate]       = useState(payment.paymentDate);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState("");

  const handleSave = async () => {
    if (!amount || !date) { setError("Amount and date are required"); return; }
    setSaving(true);
    try {
      await updatePayment(payment.id, { amount, paymentDate: date });
      onSaved();
      onClose();
    } catch (e) {
      setError(e.message);
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl">
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Edit Payment</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
            <X size={16} className="text-gray-500" />
          </button>
        </div>
        <div className="px-5 py-4 space-y-4">
          {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
          <div>
            <p className="text-xs text-gray-400 mb-1">Member</p>
            <p className="text-sm font-semibold text-gray-900">
              {payment.member?.name}
              {payment.member?.fatherName && <span className="text-gray-400 font-normal"> S/O {payment.member.fatherName}</span>}
            </p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Amount (PKR)</label>
            <div className="flex items-center gap-1 border border-gray-200 rounded-xl px-3 py-3 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-50 transition-all">
              <span className="text-gray-400 text-xs">PKR</span>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                className="w-full bg-transparent text-sm text-gray-700 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Payment Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all" />
          </div>
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <button onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-all">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50">
            <Save size={15} /> {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main screen ───────────────────────────────────────────
export default function PaymentsScreen({ setScreen }) {
  const [payments, setPayments]         = useState([]);
  const [members, setMembers]           = useState([]);
  const [plans, setPlans]               = useState([]);
  const [summary, setSummary]           = useState(null);
  const [loading, setLoading]           = useState(true);
  const [submitting, setSubmitting]     = useState(false);
  const [searchTerm, setSearchTerm]     = useState("");
  const [yearFilter, setYearFilter]     = useState("All");
  const [memberId, setMemberId]         = useState("");
  const [year, setYear]                 = useState("");
  const [amount, setAmount]             = useState("");
  const [date, setDate]                 = useState("");
  const [receipt, setReceipt]           = useState(null);
  const [previewModal, setPreviewModal] = useState(null);
  const [editPayment, setEditPayment]   = useState(null);
  const [toast, setToast]               = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    Promise.all([fetchMembers(), fetchYearPlans()])
      .then(([m, p]) => {
        setMembers(m);
        setPlans(p);
        if (p.length > 0) setYear(p[0].year);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!memberId || !year) { setSummary(null); return; }
    fetchMemberSummary(memberId, year).then(setSummary).catch(() => setSummary(null));
  }, [memberId, year]);

  const load = () => {
    setLoading(true);
    fetchPayments(searchTerm, yearFilter)
      .then(setPayments)
      .catch(console.error)
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, [searchTerm, yearFilter]);

  const refreshSummary = () => {
    if (memberId && year) fetchMemberSummary(memberId, year).then(setSummary).catch(() => {});
  };

  const handleFileChange = e => {
    const file = e.target.files?.[0];
    if (file) setReceipt({ file, previewUrl: URL.createObjectURL(file) });
  };

  const handleSubmit = async () => {
    if (!memberId || !amount || !date || !year) return;
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("memberId", memberId);
      fd.append("year", year);
      fd.append("amount", amount);
      fd.append("paymentDate", date);
      if (receipt?.file) fd.append("proof", receipt.file);
      await createPayment(fd);
      setAmount(""); setDate(""); setReceipt(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      refreshSummary();
      load();
      const member = members.find(m => m.id === +memberId);
      setToast(`Payment recorded for ${member?.name ?? "member"}`);
    } catch (e) { console.error(e); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this payment?")) return;
    await deletePayment(id);
    load();
    refreshSummary();
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-gray-50">
      {toast && <Toast message={toast} onDone={() => setToast("")} />}

      <ScreenHeader title="Payment Records" onBack={() => setScreen("dashboard")}
        actions={
          <div className="flex items-center gap-2">
            <Bell size={22} className="text-blue-500" />
            <div className="w-9 h-9 rounded-full bg-orange-300 flex items-center justify-center text-white text-sm font-semibold">J</div>
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto px-4 md:px-6 xl:px-8 py-4 max-w-5xl xl:max-w-6xl mx-auto w-full space-y-4">

        {/* ── Record New Payment ── */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard size={18} className="text-blue-600" />
            <h2 className="text-base font-bold text-gray-900">Record New Payment</h2>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={handleFileChange} />

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 items-end">
            <div className="col-span-2 md:col-span-1">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Member</label>
              <MemberSearch members={members} selectedId={memberId} onSelect={setMemberId} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Year</label>
              <div className="relative">
                <select value={year} onChange={e => setYear(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-3 text-sm text-gray-700 appearance-none outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all">
                  {plans.map(p => <option key={p.year} value={p.year}>{p.year}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Amount (PKR)</label>
              <div className="flex items-center gap-1 border border-gray-200 rounded-xl px-3 py-3 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-50 transition-all">
                <span className="text-gray-400 text-xs">PKR</span>
                <input type="number" placeholder="0" value={amount} onChange={e => setAmount(e.target.value)}
                  className="w-full bg-transparent text-sm text-gray-700 outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Payment Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Proof</label>
              {receipt ? (
                <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50">
                  <img src={receipt.previewUrl} alt="thumb" className="w-7 h-7 rounded-lg object-cover flex-shrink-0" />
                  <p className="text-xs text-gray-600 truncate flex-1">{receipt.file.name}</p>
                  <button onClick={() => { setReceipt(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                    className="text-gray-400 hover:text-red-500 transition-colors"><X size={14} /></button>
                </div>
              ) : (
                <button onClick={() => fileInputRef.current?.click()}
                  className="w-full border border-dashed border-gray-200 rounded-xl py-3 flex items-center justify-center gap-2 text-sm text-gray-400 hover:border-blue-300 hover:text-blue-500 transition-colors">
                  <Upload size={15} /> Upload
                </button>
              )}
            </div>
          </div>

          {summary && (
            <div className="mt-4 rounded-xl px-4 py-3 flex flex-wrap gap-4 items-center bg-gray-50 border border-gray-200">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusStyle(summary.status)}`}>{summary.status}</span>
              <span className="text-xs text-gray-600">Required: <strong>PKR {summary.totalRequired.toLocaleString()}</strong></span>
              <span className="text-xs text-gray-600">Paid: <strong className="text-green-600">PKR {summary.totalPaid.toLocaleString()}</strong></span>
              <span className="text-xs text-gray-600">Remaining: <strong className="text-red-500">PKR {summary.remaining.toLocaleString()}</strong></span>
            </div>
          )}

          <div className="mt-3 flex justify-end">
            <button onClick={handleSubmit} disabled={submitting || !memberId || !amount || !date}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50">
              <Save size={16} /> {submitting ? "Saving..." : "Submit Payment"}
            </button>
          </div>
        </div>

        {/* ── Payment History ── */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={18} className="text-blue-600" />
            <h2 className="text-base font-bold text-gray-900">Payment History</h2>
          </div>
          <div className="flex gap-2 mb-4">
            <div className="flex items-center gap-2 flex-1 border border-gray-200 rounded-xl px-3 py-2.5">
              <Search size={14} className="text-gray-400" />
              <input placeholder="Search member name" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                className="flex-1 text-xs text-gray-700 placeholder-gray-400 bg-transparent outline-none" />
            </div>
            <div className="relative">
              <select value={yearFilter} onChange={e => setYearFilter(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-600 appearance-none pr-7 outline-none">
                <option value="All">All Years</option>
                {plans.map(p => <option key={p.year} value={p.year}>{p.year}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8 text-sm text-gray-400">Loading...</div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full" style={{ minWidth: 560 }}>
                <thead>
                  <tr className="border-b border-gray-100">
                    {["MEMBER", "YEAR", "AMOUNT", "DATE", "PROOF", "ACTIONS"].map((h, i) => (
                      <th key={i} className={`pb-2 text-[11px] font-semibold text-gray-400 tracking-wider whitespace-nowrap
                                              ${i >= 2 ? "text-center" : "text-left"}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {payments.length === 0 ? (
                    <tr><td colSpan={6} className="py-8 text-center text-sm text-gray-400">No records found</td></tr>
                  ) : payments.map(r => (
                    <tr key={r.id} className="border-b border-gray-50 last:border-0">
                      <td className="py-3 pr-3">
                        <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">{r.member?.name ?? "—"}</p>
                        {r.member?.fatherName && <p className="text-xs text-gray-400">S/O {r.member.fatherName}</p>}
                      </td>
                      <td className="py-3 pr-3">
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-700 whitespace-nowrap">{r.year}</span>
                      </td>
                      <td className="py-3 pr-3 text-sm font-semibold text-gray-900 text-center whitespace-nowrap">
                        PKR {parseFloat(r.amount).toLocaleString()}
                      </td>
                      <td className="py-3 pr-3 text-xs text-gray-500 text-center whitespace-nowrap">
                        {new Date(r.paymentDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td className="py-3 pr-3 text-center">
                        {r.proofPath
                          ? <button onClick={() => setPreviewModal(proofUrl(r.proofPath))}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                              <Eye size={13} /> View
                            </button>
                          : <span className="text-xs text-gray-300">—</span>
                        }
                      </td>
                      <td className="py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => setEditPayment(r)}
                            className="text-gray-400 hover:text-blue-500 transition-colors" title="Edit">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => handleDelete(r.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-400">{payments.length} records</p>
          </div>
        </div>
      </div>

      {previewModal  && <ReceiptModal src={previewModal} onClose={() => setPreviewModal(null)} />}
      {editPayment   && <EditPaymentModal payment={editPayment} onClose={() => setEditPayment(null)}
                          onSaved={() => { load(); refreshSummary(); }} />}
    </div>
  );
}
