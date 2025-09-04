// Type definitions for the expense tracker app

export interface User {
  id?: number;
  email: string;
  password: string; // In production, this should be hashed
  name: string;
  createdAt: Date;
  updatedAt: Date;
  settings?: UserSettings;
}

export interface UserSettings {
  currency?: string;
  theme?: 'light' | 'dark';
  notifications?: boolean;
  budgetAlerts?: boolean;
  monthlyBudget?: number;
}

export type PaymentMethod = 'online' | 'cash' | 'credit_card';

export type ExpenseCategory = 
  | 'food_dining'
  | 'transportation'
  | 'shopping'
  | 'entertainment'
  | 'bills_utilities'
  | 'healthcare'
  | 'education'
  | 'travel'
  | 'others';

export type IncomeCategory = 
  | 'salary'
  | 'freelance'
  | 'business'
  | 'interest'
  | 'dividends'
  | 'gift'
  | 'others';

export type InvestmentType = 
  | 'stocks'
  | 'mutual_funds'
  | 'gold'
  | 'etfs'
  | 'fixed_deposits'
  | 'others';

export type LentMoneyStatus = 'pending' | 'returned';

export interface Expense {
  id?: number;
  date: Date;
  paymentMethod: PaymentMethod;
  title: string;
  description?: string;
  amount: number;
  category: ExpenseCategory;
  createdAt: Date;
  updatedAt: Date;
}

export interface Income {
  id?: number;
  date: Date;
  source: string;
  description?: string;
  amount: number;
  category: IncomeCategory;
  createdAt: Date;
  updatedAt: Date;
}

export interface Investment {
  id?: number;
  date: Date;
  type: InvestmentType;
  amount: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LentMoney {
  id?: number;
  name: string;
  amount: number;
  reason?: string;
  givenDate: Date;
  returnDate?: Date;
  comment?: string;
  status: LentMoneyStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardStats {
  monthlyExpenses: number;
  dailyExpenses: number;
  monthlyIncome: number;
  currentBalance: number;
  totalInvestments: number;
  creditCardSpending: number;
}
