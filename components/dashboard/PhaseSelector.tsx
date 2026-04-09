"use client";

interface PhaseSelectorProps {
  activePhase: number;
  onSelect: (phase: number) => void;
}

export function PhaseSelector({ activePhase, onSelect }: PhaseSelectorProps) {
  const phases = [
    { num: 1, label: "Foundation", weeks: "Wk 1–4" },
    { num: 2, label: "Build", weeks: "Wk 5–8" },
    { num: 3, label: "Peak", weeks: "Wk 9–12" },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {phases.map((p) => (
        <button
          key={p.num}
          onClick={() => onSelect(p.num)}
          className={`flex-shrink-0 flex flex-col items-center px-4 py-2 rounded-xl border transition-colors ${
            activePhase === p.num
              ? "bg-[#c8f060]/10 border-[#c8f060]/40 text-[#c8f060]"
              : "bg-[#141414] border-[#1e1e1e] text-[#6b6b6b] hover:border-[#2a2a2a]"
          }`}
        >
          <span className="font-display font-bold text-xs">{p.label}</span>
          <span className="text-[10px] opacity-70">{p.weeks}</span>
        </button>
      ))}
    </div>
  );
}
