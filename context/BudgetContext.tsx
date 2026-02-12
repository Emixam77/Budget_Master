import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Expense, UserSettings, Category, ExpenseType } from '../types';
import { generateMockData, determineDefaultType } from '../utils/helpers';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';
import { 
  collection, 
  doc, 
  addDoc, 
  deleteDoc, 
  setDoc, 
  onSnapshot, 
  query, 
  orderBy,
  writeBatch
} from 'firebase/firestore';

interface BudgetContextType {
  expenses: Expense[];
  settings: UserSettings;
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  updateSettings: (newSettings: Partial<UserSettings>) => Promise<void>;
  resetData: () => Promise<void>;
  isLoadingData: boolean;
}

const defaultSettings: UserSettings = {
  monthlyBudget: 2000,
  monthlyIncome: 2500,
  budgetTargets: {
      [ExpenseType.FIXED]: 1000,
      [ExpenseType.VARIABLE]: 800,
      [ExpenseType.SAVINGS]: 200
  },
  currency: 'EUR',
  darkMode: false,
  enableBudgetAlerts: true,
  budgetAlertThreshold: 80,
};

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const BudgetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Sync Data with Firestore
  useEffect(() => {
    if (!user) {
      setExpenses([]);
      setSettings(defaultSettings);
      setIsLoadingData(false);
      return;
    }

    setIsLoadingData(true);

    // 1. Subscribe to Settings
    const settingsRef = doc(db, 'users', user.uid);
    const unsubSettings = onSnapshot(settingsRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as Partial<UserSettings>;
        // Merge with default to ensure structure integrity
        setSettings({ 
          ...defaultSettings, 
          ...data,
          budgetTargets: { ...defaultSettings.budgetTargets, ...(data.budgetTargets || {}) }
        });
      } else {
        // Create default settings if not exists
        setDoc(settingsRef, defaultSettings, { merge: true });
      }
    });

    // 2. Subscribe to Expenses
    const expensesRef = collection(db, 'users', user.uid, 'expenses');
    const q = query(expensesRef, orderBy('date', 'desc')); // Order by date desc

    const unsubExpenses = onSnapshot(q, (snapshot) => {
      const loadedExpenses: Expense[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Expense));
      setExpenses(loadedExpenses);
      setIsLoadingData(false);
    });

    return () => {
      unsubSettings();
      unsubExpenses();
    };
  }, [user]);

  // Handle Dark Mode locally based on state
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  const addExpense = async (expenseData: Omit<Expense, 'id'>) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'users', user.uid, 'expenses'), expenseData);
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  const deleteExpense = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'expenses', id));
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    if (!user) return;
    try {
      // Optimistic update
      setSettings(prev => ({ ...prev, ...newSettings }));
      await setDoc(doc(db, 'users', user.uid), newSettings, { merge: true });
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };

  const resetData = async () => {
      if (!user) return;
      
      const mockData = generateMockData();
      const batch = writeBatch(db);
      
      // 1. Delete existing expenses (in real app, use a cloud function for large collections)
      // Since we can't delete collection easily from client, we loop (careful with limits)
      // For demo we just add mock data
      
      const expensesRef = collection(db, 'users', user.uid, 'expenses');
      
      mockData.forEach(expense => {
         const newDocRef = doc(expensesRef); // Auto-id
         // Remove fake ID from mock and use Firestore ID
         const { id, ...data } = expense; 
         batch.set(newDocRef, data);
      });

      await batch.commit();
  };

  return (
    <BudgetContext.Provider value={{ expenses, settings, addExpense, deleteExpense, updateSettings, resetData, isLoadingData }}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) throw new Error('useBudget must be used within a BudgetProvider');
  return context;
};