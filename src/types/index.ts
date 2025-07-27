export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'analyst';
  createdAt: string;
}

export interface HealthProfile {
  userId: string;
  height: number; // cm
  weight: number; // kg
  bmi: number;
  age: number;
  gender: 'male' | 'female' | 'other';
  sleepHours: number;
  waterIntake: number; // liters per day
  heartRate: number; // resting heart rate
  dailySteps: number;
  smokes: boolean;
  drinks: boolean;
  healthIssues: string[];
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  healthGoals: string[];
  medications: string[];
  lastUpdated: string;
}

export interface Recommendation {
  id: string;
  type: 'water' | 'exercise' | 'sleep' | 'nutrition' | 'general';
  title: string;
  description: string;
  schedule?: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  implemented: boolean;
  createdAt: string;
}

export interface WaterSchedule {
  time: string;
  amount: number; // ml
  reason: string;
}

export interface ExerciseRecommendation {
  name: string;
  duration: number; // minutes
  intensity: 'low' | 'medium' | 'high';
  time: string;
  category: string;
  instructions: string;
}

export interface SleepSchedule {
  bedtime: string;
  wakeTime: string;
  duration: number; // hours
  phases: {
    windDown: string;
    deepSleep: string;
    lightSleep: string;
  };
}

export interface HealthMetrics {
  date: string;
  weight: number;
  steps: number;
  waterIntake: number;
  sleepHours: number;
  heartRate: number;
  mood: number; // 1-10 scale
}