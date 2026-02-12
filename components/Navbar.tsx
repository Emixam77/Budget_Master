import React from 'react';
import { LayoutDashboard, History as HistoryIcon, Settings as SettingsIcon, Wallet, BarChart2, Calculator, Target, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentView: string;
  setView: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setView }) => {
  const { logout } = useAuth();
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'forecast', label: 'Prévisionnel', icon: Target },
    { id: 'analysis', label: 'Analyse', icon: BarChart2 },
    { id: 'history', label: 'Historique', icon: HistoryIcon },
    { id: 'simulator', label: 'Simulateur', icon: Calculator },
    { id: 'settings', label: 'Paramètres', icon: SettingsIcon },
  ];

  return (
    <nav className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-600 rounded-lg text-white">
                <Wallet size={24} />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400 hidden sm:block">
              BudgetMaster
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1 sm:space-x-4 overflow-x-auto no-scrollbar">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setView(item.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                      isActive
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="hidden md:inline">{item.label}</span>
                  </button>
                );
              })}
            </div>
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2 hidden md:block"></div>
            <button 
              onClick={logout}
              className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
              title="Se déconnecter"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};