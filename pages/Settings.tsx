import React from 'react';
import { useBudget } from '../context/BudgetContext';
import { Card } from '../components/ui/Card';
import { Download, RefreshCw, Moon, Sun, Bell } from 'lucide-react';
import { downloadCSV } from '../utils/helpers';

export const Settings: React.FC = () => {
  const { settings, updateSettings, expenses, resetData } = useBudget();

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Paramètres</h1>
        <p className="text-gray-500 dark:text-gray-400">Personnalisez votre expérience</p>
      </div>

      <Card title="Préférences Générales">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
             <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white">Budget Mensuel</label>
                <p className="text-sm text-gray-500">Votre objectif de dépenses maximum par mois.</p>
             </div>
             <div className="flex items-center gap-2">
                <input 
                    type="number" 
                    value={settings.monthlyBudget}
                    onChange={(e) => updateSettings({ monthlyBudget: Number(e.target.value) })}
                    className="w-32 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 dark:text-white"
                />
                <span className="text-gray-500">{settings.currency}</span>
             </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t dark:border-gray-700">
             <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white">Devise</label>
                <p className="text-sm text-gray-500">Symbole monétaire affiché.</p>
             </div>
             <select 
                value={settings.currency}
                onChange={(e) => updateSettings({ currency: e.target.value })}
                className="w-32 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 dark:text-white"
             >
                 <option value="EUR">EUR (€)</option>
                 <option value="USD">USD ($)</option>
                 <option value="GBP">GBP (£)</option>
                 <option value="CHF">CHF</option>
             </select>
          </div>

          <div className="flex items-center justify-between pt-4 border-t dark:border-gray-700">
             <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white">Apparence</label>
                <p className="text-sm text-gray-500">Basculer entre le mode clair et sombre.</p>
             </div>
             <button 
                onClick={() => updateSettings({ darkMode: !settings.darkMode })}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${settings.darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'}`}
             >
                 {settings.darkMode ? <Moon size={18} /> : <Sun size={18} />}
                 {settings.darkMode ? 'Mode Sombre' : 'Mode Clair'}
             </button>
          </div>
        </div>
      </Card>

      <Card title="Notifications et Alertes">
          <div className="space-y-6">
              <div className="flex items-center justify-between">
                  <div>
                      <label className="block text-sm font-medium text-gray-900 dark:text-white">Alertes de Budget</label>
                      <p className="text-sm text-gray-500">Recevoir une notification quand le budget est presque atteint.</p>
                  </div>
                  <button
                      onClick={() => updateSettings({ enableBudgetAlerts: !settings.enableBudgetAlerts })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${settings.enableBudgetAlerts ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'}`}
                  >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.enableBudgetAlerts ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
              </div>

              {settings.enableBudgetAlerts && (
                  <div className="pt-4 border-t dark:border-gray-700 animate-fade-in">
                      <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                          Seuil d'alerte : {settings.budgetAlertThreshold}%
                      </label>
                      <input
                          type="range"
                          min="50"
                          max="100"
                          step="5"
                          value={settings.budgetAlertThreshold}
                          onChange={(e) => updateSettings({ budgetAlertThreshold: Number(e.target.value) })}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-primary-600"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>50%</span>
                          <span>75%</span>
                          <span>100%</span>
                      </div>
                  </div>
              )}
          </div>
      </Card>

      <Card title="Gestion des Données">
         <div className="space-y-4">
            <button 
                onClick={() => downloadCSV(expenses)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200"
            >
                <Download size={20} />
                Exporter les données (CSV)
            </button>

            <button 
                onClick={() => {
                    if(confirm('Êtes-vous sûr de vouloir réinitialiser toutes les données avec des données de démonstration ?')) {
                        resetData();
                    }
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400"
            >
                <RefreshCw size={20} />
                Réinitialiser avec données démo
            </button>
         </div>
      </Card>
    </div>
  );
};