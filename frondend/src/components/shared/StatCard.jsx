export default function StatCard({ icon: Icon, label, value, subtitle, badge, badgeType }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
          <Icon size={20} className="text-blue-500" />
        </div>
        {badge && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full
                            ${badgeType === "up" ? "text-green-600 bg-green-50" : "text-red-500 bg-red-50"}`}>
            {badge}
          </span>
        )}
      </div>
      <p className="text-gray-500 text-sm mt-3">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      <p className="text-gray-400 text-xs mt-1">{subtitle}</p>
    </div>
  );
}