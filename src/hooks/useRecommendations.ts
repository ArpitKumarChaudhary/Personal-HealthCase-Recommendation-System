import { useState, useEffect } from 'react';
import { HealthProfile, Recommendation, WaterSchedule, ExerciseRecommendation, SleepSchedule } from '../types';

export function useRecommendations(profile: HealthProfile | null) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [waterSchedule, setWaterSchedule] = useState<WaterSchedule[]>([]);
  const [exerciseRecs, setExerciseRecs] = useState<ExerciseRecommendation[]>([]);
  const [sleepSchedule, setSleepSchedule] = useState<SleepSchedule | null>(null);

  useEffect(() => {
    if (!profile) return;

    // Generate water schedule based on profile
    const waterSched = generateWaterSchedule(profile);
    setWaterSchedule(waterSched);

    // Generate exercise recommendations
    const exercises = generateExerciseRecommendations(profile);
    setExerciseRecs(exercises);

    // Generate sleep schedule
    const sleep = generateSleepSchedule(profile);
    setSleepSchedule(sleep);

    // Generate general recommendations
    const recs = generateRecommendations(profile);
    setRecommendations(recs);
  }, [profile]);

  return {
    recommendations,
    waterSchedule,
    exerciseRecs,
    sleepSchedule,
  };
}

function generateWaterSchedule(profile: HealthProfile): WaterSchedule[] {
  const baseWater = Math.max(2000, profile.weight * 35); // ml per day
  const activityMultiplier = {
    sedentary: 1,
    light: 1.1,
    moderate: 1.2,
    active: 1.3,
    very_active: 1.4
  };
  
  const totalWater = baseWater * activityMultiplier[profile.activityLevel];
  const sessions = 8;
  const perSession = Math.round(totalWater / sessions);

  return [
    { time: '07:00', amount: perSession, reason: 'Morning hydration boost' },
    { time: '09:00', amount: perSession, reason: 'Pre-workout hydration' },
    { time: '11:00', amount: perSession, reason: 'Mid-morning replenishment' },
    { time: '13:00', amount: perSession, reason: 'Lunch hydration' },
    { time: '15:00', amount: perSession, reason: 'Afternoon energy' },
    { time: '17:00', amount: perSession, reason: 'Pre-dinner hydration' },
    { time: '19:00', amount: perSession, reason: 'Evening hydration' },
    { time: '21:00', amount: perSession / 2, reason: 'Light evening sip' },
  ];
}

function generateExerciseRecommendations(profile: HealthProfile): ExerciseRecommendation[] {
  const exercises: ExerciseRecommendation[] = [];
  
  // Cardio recommendations based on BMI and health issues
  if (profile.bmi > 25) {
    exercises.push({
      name: 'Brisk Walking',
      duration: 30,
      intensity: 'medium',
      time: '07:00',
      category: 'Cardio',
      instructions: 'Walk at a pace where you can still hold a conversation'
    });
  }

  // Strength training for overall health
  exercises.push({
    name: 'Bodyweight Exercises',
    duration: 20,
    intensity: profile.age > 50 ? 'low' : 'medium',
    time: '18:00',
    category: 'Strength',
    instructions: 'Include push-ups, squats, and planks. Start with 3 sets of 10.'
  });

  // Flexibility based on age and activity level
  exercises.push({
    name: 'Stretching & Yoga',
    duration: 15,
    intensity: 'low',
    time: '21:00',
    category: 'Flexibility',
    instructions: 'Focus on major muscle groups. Hold each stretch for 30 seconds.'
  });

  return exercises;
}

function generateSleepSchedule(profile: HealthProfile): SleepSchedule {
  const optimalSleep = profile.age < 25 ? 8.5 : profile.age < 65 ? 8 : 7.5;
  const bedtime = profile.sleepHours < optimalSleep ? '22:00' : '22:30';
  const wakeTime = profile.sleepHours < optimalSleep ? '06:30' : '07:00';

  return {
    bedtime,
    wakeTime,
    duration: optimalSleep,
    phases: {
      windDown: '21:00',
      deepSleep: '23:00-02:00',
      lightSleep: '05:00-07:00'
    }
  };
}

function generateRecommendations(profile: HealthProfile): Recommendation[] {
  const recs: Recommendation[] = [];

  // BMI-based recommendations
  if (profile.bmi > 25) {
    recs.push({
      id: '1',
      type: 'nutrition',
      title: 'Weight Management',
      description: 'Focus on portion control and increase fiber intake. Aim for 500-calorie deficit daily.',
      priority: 'high',
      category: 'Weight Loss',
      implemented: false,
      createdAt: new Date().toISOString()
    });
  }

  // Heart rate recommendations
  if (profile.heartRate > 100) {
    recs.push({
      id: '2',
      type: 'general',
      title: 'Heart Rate Management',
      description: 'Consider stress reduction techniques and consult with healthcare provider.',
      priority: 'high',
      category: 'Cardiovascular',
      implemented: false,
      createdAt: new Date().toISOString()
    });
  }

  // Steps recommendations
  if (profile.dailySteps < 8000) {
    recs.push({
      id: '3',
      type: 'exercise',
      title: 'Increase Daily Activity',
      description: 'Aim for 10,000 steps daily. Take stairs, park farther, or walk during calls.',
      schedule: 'Throughout the day',
      priority: 'medium',
      category: 'Activity',
      implemented: false,
      createdAt: new Date().toISOString()
    });
  }

  // Smoking/drinking recommendations
  if (profile.smokes) {
    recs.push({
      id: '4',
      type: 'general',
      title: 'Smoking Cessation',
      description: 'Consider joining a smoking cessation program. Your health will improve within weeks.',
      priority: 'high',
      category: 'Lifestyle',
      implemented: false,
      createdAt: new Date().toISOString()
    });
  }

  return recs;
}