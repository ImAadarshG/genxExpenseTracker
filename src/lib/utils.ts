import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: Date): string {
  return format(date, 'dd MMM yyyy');
}

export function formatDateTime(date: Date): string {
  return format(date, 'dd MMM yyyy, hh:mm a');
}

export function getStartOfMonth(date: Date = new Date()): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function getEndOfMonth(date: Date = new Date()): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function getStartOfWeek(date: Date = new Date()): Date {
  const day = date.getDay();
  const diff = date.getDate() - day;
  return new Date(date.setDate(diff));
}

export function getEndOfWeek(date: Date = new Date()): Date {
  const day = date.getDay();
  const diff = date.getDate() - day + 6;
  return new Date(date.setDate(diff));
}

export function getStartOfDay(date: Date = new Date()): Date {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
}

export function getEndOfDay(date: Date = new Date()): Date {
  const newDate = new Date(date);
  newDate.setHours(23, 59, 59, 999);
  return newDate;
}

export const EXPENSE_CATEGORIES = [
  { value: 'food_dining', label: 'Food & Dining', icon: '🍽️' },
  { value: 'transportation', label: 'Transportation', icon: '🚗' },
  { value: 'shopping', label: 'Shopping', icon: '🛍️' },
  { value: 'entertainment', label: 'Entertainment', icon: '🎬' },
  { value: 'bills_utilities', label: 'Bills & Utilities', icon: '📱' },
  { value: 'healthcare', label: 'Healthcare', icon: '🏥' },
  { value: 'education', label: 'Education', icon: '📚' },
  { value: 'travel', label: 'Travel', icon: '✈️' },
  { value: 'others', label: 'Others', icon: '📦' }
] as const;

export const INCOME_CATEGORIES = [
  { value: 'salary', label: 'Salary', icon: '💼' },
  { value: 'freelance', label: 'Freelance', icon: '💻' },
  { value: 'business', label: 'Business', icon: '🏢' },
  { value: 'interest', label: 'Interest', icon: '💰' },
  { value: 'dividends', label: 'Dividends', icon: '📈' },
  { value: 'gift', label: 'Gift', icon: '🎁' },
  { value: 'others', label: 'Others', icon: '📦' }
] as const;

export const INVESTMENT_TYPES = [
  { value: 'stocks', label: 'Stocks', icon: '📊' },
  { value: 'mutual_funds', label: 'Mutual Funds', icon: '💹' },
  { value: 'gold', label: 'Gold', icon: '🏅' },
  { value: 'etfs', label: 'ETFs', icon: '📈' },
  { value: 'fixed_deposits', label: 'Fixed Deposits', icon: '🏦' },
  { value: 'others', label: 'Others', icon: '📦' }
] as const;

export const PAYMENT_METHODS = [
  { value: 'online', label: 'Online', icon: '💳' },
  { value: 'cash', label: 'Cash', icon: '💵' },
  { value: 'credit_card', label: 'Credit Card', icon: '💳' }
] as const;
