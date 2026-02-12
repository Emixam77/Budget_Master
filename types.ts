export enum Category {
  FOOD = 'Alimentation',
  TRANSPORT = 'Transport',
  HOUSING = 'Logement',
  LEISURE = 'Loisirs',
  HEALTH = 'Santé',
  SHOPPING = 'Shopping',
  SAVINGS = 'Épargne',
  MISC = 'Divers',
}

export enum ExpenseType {
  FIXED = 'Fixe',      // Loyer, Assurances, Abonnements
  VARIABLE = 'Variable', // Loisirs, Courses, Shopping
  SAVINGS = 'Épargne'   // Investissement, Livrets
}

export enum PaymentMethod {
  CASH = 'Espèces',
  CARD = 'Carte Bancaire',
  TRANSFER = 'Virement',
  OTHER = 'Autre',
}

export interface Expense {
  id: string;
  amount: number;
  date: string; // ISO string
  category: Category;
  type: ExpenseType; // Nouveau champ
  description: string;
  paymentMethod: PaymentMethod;
}

export interface UserSettings {
  monthlyBudget: number; // Gardé pour compatibilité, sert de total
  monthlyIncome: number; // Nouveaux revenus
  budgetTargets: {
    [ExpenseType.FIXED]: number;
    [ExpenseType.VARIABLE]: number;
    [ExpenseType.SAVINGS]: number;
  };
  currency: string;
  darkMode: boolean;
  enableBudgetAlerts: boolean;
  budgetAlertThreshold: number; 
}

export interface DashboardMetrics {
  totalSpent: number;
  remainingBudget: number;
  spentPercentage: number;
  dailyAverage: number;
}