import React, { useMemo } from 'react';
import { useBudget } from '../context/BudgetContext';
import { Card } from '../components/ui/Card';
import { ExpenseType } from '../types';
import { formatCurrency, getExpenseTypeColor } from '../utils/helpers';
import { Target, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

export const Forecast: React.FC = () => {
  const { settings, updateSettings, expenses } = useBudget();

  // Calculate actual spending per type for current month
  const actuals = useMemo(() => {
      const now = new Date();
      const currentExpenses = expenses.filter(e => {
          const d = new Date(e.date);
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      });

      return {
          [ExpenseType.FIXED]: currentExpenses.filter(e => e.type === ExpenseType.FIXED).reduce((sum, e) => sum + e.amount, 0),
          [ExpenseType.VARIABLE]: currentExpenses.filter(e => e.type === ExpenseType.VARIABLE).reduce((sum, e) => sum + e.amount, 0),
          [ExpenseType.SAVINGS]: currentExpenses.filter(e => e.type === ExpenseType.SAVINGS).reduce((sum, e) => sum + e.amount, 0),
      };
  }, [expenses]);

  const totalBudget = settings.budgetTargets[ExpenseType.FIXED] + settings.budgetTargets[ExpenseType.VARIABLE] + settings.budgetTargets[ExpenseType.SAVINGS];
  const totalActual = actuals[ExpenseType.FIXED] + actuals[ExpenseType.VARIABLE] + actuals[ExpenseType.SAVINGS];
  const savingsCapacity = settings.monthlyIncome - settings.budgetTargets[ExpenseType.FIXED] - settings.budgetTargets[ExpenseType.VARIABLE];

  const handleBudgetChange = (type: ExpenseType, value: number) => {
      updateSettings({
          budgetTargets: {
              ...settings.budgetTargets,
              [type]: value
          }
      });
  };

  return (
    <div className="space-y-6 animate-fade-in">
        <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Prévisionnel & Objectifs</h1>
            <p className="text-gray-500 dark:text-gray-400">Planifiez vos dépenses et suivez vos objectifs mensuels.</p>
        </div>

        {/* Section 1: Définition du Plan */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card title="1. Mes Revenus" className="border-l-4 border-green-500">
                <div className="space-y-4">
                    <p className="text-sm text-gray-500">Revenu mensuel net estimé</p>
                    <div className="flex items-center gap-2">
                        <input 
                            type="number" 
                            value={settings.monthlyIncome}
                            onChange={(e) => updateSettings({ monthlyIncome: Number(e.target.value) })}
                            className="w-full text-2xl font-bold bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-green-500 outline-none p-1"
                        />
                        <span className="text-gray-400">{settings.currency}</span>
                    </div>
                </div>
            </Card>

            <Card title="2. Mes Objectifs" className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {Object.values(ExpenseType).map((type) => (
                        <div key={type} className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: getExpenseTypeColor(type) }}></span>
                                {type}
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={settings.budgetTargets[type]}
                                    onChange={(e) => handleBudgetChange(type, Number(e.target.value))}
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 outline-none"
                                />
                                <span className="absolute right-3 top-2 text-gray-400 text-sm">{settings.currency}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-4 pt-4 border-t dark:border-gray-700 flex justify-between items-center text-sm">
                    <span className="text-gray-500">Total Budget Planifié:</span>
                    <span className={`font-bold ${totalBudget > settings.monthlyIncome ? 'text-red-500' : 'text-green-600'}`}>
                        {formatCurrency(totalBudget, settings.currency)} / {formatCurrency(settings.monthlyIncome, settings.currency)}
                    </span>
                </div>
            </Card>
        </div>

        {/* Section 2: Analyse du Plan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <Card>
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600">
                        <Target size={24} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800 dark:text-white">Capacité d'Épargne Théorique</h3>
                        <p className="text-xs text-gray-500">Revenus - (Fixe + Variable)</p>
                    </div>
                </div>
                <div className="text-center py-2">
                    <span className="text-3xl font-bold text-gray-800 dark:text-white">
                        {formatCurrency(savingsCapacity, settings.currency)}
                    </span>
                    <p className="text-sm text-gray-500 mt-1">
                        soit {((savingsCapacity / settings.monthlyIncome) * 100).toFixed(1)}% de vos revenus
                    </p>
                </div>
             </Card>

             <Card>
                 <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800 dark:text-white">Reste à Vivre Réel</h3>
                        <p className="text-xs text-gray-500">Revenus - Dépenses actuelles</p>
                    </div>
                </div>
                <div className="text-center py-2">
                    <span className={`text-3xl font-bold ${settings.monthlyIncome - totalActual < 0 ? 'text-red-500' : 'text-gray-800 dark:text-white'}`}>
                        {formatCurrency(settings.monthlyIncome - totalActual, settings.currency)}
                    </span>
                    <p className="text-sm text-gray-500 mt-1">disponible sur votre compte</p>
                </div>
             </Card>
        </div>

        {/* Section 3: Suivi Réel vs Prévisionnel */}
        <Card title="Suivi en Temps Réel (Ce mois)">
            <div className="space-y-6">
                {Object.values(ExpenseType).map((type) => {
                    const target = settings.budgetTargets[type];
                    const current = actuals[type];
                    const percent = target > 0 ? (current / target) * 100 : 0;
                    const isOver = current > target;

                    return (
                        <div key={type}>
                            <div className="flex justify-between items-end mb-1">
                                <span className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                    {type}
                                    {isOver && <AlertCircle size={14} className="text-red-500" />}
                                    {!isOver && percent >= 100 && <CheckCircle size={14} className="text-green-500" />}
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    <span className={`font-semibold ${isOver ? 'text-red-500' : 'text-gray-800 dark:text-gray-200'}`}>
                                        {formatCurrency(current, settings.currency)}
                                    </span>
                                    {' / '}
                                    {formatCurrency(target, settings.currency)}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                                <div 
                                    className="h-2.5 rounded-full transition-all duration-500"
                                    style={{ 
                                        width: `${Math.min(percent, 100)}%`,
                                        backgroundColor: isOver ? '#EF4444' : getExpenseTypeColor(type)
                                    }}
                                ></div>
                            </div>
                        </div>
                    );
                })}

                 <div className="pt-4 border-t dark:border-gray-700 mt-4">
                     <div className="flex justify-between items-center font-bold text-gray-900 dark:text-white">
                         <span>TOTAL</span>
                         <span>
                             {formatCurrency(totalActual, settings.currency)} / {formatCurrency(totalBudget, settings.currency)}
                         </span>
                     </div>
                     <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mt-2 overflow-hidden">
                        <div 
                            className={`h-4 rounded-full transition-all duration-500 ${totalActual > totalBudget ? 'bg-red-500' : 'bg-gray-800 dark:bg-gray-100'}`}
                            style={{ width: `${Math.min((totalActual / totalBudget) * 100, 100)}%` }}
                        ></div>
                     </div>
                 </div>
            </div>
        </Card>
    </div>
  );
};