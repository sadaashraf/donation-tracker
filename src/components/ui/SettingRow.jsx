import { ChevronRight } from "lucide-react";

export default function SettingRow({ icon: Icon, iconBg, label, value, onClick, rightEl }) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-2xl px-4 py-4 flex items-center gap-3 shadow-sm border border-gray-100
                 hover:border-blue-100 hover:bg-blue-50/30 active:scale-[0.98] transition-all text-left"
    >
      <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
        <Icon size={18} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900">{label}</p>
        {value && <p className="text-xs text-gray-400 mt-0.5 truncate">{value}</p>}
      </div>
      {rightEl ?? <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />}
    </button>
  );
}