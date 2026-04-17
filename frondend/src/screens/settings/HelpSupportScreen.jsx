import { useState } from "react";
import { MessageCircle, Mail, ExternalLink, Phone, ChevronDown, CheckCircle } from "lucide-react";
import ScreenHeader from "../../components/ui/ScreenHeader";
import PrimaryButton from "../../components/ui/PrimaryButton";

export default function HelpSupportScreen({ onBack }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const faqs = [
    { q: "How do I add a new member?", a: "Go to the Members tab and tap the blue + button at the bottom right to open the Add New Member form." },
    { q: "How do I record a payment?", a: "Navigate to the Billing tab, fill in the year, amount, date, optionally upload a receipt, then tap Submit Record." },
    { q: "Can I export payment history?", a: "Yes! In the Payment History section use the filter options and download as CSV or PDF." },
    { q: "How do I change my subscription?", a: "Go to Settings → Plans & Billing. View all available plans and upgrade or downgrade your subscription." },
    { q: "How do I reset my password?", a: "Go to Settings → Security → Change Password. Enter your current password and set a new one." },
  ];

  const contacts = [
    { icon: MessageCircle, label: "Live Chat", sub: "Chat with us", color: "bg-blue-500" },
    { icon: Mail, label: "Email Us", sub: "support@app.com", color: "bg-purple-500" },
    { icon: ExternalLink, label: "Docs", sub: "Read the guides", color: "bg-teal-500" },
    { icon: Phone, label: "Call Us", sub: "+1 800 555-0101", color: "bg-orange-500" },
  ];

  const handleSend = () => {
    if (message.trim()) {
      setSent(true); setMessage("");
      setTimeout(() => setSent(false), 3000);
    }
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-gray-50">
      <ScreenHeader title="Help & Support" onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-5 space-y-4 max-w-2xl mx-auto w-full">

        {/* Quick contact grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {contacts.map(c => (
            <button key={c.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col items-start gap-2
                                             hover:border-blue-100 active:scale-95 transition-all text-left">
              <div className={`w-9 h-9 ${c.color} rounded-xl flex items-center justify-center`}>
                <c.icon size={16} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{c.label}</p>
                <p className="text-xs text-gray-400">{c.sub}</p>
              </div>
            </button>
          ))}
        </div>

        {/* FAQ accordion */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-50">
            <p className="text-sm font-bold text-gray-900">Frequently Asked Questions</p>
          </div>
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-gray-50 last:border-0">
              <button
                className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-gray-50 transition-colors"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <p className="text-sm font-semibold text-gray-900 flex-1 pr-2">{faq.q}</p>
                <ChevronDown size={16} className={`text-gray-400 flex-shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`} />
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4">
                  <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact form */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3">
          <div className="flex items-center gap-2">
            <MessageCircle size={16} className="text-blue-600" />
            <p className="text-sm font-bold text-gray-900">Send us a message</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Your Message</label>
            <textarea
              placeholder="Describe your issue or question..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={3}
              className="w-full bg-gray-50 rounded-xl px-3 py-3 text-sm text-gray-700 placeholder-gray-400
                         border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none
                         transition-all resize-none"
            />
          </div>
          {sent ? (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2.5">
              <CheckCircle size={14} className="text-green-600" />
              <p className="text-xs text-green-700 font-semibold">Message sent! We'll reply within 24 hours.</p>
            </div>
          ) : (
            <PrimaryButton onClick={handleSend}><Mail size={15} /> Send Message</PrimaryButton>
          )}
        </div>

        <p className="text-center text-xs text-gray-300 py-1">MemberFlow v2.1.0 · © 2025</p>
      </div>
    </div>
  );
}