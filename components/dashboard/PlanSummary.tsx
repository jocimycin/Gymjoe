import { PlanContent } from "@/types";

export function PlanSummary({ plan }: { plan: PlanContent }) {
  return (
    <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-4 space-y-3">
      <h2 className="font-display font-bold text-lg text-[#f0ede8] leading-tight">
        {plan.plan_title}
      </h2>
      <p className="text-sm text-[#6b6b6b] leading-relaxed">{plan.summary}</p>
      <div className="flex gap-3 pt-1">
        <div className="flex-1 bg-[#1e1e1e] rounded-xl p-3 text-center">
          <p className="text-xs text-[#6b6b6b] mb-1">BMI</p>
          <p className="font-display font-bold text-[#f0ede8]">
            {plan.bmi.toFixed(1)}
          </p>
        </div>
        <div className="flex-1 bg-[#1e1e1e] rounded-xl p-3 text-center">
          <p className="text-xs text-[#6b6b6b] mb-1">Deficit</p>
          <p className="font-display font-bold text-[#c8f060]">
            {plan.weekly_deficit_target > 0
              ? `-${plan.weekly_deficit_target} kcal`
              : "Surplus"}
          </p>
        </div>
        <div className="flex-1 bg-[#1e1e1e] rounded-xl p-3 text-center">
          <p className="text-xs text-[#6b6b6b] mb-1">Phases</p>
          <p className="font-display font-bold text-[#f0ede8]">3 × 4wk</p>
        </div>
      </div>
    </div>
  );
}
