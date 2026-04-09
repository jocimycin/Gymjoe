"use client";

import { useEffect, useState } from "react";
import { LOADING_MESSAGES } from "@/types";

export function LoadingScreen() {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] flex flex-col items-center justify-center z-50 px-6">
      <div className="mb-8">
        <div className="w-16 h-16 rounded-full border-2 border-[#c8f060]/20 border-t-[#c8f060] animate-spin" />
      </div>
      <h2 className="font-display font-bold text-xl text-[#f0ede8] mb-3 text-center">
        Building your plan
      </h2>
      <p className="text-[#6b6b6b] text-sm text-center min-h-[1.5rem] transition-all">
        {LOADING_MESSAGES[msgIndex]}
      </p>
      <p className="text-[#6b6b6b] text-xs mt-8">This takes 15–25 seconds</p>
    </div>
  );
}
