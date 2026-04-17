import { useState, useEffect } from "react";
import { CalendarDays, Plus, Trash2, AlertCircle } from "lucide-react";
import AppLogo from "../components/ui/AppLogo";
import { fetchYearPlans, createYearPlan, deleteYearPlan } from "../api";

export default function YearPlansScreen() {
  const [plans, setPlans]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear]       = useState("");
  const [amount, setAmount]   = useState("");
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState("");

  const load = () => {
    setLoading(true);
    fetchYearPlans().then(setPlans).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!year || !amount) { setError("Both year and amount are required"); return; }
    setSaving(true); setError("");
    try {
      await createYearPlan({ year, amountRequired: amount });
      setYear(""); setAmount("");
      load();
    } catch (e) {
      setError(e.message);
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this year plan?")) return;
    await deleteYearPlan(id);
    load();
  };

  return (
    <div className="flex flex-col flex-1 overflow-y-auto bg-gray-50">
      <div className="bg-white px-5 pt-5 pb-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-3 md:hidden"><AppLogo /><span className="text-lg font-bold text-gray-900">Year Plans</span></div>
        <div className="hidden md:block"><h1 className="text-xl font-bold text-gray-900">Year Plans</h1></div>
      </div>

      <div className="px-4 md:px-6 xl:px-8 py-5 space-y-4 max-w-2xl mx-auto w-full">

        {/* Create new plan */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays size={18} className="text-blue-600" />
            <h2 className="text-base font-bold text-gray-900">Create Year Plan</h2>
          </div>
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 mb-3">
              <AlertCircle size={14} className="text-red-500" />
              <p className="text-xs text-red-600 font-medium">{error}</p>
            </div>
          )}
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Year</label>
              <input type="number" placeholder="e.g. 2026" value={year} onChange={e => setYear(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all" />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Amount Required (PKR)</label>
              <div className="flex items-center gap-1 border border-gray-200 rounded-xl px-3 py-3 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-50 transition-all">
                <span className="text-gray-400 text-xs">PKR</span>
                <input type="number" placeholder="e.g. 1500" value={amount} onChange={e => setAmount(e.target.value)}
                  className="w-full bg-transparent text-sm text-gray-700 outline-none" />
              </div>
            </div>
            <button onClick={handleCreate} disabled={saving}
              className="bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 flex-shrink-0">
              <Plus size={16} /> {saving ? "Saving..." : "Add"}
            </button>
          </div>
        </div>

        {/* Plans list */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-50">
            <p className="text-sm font-bold text-gray-900">All Year Plans</p>
          </div>
          {loading ? (
            <div className="text-center py-8 text-sm text-gray-400">Loading...</div>
          ) : plans.length === 0 ? (
            <div className="text-center py-8 text-sm text-gray-400">No year plans yet</div>
          ) : plans.map((p, i) => (
            <div key={p.id} className={`flex items-center justify-between px-4 py-4 ${i < plans.length - 1 ? "border-b border-gray-50" : ""}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <CalendarDays size={18} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{p.year}</p>
                  <p className="text-xs text-gray-400">PKR {parseFloat(p.amountRequired).toLocaleString()} per member</p>
                </div>
              </div>
              <button onClick={() => handleDelete(p.id)} className="text-gray-300 hover:text-red-500 transition-colors p-1">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
