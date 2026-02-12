import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { formatCurrency } from '../utils/helpers';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Calculator, Percent, Calendar, DollarSign } from 'lucide-react';
import { useBudget } from '../context/BudgetContext';

export const Simulator: React.FC = () => {
  const { settings } = useBudget();
  const [amount, setAmount] = useState<number>(200000);
  const [rate, setRate] = useState<number>(3.5);
  const [years, setYears] = useState<number>(20);
  
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);

  useEffect(() => {
    // Formula: M = P * (r * (1+r)^n) / ((1+r)^n - 1)
    const principal = amount;
    const monthlyRate = rate / 100 / 12;
    const numberOfPayments = years * 12;

    if (rate === 0) {
        const payment = principal / numberOfPayments;
        setMonthlyPayment(payment);
        setTotalInterest(0);
        setTotalCost(principal);
    } else {
        const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
        
        if (isFinite(payment)) {
            setMonthlyPayment(payment);
            const total = payment * numberOfPayments;
            setTotalCost(total);
            setTotalInterest(total - principal);
        }
    }
  }, [amount, rate, years]);

  const chartData = [
      { name: 'Capital Principal', value: amount },
      { name: 'Intérêts Totaux', value: totalInterest }
  ];

  const COLORS = ['#3b82f6', '#f59e0b'];

  return (
    <div className="space-y-6 animate-fade-in">
       <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Simulateur de Prêt</h1>
        <p className="text-gray-500 dark:text-gray-400">Estimez vos mensualités et le coût de votre crédit</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Détails du Prêt">
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Montant du prêt
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <DollarSign className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                    </div>
                    <input 
                        type="range" 
                        min="1000" max="1000000" step="1000" 
                        value={amount} 
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="w-full mt-2 accent-primary-600"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Taux d'intérêt annuel (%)
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Percent className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="number"
                            step="0.1"
                            value={rate}
                            onChange={(e) => setRate(Number(e.target.value))}
                            className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                    </div>
                    <input 
                        type="range" 
                        min="0.1" max="15" step="0.1" 
                        value={rate} 
                        onChange={(e) => setRate(Number(e.target.value))}
                        className="w-full mt-2 accent-primary-600"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Durée (années)
                    </label>
                    <div className="relative">
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="number"
                            value={years}
                            onChange={(e) => setYears(Number(e.target.value))}
                            className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                    </div>
                    <input 
                        type="range" 
                        min="1" max="30" step="1" 
                        value={years} 
                        onChange={(e) => setYears(Number(e.target.value))}
                        className="w-full mt-2 accent-primary-600"
                    />
                </div>
            </div>
        </Card>

        <div className="space-y-6">
            <Card className="bg-primary-50 dark:bg-gray-800 border-primary-200 dark:border-gray-700">
                <div className="text-center py-6">
                    <p className="text-gray-500 dark:text-gray-400 mb-2 font-medium uppercase tracking-wide text-xs">Mensualité Estimée</p>
                    <h2 className="text-5xl font-extrabold text-primary-600 dark:text-primary-400">
                        {formatCurrency(monthlyPayment, settings.currency)}
                    </h2>
                    <p className="text-sm text-gray-500 mt-2">par mois pendant {years} ans</p>
                </div>
            </Card>

            <Card title="Répartition du Coût">
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Coût total du crédit</p>
                        <p className="text-lg font-bold text-gray-800 dark:text-white">{formatCurrency(totalCost, settings.currency)}</p>
                    </div>
                     <div className="p-3 bg-orange-50 dark:bg-orange-900/10 rounded-lg">
                        <p className="text-xs text-orange-600 dark:text-orange-400">Dont Intérêts</p>
                        <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{formatCurrency(totalInterest, settings.currency)}</p>
                    </div>
                </div>
                
                <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value: number) => formatCurrency(value, settings.currency)} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
};