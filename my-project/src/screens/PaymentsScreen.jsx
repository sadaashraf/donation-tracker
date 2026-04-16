import { useState, useRef } from "react";
import { Bell, CreditCard, ChevronDown, Search, Filter, Clock, Upload, Save, X, Eye, ImageOff } from "lucide-react";
import ScreenHeader from "../components/ui/ScreenHeader";
import { paymentHistory } from "../data/dummyData";

const statusStyle = (s) => ({
  Verified: "bg-green-50 text-green-600",
  Pending:  "bg-orange-50 text-orange-500",
  Rejected: "bg-red-50 text-red-500",
}[s] ?? "bg-gray-100 text-gray-500");

function ReceiptModal({ src, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl overflow-hidden shadow-2xl max-w-lg w-full" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <p className="text-sm font-bold text-gray-900">Proof of Payment</p>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
            <X size={16} className="text-gray-500" />
          </button>
        </div>
        <div className="p-4">
          {src
            ? <img src={src} alt="Receipt" className="w-full rounded-xl object-contain max-h-80" />
            : <div className="flex flex-col items-center justify-center gap-2 py-10 text-gray-400">
                <ImageOff size={32} />
                <p className="text-sm">No receipt uploaded</p>
              </div>
          }
        </div>
      </div>
    </div>
  );
}

export default function PaymentsScreen({ setScreen }) {
  const [searchTerm, setSearchTerm]   = useState("");
  const [yearFilter, setYearFilter]   = useState("All");
  const [page, setPage]               = useState(1);
  const [amount, setAmount]           = useState("");
  const [date, setDate]               = useState("");
  const [year, setYear]               = useState("2025");
  const [receipt, setReceipt]         = useState(null);   // { file, previewUrl }
  const [previewModal, setPreviewModal] = useState(null); // url string
  const fileInputRef = useRef(null);

  const filtered = paymentHistory.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (yearFilter === "All" || p.year === yearFilter)
  );

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setReceipt({ file, previewUrl: URL.createObjectURL(file) });
  };

  const handleSubmit = () => {
    // submission logic would go here
    setAmount(""); setDate(""); setYear("2025"); setReceipt(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-gray-50">
      <ScreenHeader
        title="Payment Records"
        onBack={() => setScreen("dashboard")}
        actions={
          <div className="flex items-center gap-2">
            <Bell size={22} className="text-blue-500" />
            <div className="w-9 h-9 rounded-full bg-orange-300 flex items-center justify-center text-white text-sm font-semibold">J</div>
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto px-4 md:px-6 xl:px-8 py-4 max-w-5xl xl:max-w-6xl mx-auto w-full">
        <div className="space-y-4">

          {/* ── Record New Payment ── */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard size={18} className="text-blue-600" />
              <h2 className="text-base font-bold text-gray-900">Record New Payment</h2>
            </div>
            {/* Hidden native file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 items-end">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Membership Year</label>
                <div className="relative">
                  <select value={year} onChange={e => setYear(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-3 text-sm text-gray-700
                               appearance-none outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all">
                    <option value="2025">2025 (Current)</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Amount (USD)</label>
                <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-3
                                focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-50 transition-all">
                  <span className="text-gray-400 text-sm">$</span>
                  <input type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)}
                    className="w-full bg-transparent text-sm text-gray-700 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Payment Date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm text-gray-700 outline-none
                             focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Proof of Payment</label>
                {receipt ? (
                  <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50">
                    <img src={receipt.previewUrl} alt="thumb" className="w-7 h-7 rounded-lg object-cover flex-shrink-0" />
                    <p className="text-xs text-gray-600 truncate flex-1">{receipt.file.name}</p>
                    <button onClick={() => { setReceipt(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                      className="text-gray-400 hover:text-red-500 flex-shrink-0 transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border border-dashed border-gray-200 rounded-xl py-3 flex items-center justify-center
                               gap-2 text-sm text-gray-400 hover:border-blue-300 hover:text-blue-500 transition-colors">
                    <Upload size={15} /> Upload
                  </button>
                )}
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <button onClick={handleSubmit}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold text-sm
                           flex items-center gap-2 hover:bg-blue-700 active:scale-95 transition-all">
                <Save size={16} /> Submit Record
              </button>
            </div>
          </div>

          {/* ── Payment History ── */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={18} className="text-blue-600" />
              <h2 className="text-base font-bold text-gray-900">Payment History</h2>
            </div>
            <div className="flex gap-2 mb-3">
              <div className="flex items-center gap-2 flex-1 border border-gray-200 rounded-xl px-3 py-2.5">
                <Search size={14} className="text-gray-400" />
                <input placeholder="Search member name" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                  className="flex-1 text-xs text-gray-700 placeholder-gray-400 bg-transparent outline-none" />
              </div>
              <div className="relative">
                <select value={yearFilter} onChange={e => setYearFilter(e.target.value)}
                  className="border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-600 appearance-none pr-7 outline-none">
                  <option value="All">Filter by Year</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                </select>
                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <button className="mb-3 flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 rounded-lg px-2.5 py-1.5 hover:bg-gray-50 transition-colors">
              <Filter size={12} /> Filter
            </button>

            {/* Scrollable table wrapper for small screens */}
            <div className="overflow-x-auto -mx-1 px-1">
              <table className="w-full min-w-[520px]">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["YEAR", "MEMBER NAME", "AMOUNT", "DATE", "STATUS", "PROOF"].map((h, i) => (
                      <th key={h} className={`pb-2 text-[11px] font-semibold text-gray-400 tracking-wider whitespace-nowrap
                                              ${i >= 2 ? "text-center" : "text-left"}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(r => (
                    <tr key={r.id} className="border-b border-gray-50 last:border-0">
                      <td className="py-3 pr-2">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap
                                          ${r.year === "2025" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>
                          {r.year}
                        </span>
                      </td>
                      <td className="py-3 pr-2 text-sm text-gray-800 font-medium whitespace-nowrap">{r.name}</td>
                      <td className="py-3 pr-2 text-sm font-semibold text-gray-900 text-center whitespace-nowrap">{r.amount}</td>
                      <td className="py-3 pr-2 text-xs text-gray-500 text-center whitespace-nowrap">
                        {new Date(r.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td className="py-3 pr-2 text-center">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${statusStyle(r.status)}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        {r.proof
                          ? <button onClick={() => setPreviewModal(r.proof)}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                              <Eye size={13} /> View
                            </button>
                          : <span className="text-xs text-gray-300">—</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-400">Showing {filtered.length} of {paymentHistory.length} records</p>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 active:scale-95 transition-all">Prev</button>
                <button onClick={() => setPage(p => p + 1)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all">Next</button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {previewModal && <ReceiptModal src={previewModal} onClose={() => setPreviewModal(null)} />}
    </div>
  );
}
