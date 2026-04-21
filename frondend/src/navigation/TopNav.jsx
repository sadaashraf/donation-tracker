import { Home, Users, CreditCard, CalendarDays, Settings } from "lucide-react";

const items = [
  { key: "dashboard", icon: Home,         label: "Home"      },
  { key: "members",   icon: Users,        label: "Members"   },
  { key: "payments",  icon: CreditCard,   label: "Billing"   },
  { key: "yearplans", icon: CalendarDays, label: "Plans"     },
  { key: "settings",  icon: Settings,     label: "Settings"  },
];

export default function TopNav({ active, setScreen }) {
  return (
    <div className="flex bg-white border-b border-gray-100 flex-shrink-0 overflow-x-auto">
      {items.map(({ key, icon: Icon, label }) => (
        <button key={key} onClick={() => setScreen(key)}
          className={`flex-1 min-w-[60px] flex flex-col items-center pt-3 pb-2.5 gap-1 transition-colors relative
                      ${active === key ? "text-blue-600" : "text-gray-400"}`}>
          <Icon size={20} />
          <span className="text-[10px] font-semibold">{label}</span>
          {active === key && (
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-blue-600 rounded-full" />
          )}
        </button>
      ))}
    </div>
  );
}
