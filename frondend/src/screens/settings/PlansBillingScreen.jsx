import { useState } from "react";
import { Download, Star, CheckCircle } from "lucide-react";
import ScreenHeader from "../../components/ui/ScreenHeader";
import PrimaryButton from "../../components/ui/PrimaryButton";
// import { plans } from "../../data/dummyData";

export default function PlansBillingScreen({ onBack }) {
  const [selected, setSelected] = useState("Pro Plan");

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-gray-50">
      <ScreenHeader title="Plans & Billing" onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-5 space-y-4 max-w-2xl mx-auto w-full">

        {/* Current plan banner */}
        <div className="bg-blue-600 rounded-2xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold opacity-80">CURRENT PLAN</p>
            <span className="bg-white/20 text-white text-xs font-semibold px-2 py-0.5 rounded-full">Active</span>
          </div>
          <p className="text-xl font-bold">Pro Plan</p>
          <p className="text-sm opacity-80 mt-0.5">$29/month · Renews Jan 15, 2026</p>
          <div className="flex gap-3 mt-3">
            <button className="bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors flex items-center gap-1">
              <Download size={12} /> Invoice
            </button>
            <button className="bg-white text-blue-600 text-xs font-semibold px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors">
              Manage
            </button>
          </div>
        </div>

        {/* Plan cards */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Available Plans</p>
          <div className="space-y-3">
            {plans.map(plan => (
              <button key={plan.id} onClick={() => setSelected(plan.name)}
                className={`w-full text-left bg-white rounded-2xl p-4 shadow-sm border-2 transition-all
                            ${selected === plan.name ? "border-blue-600" : "border-gray-100 hover:border-blue-200"}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-gray-900">{plan.name}</p>
                      {plan.current && <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full">CURRENT</span>}
                    </div>
                    <p className="text-base font-bold text-blue-600 mt-0.5">{plan.price}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5
                                   ${selected === plan.name ? "border-blue-600 bg-blue-600" : "border-gray-300"}`}>
                    {selected === plan.name && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </div>
                <div className="mt-3 space-y-1.5">
                  {plan.features.map(f => (
                    <div key={f} className="flex items-center gap-2">
                      <CheckCircle size={13} className="text-green-500 flex-shrink-0" />
                      <span className="text-xs text-gray-600">{f}</span>
                    </div>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        {selected !== "Pro Plan" && (
          <PrimaryButton><Star size={15} /> Upgrade to {selected}</PrimaryButton>
        )}

        {/* Payment method */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm font-bold text-gray-900 mb-3">Payment Method</p>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
            <div className="w-10 h-7 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white text-[9px] font-bold">VISA</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">•••• •••• •••• 4242</p>
              <p className="text-xs text-gray-400">Expires 08/27</p>
            </div>
            <button className="text-xs text-blue-600 font-semibold hover:text-blue-700">Edit</button>
          </div>
        </div>
      </div>
    </div>
  );
}