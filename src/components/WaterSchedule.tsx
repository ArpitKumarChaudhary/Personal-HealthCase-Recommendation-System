import React, { useState } from 'react';
import { useRecommendations } from '../hooks/useRecommendations';
import { HealthProfile } from '../types';
import { Droplet, CheckCircle, Clock, Plus } from 'lucide-react';

interface WaterScheduleProps {
  profile: HealthProfile | null;
}

export function WaterSchedule({ profile }: WaterScheduleProps) {
  const { waterSchedule } = useRecommendations(profile);
  const [completedSlots, setCompletedSlots] = useState<Set<string>>(new Set());

  if (!profile) {
    return (
      <div className="text-center py-12">
        <Droplet className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Profile Found</h2>
        <p className="text-gray-600">Complete your health profile to get your personalized water schedule</p>
      </div>
    );
  }

  const toggleComplete = (time: string) => {
    const newCompleted = new Set(completedSlots);
    if (newCompleted.has(time)) {
      newCompleted.delete(time);
    } else {
      newCompleted.add(time);
    }
    setCompletedSlots(newCompleted);
  };

  const totalWater = waterSchedule.reduce((sum, slot) => sum + slot.amount, 0);
  const completedWater = waterSchedule
    .filter(slot => completedSlots.has(slot.time))
    .reduce((sum, slot) => sum + slot.amount, 0);

  const progressPercentage = (completedWater / totalWater) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Water Intake Schedule</h1>
        <p className="text-gray-600 mt-2">Stay hydrated with your personalized water schedule</p>
      </div>

      {/* Progress Card */}
      <div className="bg-gradient-to-r from-blue-500 to-teal-600 rounded-xl text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold">Today's Progress</h2>
            <p className="text-blue-100">
              {(completedWater / 1000).toFixed(1)}L of {(totalWater / 1000).toFixed(1)}L consumed
            </p>
          </div>
          <Droplet className="h-12 w-12 text-white/70" />
        </div>
        
        <div className="w-full bg-white/20 rounded-full h-3 mb-2">
          <div 
            className="bg-white rounded-full h-3 transition-all duration-300"
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          />
        </div>
        <p className="text-sm text-blue-100">
          {Math.round(progressPercentage)}% complete
        </p>
      </div>

      {/* Water Schedule Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {waterSchedule.map((slot, index) => {
          const isCompleted = completedSlots.has(slot.time);
          const isPast = new Date(`2024-01-01 ${slot.time}`) < new Date(`2024-01-01 ${new Date().toTimeString().slice(0, 5)}`);
          
          return (
            <div
              key={index}
              className={`bg-white rounded-xl shadow-sm border-2 p-6 transition-all ${
                isCompleted 
                  ? 'border-green-200 bg-green-50' 
                  : isPast 
                    ? 'border-red-200 bg-red-50'
                    : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${
                    isCompleted ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    <Droplet className={`h-5 w-5 ${
                      isCompleted ? 'text-green-600' : 'text-blue-600'
                    }`} />
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-gray-900">{slot.time}</p>
                    <p className="text-sm text-gray-500">{slot.amount}ml</p>
                  </div>
                </div>
                
                <button
                  onClick={() => toggleComplete(slot.time)}
                  className={`p-2 rounded-full transition-colors ${
                    isCompleted 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                  }`}
                >
                  <CheckCircle className="h-5 w-5" />
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-3">{slot.reason}</p>
              
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  isCompleted 
                    ? 'bg-green-100 text-green-700'
                    : isPast
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-700'
                }`}>
                  {isCompleted ? 'Completed' : isPast ? 'Missed' : 'Upcoming'}
                </span>
                
                {!isCompleted && (
                  <button
                    onClick={() => toggleComplete(slot.time)}
                    className="text-teal-600 hover:text-teal-700 text-sm font-medium"
                  >
                    Mark Done
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <Plus className="h-5 w-5 text-blue-600 mr-2" />
            <span className="font-medium text-blue-700">Log Extra Water</span>
          </button>
          <button className="flex items-center justify-center p-4 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors">
            <Clock className="h-5 w-5 text-teal-600 mr-2" />
            <span className="font-medium text-teal-700">Set Reminder</span>
          </button>
          <button className="flex items-center justify-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <span className="font-medium text-green-700">Mark All Done</span>
          </button>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hydration Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <Droplet className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Start your day with water</p>
              <p className="text-sm text-gray-600">Drink a glass as soon as you wake up</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="p-2 bg-teal-100 rounded-lg mr-3">
              <Clock className="h-4 w-4 text-teal-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Set regular reminders</p>
              <p className="text-sm text-gray-600">Use phone alerts to stay on schedule</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}