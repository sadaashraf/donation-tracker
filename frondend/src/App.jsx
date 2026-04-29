import { useState } from "react";
import { Home, Users, CreditCard, Settings, CalendarDays } from "lucide-react";
import DashboardScreen from "./screens/DashboardScreen";
import MembersScreen from "./screens/MembersScreen";
import PaymentsScreen from "./screens/PaymentsScreen";
import SettingsScreen from "./screens/SettingsScreen";
import YearPlansScreen from "./screens/YearPlansScreen";
import ProfileScreen from "./screens/settings/ProfileScreen";
import NotificationsScreen from "./screens/settings/NotificationsScreen";
import SecurityScreen from "./screens/settings/SecurityScreen";
import PlansBillingScreen from "./screens/settings/PlansBillingScreen";
import HelpSupportScreen from "./screens/settings/HelpSupportScreen";
import BottomNav from "./navigation/BottomNav";
import TopNav from "./navigation/TopNav";
import AppLogo from "./components/ui/AppLogo";

const navItems = [
  { key: "dashboard", icon: Home, label: "Dashboard" },
  { key: "members", icon: Users, label: "Members" },
  { key: "payments", icon: CreditCard, label: "Billing" },
  { key: "yearplans", icon: CalendarDays, label: "Year Plans" },
  { key: "settings", icon: Settings, label: "Settings" },
];

function SidebarNav({ active, setScreen }) {
  return (
    <aside className="hidden md:flex flex-col w-20 xl:w-56 bg-white border-r border-gray-100 flex-shrink-0">
      <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-100">
        <AppLogo />
        <span className="hidden xl:block text-base font-bold text-gray-900 truncate">Donation Tracker</span>
      </div>
      <nav className="flex flex-col gap-1 p-3 flex-1">
        {navItems.map(({ key, icon: Icon, label }) => (
          <button key={key} onClick={() => setScreen(key)}
            className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all
                        ${active === key ? "bg-blue-600 text-white" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"}`}>
            <Icon size={20} className="flex-shrink-0" />
            <span className="hidden xl:block text-sm font-semibold">{label}</span>
          </button>
        ))}
      </nav>
      <div className="p-3 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">As</div>
          <div className="hidden xl:block min-w-0">
            <p className="text-xs font-semibold text-gray-900 truncate">Ashraf</p>
            <p className="text-[10px] text-gray-400 truncate">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default function App() {
  const [screen, setScreen] = useState("dashboard");
  const [subScreen, setSubScreen] = useState(null);

  const navigateTo = (s) => { setScreen(s); setSubScreen(null); };

  const renderContent = () => {
    if (screen === "settings" && subScreen) {
      const back = () => setSubScreen(null);
      if (subScreen === "profile") return <ProfileScreen onBack={back} />;
      if (subScreen === "notifications") return <NotificationsScreen onBack={back} />;
      if (subScreen === "security") return <SecurityScreen onBack={back} />;
      if (subScreen === "plans") return <PlansBillingScreen onBack={back} />;
      if (subScreen === "help") return <HelpSupportScreen onBack={back} />;
    }
    if (screen === "dashboard") return <DashboardScreen />;
    if (screen === "members") return <MembersScreen />;
    if (screen === "payments") return <PaymentsScreen setScreen={navigateTo} />;
    if (screen === "yearplans") return <YearPlansScreen />;
    if (screen === "settings") return <SettingsScreen setSubScreen={setSubScreen} />;
    return null;
  };

  const isSubScreen = screen === "settings" && subScreen;

  return (
    <div className="min-h-screen bg-gray-50 md:bg-gray-200 flex flex-col md:flex-row">
      <SidebarNav active={screen} setScreen={navigateTo} />
      <main className="flex-1 flex flex-col overflow-hidden relative min-h-screen md:min-h-0">
        {/* Top nav — mobile only */}
        <div className="md:hidden">
          <TopNav active={screen} setScreen={navigateTo} />
        </div>
        {renderContent()}
      </main>
    </div>
  );
}
