import { useState } from "react";
import { User, Mail, Phone, MapPin, Edit3, Save, CheckCircle } from "lucide-react";
import ScreenHeader from "../../components/ui/ScreenHeader";
import InputField from "../../components/ui/InputField";
import PrimaryButton from "../../components/ui/PrimaryButton";

export default function ProfileScreen({ onBack }) {
  const [name, setName] = useState("Alex Johnson");
  const [email, setEmail] = useState("alex.johnson@email.com");
  const [phone, setPhone] = useState("+1 (555) 012-3456");
  const [city, setCity] = useState("New York, USA");
  const [saved, setSaved] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-gray-50">
      <ScreenHeader title="Profile" onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-5 space-y-4 max-w-2xl mx-auto w-full">

        {/* Avatar card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col items-center gap-3">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">AJ</div>
            <button className="absolute bottom-0 right-0 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white hover:bg-blue-700 transition-colors">
              <Edit3 size={12} className="text-white" />
            </button>
          </div>
          <div className="text-center">
            <p className="font-bold text-gray-900 text-base">{name}</p>
            <p className="text-xs text-gray-400 mt-0.5">Member since Jan 2023</p>
          </div>
          <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">Pro Plan</span>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-4">
          <p className="text-sm font-bold text-gray-900">Personal Information</p>
          <InputField label="Full Name" placeholder="Your full name" icon={User} value={name} onChange={e => setName(e.target.value)} />
          <InputField label="Email Address" placeholder="your@email.com" icon={Mail} value={email} onChange={e => setEmail(e.target.value)} type="email" />
          <InputField label="Phone Number" placeholder="+1 (000) 000-0000" icon={Phone} value={phone} onChange={e => setPhone(e.target.value)} type="tel" />
          <InputField label="Location" placeholder="City, Country" icon={MapPin} value={city} onChange={e => setCity(e.target.value)} />
        </div>

        {saved && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
            <CheckCircle size={16} className="text-green-600" />
            <p className="text-sm text-green-700 font-semibold">Profile saved successfully!</p>
          </div>
        )}
        <PrimaryButton onClick={handleSave}><Save size={16} /> Save Changes</PrimaryButton>
      </div>
    </div>
  );
}