import React, { useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { useBudget } from '../context/BudgetContext';
import { Card } from './ui/Card';
import { getCategoryColor } from '../utils/helpers';
import { Category } from '../types';

export const Charts: React.FC = () => {
  const { expenses, settings } = useBudget();

  // 1. Data for Pie Chart (Expenses by Category)
  const categoryData = useMemo(() => {
    const data: Record<string, number> = {};
    const now = new Date();
    const currentMonthExpenses = expenses.filter(e => {
        const d = new Date(e.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });

    currentMonthExpenses.forEach(e => {
      data[e.category] = (data[e.category] || 0) + e.amount;
    });
    return Object.keys(data).map(key => ({ name: key, value: data[key] }));
  }, [expenses]);

  // 2. Data for Bar Chart (Last 7 Days)
  const dailyData = useMemo(() => {
      const data: any[] = [];
      const today = new Date();
      for (let i = 6; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(d.getDate() - i);
          const dateStr = d.toLocaleDateString('fr-FR', { weekday: 'short' });
          
          const dailyTotal = expenses
            .filter(e => new Date(e.date).toDateString() === d.toDateString())
            .reduce((sum, e) => sum + e.amount, 0);
          
          data.push({ name: dateStr, amount: dailyTotal });
      }
      return data;
  }, [expenses]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <Card title="Répartition par Catégorie (Ce mois)">
        <div className="h-[300px] w-full">
            {categoryData.length > 0 ? (
                 <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={categoryData}
                     cx="50%"
                     cy="50%"
                     innerRadius={60}
                     outerRadius={80}
                     paddingAngle={5}
                     dataKey="value"
                   >
                     {categoryData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={getCategoryColor(entry.name as Category)} />
                     ))}
                   </Pie>
                   <Tooltip 
                     formatter={(value: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: settings.currency }).format(value)}
                   />
                   <Legend />
                 </PieChart>
               </ResponsiveContainer>
            ) : (
                <div className="h-full flex items-center justify-center text-gray-400">Pas de données ce mois-ci</div>
            )}
         
        </div>
      </Card>

      <Card title="Dépenses des 7 derniers jours">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} vertical={false} />
              <XAxis dataKey="name" tick={{fontSize: 12}} />
              <YAxis tick={{fontSize: 12}} />
              <Tooltip 
                 formatter={(value: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: settings.currency }).format(value)}
                 cursor={{fill: 'transparent'}}
              />
              <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};