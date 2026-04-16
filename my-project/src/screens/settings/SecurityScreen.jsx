import { useState } from "react";
import { Lock, Shield, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import ScreenHeader from "../../components/ui/ScreenHeader";
import InputField from "../../components/ui/InputField";
import PrimaryButton from "../../components/ui/PrimaryButton";
import Toggle from "../../components/ui/Toggle";

export default function SecurityScreen({ onBack }) {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [twoFA, setTwoFA] = useState(true);
  const [saved, setSaved] = useState(false);

  const strength = newPwd.length === 0 ? 0 : newPwd.length < 6 ? 1 : newPwd.length < 10 ? 2 : 3;
  const strengthColors = ["bg-gray-200", "bg-red-400", "bg-yellow-400", "bg-green-500"];
  const strengthLabels = ["", "Weak", "Medium", "Strong"];

  const handleSave = () => {
    if (newPwd && newPwd === confirm) {
      setSaved(true); setOldPwd(""); setNewPwd(""); setConfirm("");
      setTimeout(() => setSaved(false), 2500);
    }
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-gray-50">
      <ScreenHeader title="Security" onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-5 space-y-4 max-w-2xl mx-auto w-full">

        {/* Change Password */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center gap-2">
            <Lock size={16} className="text-blue-600" />
            <p className="text-sm font-bold text-gray-900">Change Password</p>
          </div>
          <InputField label="Current Password" placeholder="Enter current password" type={showOld ? "text" : "password"}
            icon={Lock} value={oldPwd} onChange={e => setOldPwd(e.target.value)}
            rightEl={<button onClick={() => setShowOld(v => !v)} className="text-gray-400 hover:text-gray-600">{showOld ? <EyeOff size={16} /> : <Eye size={16} />}</button>}
          />
          <InputField label="New Password" placeholder="Enter new password" type={showNew ? "text" : "password"}
            icon={Lock} value={newPwd} onChange={e => setNewPwd(e.target.value)}
            rightEl={<button onClick={() => setShowNew(v => !v)} className="text-gray-400 hover:text-gray-600">{showNew ? <EyeOff size={16} /> : <Eye size={16} />}</button>}
          />
          {newPwd.length > 0 && (
            <div className="space-y-1">
              <div className="flex gap-1">
                {[1, 2, 3].map(i => (
                  <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= strength ? strengthColors[strength] : "bg-gray-200"}`} />
                ))}
              </div>
              <p className="text-xs text-gray-400">Strength: <span className="font-semibold text-gray-700">{strengthLabels[strength]}</span></p>
            </div>
          )}
          <InputField label="Confirm Password" placeholder="Confirm new password" type="password"
            icon={Lock} value={confirm} onChange={e => setConfirm(e.target.value)}
            rightEl={confirm && newPwd && (confirm === newPwd
              ? <CheckCircle size={16} className="text-green-500" />
              : <AlertCircle size={16} className="text-red-400" />)}
          />
          {saved && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2.5">
              <CheckCircle size={14} className="text-green-600" />
              <p className="text-xs text-green-700 font-semibold">Password updated successfully!</p>
            </div>
          )}
          <PrimaryButton onClick={handleSave}><Lock size={15} /> Update Password</PrimaryButton>
        </div>

        {/* Two-Factor Auth */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <Shield size={16} className="text-blue-600" />
            <p className="text-sm font-bold text-gray-900">Two-Factor Authentication</p>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">Enable 2FA</p>
              <p className="text-xs text-gray-400 mt-0.5">Extra layer of account security</p>
            </div>
            <Toggle on={twoFA} onToggle={() => setTwoFA(v => !v)} />
          </div>
          {twoFA && (
            <div className="mt-3 bg-blue-50 rounded-xl px-3 py-2.5 flex items-center gap-2">
              <CheckCircle size={14} className="text-blue-600" />
              <p className="text-xs text-blue-700 font-medium">2FA active — your account is protected</p>
            </div>
          )}
        </div>

        {/* Active Sessions */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm font-bold text-gray-900 mb-3">Active Sessions</p>
          {[
            { device: "iPhone 15 Pro", location: "New York, USA", current: true },
            { device: "MacBook Pro", location: "New York, USA", current: false },
          ].map((sess, i) => (
            <div key={i} className={`flex items-center justify-between py-3 ${i === 0 ? "border-b border-gray-50" : ""}`}>
              <div>
                <p className="text-sm font-semibold text-gray-900">{sess.device}</p>
                <p className="text-xs text-gray-400">{sess.location}</p>
              </div>
              {sess.current
                ? <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">Current</span>
                : <button className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors">Revoke</button>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}