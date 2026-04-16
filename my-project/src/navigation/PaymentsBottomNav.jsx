import { Home, Users, CreditCard, TrendingUp, Settings } from "lucide-react";

export default function PaymentsBottomNav({ setScreen }) {
  const items = [
    { key: "dashboard", icon: Home, label: "Dashboard", active: false },
    { key: "members", icon: Users, label: "Members", active: false },
    { key: "payments", icon: CreditCard, label: "Payments", active: true },
    { key: "reports", icon: TrendingUp, label: "Reports", active: false },
    { key: "settings", icon: Settings, label: "Settings", active: false },
  ];

  return (
    <div className="flex border-t border-gray-100 bg-white flex-shrink-0">
      {items.map(({ key, icon: Icon, label, active }) => (
        <button
          key={key}
          onClick={() => setScreen(key === "reports" ? "dashboard" : key)}
          className={`flex-1 flex flex-col items-center py-3 gap-0.5 transition-colors
                      ${active ? "text-blue-600" : "text-gray-400 hover:text-gray-500"}`}
        >
          <div className="relative">
            <Icon size={18} />
            {active && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />}
          </div>
          <span className="text-[9px] font-medium">{label}</span>
        </button>
      ))}
    </div>
  );
}