"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { INJURY_OPTIONS, ProfileFormData } from "@/types";

const TOTAL_STEPS = 4;

const defaultForm: ProfileFormData = {
  age: 30,
  heightCm: 175,
  weightKg: 80,
  gender: "",
  fitnessGoal: "",
  experienceLevel: "",
  daysPerWeek: 3,
  equipment: "",
  injuries: [],
  activityLevel: "",
};

function SelectCard({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-xl border font-body text-sm transition-colors ${
        selected
          ? "bg-[#c8f060]/10 border-[#c8f060]/40 text-[#c8f060]"
          : "bg-[#141414] border-[#1e1e1e] text-[#f0ede8] hover:border-[#2a2a2a]"
      }`}
    >
      {label}
    </button>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<ProfileFormData>(defaultForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = <K extends keyof ProfileFormData>(key: K, value: ProfileFormData[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleInjury = (id: string) => {
    if (id === "none") {
      set("injuries", ["none"]);
      return;
    }
    set(
      "injuries",
      form.injuries.includes(id)
        ? form.injuries.filter((i) => i !== id)
        : [...form.injuries.filter((i) => i !== "none"), id]
    );
  };

  async function finish() {
    setSaving(true);
    setError("");
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      setError("Failed to save profile. Try again.");
      setSaving(false);
      return;
    }
    router.push("/dashboard?generating=true");
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex flex-col px-6 py-8 max-w-lg mx-auto w-full">
      <OnboardingProgress step={step} total={TOTAL_STEPS} />

      <div className="flex-1 mt-8 space-y-6">
        {/* Step 1: Basic stats */}
        {step === 1 && (
          <>
            <div>
              <h2 className="font-display font-bold text-2xl text-[#f0ede8]">
                Basic stats
              </h2>
              <p className="text-[#6b6b6b] text-sm mt-1">
                Used to calculate your BMI and calorie targets.
              </p>
            </div>
            <div className="space-y-4">
              <Input
                label="Age"
                type="number"
                value={form.age}
                min={16}
                max={80}
                onChange={(e) => set("age", Number(e.target.value))}
              />
              <Input
                label="Height (cm)"
                type="number"
                value={form.heightCm}
                min={140}
                max={220}
                onChange={(e) => set("heightCm", Number(e.target.value))}
              />
              <Input
                label="Weight (kg)"
                type="number"
                value={form.weightKg}
                min={40}
                max={250}
                step={0.5}
                onChange={(e) => set("weightKg", Number(e.target.value))}
              />
              <div>
                <p className="text-xs font-display font-bold uppercase tracking-widest text-[#6b6b6b] mb-2">
                  Gender (optional)
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {["Male", "Female", "Other"].map((g) => (
                    <SelectCard
                      key={g}
                      label={g}
                      selected={form.gender === g.toLowerCase()}
                      onClick={() => set("gender", g.toLowerCase())}
                    />
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Step 2: Goals */}
        {step === 2 && (
          <>
            <div>
              <h2 className="font-display font-bold text-2xl text-[#f0ede8]">
                Your goals
              </h2>
              <p className="text-[#6b6b6b] text-sm mt-1">
                We'll tailor every phase to what you actually want.
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-display font-bold uppercase tracking-widest text-[#6b6b6b] mb-2">
                  Primary goal
                </p>
                <div className="space-y-2">
                  {[
                    { id: "fat_loss", label: "Fat loss" },
                    { id: "muscle_gain", label: "Muscle gain" },
                    { id: "general_fitness", label: "General fitness" },
                    { id: "rehab", label: "Rehab / injury recovery" },
                    { id: "endurance", label: "Endurance" },
                  ].map((g) => (
                    <SelectCard
                      key={g.id}
                      label={g.label}
                      selected={form.fitnessGoal === g.id}
                      onClick={() => set("fitnessGoal", g.id)}
                    />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-display font-bold uppercase tracking-widest text-[#6b6b6b] mb-2">
                  Experience level
                </p>
                <div className="space-y-2">
                  {[
                    { id: "beginner", label: "Beginner — new to training" },
                    { id: "intermediate", label: "Intermediate — 1–3 years" },
                    { id: "advanced", label: "Advanced — 3+ years" },
                  ].map((e) => (
                    <SelectCard
                      key={e.id}
                      label={e.label}
                      selected={form.experienceLevel === e.id}
                      onClick={() => set("experienceLevel", e.id)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Step 3: Availability */}
        {step === 3 && (
          <>
            <div>
              <h2 className="font-display font-bold text-2xl text-[#f0ede8]">
                Availability
              </h2>
              <p className="text-[#6b6b6b] text-sm mt-1">
                How often can you train and what gear do you have?
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-display font-bold uppercase tracking-widest text-[#6b6b6b] mb-2">
                  Days per week
                </p>
                <div className="flex gap-2">
                  {[2, 3, 4, 5, 6].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => set("daysPerWeek", d)}
                      className={`flex-1 py-3 rounded-xl border font-display font-bold text-sm transition-colors ${
                        form.daysPerWeek === d
                          ? "bg-[#c8f060]/10 border-[#c8f060]/40 text-[#c8f060]"
                          : "bg-[#141414] border-[#1e1e1e] text-[#6b6b6b]"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-display font-bold uppercase tracking-widest text-[#6b6b6b] mb-2">
                  Equipment access
                </p>
                <div className="space-y-2">
                  {[
                    { id: "full_gym", label: "Full gym" },
                    { id: "home_dumbbells", label: "Home — dumbbells only" },
                    { id: "home_no_equipment", label: "Home — no equipment" },
                    { id: "mixed", label: "Mixed (gym + home)" },
                  ].map((e) => (
                    <SelectCard
                      key={e.id}
                      label={e.label}
                      selected={form.equipment === e.id}
                      onClick={() => set("equipment", e.id)}
                    />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-display font-bold uppercase tracking-widest text-[#6b6b6b] mb-2">
                  Activity level (outside training)
                </p>
                <div className="space-y-2">
                  {[
                    { id: "sedentary", label: "Sedentary — desk job" },
                    { id: "light", label: "Light — occasional walking" },
                    { id: "moderate", label: "Moderate — on your feet a lot" },
                    { id: "active", label: "Active — physical work" },
                  ].map((a) => (
                    <SelectCard
                      key={a.id}
                      label={a.label}
                      selected={form.activityLevel === a.id}
                      onClick={() => set("activityLevel", a.id)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Step 4: Injuries */}
        {step === 4 && (
          <>
            <div>
              <h2 className="font-display font-bold text-2xl text-[#f0ede8]">
                Injuries & limitations
              </h2>
              <p className="text-[#6b6b6b] text-sm mt-1">
                Every exercise will be adapted around these. Be honest.
              </p>
            </div>
            <div className="space-y-2">
              {INJURY_OPTIONS.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => toggleInjury(o.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl border font-body text-sm transition-colors flex items-center gap-3 ${
                    form.injuries.includes(o.id)
                      ? "bg-[#c8f060]/10 border-[#c8f060]/40 text-[#c8f060]"
                      : "bg-[#141414] border-[#1e1e1e] text-[#f0ede8] hover:border-[#2a2a2a]"
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center text-[10px] font-bold ${
                      form.injuries.includes(o.id)
                        ? "bg-[#c8f060] border-[#c8f060] text-[#0a0a0a]"
                        : "border-[#2a2a2a]"
                    }`}
                  >
                    {form.injuries.includes(o.id) ? "✓" : ""}
                  </span>
                  {o.label}
                </button>
              ))}
            </div>
            {error && (
              <p className="text-sm text-[#f06060] text-center">{error}</p>
            )}
          </>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 mt-8">
        {step > 1 && (
          <Button variant="secondary" onClick={() => setStep(step - 1)}>
            Back
          </Button>
        )}
        {step < TOTAL_STEPS ? (
          <Button onClick={() => setStep(step + 1)}>Continue</Button>
        ) : (
          <Button loading={saving} onClick={finish}>
            Generate my plan
          </Button>
        )}
      </div>
    </main>
  );
}
