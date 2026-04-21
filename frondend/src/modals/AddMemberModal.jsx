import { useState } from "react";
import { X } from "lucide-react";
import { createMember } from "../api";

export default function AddMemberModal({ onClose, onSaved }) {
  const [form, setForm] = useState({ name: "", fatherName: "", phone: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState("");
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSave = async () => {
    if (!form.name.trim()) { setError("Member name is required."); return; }
    setSaving(true);
    try {
      await createMember(form);
      onSaved?.();
      onClose();
    } catch (e) {
      setError(e.message);
    } finally { setSaving(false); }
  };

  return (
    <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Add New Member</h2>
            <p className="text-xs text-gray-400 mt-0.5">Fill in the member's details below</p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Fields in one row */}
        <div className="px-6 py-5">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
              <p className="text-xs text-red-600 font-medium">{error}</p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input placeholder="e.g. Muhammad Ali" value={form.name} onChange={set("name")}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800
                           placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Father's Name</label>
              <input placeholder="e.g. Muhammad Akbar" value={form.fatherName} onChange={set("fatherName")}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800
                           placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
              <input type="tel" placeholder="e.g. 0300 1234567" value={form.phone} onChange={set("phone")}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800
                           placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50">
            {saving ? "Saving..." : "Add Member"}
          </button>
        </div>
      </div>
    </div>
  );
}
