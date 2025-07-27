// import React from 'react';
import { HealthProfile, HealthMetrics } from '../types';
import { 
  Activity, 
  Heart, 
  Droplet, 
  Moon, 
  TrendingUp, 
  Target,
  Clock,
  CheckCircle
} from 'lucide-react';

interface DashboardProps {
  profile: HealthProfile | null;
}

export function Dashboard({ profile }: DashboardProps) {
  // Mock health metrics for the last 7 days
  const mockMetrics: HealthMetrics[] = [
    { date: '2024-01-15', weight: 75, steps: 8500, waterIntake: 2.1, sleepHours: 7.5, heartRate: 72, mood: 8 },
    { date: '2024-01-16', weight: 74.8, steps: 9200, waterIntake: 2.3, sleepHours: 8, heartRate: 70, mood: 9 },
    { date: '2024-01-17', weight: 74.9, steps: 7800, waterIntake: 2.0, sleepHours: 7, heartRate: 75, mood: 7 },
    { date: '2024-01-18', weight: 74.7, steps: 10500, waterIntake: 2.5, sleepHours: 8.5, heartRate: 68, mood: 9 },
    { date: '2024-01-19', weight: 74.5, steps: 9800, waterIntake: 2.2, sleepHours: 7.5, heartRate: 71, mood: 8 },
    { date: '2024-01-20', weight: 74.6, steps: 8900, waterIntake: 2.4, sleepHours: 8, heartRate: 69, mood: 8 },
    { date: '2024-01-21', weight: 74.4, steps: 11200, waterIntake: 2.6, sleepHours: 8.5, heartRate: 67, mood: 9 },
  ];

  const latestMetrics = mockMetrics[mockMetrics.length - 1];

  const stats = [
    {
      name: 'Current Weight',
      value: profile ? `${profile.weight} kg` : 'Not set',
      change: profile ? '-0.6 kg this week' : '',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      name: 'Daily Steps',
      value: latestMetrics ? latestMetrics.steps.toLocaleString() : '0',
      change: '+12% from last week',
      changeType: 'positive',
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      name: 'Water Intake',
      value: `${latestMetrics?.waterIntake || 0}L`,
      change: 'Goal: 2.5L daily',
      changeType: 'neutral',
      icon: Droplet,
      color: 'text-teal-600',
      bgColor: 'bg-teal-100'
    },
    {
      name: 'Sleep Quality',
      value: `${latestMetrics?.sleepHours || 0}h`,
      change: 'Optimal range',
      changeType: 'positive',
      icon: Moon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  const todayGoals = [
    { task: 'Drink 2.5L water', completed: true, icon: Droplet },
    { task: '10,000 steps', completed: true, icon: Activity },
    { task: '30min exercise', completed: false, icon: Target },
    { task: '8h sleep', completed: false, icon: Moon },
  ];

  if (!profile) {
    return (
      <div className="text-center py-12">
        <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Welcome to HealthAI</h2>
        <p className="text-gray-600 mb-6">Complete your health profile to get personalized recommendations</p>
        <button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
          Set Up Profile
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Health Dashboard</h1>
        <p className="text-gray-600 mt-2">Track your progress and stay on top of your health goals</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  {stat.change && (
                    <p className={`text-sm mt-2 ${
                      stat.changeType === 'positive' ? 'text-green-600' :
                      stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-500'
                    }`}>
                      {stat.change}
                    </p>
                  )}
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Goals */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Goals</h3>
          <div className="space-y-4">
            {todayGoals.map((goal, index) => {
              const Icon = goal.icon;
              return (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Icon className="h-5 w-5 text-gray-400 mr-3" />
                    <span className={`font-medium ${goal.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                      {goal.task}
                    </span>
                  </div>
                  {goal.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Clock className="h-5 w-5 text-gray-300" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Health Score */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Score</h3>
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center w-32 h-32 mb-4">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-gray-200"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - 0.85)}`}
                  className="text-green-500"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-gray-900">85</span>
              </div>
            </div>
            <p className="text-lg font-medium text-gray-900">Excellent</p>
            <p className="text-sm text-gray-600 mt-2">
              Your health metrics are looking great! Keep up the good work.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Progress</h3>
        <div className="grid grid-cols-7 gap-2">
          {mockMetrics.map((metric, index) => (
            <div key={index} className="text-center">
              <div className="text-xs text-gray-500 mb-2">
                {new Date(metric.date).toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div className="space-y-2">
                <div 
                  className="bg-blue-500 rounded-sm mx-auto"
                  style={{ 
                    height: `${(metric.steps / 12000) * 60}px`,
                    width: '16px'
                  }}
                  title={`${metric.steps} steps`}
                />
                <div className="text-xs text-gray-600">{Math.round(metric.steps / 1000)}k</div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-4">
          <span className="text-sm text-gray-500">Daily Steps</span>
        </div>
      </div>
    </div>
  );
}