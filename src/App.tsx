import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Auth } from './components/Auth';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { HealthProfileComponent } from './components/HealthProfile';
import { Recommendations } from './components/Recommendations';
import { WaterSchedule } from './components/WaterSchedule';
import { ExercisePlan } from './components/ExercisePlan';
import { HealthProfile } from './types';

function AppContent() {
  const { user, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [profile, setProfile] = useState<HealthProfile | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard profile={profile} />;
      case 'profile':
        return <HealthProfileComponent profile={profile} onProfileUpdate={setProfile} />;
      case 'recommendations':
        return <Recommendations profile={profile} />;
      case 'water':
        return <WaterSchedule profile={profile} />;
      case 'exercise':
        return <ExercisePlan profile={profile} />;
      case 'sleep':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Sleep Schedule</h2>
            <p className="text-gray-600">Coming soon...</p>
          </div>
        );
      case 'admin':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Admin Panel</h2>
            <p className="text-gray-600">Coming soon...</p>
          </div>
        );
      case 'analytics':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Analytics</h2>
            <p className="text-gray-600">Coming soon...</p>
          </div>
        );
      default:
        return <Dashboard profile={profile} />;
    }
  };

  return (
    <Layout currentView={currentView} onViewChange={setCurrentView}>
      {renderCurrentView()}
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;