"use client";

import { useState } from "react";
import { Stretch } from "@/types";

interface StretchPanelProps {
  stretching: {
    morning_routine: {
      duration_minutes: number;
      description: string;
      stretches: Stretch[];
    };
    workout_day: {
      warmup: Stretch[];
      cooldown: Stretch[];
    };
    rest_day: {
      description: string;
      stretches: Stretch[];
    };
  };
}

function StretchList({ stretches }: { stretches: Stretch[] }) {
  return (
    <div className="space-y-2">
      {stretches.map((s, i) => (
        <div key={i} className="bg-[#141414] border border-[#1e1e1e] rounded-xl p-3">
          <div className="flex items-center justify-between mb-1">
            <p className="font-display font-bold text-sm text-[#f0ede8]">{s.name}</p>
            <span className="text-xs text-[#c8f060] bg-[#c8f060]/10 border border-[#c8f060]/20 px-2 py-0.5 rounded font-bold">
              {s.duration}
            </span>
          </div>
          <p className="text-xs text-[#6b6b6b] leading-relaxed">{s.how_to}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {s.targets.map((t) => (
              <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-[#1e1e1e] text-[#6b6b6b]">
                {t}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function StretchPanel({ stretching }: StretchPanelProps) {
  const [tab, setTab] = useState<"morning" | "workout" | "rest">("morning");

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(["morning", "workout", "rest"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-xl font-display font-bold text-xs capitalize border transition-colors ${
              tab === t
                ? "bg-[#c8f060]/10 border-[#c8f060]/40 text-[#c8f060]"
                : "bg-[#141414] border-[#1e1e1e] text-[#6b6b6b]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "morning" && (
        <div className="space-y-3">
          <p className="text-xs text-[#6b6b6b]">
            {stretching.morning_routine.duration_minutes} min •{" "}
            {stretching.morning_routine.description}
          </p>
          <StretchList stretches={stretching.morning_routine.stretches} />
        </div>
      )}

      {tab === "workout" && (
        <div className="space-y-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#6b6b6b] mb-2">
              Warm-up
            </p>
            <StretchList stretches={stretching.workout_day.warmup} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#6b6b6b] mb-2">
              Cool-down
            </p>
            <StretchList stretches={stretching.workout_day.cooldown} />
          </div>
        </div>
      )}

      {tab === "rest" && (
        <div className="space-y-3">
          <p className="text-xs text-[#6b6b6b]">{stretching.rest_day.description}</p>
          <StretchList stretches={stretching.rest_day.stretches} />
        </div>
      )}
    </div>
  );
}
