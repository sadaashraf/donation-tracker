import { ArrowLeft } from "lucide-react";

export default function ScreenHeader({ title, onBack, actions }) {
  return (
    <div className="bg-white px-5 pt-5 pb-4 flex items-center gap-3 border-b border-gray-100 flex-shrink-0">
      {onBack && (
        <button onClick={onBack} className="p-1 -ml-1 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
      )}
      <span className="text-base md:text-lg font-bold text-gray-900 flex-1">{title}</span>
      {actions}
    </div>
  );
}
