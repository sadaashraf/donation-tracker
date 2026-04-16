import { useState } from "react";
import { X, User, Users, Phone } from "lucide-react";
import InputField from "../components/ui/InputField";
import OutlineButton from "../components/ui/OutlineButton";
import PrimaryButton from "../components/ui/PrimaryButton";

export default function AddMemberModal({ onClose }) {
  const [form, setForm] = useState({ name: "", father: "", phone: "" });
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Add New Member</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
            <X size={18} className="text-gray-500" />
          </button>
        </div>
        <div className="px-5 py-5 space-y-4">
          <InputField label="Member Name" placeholder="Full name of member" icon={User} value={form.name} onChange={set("name")} />
          <InputField label="Father's Name" placeholder="Full name of father" icon={Users} value={form.father} onChange={set("father")} />
          <InputField label="Phone Number" placeholder="+1 (000) 000-0000" icon={Phone} value={form.phone} onChange={set("phone")} type="tel" />
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <OutlineButton onClick={onClose}>Cancel</OutlineButton>
          <PrimaryButton onClick={onClose}>Save Member</PrimaryButton>
        </div>
      </div>
    </div>
  );
}