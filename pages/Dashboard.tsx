import React from 'react';
import { KPICards } from '../components/KPICards';
import { ExpenseForm } from '../components/ExpenseForm';
import { Charts } from '../components/Charts';
import { TransactionList } from '../components/TransactionList';
import { Card } from '../components/ui/Card';

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tableau de bord</h1>
           <p className="text-gray-500 dark:text-gray-400">Vue d'ensemble de vos finances</p>
        </div>
      </div>
      
      <KPICards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Charts />
          <TransactionList limit={5} />
        </div>
        
        <div className="lg:col-span-1">
          <Card title="Nouvelle Dépense" className="sticky top-6">
            <ExpenseForm />
          </Card>
        </div>
      </div>
    </div>
  );
};