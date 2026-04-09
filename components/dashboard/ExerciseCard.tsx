"use client";

import { useState } from "react";
import { Exercise } from "@/types";

export function ExerciseCard({
  exercise,
  index,
}: {
  exercise: Exercise;
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const ytUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(exercise.youtube_search)}`;

  return (
    <div
      className={`bg-[#141414] border rounded-2xl overflow-hidden transition-colors ${open ? "border-[#2a2a2a]" : "border-[#1e1e1e]"}`}
    >
      <button
        className="w-full flex items-center gap-3 p-4 text-left"
        onClick={() => setOpen(!open)}
      >
        <div className="w-7 h-7 rounded-full bg-[#1e1e1e] flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-display font-bold text-[#6b6b6b]">
            {index + 1}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display font-bold text-[#f0ede8] text-sm leading-tight">
            {exercise.name}
          </p>
          <span className="inline-block mt-1 text-xs font-bold text-[#c8f060] bg-[#c8f060]/10 border border-[#c8f060]/20 px-2 py-0.5 rounded">
            {exercise.sets}
          </span>
        </div>
        <span
          className={`text-[#6b6b6b] text-xs transition-transform ${open ? "rotate-180" : ""}`}
        >
          ▼
        </span>
      </button>

      {open && (
        <div className="px-4 pb-4 border-t border-[#1e1e1e] pt-3 space-y-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#6b6b6b] mb-2">
              How to do it
            </p>
            <p className="text-sm text-[#f0ede8]/80 leading-relaxed">
              {exercise.how_to}
            </p>
          </div>

          {exercise.injury_notes && (
            <div className="bg-[#f06060]/10 border border-[#f06060]/20 rounded-xl p-3">
              <p className="text-xs font-bold uppercase tracking-widest text-[#f06060] mb-1">
                Injury note
              </p>
              <p className="text-xs text-[#f06060]/80">{exercise.injury_notes}</p>
            </div>
          )}

          {exercise.safe_tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {exercise.safe_tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded bg-green-950/50 text-green-400 border border-green-800/30"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-[#6b6b6b]">
              Rest: {exercise.rest_seconds}s
            </span>
            <a
              href={ytUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[#60c8f0] text-xs hover:text-[#60c8f0]/80 transition-colors"
            >
              Watch demo →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
