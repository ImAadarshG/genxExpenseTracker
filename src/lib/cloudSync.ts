// Cloud Sync Service for syncing data across devices using Vercel Postgres
import { sql } from '@vercel/postgres';
import type { Expense, Income, Investment, LentMoney, User } from '@/types';
import { dbHelpers } from './db';

// Check if cloud sync is enabled
const isCloudSyncEnabled = process.env.NEXT_PUBLIC_ENABLE_CLOUD_SYNC === 'true';

export const cloudSync = {
  // Initialize database tables
  async initializeTables() {
    if (!isCloudSyncEnabled) return;
    
    try {
      // Create users table
      await sql`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          name VARCHAR(255) NOT NULL,
          settings JSONB,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `;

      // Create expenses table
      await sql`
        CREATE TABLE IF NOT EXISTS expenses (
          id SERIAL PRIMARY KEY,
          user_email VARCHAR(255) NOT NULL,
          date DATE NOT NULL,
          payment_method VARCHAR(50),
          title VARCHAR(255) NOT NULL,
          description TEXT,
          amount DECIMAL(10, 2) NOT NULL,
          category VARCHAR(50),
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW(),
          FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE
        );
      `;

      // Create incomes table
      await sql`
        CREATE TABLE IF NOT EXISTS incomes (
          id SERIAL PRIMARY KEY,
          user_email VARCHAR(255) NOT NULL,
          date DATE NOT NULL,
          source VARCHAR(255) NOT NULL,
          description TEXT,
          amount DECIMAL(10, 2) NOT NULL,
          category VARCHAR(50),
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW(),
          FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE
        );
      `;

      // Create investments table
      await sql`
        CREATE TABLE IF NOT EXISTS investments (
          id SERIAL PRIMARY KEY,
          user_email VARCHAR(255) NOT NULL,
          date DATE NOT NULL,
          type VARCHAR(50) NOT NULL,
          amount DECIMAL(10, 2) NOT NULL,
          description TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW(),
          FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE
        );
      `;

      // Create lent_money table
      await sql`
        CREATE TABLE IF NOT EXISTS lent_money (
          id SERIAL PRIMARY KEY,
          user_email VARCHAR(255) NOT NULL,
          name VARCHAR(255) NOT NULL,
          amount DECIMAL(10, 2) NOT NULL,
          reason TEXT,
          given_date DATE NOT NULL,
          return_date DATE,
          comment TEXT,
          status VARCHAR(20) DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW(),
          FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE
        );
      `;

      console.log('Cloud database tables initialized successfully');
    } catch (error) {
      console.error('Error initializing cloud database tables:', error);
    }
  },

  // Sync local data to cloud
  async syncToCloud(userEmail: string) {
    if (!isCloudSyncEnabled || !userEmail) return;
    
    try {
      // Get all local data
      const [expenses, incomes, investments, lentMoney] = await Promise.all([
        dbHelpers.db.expenses.toArray(),
        dbHelpers.db.incomes.toArray(),
        dbHelpers.db.investments.toArray(),
        dbHelpers.db.lentMoney.toArray()
      ]);

      // Clear existing cloud data for this user
      await sql`DELETE FROM expenses WHERE user_email = ${userEmail}`;
      await sql`DELETE FROM incomes WHERE user_email = ${userEmail}`;
      await sql`DELETE FROM investments WHERE user_email = ${userEmail}`;
      await sql`DELETE FROM lent_money WHERE user_email = ${userEmail}`;

      // Upload expenses
      for (const expense of expenses) {
        await sql`
          INSERT INTO expenses (
            user_email, date, payment_method, title, description, 
            amount, category, created_at, updated_at
          ) VALUES (
            ${userEmail}, ${expense.date}, ${expense.paymentMethod}, 
            ${expense.title}, ${expense.description || null}, ${expense.amount}, 
            ${expense.category}, ${expense.createdAt}, ${expense.updatedAt}
          )
        `;
      }

      // Upload incomes
      for (const income of incomes) {
        await sql`
          INSERT INTO incomes (
            user_email, date, source, description, amount, 
            category, created_at, updated_at
          ) VALUES (
            ${userEmail}, ${income.date}, ${income.source}, 
            ${income.description || null}, ${income.amount}, ${income.category}, 
            ${income.createdAt}, ${income.updatedAt}
          )
        `;
      }

      // Upload investments
      for (const investment of investments) {
        await sql`
          INSERT INTO investments (
            user_email, date, type, amount, description, 
            created_at, updated_at
          ) VALUES (
            ${userEmail}, ${investment.date}, ${investment.type}, 
            ${investment.amount}, ${investment.description || null}, 
            ${investment.createdAt}, ${investment.updatedAt}
          )
        `;
      }

      // Upload lent money
      for (const lent of lentMoney) {
        await sql`
          INSERT INTO lent_money (
            user_email, name, amount, reason, given_date, 
            return_date, comment, status, created_at, updated_at
          ) VALUES (
            ${userEmail}, ${lent.name}, ${lent.amount}, ${lent.reason || null}, 
            ${lent.givenDate}, ${lent.returnDate || null}, ${lent.comment || null}, 
            ${lent.status}, ${lent.createdAt}, ${lent.updatedAt}
          )
        `;
      }

      console.log('Data synced to cloud successfully');
      return { success: true };
    } catch (error) {
      console.error('Error syncing to cloud:', error);
      return { success: false, error };
    }
  },

  // Sync cloud data to local
  async syncFromCloud(userEmail: string) {
    if (!isCloudSyncEnabled || !userEmail) return;
    
    try {
      // Fetch all cloud data for the user
      const { rows: expenses } = await sql`
        SELECT * FROM expenses WHERE user_email = ${userEmail}
      `;
      const { rows: incomes } = await sql`
        SELECT * FROM incomes WHERE user_email = ${userEmail}
      `;
      const { rows: investments } = await sql`
        SELECT * FROM investments WHERE user_email = ${userEmail}
      `;
      const { rows: lentMoney } = await sql`
        SELECT * FROM lent_money WHERE user_email = ${userEmail}
      `;

      // Clear local data
      await dbHelpers.db.expenses.clear();
      await dbHelpers.db.incomes.clear();
      await dbHelpers.db.investments.clear();
      await dbHelpers.db.lentMoney.clear();

      // Import expenses
      for (const expense of expenses) {
        await dbHelpers.db.expenses.add({
          date: new Date(expense.date),
          paymentMethod: expense.payment_method as any,
          title: expense.title,
          description: expense.description,
          amount: Number(expense.amount),
          category: expense.category as any,
          createdAt: new Date(expense.created_at),
          updatedAt: new Date(expense.updated_at)
        });
      }

      // Import incomes
      for (const income of incomes) {
        await dbHelpers.db.incomes.add({
          date: new Date(income.date),
          source: income.source,
          description: income.description,
          amount: Number(income.amount),
          category: income.category as any,
          createdAt: new Date(income.created_at),
          updatedAt: new Date(income.updated_at)
        });
      }

      // Import investments
      for (const investment of investments) {
        await dbHelpers.db.investments.add({
          date: new Date(investment.date),
          type: investment.type as any,
          amount: Number(investment.amount),
          description: investment.description,
          createdAt: new Date(investment.created_at),
          updatedAt: new Date(investment.updated_at)
        });
      }

      // Import lent money
      for (const lent of lentMoney) {
        await dbHelpers.db.lentMoney.add({
          name: lent.name,
          amount: Number(lent.amount),
          reason: lent.reason,
          givenDate: new Date(lent.given_date),
          returnDate: lent.return_date ? new Date(lent.return_date) : undefined,
          comment: lent.comment,
          status: lent.status as any,
          createdAt: new Date(lent.created_at),
          updatedAt: new Date(lent.updated_at)
        });
      }

      console.log('Data synced from cloud successfully');
      return { success: true };
    } catch (error) {
      console.error('Error syncing from cloud:', error);
      return { success: false, error };
    }
  },

  // Check sync status
  async getSyncStatus(userEmail: string) {
    if (!isCloudSyncEnabled || !userEmail) {
      return { enabled: false, message: 'Cloud sync is disabled' };
    }
    
    try {
      const { rows } = await sql`
        SELECT COUNT(*) as count FROM expenses WHERE user_email = ${userEmail}
      `;
      
      return {
        enabled: true,
        cloudRecords: rows[0]?.count || 0,
        lastSync: new Date().toISOString()
      };
    } catch (error) {
      return {
        enabled: true,
        error: 'Could not connect to cloud database'
      };
    }
  }
};
