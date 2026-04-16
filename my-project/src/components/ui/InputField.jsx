export default function InputField({ label, placeholder, type = "text", value, onChange, icon: Icon, rightEl }) {
  return (
    <div>
      {label && <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>}
      <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-3 border border-gray-200
                      focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-50 transition-all">
        {Icon && <Icon size={16} className="text-gray-400 flex-shrink-0" />}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
        />
        {rightEl}
      </div>
    </div>
  );
}