import React, { useState, useMemo } from 'react';
import { useBudget } from '../context/BudgetContext';
import { Card } from '../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency } from '../utils/helpers';
import { Calendar, Filter } from 'lucide-react';

type Period = 'week' | 'month' | 'quarter' | 'year';

export const Analysis: React.FC = () => {
  const { expenses, settings } = useBudget();
  const [period, setPeriod] = useState<Period>('month');

  const chartData = useMemo(() => {
    const data: Record<string, number> = {};
    
    // Sort expenses by date ascending first
    const sortedExpenses = [...expenses].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    sortedExpenses.forEach(expense => {
      const date = new Date(expense.date);
      let key = '';

      switch (period) {
        case 'week':
          // Simple week calculation
          const firstDay = new Date(date.getFullYear(), 0, 1);
          const pastDays = (date.getTime() - firstDay.getTime()) / 86400000;
          const weekNum = Math.ceil((pastDays + firstDay.getDay() + 1) / 7);
          key = `S${weekNum} ${date.getFullYear()}`;
          break;
        case 'month':
          key = date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
          break;
        case 'quarter':
          const q = Math.floor(date.getMonth() / 3) + 1;
          key = `T${q} ${date.getFullYear()}`;
          break;
        case 'year':
          key = date.getFullYear().toString();
          break;
      }

      data[key] = (data[key] || 0) + expense.amount;
    });

    // Convert to array and take last 12 entries to avoid overcrowding
    return Object.keys(data).map(key => ({
      name: key,
      amount: data[key]
    })).slice(-12);
  }, [expenses, period]);

  const averageSpending = useMemo(() => {
    if (chartData.length === 0) return 0;
    const total = chartData.reduce((sum, item) => sum + item.amount, 0);
    return total / chartData.length;
  }, [chartData]);

  const maxSpending = useMemo(() => {
      if (chartData.length === 0) return 0;
      return Math.max(...chartData.map(d => d.amount));
  }, [chartData]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analyse Temporelle</h1>
           <p className="text-gray-500 dark:text-gray-400">Visualisez vos dépenses sur différentes périodes</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 flex">
            {(['week', 'month', 'quarter', 'year'] as Period[]).map((p) => (
                <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                        period === p 
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300 shadow-sm' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                >
                    {p === 'week' && 'Hebdo'}
                    {p === 'month' && 'Mensuel'}
                    {p === 'quarter' && 'Trimestriel'}
                    {p === 'year' && 'Annuel'}
                </button>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2" title={`Évolution ${period === 'week' ? 'Hebdomadaire' : period === 'month' ? 'Mensuelle' : period === 'quarter' ? 'Trimestrielle' : 'Annuelle'}`}>
            <div className="h-[400px] w-full mt-4">
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} vertical={false} />
                        <XAxis dataKey="name" tick={{fontSize: 12}} stroke="#9CA3AF" />
                        <YAxis tick={{fontSize: 12}} stroke="#9CA3AF" />
                        <Tooltip 
                            formatter={(value: number) => formatCurrency(value, settings.currency)}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        />
                        <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Dépenses" />
                    </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                        <Calendar size={48} className="mb-2 opacity-50" />
                        <p>Pas assez de données pour cette période</p>
                    </div>
                )}
            </div>
          </Card>

          <div className="space-y-6">
              <Card title="Statistiques">
                  <div className="space-y-4">
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <p className="text-sm text-blue-600 dark:text-blue-300 mb-1">Moyenne par période</p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                              {formatCurrency(averageSpending, settings.currency)}
                          </p>
                      </div>
                      <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                          <p className="text-sm text-orange-600 dark:text-orange-300 mb-1">Pic de dépenses</p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                              {formatCurrency(maxSpending, settings.currency)}
                          </p>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                          <p className="text-sm text-gray-500 mb-1">Période analysée</p>
                          <p className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                             <Filter size={16} /> 
                             {chartData.length} dernières entrées
                          </p>
                      </div>
                  </div>
              </Card>
          </div>
      </div>
    </div>
  );
};