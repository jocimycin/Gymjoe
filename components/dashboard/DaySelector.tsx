"use client";

interface DaySelectorProps {
  days: string[];
  activeDay: number;
  onSelect: (index: number) => void;
}

export function DaySelector({ days, activeDay, onSelect }: DaySelectorProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {days.map((day, i) => (
        <button
          key={day}
          onClick={() => onSelect(i)}
          className={`flex-shrink-0 px-4 py-2 rounded-xl border font-display font-bold text-xs transition-colors ${
            activeDay === i
              ? "bg-[#f0ede8] text-[#0a0a0a] border-[#f0ede8]"
              : "bg-[#141414] border-[#1e1e1e] text-[#6b6b6b] hover:border-[#2a2a2a]"
          }`}
        >
          {day}
        </button>
      ))}
    </div>
  );
}
