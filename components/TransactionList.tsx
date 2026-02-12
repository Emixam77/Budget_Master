import React, { useState } from 'react';
import { useBudget } from '../context/BudgetContext';
import { Card } from './ui/Card';
import { formatDate, formatCurrency, getCategoryIcon, getExpenseTypeColor } from '../utils/helpers';
import { Trash2, Search, Filter } from 'lucide-react';
import { Category } from '../types';

interface Props {
  limit?: number;
  showFilters?: boolean;
}

export const TransactionList: React.FC<Props> = ({ limit, showFilters = false }) => {
  const { expenses, deleteExpense, settings } = useBudget();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredExpenses = expenses.filter(e => {
    const matchesSearch = e.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          e.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || e.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const displayExpenses = limit ? filteredExpenses.slice(0, limit) : filteredExpenses;

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {limit ? 'Dernières Transactions' : 'Historique Complet'}
        </h3>
        
        {showFilters && (
            <div className="flex gap-2">
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Rechercher..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
                <div className="relative">
                     <Filter className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <select 
                        value={categoryFilter}
                        onChange={e => setCategoryFilter(e.target.value)}
                        className="pl-10 pr-8 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none"
                    >
                        <option value="all">Toutes catégories</option>
                        {Object.values(Category).map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>
            </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {displayExpenses.length > 0 ? (
                displayExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                    {formatDate(expense.date)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <div className="flex flex-col">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 w-fit">
                                {getCategoryIcon(expense.category)} {expense.category}
                            </span>
                            {expense.type && (
                                <span 
                                    className="text-[10px] uppercase font-bold mt-1 ml-1"
                                    style={{ color: getExpenseTypeColor(expense.type) }}
                                >
                                    {expense.type}
                                </span>
                            )}
                        </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200 font-medium">
                    {expense.description}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-semibold text-gray-900 dark:text-gray-100">
                    {formatCurrency(expense.amount, settings.currency)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                    <button 
                        onClick={() => deleteExpense(expense.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title="Supprimer"
                    >
                        <Trash2 size={16} />
                    </button>
                    </td>
                </tr>
                ))
            ) : (
                <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                        Aucune transaction trouvée
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {limit && filteredExpenses.length > limit && (
          <div className="mt-4 text-center">
              <span className="text-sm text-gray-500">Affichage des {limit} dernières transactions</span>
          </div>
      )}
    </Card>
  );
};