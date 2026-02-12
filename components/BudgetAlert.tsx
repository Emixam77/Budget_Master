import React, { useMemo } from 'react';
import { useBudget } from '../context/BudgetContext';
import { AlertTriangle, X } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

export const BudgetAlert: React.FC = () => {
  const { expenses, settings } = useBudget();

  const alertData = useMemo(() => {
    if (!settings.enableBudgetAlerts) return null;

    const now = new Date();
    const currentMonthExpenses = expenses.filter(e => {
        const d = new Date(e.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });

    const totalSpent = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
    const percentage = (totalSpent / settings.monthlyBudget) * 100;

    if (percentage >= settings.budgetAlertThreshold) {
      return {
        totalSpent,
        percentage,
        threshold: settings.budgetAlertThreshold
      };
    }
    return null;
  }, [expenses, settings]);

  if (!alertData) return null;

  return (
    <div className="bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 p-4 mb-6 rounded-r-lg animate-fade-in shadow-sm">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-orange-800 dark:text-orange-200">
            Attention : Seuil de budget atteint
          </h3>
          <div className="mt-1 text-sm text-orange-700 dark:text-orange-300">
            <p>
              Vous avez consommé <strong>{alertData.percentage.toFixed(1)}%</strong> de votre budget mensuel 
              ({formatCurrency(alertData.totalSpent, settings.currency)} sur {formatCurrency(settings.monthlyBudget, settings.currency)}).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};