export default function PrimaryButton({ children, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold text-sm
                  flex items-center justify-center gap-2 hover:bg-blue-700 active:scale-95 transition-all ${className}`}
    >
      {children}
    </button>
  );
}