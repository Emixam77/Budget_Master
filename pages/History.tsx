import React from 'react';
import { TransactionList } from '../components/TransactionList';

export const History: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Historique</h1>
        <p className="text-gray-500 dark:text-gray-400">Gérez et filtrez toutes vos transactions</p>
      </div>
      <TransactionList showFilters={true} />
    </div>
  );
};