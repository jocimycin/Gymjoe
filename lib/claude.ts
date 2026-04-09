import Anthropic from "@anthropic-ai/sdk";
import { Profile } from "@prisma/client";

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export function buildPrompt(profile: Profile): string {
  const kneeInjury =
    profile.injuries.includes("left_knee") ||
    profile.injuries.includes("right_knee") ||
    profile.injuries.includes("both_knees");
  const backInjury = profile.injuries.includes("lower_back");
  const shoulderInjury =
    profile.injuries.includes("left_shoulder") ||
    profile.injuries.includes("right_shoulder") ||
    profile.injuries.includes("both_shoulders");

  return `You are an expert personal trainer and sports physiotherapist. Generate a complete, personalised 12-week workout plan for the following person.

USER PROFILE:
- Age: ${profile.age}
- Height: ${profile.heightCm}cm
- Weight: ${profile.weightKg}kg
- Gender: ${profile.gender || "not specified"}
- Primary goal: ${profile.fitnessGoal}
- Experience level: ${profile.experienceLevel}
- Days available per week: ${profile.daysPerWeek}
- Equipment access: ${profile.equipment}
- Activity level: ${profile.activityLevel}
- Current injuries or limitations: ${profile.injuries.length > 0 ? profile.injuries.join(", ") : "none"}

REQUIREMENTS:
1. Structure the plan into 3 phases of 4 weeks each (Phase 1: Foundation, Phase 2: Build, Phase 3: Peak/Burn)
2. For each phase, provide ${profile.daysPerWeek} workout days (label them Day A, Day B, etc.)
3. Each day must have 4-6 exercises with sets, reps, and tempo
4. Every exercise must include:
   - A clear "how_to" description (3-5 sentences, beginner-friendly)
   - injury_notes if relevant to their injuries
   - A "safe_tags" array (e.g. ["knee safe", "back safe"])
5. Include a separate stretch routine section: morning_routine, workout_day_stretches, rest_day_stretches
6. Include nutrition targets: workout_day and rest_day (calories, protein, carbs, fat)
7. Adapt ALL exercises to avoid aggravating listed injuries — suggest safer alternatives
8. For beginners, start very conservatively in Phase 1

CRITICAL INJURY RULES (apply strictly):
${kneeInjury ? "- No lunges, no deep squats past 90 degrees, no leg extensions. Use high box squats, leg press with high foot placement, sled work, stationary bike (seat high)." : ""}
${backInjury ? "- No sit-ups, no hyperextensions. Use dead bug, bird-dog, pallof press for core. Hip hinge form must be coached carefully." : ""}
${shoulderInjury ? "- No overhead pressing until Phase 2. Face pulls every upper body session. No behind-neck movements ever." : ""}

Respond ONLY with a valid JSON object matching this exact structure. No markdown, no preamble, no explanation outside the JSON:

{
  "plan_title": "string — personalised title",
  "summary": "string — 2-3 sentence overview for this person",
  "bmi": number,
  "weekly_deficit_target": number,
  "phases": [
    {
      "phase_number": 1,
      "label": "Foundation",
      "weeks": "1-4",
      "description": "string",
      "days": [
        {
          "day_label": "Day A",
          "focus": "string e.g. Lower body + core",
          "exercises": [
            {
              "name": "string",
              "sets": "string e.g. 3 x 10",
              "rest_seconds": 90,
              "how_to": "string — beginner-friendly step by step",
              "injury_notes": "string or null",
              "safe_tags": ["string"],
              "youtube_search": "string — optimised search query for YouTube"
            }
          ]
        }
      ]
    }
  ],
  "stretching": {
    "morning_routine": {
      "duration_minutes": 5,
      "description": "string",
      "stretches": [
        { "name": "string", "duration": "string", "how_to": "string", "targets": ["string"] }
      ]
    },
    "workout_day": {
      "warmup": [{ "name": "string", "duration": "string", "how_to": "string", "targets": ["string"] }],
      "cooldown": [{ "name": "string", "duration": "string", "how_to": "string", "targets": ["string"] }]
    },
    "rest_day": {
      "description": "string",
      "stretches": [{ "name": "string", "duration": "string", "how_to": "string", "targets": ["string"] }]
    }
  },
  "nutrition": {
    "workout_day": {
      "calories": number,
      "protein_g": number,
      "carbs_g": number,
      "fat_g": number,
      "meals": [
        { "name": "string", "timing": "string", "kcal": number, "description": "string", "protein_g": number, "carbs_g": number, "fat_g": number }
      ]
    },
    "rest_day": {
      "calories": number,
      "protein_g": number,
      "carbs_g": number,
      "fat_g": number,
      "meals": [
        { "name": "string", "timing": "string", "kcal": number, "description": "string", "protein_g": number, "carbs_g": number, "fat_g": number }
      ]
    },
    "ground_rules": ["string"]
  }
}`;
}
