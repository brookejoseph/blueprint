export interface UserFormData {
  name: string;
  age: number;
  weight?: number;
  height?: number;
  gender: string;
  activityLevel: string;
  healthGoals: string[];
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
}

export interface DietPlan {
  meals: string[];
  restrictions: string[];
  schedule: string[];
}

export interface ExercisePlan {
  type: string;
  frequency: string;
  duration: string;
}

export interface SleepSchedule {
  bedtime: string;
  wakeTime: string;
  sleepGoal: number;
}

export interface MetricsConfig {
  trackWeight: boolean;
  trackSleep: boolean;
  trackSteps: boolean;
  trackSupplements: boolean;
}
