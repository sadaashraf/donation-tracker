export default function Avatar({ initials, size = "md", color = "bg-blue-100 text-blue-600" }) {
  const sz = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-14 h-14 text-lg" }[size];
  return (
    <div className={`${sz} rounded-full ${color} flex items-center justify-center font-semibold flex-shrink-0`}>
      {initials}
    </div>
  );
}