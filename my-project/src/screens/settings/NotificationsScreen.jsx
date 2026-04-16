import { useState } from "react";
import ScreenHeader from "../../components/ui/ScreenHeader";
import Toggle from "../../components/ui/Toggle";

export default function NotificationsScreen({ onBack }) {
  const [s, setS] = useState({
    paymentDue: true, smsAlerts: true,
    newMember: true, systemAlerts: true,
    weeklyReport: false, emailDigest: false,
  });
  const toggle = (k) => setS(prev => ({ ...prev, [k]: !prev[k] }));

  const groups = [
    {
      title: "Payment Alerts",
      items: [
        { key: "paymentDue", label: "Payment Due Reminders", desc: "Notified before payments are due" },
        { key: "smsAlerts", label: "SMS Notifications", desc: "Receive alerts via text message" },
      ],
    },
    {
      title: "Member Activity",
      items: [
        { key: "newMember", label: "New Member Added", desc: "Alert when a new member joins" },
        { key: "systemAlerts", label: "System Alerts", desc: "Important system notifications" },
      ],
    },
    {
      title: "Reports & Digest",
      items: [
        { key: "weeklyReport", label: "Weekly Reports", desc: "Summary report every Monday" },
        { key: "emailDigest", label: "Email Digest", desc: "Daily digest of all activity" },
      ],
    },
  ];

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-gray-50">
      <ScreenHeader title="Notifications" onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-5 space-y-4 max-w-2xl mx-auto w-full">
        {groups.map(g => (
          <div key={g.title} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-50">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{g.title}</p>
            </div>
            {g.items.map((item, i) => (
              <div key={item.key} className={`flex items-center justify-between px-4 py-4 ${i < g.items.length - 1 ? "border-b border-gray-50" : ""}`}>
                <div className="flex-1 pr-3">
                  <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                </div>
                <Toggle on={s[item.key]} onToggle={() => toggle(item.key)} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}