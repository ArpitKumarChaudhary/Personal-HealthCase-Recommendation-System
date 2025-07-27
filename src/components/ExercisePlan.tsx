import React, { useState } from 'react';
import { useRecommendations } from '../hooks/useRecommendations';
import { HealthProfile } from '../types';
import { 
  Dumbbell, 
  Clock, 
  Target, 
  Play, 
  Pause, 
  CheckCircle,
  Heart,
  Zap,
  Activity,
  Calendar,
  Timer,
  TrendingUp
} from 'lucide-react';

interface ExercisePlanProps {
  profile: HealthProfile | null;
}

interface WorkoutSession {
  id: string;
  name: string;
  duration: number;
  exercises: Exercise[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  focus: string;
  calories: number;
}

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  duration?: number;
  restTime: number;
  instructions: string;
  targetMuscles: string[];
  equipment: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export function ExercisePlan({ profile }: ExercisePlanProps) {
  const { exerciseRecs } = useRecommendations(profile);
  const [selectedDay, setSelectedDay] = useState(0);
  const [activeWorkout, setActiveWorkout] = useState<string | null>(null);
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());

  if (!profile) {
    return (
      <div className="text-center py-12">
        <Dumbbell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Profile Found</h2>
        <p className="text-gray-600">Complete your health profile to get your personalized exercise plan</p>
      </div>
    );
  }

  // Generate weekly workout plan based on profile
  const generateWeeklyPlan = (): WorkoutSession[] => {
    const workouts: WorkoutSession[] = [];
    const userLevel = profile.activityLevel === 'sedentary' ? 'beginner' : 
                     profile.activityLevel === 'light' || profile.activityLevel === 'moderate' ? 'intermediate' : 'advanced';
    
    // Day 1: Full Body Strength
    workouts.push({
      id: 'day1',
      name: 'Full Body Strength',
      duration: profile.age > 50 ? 30 : 45,
      difficulty: userLevel,
      focus: 'Strength Building',
      calories: profile.weight * 0.5 * (profile.age > 50 ? 30 : 45) / 60,
      exercises: [
        {
          name: 'Push-ups',
          sets: userLevel === 'beginner' ? 2 : userLevel === 'intermediate' ? 3 : 4,
          reps: userLevel === 'beginner' ? '5-8' : userLevel === 'intermediate' ? '8-12' : '12-15',
          restTime: 60,
          instructions: 'Keep your body straight, lower chest to ground, push back up',
          targetMuscles: ['Chest', 'Shoulders', 'Triceps'],
          equipment: 'None',
          difficulty: userLevel === 'beginner' ? 'easy' : 'medium'
        },
        {
          name: 'Bodyweight Squats',
          sets: userLevel === 'beginner' ? 2 : 3,
          reps: userLevel === 'beginner' ? '8-10' : '12-15',
          restTime: 60,
          instructions: 'Feet shoulder-width apart, lower hips back and down, return to standing',
          targetMuscles: ['Quadriceps', 'Glutes', 'Hamstrings'],
          equipment: 'None',
          difficulty: 'easy'
        },
        {
          name: 'Plank',
          sets: 2,
          reps: '30-60 seconds',
          restTime: 60,
          instructions: 'Hold straight line from head to heels, engage core',
          targetMuscles: ['Core', 'Shoulders'],
          equipment: 'None',
          difficulty: 'medium'
        }
      ]
    });

    // Day 2: Cardio
    workouts.push({
      id: 'day2',
      name: 'Cardio Blast',
      duration: profile.bmi > 25 ? 35 : 30,
      difficulty: userLevel,
      focus: 'Cardiovascular Health',
      calories: profile.weight * 0.8 * (profile.bmi > 25 ? 35 : 30) / 60,
      exercises: [
        {
          name: 'Brisk Walking',
          sets: 1,
          reps: '20-30 minutes',
          duration: profile.bmi > 25 ? 30 : 20,
          restTime: 0,
          instructions: 'Maintain a pace where you can still hold a conversation',
          targetMuscles: ['Legs', 'Cardiovascular'],
          equipment: 'None',
          difficulty: 'easy'
        },
        {
          name: 'Jumping Jacks',
          sets: 3,
          reps: userLevel === 'beginner' ? '10-15' : '20-30',
          restTime: 45,
          instructions: 'Jump feet apart while raising arms overhead, return to start',
          targetMuscles: ['Full Body', 'Cardiovascular'],
          equipment: 'None',
          difficulty: 'medium'
        }
      ]
    });

    // Day 3: Flexibility & Recovery
    workouts.push({
      id: 'day3',
      name: 'Flexibility & Recovery',
      duration: 25,
      difficulty: 'beginner',
      focus: 'Flexibility & Mobility',
      calories: profile.weight * 0.2 * 25 / 60,
      exercises: [
        {
          name: 'Cat-Cow Stretch',
          sets: 2,
          reps: '10-15',
          restTime: 30,
          instructions: 'On hands and knees, arch and round your back slowly',
          targetMuscles: ['Spine', 'Core'],
          equipment: 'None',
          difficulty: 'easy'
        },
        {
          name: 'Child\'s Pose',
          sets: 2,
          reps: '30-60 seconds',
          restTime: 30,
          instructions: 'Kneel and sit back on heels, stretch arms forward',
          targetMuscles: ['Back', 'Shoulders'],
          equipment: 'None',
          difficulty: 'easy'
        }
      ]
    });

    return workouts;
  };

  const weeklyPlan = generateWeeklyPlan();
  const currentWorkout = weeklyPlan[selectedDay];

  const toggleExerciseComplete = (exerciseName: string) => {
    const newCompleted = new Set(completedExercises);
    if (newCompleted.has(exerciseName)) {
      newCompleted.delete(exerciseName);
    } else {
      newCompleted.add(exerciseName);
    }
    setCompletedExercises(newCompleted);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getIntensityIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return <Zap className="h-4 w-4" />;
      case 'intermediate': return <Activity className="h-4 w-4" />;
      case 'advanced': return <TrendingUp className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Exercise Plan</h1>
        <p className="text-gray-600 mt-2">Your personalized workout routine based on your health profile</p>
      </div>

      {/* Profile Summary */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-2">Fitness Profile</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="font-medium">Activity Level</div>
                <div className="text-white/90 capitalize">{profile.activityLevel.replace('_', ' ')}</div>
              </div>
              <div>
                <div className="font-medium">BMI</div>
                <div className="text-white/90">{profile.bmi.toFixed(1)}</div>
              </div>
              <div>
                <div className="font-medium">Daily Steps</div>
                <div className="text-white/90">{profile.dailySteps.toLocaleString()}</div>
              </div>
              <div>
                <div className="font-medium">Heart Rate</div>
                <div className="text-white/90">{profile.heartRate} bpm</div>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <Dumbbell className="h-16 w-16 text-white/70" />
          </div>
        </div>
      </div>

      {/* Weekly Schedule */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Schedule</h3>
        <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
            const workout = weeklyPlan[index % weeklyPlan.length];
            const isSelected = selectedDay === index;
            const isRestDay = index >= weeklyPlan.length;
            
            return (
              <button
                key={day}
                onClick={() => !isRestDay && setSelectedDay(index)}
                className={`p-3 rounded-lg text-center transition-all ${
                  isSelected
                    ? 'bg-purple-100 border-2 border-purple-500 text-purple-700'
                    : isRestDay
                      ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                }`}
                disabled={isRestDay}
              >
                <div className="font-medium text-sm">{day}</div>
                <div className="text-xs mt-1">
                  {isRestDay ? 'Rest' : workout?.name.split(' ')[0]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Workout */}
      {currentWorkout && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{currentWorkout.name}</h3>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {currentWorkout.duration} min
                </div>
                <div className="flex items-center">
                  <Heart className="h-4 w-4 mr-1" />
                  {Math.round(currentWorkout.calories)} cal
                </div>
                <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  currentWorkout.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                  currentWorkout.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {getIntensityIcon(currentWorkout.difficulty)}
                  <span className="ml-1 capitalize">{currentWorkout.difficulty}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setActiveWorkout(activeWorkout === currentWorkout.id ? null : currentWorkout.id)}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                activeWorkout === currentWorkout.id
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              {activeWorkout === currentWorkout.id ? (
                <>
                  <Pause className="h-5 w-5 mr-2" />
                  Stop Workout
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 mr-2" />
                  Start Workout
                </>
              )}
            </button>
          </div>

          {/* Exercise List */}
          <div className="space-y-4">
            {currentWorkout.exercises.map((exercise, index) => {
              const isCompleted = completedExercises.has(exercise.name);
              
              return (
                <div
                  key={index}
                  className={`border-2 rounded-xl p-6 transition-all ${
                    isCompleted 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h4 className="text-lg font-semibold text-gray-900 mr-3">
                          {index + 1}. {exercise.name}
                        </h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                          {exercise.difficulty}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                        <div>
                          <span className="font-medium">Sets:</span> {exercise.sets}
                        </div>
                        <div>
                          <span className="font-medium">Reps:</span> {exercise.reps}
                        </div>
                        <div>
                          <span className="font-medium">Rest:</span> {exercise.restTime}s
                        </div>
                        <div>
                          <span className="font-medium">Equipment:</span> {exercise.equipment}
                        </div>
                      </div>

                      <p className="text-gray-700 mb-3">{exercise.instructions}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        {exercise.targetMuscles.map((muscle, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                          >
                            {muscle}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => toggleExerciseComplete(exercise.name)}
                      className={`ml-4 p-3 rounded-full transition-colors ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                      }`}
                    >
                      <CheckCircle className="h-6 w-6" />
                    </button>
                  </div>

                  {activeWorkout === currentWorkout.id && (
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <button className="flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors">
                            <Timer className="h-4 w-4 mr-2" />
                            Start Timer
                          </button>
                          <span className="text-sm text-gray-600">
                            Rest: {exercise.restTime} seconds
                          </span>
                        </div>
                        <button
                          onClick={() => toggleExerciseComplete(exercise.name)}
                          className="text-purple-600 hover:text-purple-700 font-medium"
                        >
                          {isCompleted ? 'Mark Incomplete' : 'Mark Complete'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Progress Tracking */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Progress</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Exercises Completed</span>
              <span className="font-semibold">
                {completedExercises.size}/{currentWorkout?.exercises.length || 0}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${currentWorkout ? (completedExercises.size / currentWorkout.exercises.length) * 100 : 0}%` 
                }}
              />
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Estimated Calories</span>
              <span>{Math.round((currentWorkout?.calories || 0) * (completedExercises.size / (currentWorkout?.exercises.length || 1)))}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <Calendar className="h-5 w-5 text-purple-600 mr-2" />
              <span className="font-medium text-purple-700">Schedule Workout</span>
            </button>
            <button className="w-full flex items-center justify-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <Target className="h-5 w-5 text-green-600 mr-2" />
              <span className="font-medium text-green-700">Set Fitness Goal</span>
            </button>
            <button className="w-full flex items-center justify-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
              <span className="font-medium text-blue-700">View Progress</span>
            </button>
          </div>
        </div>
      </div>

      {/* Exercise Tips */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Exercise Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start">
            <div className="p-2 bg-purple-100 rounded-lg mr-3">
              <Heart className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Listen to your body</p>
              <p className="text-sm text-gray-600">Stop if you feel pain or excessive fatigue</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <Clock className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Stay consistent</p>
              <p className="text-sm text-gray-600">Regular exercise is better than intense sporadic sessions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}