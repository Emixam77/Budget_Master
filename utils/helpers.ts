import { Category, PaymentMethod, Expense, ExpenseType } from '../types';

export const generateId = (): string => Math.random().toString(36).substr(2, 9);

export const formatCurrency = (amount: number, currency: string = 'EUR'): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const getCategoryIcon = (category: Category): string => {
  switch (category) {
    case Category.FOOD: return '🍽️';
    case Category.TRANSPORT: return '🚗';
    case Category.HOUSING: return '🏠';
    case Category.LEISURE: return '🎮';
    case Category.HEALTH: return '🏥';
    case Category.SHOPPING: return '🛍️';
    case Category.SAVINGS: return '💰';
    case Category.MISC: return '📦';
    default: return '📝';
  }
};

export const getCategoryColor = (category: Category): string => {
    switch (category) {
      case Category.FOOD: return '#EF4444'; 
      case Category.TRANSPORT: return '#F59E0B'; 
      case Category.HOUSING: return '#3B82F6'; 
      case Category.LEISURE: return '#8B5CF6'; 
      case Category.HEALTH: return '#10B981'; 
      case Category.SHOPPING: return '#EC4899'; 
      case Category.SAVINGS: return '#14B8A6'; 
      case Category.MISC: return '#6B7280'; 
      default: return '#6B7280';
    }
  };

// Helper pour déterminer le type par défaut selon la catégorie
export const determineDefaultType = (category: Category): ExpenseType => {
    switch (category) {
        case Category.HOUSING:
        case Category.HEALTH:
            return ExpenseType.FIXED;
        case Category.SAVINGS:
            return ExpenseType.SAVINGS;
        default:
            return ExpenseType.VARIABLE;
    }
};

export const getExpenseTypeColor = (type: ExpenseType): string => {
    switch (type) {
        case ExpenseType.FIXED: return '#3B82F6'; // Blue
        case ExpenseType.VARIABLE: return '#F59E0B'; // Orange
        case ExpenseType.SAVINGS: return '#10B981'; // Green
        default: return '#6B7280';
    }
};

export const generateMockData = (): Expense[] => {
  const expenses: Expense[] = [];
  const categories = Object.values(Category);
  const methods = Object.values(PaymentMethod);
  const now = new Date();

  for (let i = 0; i < 80; i++) {
    const daysAgo = Math.floor(Math.random() * 90);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);

    const cat = categories[Math.floor(Math.random() * categories.length)];

    expenses.push({
      id: generateId(),
      amount: Math.floor(Math.random() * 150) + 5,
      date: date.toISOString(),
      category: cat,
      type: determineDefaultType(cat), // Assigner le type automatiquement
      description: `Dépense test ${i + 1}`,
      paymentMethod: methods[Math.floor(Math.random() * methods.length)],
    });
  }
  return expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const downloadCSV = (data: Expense[]) => {
    const csvContent = "data:text/csv;charset=utf-8," 
        + "Date,Type,Categorie,Description,Montant,Methode\n"
        + data.map(e => `${new Date(e.date).toLocaleDateString()},${e.type},${e.category},"${e.description}",${e.amount},${e.paymentMethod}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "budget_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};