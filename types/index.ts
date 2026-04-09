export interface Exercise {
  name: string;
  sets: string;
  rest_seconds: number;
  how_to: string;
  injury_notes: string | null;
  safe_tags: string[];
  youtube_search: string;
}

export interface Stretch {
  name: string;
  duration: string;
  how_to: string;
  targets: string[];
}

export interface WorkoutDay {
  day_label: string;
  focus: string;
  exercises: Exercise[];
}

export interface Phase {
  phase_number: number;
  label: string;
  weeks: string;
  description: string;
  days: WorkoutDay[];
}

export interface Meal {
  name: string;
  timing: string;
  kcal: number;
  description: string;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}

export interface NutritionDay {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  meals: Meal[];
}

export interface PlanContent {
  plan_title: string;
  summary: string;
  bmi: number;
  weekly_deficit_target: number;
  phases: Phase[];
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
  nutrition: {
    workout_day: NutritionDay;
    rest_day: NutritionDay;
    ground_rules: string[];
  };
}

export interface ProfileFormData {
  age: number;
  heightCm: number;
  weightKg: number;
  gender: string;
  fitnessGoal: string;
  experienceLevel: string;
  daysPerWeek: number;
  equipment: string;
  injuries: string[];
  activityLevel: string;
}

export const INJURY_OPTIONS = [
  { id: "lower_back", label: "Lower back pain or injury" },
  { id: "left_knee", label: "Left knee injury" },
  { id: "right_knee", label: "Right knee injury" },
  { id: "both_knees", label: "Both knees" },
  { id: "left_shoulder", label: "Left shoulder" },
  { id: "right_shoulder", label: "Right shoulder" },
  { id: "both_shoulders", label: "Both shoulders" },
  { id: "neck", label: "Neck or cervical spine" },
  { id: "hip", label: "Hip (labrum, bursitis, impingement)" },
  { id: "ankle", label: "Ankle (sprain, instability)" },
  { id: "wrist", label: "Wrist or forearm" },
  { id: "none", label: "No injuries — fully healthy" },
] as const;

export const LOADING_MESSAGES = [
  "Analysing your profile...",
  "Selecting exercises for your goals...",
  "Adapting for your injury history...",
  "Building your 3-phase programme...",
  "Calculating nutrition targets...",
  "Finalising your plan...",
];
