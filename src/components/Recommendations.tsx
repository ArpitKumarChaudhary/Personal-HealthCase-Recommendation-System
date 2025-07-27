import React, { useState } from 'react';
import { useRecommendations } from '../hooks/useRecommendations';
import { HealthProfile } from '../types';
import { 
  Heart, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Lightbulb,
  Target,
  TrendingUp
} from 'lucide-react';

interface RecommendationsProps {
  profile: HealthProfile | null;
}

export function Recommendations({ profile }: RecommendationsProps) {
  const { recommendations } = useRecommendations(profile);
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  if (!profile) {
    return (
      <div className="text-center py-12">
        <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Profile Found</h2>
        <p className="text-gray-600">Complete your health profile to receive personalized recommendations</p>
      </div>
    );
  }

  const filteredRecommendations = filter === 'all' 
    ? recommendations 
    : recommendations.filter(rec => rec.priority === filter);

  const priorityColors = {
    high: 'border-red-200 bg-red-50',
    medium: 'border-yellow-200 bg-yellow-50',
    low: 'border-green-200 bg-green-50'
  };

  const priorityIcons = {
    high: AlertTriangle,
    medium: Clock,
    low: Lightbulb
  };

  const typeIcons = {
    water: '💧',
    exercise: '🏃‍♂️',
    sleep: '😴',
    nutrition: '🍎',
    general: '💡'
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Personalized Recommendations</h1>
        <p className="text-gray-600 mt-2">AI-powered suggestions based on your health profile</p>
      </div>

      {/* Health Summary Card */}
      <div className="bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-2">Health Analysis</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="font-medium">BMI</div>
                <div className="text-white/90">{profile.bmi.toFixed(1)}</div>
              </div>
              <div>
                <div className="font-medium">Activity</div>
                <div className="text-white/90 capitalize">{profile.activityLevel}</div>
              </div>
              <div>
                <div className="font-medium">Sleep</div>
                <div className="text-white/90">{profile.sleepHours}h/night</div>
              </div>
              <div>
                <div className="font-medium">Steps</div>
                <div className="text-white/90">{profile.dailySteps.toLocaleString()}/day</div>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <TrendingUp className="h-16 w-16 text-white/70" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        {[
          { key: 'all', label: 'All' },
          { key: 'high', label: 'High Priority' },
          { key: 'medium', label: 'Medium' },
          { key: 'low', label: 'Low Priority' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === tab.key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRecommendations.map((rec) => {
          const PriorityIcon = priorityIcons[rec.priority];
          return (
            <div
              key={rec.id}
              className={`bg-white rounded-xl shadow-sm border-2 p-6 ${priorityColors[rec.priority]}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{typeIcons[rec.type]}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                    <span className="text-sm text-gray-500 capitalize">{rec.category}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <PriorityIcon className={`h-5 w-5 ${
                    rec.priority === 'high' ? 'text-red-500' :
                    rec.priority === 'medium' ? 'text-yellow-500' : 'text-green-500'
                  }`} />
                </div>
              </div>

              <p className="text-gray-700 mb-4">{rec.description}</p>

              {rec.schedule && (
                <div className="bg-white/50 rounded-lg p-3 mb-4">
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="font-medium">Schedule: </span>
                    <span className="ml-1">{rec.schedule}</span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  rec.priority === 'high' ? 'bg-red-100 text-red-700' :
                  rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)} Priority
                </span>
                
                <button
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    rec.implemented
                      ? 'bg-green-100 text-green-700 cursor-default'
                      : 'bg-teal-600 text-white hover:bg-teal-700'
                  }`}
                  disabled={rec.implemented}
                >
                  {rec.implemented ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Implemented
                    </>
                  ) : (
                    <>
                      <Target className="h-4 w-4 mr-2" />
                      Start Now
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredRecommendations.length === 0 && (
        <div className="text-center py-12">
          <Lightbulb className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Recommendations</h3>
          <p className="text-gray-600">No recommendations found for the selected priority level.</p>
        </div>
      )}
    </div>
  );
}