"use client";

import { useState, useEffect, useRef } from "react";

const PRESETS = [30, 60, 90, 120, 180];

export function TimerWidget() {
  const [seconds, setSeconds] = useState(90);
  const [remaining, setRemaining] = useState(90);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            clearInterval(intervalRef.current!);
            setRunning(false);
            try {
              navigator.vibrate([200, 100, 200]);
            } catch {
              // Safari silently ignores
            }
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const reset = () => {
    setRunning(false);
    setRemaining(seconds);
  };

  const toggle = () => {
    if (remaining === 0) {
      setRemaining(seconds);
      setRunning(true);
    } else {
      setRunning((r) => !r);
    }
  };

  const progress = remaining / seconds;
  const circumference = 2 * Math.PI * 40;

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Preset buttons */}
      <div className="flex gap-2 w-full">
        {PRESETS.map((p) => (
          <button
            key={p}
            onClick={() => {
              setSeconds(p);
              setRemaining(p);
              setRunning(false);
            }}
            className={`flex-1 py-2 rounded-xl font-display font-bold text-xs border transition-colors ${
              seconds === p
                ? "bg-[#c8f060]/10 border-[#c8f060]/40 text-[#c8f060]"
                : "bg-[#141414] border-[#1e1e1e] text-[#6b6b6b]"
            }`}
          >
            {p}s
          </button>
        ))}
      </div>

      {/* Ring timer */}
      <div className="relative flex items-center justify-center">
        <svg width="120" height="120" className="-rotate-90">
          <circle
            cx="60"
            cy="60"
            r="40"
            fill="none"
            stroke="#1e1e1e"
            strokeWidth="6"
          />
          <circle
            cx="60"
            cy="60"
            r="40"
            fill="none"
            stroke={remaining === 0 ? "#f06060" : "#c8f060"}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <span className="absolute font-display font-bold text-2xl text-[#f0ede8]">
          {fmt(remaining)}
        </span>
      </div>

      {/* Controls */}
      <div className="flex gap-3 w-full">
        <button
          onClick={reset}
          className="flex-1 py-3 rounded-2xl bg-[#141414] border border-[#1e1e1e] font-display font-bold text-sm text-[#6b6b6b] hover:text-[#f0ede8] transition-colors"
        >
          Reset
        </button>
        <button
          onClick={toggle}
          className="flex-1 py-3 rounded-2xl bg-[#c8f060] font-display font-bold text-sm text-[#0a0a0a] hover:bg-[#b8e050] transition-colors"
        >
          {running ? "Pause" : remaining === 0 ? "Restart" : "Start"}
        </button>
      </div>
    </div>
  );
}
