"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PlanContent } from "@/types";
import { PlanSummary } from "@/components/dashboard/PlanSummary";
import { PhaseSelector } from "@/components/dashboard/PhaseSelector";
import { DaySelector } from "@/components/dashboard/DaySelector";
import { ExerciseCard } from "@/components/dashboard/ExerciseCard";
import { StretchPanel } from "@/components/dashboard/StretchPanel";
import { NutritionPanel } from "@/components/dashboard/NutritionPanel";
import { TimerWidget } from "@/components/dashboard/TimerWidget";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import Link from "next/link";

type Tab = "workout" | "stretch" | "nutrition" | "timer";

export default function DashboardPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [plan, setPlan] = useState<PlanContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [activePhase, setActivePhase] = useState(1);
  const [activeDay, setActiveDay] = useState(0);
  const [tab, setTab] = useState<Tab>("workout");

  const fetchPlan = useCallback(async () => {
    const res = await fetch("/api/plan/active");
    const data = await res.json() as { plan: { content: PlanContent } | null };
    if (data.plan) {
      setPlan(data.plan.content);
    }
    return !!data.plan;
  }, []);

  useEffect(() => {
    const shouldGenerate = params.get("generating") === "true";

    async function init() {
      if (shouldGenerate) {
        setGenerating(true);
        try {
          const res = await fetch("/api/generate-plan", { method: "POST" });
          if (!res.ok) {
            let msg = `Server error ${res.status}`;
            try { const d = await res.json() as { error?: string }; if (d.error) msg = d.error; } catch { /* ignore */ }
            setGenError(msg);
            return;
          }
          await fetchPlan();
          router.replace("/dashboard");
        } catch (err) {
          setGenError(err instanceof Error ? err.message : "Network error");
        } finally {
          setGenerating(false);
          setLoading(false);
        }
      } else {
        const hasPlan = await fetchPlan();
        if (!hasPlan) router.push("/onboarding");
        setLoading(false);
      }
    }

    init();
  }, [params, router, fetchPlan]);

  if (generating) return <LoadingScreen />;
  if (loading) return <LoadingScreen />;

  if (genError) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6 text-center">
        <p className="font-display font-bold text-[#f0ede8] text-xl mb-2">Plan generation failed</p>
        <p className="text-[#f06060] text-sm mb-6 max-w-xs">{genError}</p>
        <button
          onClick={() => { setGenError(null); setGenerating(true); setLoading(true); router.push("/dashboard?generating=true"); }}
          className="px-6 py-3 rounded-xl bg-[#c8f060] text-[#0a0a0a] font-display font-bold text-sm"
        >
          Try again
        </button>
      </main>
    );
  }

  if (!plan) return null;

  const currentPhase = plan.phases.find((p) => p.phase_number === activePhase);
  const days = currentPhase?.days ?? [];
  const currentDay = days[activeDay];

  return (
    <main className="min-h-screen bg-[#0a0a0a] pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-[#0a0a0a]/90 backdrop-blur border-b border-[#1e1e1e] px-4 py-3 z-10">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <span className="font-display font-bold text-[#f0ede8]">My Plan</span>
          <Link
            href="/profile"
            className="text-xs text-[#6b6b6b] hover:text-[#f0ede8] transition-colors"
          >
            Profile
          </Link>
        </div>
      </div>

      <div className="px-4 py-5 space-y-5 max-w-lg mx-auto">
        <PlanSummary plan={plan} />

        <PhaseSelector activePhase={activePhase} onSelect={(p) => { setActivePhase(p); setActiveDay(0); }} />

        {/* Tab navigation */}
        <div className="flex gap-1 bg-[#141414] border border-[#1e1e1e] rounded-2xl p-1">
          {(["workout", "stretch", "nutrition", "timer"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-xl font-display font-bold text-xs capitalize transition-colors ${
                tab === t
                  ? "bg-[#f0ede8] text-[#0a0a0a]"
                  : "text-[#6b6b6b] hover:text-[#f0ede8]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Workout tab */}
        {tab === "workout" && currentDay && (
          <div className="space-y-4">
            <DaySelector
              days={days.map((d) => d.day_label)}
              activeDay={activeDay}
              onSelect={setActiveDay}
            />
            <div className="bg-[#141414] border border-[#1e1e1e] rounded-xl px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-widest text-[#6b6b6b]">
                Focus
              </p>
              <p className="font-display font-bold text-[#f0ede8] text-sm mt-0.5">
                {currentDay.focus}
              </p>
            </div>
            <div className="space-y-3">
              {currentDay.exercises.map((ex, i) => (
                <ExerciseCard key={i} exercise={ex} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* Stretch tab */}
        {tab === "stretch" && <StretchPanel stretching={plan.stretching} />}

        {/* Nutrition tab */}
        {tab === "nutrition" && <NutritionPanel nutrition={plan.nutrition} />}

        {/* Timer tab */}
        {tab === "timer" && (
          <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-6">
            <p className="font-display font-bold text-[#f0ede8] mb-4 text-center">
              Rest Timer
            </p>
            <TimerWidget />
          </div>
        )}
      </div>
    </main>
  );
}
