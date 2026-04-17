import { Home, Users, CreditCard, CalendarDays, Settings } from "lucide-react";

export default function BottomNav({ active, setScreen }) {
  const items = [
    { key: "dashboard", icon: Home,         label: "HOME"      },
    { key: "members",   icon: Users,        label: "MEMBERS"   },
    { key: "payments",  icon: CreditCard,   label: "BILLING"   },
    { key: "yearplans", icon: CalendarDays, label: "PLANS"     },
    { key: "settings",  icon: Settings,     label: "SETTINGS"  },
  ];

  return (
    <div className="flex border-t border-gray-100 bg-white flex-shrink-0">
      {items.map(({ key, icon: Icon, label }) => (
        <button key={key} onClick={() => setScreen(key)}
          className={`flex-1 flex flex-col items-center py-3 gap-1 transition-colors
                      ${active === key ? "text-blue-600" : "text-gray-400 hover:text-gray-500"}`}>
          <Icon size={20} />
          <span className="text-[9px] font-semibold tracking-wider">{label}</span>
        </button>
      ))}
    </div>
  );
}
