export default function OutlineButton({ children, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`w-full py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm
                  hover:bg-gray-50 active:scale-95 transition-all ${className}`}
    >
      {children}
    </button>
  );
}