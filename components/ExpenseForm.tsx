import React, { useState, useEffect } from 'react';
import { useBudget } from '../context/BudgetContext';
import { Category, PaymentMethod, ExpenseType } from '../types';
import { getCategoryIcon, determineDefaultType } from '../utils/helpers';
import { PlusCircle } from 'lucide-react';

export const ExpenseForm: React.FC = () => {
  const { addExpense } = useBudget();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>(Category.FOOD);
  const [type, setType] = useState<ExpenseType>(ExpenseType.VARIABLE); // State pour le type
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CARD);
  const [showSuccess, setShowSuccess] = useState(false);

  // Auto-update type when category changes
  useEffect(() => {
      setType(determineDefaultType(category));
  }, [category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    addExpense({
      amount: parseFloat(amount),
      description: description || 'Dépense',
      category,
      type, // Envoi du type
      date: new Date(date).toISOString(),
      paymentMethod,
    });

    // Reset form
    setAmount('');
    setDescription('');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Montant</label>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              placeholder="0.00"
            />
            <span className="absolute right-3 top-2 text-gray-400">€</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Catégorie</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-primary-500 outline-none transition-all appearance-none"
          >
            {Object.values(Category).map((c) => (
              <option key={c} value={c}>
                {getCategoryIcon(c)} {c}
              </option>
            ))}
          </select>
        </div>

        <div>
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type de dépense</label>
             <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                 {Object.values(ExpenseType).map((t) => (
                     <button
                        type="button"
                        key={t}
                        onClick={() => setType(t)}
                        className={`flex-1 text-xs py-1.5 rounded-md transition-all ${
                            type === t 
                            ? 'bg-white dark:bg-gray-600 shadow-sm text-primary-600 dark:text-primary-400 font-medium' 
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                        }`}
                     >
                         {t}
                     </button>
                 ))}
             </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Méthode & Description</label>
        <div className="flex gap-2">
            <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-1/3 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-primary-500 outline-none"
            >
                {Object.values(PaymentMethod).map((m) => (
                <option key={m} value={m}>{m}</option>
                ))}
            </select>
            <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-2/3 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-primary-500 outline-none"
            placeholder="Ex: Déjeuner collègues"
            />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <PlusCircle size={20} />
        Ajouter la dépense
      </button>

      {showSuccess && (
        <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm text-center animate-pulse">
          Dépense ajoutée avec succès !
        </div>
      )}
    </form>
  );
};