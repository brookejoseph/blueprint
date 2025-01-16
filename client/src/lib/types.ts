export interface UserFormData {
  name: string;
  age: number;
  weight?: number;
  height?: number;
  gender: string;
  improvementAreas: string[];
  budget: string;
  equipment: string[];
}

export interface RoutineData {
  supplements: SupplementPlan[];
  diet: DietPlan;
  exercise: ExercisePlan;
  sleepSchedule: SleepSchedule;
  metrics: MetricsConfig;
}

export interface SupplementPlan {
  name: string;
  dosage: string;
  timing: string;
  cost: number;
}

export interface DietPlan {
  meals: string[];
  restrictions: string[];
  schedule: string[];
  estimatedCost: {
    daily: number;
    monthly: number;
  };
}

export interface ExercisePlan {
  type: string;
  frequency: string;
  duration: string;
  requiredEquipment: string[];
}

export interface SleepSchedule {
  bedtime: string;
  wakeTime: string;
  sleepGoal: number;
  requiredItems: string[];
}

export interface MetricsConfig {
  trackWeight: boolean;
  trackSleep: boolean;
  trackSteps: boolean;
  trackSupplements: boolean;
}

export const IMPROVEMENT_AREAS = [
  { id: "sleep", label: "Sleep Optimization", icon: "moon" },
  { id: "skin", label: "Skin Health", icon: "sparkles" },
  { id: "fitness", label: "Physical Fitness", icon: "dumbbell" },
  { id: "mood", label: "Mental Clarity & Mood", icon: "brain" },
  { id: "longevity", label: "Longevity", icon: "infinity" },
  { id: "diet", label: "Nutrition & Diet", icon: "apple" }
] as const;

export const BUDGET_RANGES = [
  { value: "essential", label: "Essential ($100-300/month)" },
  { value: "moderate", label: "Moderate ($300-800/month)" },
  { value: "comprehensive", label: "Comprehensive ($800+/month)" }
] as const;

export const AVAILABLE_EQUIPMENT = [
  { id: "treadmill", label: "Treadmill" },
  { id: "weights", label: "Free Weights" },
  { id: "bike", label: "Exercise Bike" },
  { id: "bands", label: "Resistance Bands" },
  { id: "mat", label: "Yoga Mat" },
  { id: "none", label: "No Equipment" }
] as const;