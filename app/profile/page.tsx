"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { ProfileFormData, INJURY_OPTIONS } from "@/types";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

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

export default function ProfilePage() {
  const router = useRouter();
  const [form, setForm] = useState<ProfileFormData | null>(null);
  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d: { profile: ProfileFormData | null }) => {
        if (d.profile) setForm(d.profile);
      });
  }, []);

  const set = <K extends keyof ProfileFormData>(key: K, value: ProfileFormData[K]) =>
    setForm((f) => (f ? { ...f, [key]: value } : f));

  const toggleInjury = (id: string) => {
    if (!form) return;
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

  async function saveProfile() {
    if (!form) return;
    setSaving(true);
    await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setMsg("Saved!");
    setTimeout(() => setMsg(""), 2000);
  }

  async function regenerate() {
    if (!form) return;
    setRegenerating(true);
    await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    router.push("/dashboard?generating=true");
  }

  if (!form) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#c8f060]/20 border-t-[#c8f060] animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] pb-16">
      <div className="sticky top-0 bg-[#0a0a0a]/90 backdrop-blur border-b border-[#1e1e1e] px-4 py-3 z-10">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <Link href="/dashboard" className="text-xs text-[#6b6b6b] hover:text-[#f0ede8]">
            ← Back
          </Link>
          <span className="font-display font-bold text-[#f0ede8]">Profile</span>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-xs text-[#6b6b6b] hover:text-[#f06060] transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="px-4 py-5 space-y-6 max-w-lg mx-auto">
        {/* Basic stats */}
        <section className="space-y-4">
          <h3 className="font-display font-bold text-[#f0ede8]">Basic stats</h3>
          <Input
            label="Age"
            type="number"
            value={form.age}
            onChange={(e) => set("age", Number(e.target.value))}
          />
          <Input
            label="Height (cm)"
            type="number"
            value={form.heightCm}
            onChange={(e) => set("heightCm", Number(e.target.value))}
          />
          <Input
            label="Weight (kg)"
            type="number"
            value={form.weightKg}
            step={0.5}
            onChange={(e) => set("weightKg", Number(e.target.value))}
          />
        </section>

        {/* Goal */}
        <section className="space-y-3">
          <h3 className="font-display font-bold text-[#f0ede8]">Primary goal</h3>
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
        </section>

        {/* Injuries */}
        <section className="space-y-3">
          <h3 className="font-display font-bold text-[#f0ede8]">Injuries</h3>
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
        </section>

        {msg && (
          <p className="text-center text-sm text-[#c8f060]">{msg}</p>
        )}

        <div className="space-y-3 pt-2">
          <Button loading={saving} onClick={saveProfile} variant="secondary">
            Save changes
          </Button>
          <Button loading={regenerating} onClick={regenerate}>
            Regenerate my plan
          </Button>
        </div>
      </div>
    </main>
  );
}
