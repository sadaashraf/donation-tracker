import { ToggleLeft, ToggleRight } from "lucide-react";

export default function Toggle({ on, onToggle }) {
  return (
    <button onClick={onToggle} className="flex-shrink-0 focus:outline-none">
      {on
        ? <ToggleRight size={30} className="text-blue-600" />
        : <ToggleLeft size={30} className="text-gray-300" />}
    </button>
  );
}