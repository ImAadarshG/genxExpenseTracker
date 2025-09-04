// Database setup using Dexie (IndexedDB wrapper)
import Dexie, { type Table } from 'dexie';
import type { Expense, Income, Investment, LentMoney, User } from '@/types';

export class ExpenseTrackerDB extends Dexie {
  users!: Table<User>;
  expenses!: Table<Expense>;
  incomes!: Table<Income>;
  investments!: Table<Investment>;
  lentMoney!: Table<LentMoney>;

  constructor() {
    super('ExpenseTrackerDB');
    
    this.version(2).stores({
      users: '++id, email',
      expenses: '++id, date, paymentMethod, category, amount, [date+category]',
      incomes: '++id, date, category, amount, [date+category]',
      investments: '++id, date, type, amount, [date+type]',
      lentMoney: '++id, name, status, givenDate, amount'
    });
  }
}

export const db = new ExpenseTrackerDB();

// Helper functions for database operations
export const dbHelpers = {
  db, // Export the db instance for direct access
  // Expenses
  async addExpense(expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date();
    return await db.expenses.add({
      ...expense,
      createdAt: now,
      updatedAt: now
    });
  },

  async updateExpense(id: number, expense: Partial<Expense>) {
    return await db.expenses.update(id, {
      ...expense,
      updatedAt: new Date()
    });
  },

  async deleteExpense(id: number) {
    return await db.expenses.delete(id);
  },

  async getExpensesByDateRange(startDate: Date, endDate: Date) {
    return await db.expenses
      .where('date')
      .between(startDate, endDate)
      .toArray();
  },

  // Incomes
  async addIncome(income: Omit<Income, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date();
    return await db.incomes.add({
      ...income,
      createdAt: now,
      updatedAt: now
    });
  },

  async updateIncome(id: number, income: Partial<Income>) {
    return await db.incomes.update(id, {
      ...income,
      updatedAt: new Date()
    });
  },

  async deleteIncome(id: number) {
    return await db.incomes.delete(id);
  },

  async getIncomesByDateRange(startDate: Date, endDate: Date) {
    return await db.incomes
      .where('date')
      .between(startDate, endDate)
      .toArray();
  },

  // Investments
  async addInvestment(investment: Omit<Investment, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date();
    return await db.investments.add({
      ...investment,
      createdAt: now,
      updatedAt: now
    });
  },

  async updateInvestment(id: number, investment: Partial<Investment>) {
    return await db.investments.update(id, {
      ...investment,
      updatedAt: new Date()
    });
  },

  async deleteInvestment(id: number) {
    return await db.investments.delete(id);
  },

  async getInvestmentsByDateRange(startDate: Date, endDate: Date) {
    return await db.investments
      .where('date')
      .between(startDate, endDate)
      .toArray();
  },

  // Lent Money
  async addLentMoney(lentMoney: Omit<LentMoney, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date();
    return await db.lentMoney.add({
      ...lentMoney,
      createdAt: now,
      updatedAt: now
    });
  },

  async updateLentMoney(id: number, lentMoney: Partial<LentMoney>) {
    return await db.lentMoney.update(id, {
      ...lentMoney,
      updatedAt: new Date()
    });
  },

  async deleteLentMoney(id: number) {
    return await db.lentMoney.delete(id);
  },

  async getLentMoneyByStatus(status: 'pending' | 'returned') {
    return await db.lentMoney
      .where('status')
      .equals(status)
      .toArray();
  },

  // User Authentication
  async registerUser(userData: { email: string; password: string; name: string }) {
    // Check if user already exists
    const existingUser = await db.users.where('email').equals(userData.email).first();
    if (existingUser) {
      throw new Error('User already exists with this email');
    }
    
    const now = new Date();
    // Simple hash for demo (in production, use bcrypt or similar)
    const hashedPassword = btoa(userData.password); 
    
    return await db.users.add({
      email: userData.email,
      password: hashedPassword,
      name: userData.name,
      createdAt: now,
      updatedAt: now,
      settings: {
        currency: 'INR',
        theme: 'light',
        notifications: true,
        budgetAlerts: true
      }
    });
  },
  
  async loginUser(email: string, password: string) {
    const user = await db.users.where('email').equals(email).first();
    if (!user) {
      throw new Error('User not found');
    }
    
    const hashedPassword = btoa(password);
    if (user.password !== hashedPassword) {
      throw new Error('Invalid password');
    }
    
    // Remove password from returned user object
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
  
  async updateUserSettings(userId: number, settings: Partial<User['settings']>) {
    const user = await db.users.get(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    return await db.users.update(userId, {
      settings: { ...user.settings, ...settings },
      updatedAt: new Date()
    });
  },
  
  async updateUserPassword(userId: number, currentPassword: string, newPassword: string) {
    const user = await db.users.get(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    const hashedCurrentPassword = btoa(currentPassword);
    if (user.password !== hashedCurrentPassword) {
      throw new Error('Current password is incorrect');
    }
    
    const hashedNewPassword = btoa(newPassword);
    return await db.users.update(userId, {
      password: hashedNewPassword,
      updatedAt: new Date()
    });
  },

  // Dashboard Stats
  async getDashboardStats() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const endOfDay = new Date(now.setHours(23, 59, 59, 999));

    const [monthlyExpenses, dailyExpenses, monthlyIncomes, allInvestments, creditCardExpenses] = await Promise.all([
      db.expenses.where('date').between(startOfMonth, endOfMonth).toArray(),
      db.expenses.where('date').between(startOfDay, endOfDay).toArray(),
      db.incomes.where('date').between(startOfMonth, endOfMonth).toArray(),
      db.investments.toArray(),
      db.expenses.where('paymentMethod').equals('credit_card').and(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= startOfMonth && expenseDate <= endOfMonth;
      }).toArray()
    ]);

    const monthlyExpenseTotal = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const dailyExpenseTotal = dailyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const monthlyIncomeTotal = monthlyIncomes.reduce((sum, income) => sum + income.amount, 0);
    const totalInvestments = allInvestments.reduce((sum, investment) => sum + investment.amount, 0);
    const creditCardTotal = creditCardExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    return {
      monthlyExpenses: monthlyExpenseTotal,
      dailyExpenses: dailyExpenseTotal,
      monthlyIncome: monthlyIncomeTotal,
      currentBalance: monthlyIncomeTotal - monthlyExpenseTotal,
      totalInvestments,
      creditCardSpending: creditCardTotal
    };
  }
};
