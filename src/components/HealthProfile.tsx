import React, { useState, useEffect } from 'react';
import { HealthProfile } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { Save, User, Activity, Heart, AlertTriangle } from 'lucide-react';

interface HealthProfileProps {
  profile: HealthProfile | null;
  onProfileUpdate: (profile: HealthProfile) => void;
}

export function HealthProfileComponent({ profile, onProfileUpdate }: HealthProfileProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState<Partial<HealthProfile>>({
    height: 170,
    weight: 70,
    age: 30,
    gender: 'male',
    sleepHours: 8,
    waterIntake: 2,
    heartRate: 70,
    dailySteps: 8000,
    smokes: false,
    drinks: false,
    healthIssues: [],
    activityLevel: 'moderate',
    healthGoals: [],
    medications: []
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const calculateBMI = (height: number, weight: number) => {
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-600' };
    if (bmi < 25) return { category: 'Normal', color: 'text-green-600' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-600' };
    return { category: 'Obese', color: 'text-red-600' };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);

    const bmi = calculateBMI(formData.height || 170, formData.weight || 70);
    
    const updatedProfile: HealthProfile = {
      ...formData,
      userId: user.id,
      bmi,
      lastUpdated: new Date().toISOString()
    } as HealthProfile;

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onProfileUpdate(updatedProfile);
    setIsSaving(false);
  };

  const handleHealthIssueToggle = (issue: string) => {
    const current = formData.healthIssues || [];
    const updated = current.includes(issue)
      ? current.filter(i => i !== issue)
      : [...current, issue];
    
    setFormData({ ...formData, healthIssues: updated });
  };

  const handleHealthGoalToggle = (goal: string) => {
    const current = formData.healthGoals || [];
    const updated = current.includes(goal)
      ? current.filter(g => g !== goal)
      : [...current, goal];
    
    setFormData({ ...formData, healthGoals: updated });
  };

  const currentBMI = calculateBMI(formData.height || 170, formData.weight || 70);
  const bmiInfo = getBMICategory(currentBMI);

  const commonHealthIssues = [
    'Diabetes', 'Hypertension', 'Heart Disease', 'Asthma', 'Arthritis',
    'High Cholesterol', 'Anxiety', 'Depression', 'Sleep Apnea', 'Allergies'
  ];

  const healthGoals = [
    'Weight Loss', 'Weight Gain', 'Muscle Building', 'Cardiovascular Health',
    'Better Sleep', 'Stress Reduction', 'Increased Energy', 'Flexibility',
    'Quit Smoking', 'Reduce Alcohol', 'Better Nutrition', 'Pain Management'
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <User className="h-6 w-6 text-teal-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Health Profile</h2>
          </div>
          <p className="text-gray-600 mt-2">
            Complete your health profile to receive personalized recommendations
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={formData.height || ''}
                  onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="170"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  value={formData.weight || ''}
                  onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="70"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  value={formData.age || ''}
                  onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="30"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  value={formData.gender || 'male'}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Activity Level
                </label>
                <select
                  value={formData.activityLevel || 'moderate'}
                  onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="sedentary">Sedentary</option>
                  <option value="light">Light Activity</option>
                  <option value="moderate">Moderate Activity</option>
                  <option value="active">Active</option>
                  <option value="very_active">Very Active</option>
                </select>
              </div>
            </div>

            {/* BMI Display */}
            {formData.height && formData.weight && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">BMI:</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-gray-900">
                      {currentBMI.toFixed(1)}
                    </span>
                    <span className={`ml-2 font-medium ${bmiInfo.color}`}>
                      {bmiInfo.category}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Health Metrics */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Health Metrics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sleep Hours/Night
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.sleepHours || ''}
                  onChange={(e) => setFormData({ ...formData, sleepHours: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="8"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Water Intake (L/day)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.waterIntake || ''}
                  onChange={(e) => setFormData({ ...formData, waterIntake: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resting Heart Rate
                </label>
                <input
                  type="number"
                  value={formData.heartRate || ''}
                  onChange={(e) => setFormData({ ...formData, heartRate: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="70"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Daily Steps
                </label>
                <input
                  type="number"
                  value={formData.dailySteps || ''}
                  onChange={(e) => setFormData({ ...formData, dailySteps: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="8000"
                />
              </div>
            </div>
          </div>

          {/* Lifestyle */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Heart className="h-5 w-5 mr-2" />
              Lifestyle
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="smokes"
                  checked={formData.smokes || false}
                  onChange={(e) => setFormData({ ...formData, smokes: e.target.checked })}
                  className="h-4 w-4 text-teal-600 rounded focus:ring-teal-500"
                />
                <label htmlFor="smokes" className="ml-2 text-sm font-medium text-gray-700">
                  I smoke tobacco
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="drinks"
                  checked={formData.drinks || false}
                  onChange={(e) => setFormData({ ...formData, drinks: e.target.checked })}
                  className="h-4 w-4 text-teal-600 rounded focus:ring-teal-500"
                />
                <label htmlFor="drinks" className="ml-2 text-sm font-medium text-gray-700">
                  I consume alcohol regularly
                </label>
              </div>
            </div>
          </div>

          {/* Health Issues */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Health Conditions
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {commonHealthIssues.map((issue) => (
                <div key={issue} className="flex items-center">
                  <input
                    type="checkbox"
                    id={issue}
                    checked={(formData.healthIssues || []).includes(issue)}
                    onChange={() => handleHealthIssueToggle(issue)}
                    className="h-4 w-4 text-teal-600 rounded focus:ring-teal-500"
                  />
                  <label htmlFor={issue} className="ml-2 text-sm text-gray-700">
                    {issue}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Health Goals */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Goals</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {healthGoals.map((goal) => (
                <div key={goal} className="flex items-center">
                  <input
                    type="checkbox"
                    id={goal}
                    checked={(formData.healthGoals || []).includes(goal)}
                    onChange={() => handleHealthGoalToggle(goal)}
                    className="h-4 w-4 text-teal-600 rounded focus:ring-teal-500"
                  />
                  <label htmlFor={goal} className="ml-2 text-sm text-gray-700">
                    {goal}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              <Save className="h-5 w-5 mr-2" />
              {isSaving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}