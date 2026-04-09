"use client";

import { useState } from "react";
import { NutritionDay } from "@/types";

interface NutritionPanelProps {
  nutrition: {
    workout_day: NutritionDay;
    rest_day: NutritionDay;
    ground_rules: string[];
  };
}

function MacroBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex-1 bg-[#1e1e1e] rounded-xl p-3 text-center">
      <p className="text-xs text-[#6b6b6b] mb-1">{label}</p>
      <p className={`font-display font-bold text-sm ${color}`}>{value}g</p>
    </div>
  );
}

function DayNutrition({ day }: { day: NutritionDay }) {
  return (
    <div className="space-y-4">
      <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-4">
        <p className="text-2xl font-display font-bold text-[#f0ede8] mb-1">
          {day.calories.toLocaleString()}
          <span className="text-sm text-[#6b6b6b] font-body font-normal ml-1">
            kcal
          </span>
        </p>
        <div className="flex gap-2 mt-3">
          <MacroBar label="Protein" value={day.protein_g} color="text-[#60c8f0]" />
          <MacroBar label="Carbs" value={day.carbs_g} color="text-[#f0a060]" />
          <MacroBar label="Fat" value={day.fat_g} color="text-[#6b6b6b]" />
        </div>
      </div>

      <div className="space-y-2">
        {day.meals.map((meal, i) => (
          <div
            key={i}
            className="bg-[#141414] border border-[#1e1e1e] rounded-xl p-3"
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <div>
                <p className="font-display font-bold text-sm text-[#f0ede8]">
                  {meal.name}
                </p>
                <p className="text-[10px] text-[#6b6b6b]">{meal.timing}</p>
              </div>
              <span className="text-xs font-bold text-[#c8f060] flex-shrink-0">
                {meal.kcal} kcal
              </span>
            </div>
            <p className="text-xs text-[#6b6b6b] leading-relaxed">
              {meal.description}
            </p>
            <div className="flex gap-3 mt-2 text-[10px] text-[#6b6b6b]">
              <span className="text-[#60c8f0]">{meal.protein_g}g P</span>
              <span className="text-[#f0a060]">{meal.carbs_g}g C</span>
              <span>{meal.fat_g}g F</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function NutritionPanel({ nutrition }: NutritionPanelProps) {
  const [tab, setTab] = useState<"workout" | "rest" | "rules">("workout");

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(["workout", "rest", "rules"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-xl font-display font-bold text-xs capitalize border transition-colors ${
              tab === t
                ? "bg-[#c8f060]/10 border-[#c8f060]/40 text-[#c8f060]"
                : "bg-[#141414] border-[#1e1e1e] text-[#6b6b6b]"
            }`}
          >
            {t === "rules" ? "Principles" : `${t} day`}
          </button>
        ))}
      </div>

      {tab === "workout" && <DayNutrition day={nutrition.workout_day} />}
      {tab === "rest" && <DayNutrition day={nutrition.rest_day} />}
      {tab === "rules" && (
        <ul className="space-y-2">
          {nutrition.ground_rules.map((rule, i) => (
            <li
              key={i}
              className="flex gap-3 bg-[#141414] border border-[#1e1e1e] rounded-xl p-3"
            >
              <span className="text-[#c8f060] font-display font-bold text-sm flex-shrink-0">
                {i + 1}.
              </span>
              <p className="text-sm text-[#f0ede8]/80 leading-relaxed">{rule}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
