import { User, Bell, Shield, CreditCard, HelpCircle } from "lucide-react";
import AppLogo from "../components/ui/AppLogo";
import SettingRow from "../components/ui/SettingRow";

export default function SettingsScreen({ setSubScreen }) {
  const menuItems = [
    { key: "profile", icon: User, iconBg: "bg-blue-500", label: "Profile", value: "Ashraf · nayeemashraf92@email.com" },
    { key: "notifications", icon: Bell, iconBg: "bg-purple-500", label: "Notifications", value: "Payment due, New member alerts" },
    { key: "security", icon: Shield, iconBg: "bg-red-500", label: "Security", value: "2FA enabled · Password protected" },
    { key: "plans", icon: CreditCard, iconBg: "bg-teal-500", label: "Plans & Billing", value: "Pro Plan · $29/month" },
    { key: "help", icon: HelpCircle, iconBg: "bg-orange-500", label: "Help & Support", value: "FAQs, Live chat, Contact us" },
  ];

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-gray-50">
      <div className="bg-white px-5 pt-5 pb-4 flex items-center justify-between border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-3 md:hidden">
          <AppLogo />
          <span className="text-lg font-bold text-gray-900">Settings</span>
        </div>
        <div className="hidden md:block">
          <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        </div>
        <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">AJ</div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 md:px-6 xl:px-8 py-5 max-w-3xl xl:max-w-4xl mx-auto w-full space-y-3">
        {/* Profile banner */}
        <div className="bg-blue-600 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-base">AJ</div>
          <div className="flex-1">
            <p className="text-white font-bold text-sm">Ashraf</p>
            <p className="text-blue-100 text-xs mt-0.5">Pro Plan · Member since 2026</p>
          </div>
          <button onClick={() => setSubScreen("profile")}
            className="bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
            Edit
          </button>
        </div>

        {/* Menu items */}
        <div className="space-y-2">
          {menuItems.map(item => (
            <SettingRow
              key={item.key}
              icon={item.icon}
              iconBg={item.iconBg}
              label={item.label}
              value={item.value}
              onClick={() => setSubScreen(item.key)}
            />
          ))}
        </div>

        {/* Sign out */}
        <button className="w-full bg-white rounded-2xl px-4 py-4 flex items-center justify-center gap-2
                           shadow-sm border border-red-100 hover:bg-red-50 active:scale-95 transition-all mt-2">
          <span className="text-sm font-semibold text-red-500">Sign Out</span>
        </button>

        <p className="text-center text-xs text-gray-300 pb-2">MemberFlow v2.1.0</p>
      </div>
    </div>
  );
}