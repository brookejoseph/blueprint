import { z } from 'zod';

export interface UserFormData {
  name: string;
  age: number;
  weight?: number;
  height?: number;
  gender: string;
  improvementAreas: string[];
  budget: string;
  equipment: string[];
  currentHealth: string[];
}

export interface EmbeddedSection {
  title: string;
  content: string;
  url: string;
}

export interface RoutineData {
  supplements: SupplementPlan[];
  diet: DietPlan;
  exercise: ExercisePlan;
  sleepSchedule: SleepSchedule;
  metrics: MetricsConfig;
  protocolLinks: {
    supplements: string;
    exercise: string;
    diet: string;
    sleep: string;
    testing: string;
  };
  embeddedSections: EmbeddedSection[];
}

export interface SupplementPlan {
  name: string;
  dosage: string;
  timing: string;
  cost: number;
  reference?: string;
}

export interface DietPlan {
  meals: string[];
  restrictions: string[];
  schedule: string[];
  estimatedCost: {
    daily: number;
    monthly: number;
  };
  reference?: string;
}

export interface ExercisePlan {
  type: string;
  frequency: string;
  duration: string;
  requiredEquipment: string[];
  reference?: string;
}

export interface SleepSchedule {
  bedtime: string;
  wakeTime: string;
  sleepGoal: number;
  requiredItems: string[];
  reference?: string;
}

export interface MetricsConfig {
  trackWeight: boolean;
  trackSleep: boolean;
  trackSteps: boolean;
  trackSupplements: boolean;
  reference?: string;
}

export const IMPROVEMENT_AREAS = [
  { id: "biological-age", label: "Biological Age Reduction", icon: "hourglass" },
  { id: "brain", label: "Brain Health & Cognition", icon: "brain" },
  { id: "sleep", label: "Sleep Optimization", icon: "moon" },
  { id: "fitness", label: "Physical Performance", icon: "dumbbell" },
  { id: "longevity", label: "Longevity & Aging", icon: "infinity" },
  { id: "hormones", label: "Hormone Optimization", icon: "activity" }
] as const;

export const BUDGET_RANGES = [
  { value: "starter", label: "Starter ($500-1000/month)" },
  { value: "intermediate", label: "Intermediate ($1000-2500/month)" },
  { value: "advanced", label: "Advanced ($2500-5000/month)" },
  { value: "comprehensive", label: "Comprehensive ($5000+/month)" }
] as const;

export const AVAILABLE_EQUIPMENT = [
  { id: "red-light", label: "Red Light Therapy Device" },
  { id: "cgm", label: "Continuous Glucose Monitor" },
  { id: "oura", label: "Sleep Tracking Ring" },
  { id: "hyperbaric", label: "Hyperbaric Chamber" },
  { id: "infrared-sauna", label: "Infrared Sauna" },
  { id: "cold-plunge", label: "Cold Plunge" },
  { id: "peptide-injections", label: "Peptide Injections" },
  { id: "blood-testing", label: "Regular Blood Testing" },
  { id: "dexa", label: "DEXA Scan Access" },
  { id: "none", label: "None of the above" }
] as const;

export const CURRENT_HEALTH = [
  { id: "supplements", label: "Taking Supplements" },
  { id: "tracking-sleep", label: "Tracking Sleep" },
  { id: "tracking-glucose", label: "Monitoring Blood Glucose" },
  { id: "regular-exercise", label: "Regular Exercise" },
  { id: "strict-diet", label: "Following Strict Diet" },
  { id: "blood-tests", label: "Regular Blood Tests" }
] as const;