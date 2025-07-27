import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Heart, 
  User, 
  BarChart3, 
  Settings, 
  LogOut, 
  Activity,
  Droplet,
  Moon,
  Dumbbell
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  onViewChange: (view: string) => void;
}

export function Layout({ children, currentView, onViewChange }: LayoutProps) {
  const { user, logout } = useAuth();

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'profile', name: 'Health Profile', icon: User },
    { id: 'recommendations', name: 'Recommendations', icon: Heart },
    { id: 'water', name: 'Water Schedule', icon: Droplet },
    { id: 'exercise', name: 'Exercise Plan', icon: Dumbbell },
    { id: 'sleep', name: 'Sleep Schedule', icon: Moon },
  ];

  if (user?.role === 'admin') {
    navigation.push({ id: 'admin', name: 'Admin Panel', icon: Settings });
  }

  if (user?.role === 'analyst') {
    navigation.push({ id: 'analytics', name: 'Analytics', icon: Activity });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex h-16 items-center justify-center border-b border-gray-200">
          <Heart className="h-8 w-8 text-teal-600" />
          <span className="ml-2 text-xl font-bold text-gray-900">HealthAI</span>
        </div>
        
        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => onViewChange(item.id)}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      currentView === item.id
                        ? 'bg-teal-100 text-teal-700 border-r-2 border-teal-600'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center px-4 py-3 bg-gray-100 rounded-lg">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-teal-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
            <button
              onClick={logout}
              className="ml-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="ml-64">
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}