import React, { useMemo } from 'react';
import { useBudget } from '../context/BudgetContext';
import { formatCurrency } from '../utils/helpers';
import { TrendingDown, TrendingUp, Wallet, Calendar } from 'lucide-react';
import { Card } from './ui/Card';

export const KPICards: React.FC = () => {
  const { expenses, settings } = useBudget();

  const metrics = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const today = now.toDateString();

    const monthlyExpenses = expenses.filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const dailyExpenses = expenses.filter(e => new Date(e.date).toDateString() === today);

    const totalSpent = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);
    const dailyTotal = dailyExpenses.reduce((sum, e) => sum + e.amount, 0);
    const remaining = settings.monthlyBudget - totalSpent;
    const percent = Math.min((totalSpent / settings.monthlyBudget) * 100, 100);

    return { totalSpent, dailyTotal, remaining, percent };
  }, [expenses, settings.monthlyBudget]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="border-l-4 border-l-primary-500">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Dépensé ce mois</p>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
              {formatCurrency(metrics.totalSpent, settings.currency)}
            </h3>
          </div>
          <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg text-primary-600">
            <TrendingDown size={24} />
          </div>
        </div>
      </Card>

      <Card className="border-l-4 border-l-secondary-500">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Budget Restant</p>
            <h3 className={`text-2xl font-bold mt-1 ${metrics.remaining < 0 ? 'text-red-500' : 'text-gray-800 dark:text-white'}`}>
              {formatCurrency(metrics.remaining, settings.currency)}
            </h3>
          </div>
          <div className="p-2 bg-secondary-100 dark:bg-secondary-900/20 rounded-lg text-secondary-600">
            <Wallet size={24} />
          </div>
        </div>
        <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
          <div 
            className={`h-1.5 rounded-full ${metrics.percent > 90 ? 'bg-red-500' : 'bg-secondary-500'}`} 
            style={{ width: `${metrics.percent}%` }}
          ></div>
        </div>
      </Card>

      <Card className="border-l-4 border-l-purple-500">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Dépensé aujourd'hui</p>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
              {formatCurrency(metrics.dailyTotal, settings.currency)}
            </h3>
          </div>
          <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg text-purple-600">
            <Calendar size={24} />
          </div>
        </div>
      </Card>

      <Card className="border-l-4 border-l-orange-500">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">État du Budget</p>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
              {metrics.percent.toFixed(1)}%
            </h3>
          </div>
          <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg text-orange-600">
            <TrendingUp size={24} />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">de {formatCurrency(settings.monthlyBudget, settings.currency)}</p>
      </Card>
    </div>
  );
};