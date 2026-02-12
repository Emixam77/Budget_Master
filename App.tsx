import React, { useState } from 'react';
import { BudgetProvider } from './context/BudgetContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { History } from './pages/History';
import { Settings } from './pages/Settings';
import { Analysis } from './pages/Analysis';
import { Simulator } from './pages/Simulator';
import { Forecast } from './pages/Forecast';
import { LandingPage } from './pages/LandingPage';
import { BudgetAlert } from './components/BudgetAlert';
import { Loader2 } from 'lucide-react';

const AppContent = () => {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="animate-spin text-primary-600" size={48} />
      </div>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'forecast':
        return <Forecast />;
      case 'analysis':
        return <Analysis />;
      case 'history':
        return <History />;
      case 'simulator':
        return <Simulator />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <BudgetProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Navbar currentView={currentView} setView={setCurrentView} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BudgetAlert />
          {renderView()}
        </main>
      </div>
    </BudgetProvider>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;