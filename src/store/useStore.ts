import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';

interface AppState {
  // User Authentication
  user: Omit<User, 'password'> | null;
  setUser: (user: Omit<User, 'password'> | null) => void;
  isAuthenticated: boolean;
  
  // UI State
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  
  // Modal States
  addExpenseModalOpen: boolean;
  setAddExpenseModalOpen: (open: boolean) => void;
  
  addIncomeModalOpen: boolean;
  setAddIncomeModalOpen: (open: boolean) => void;
  
  addInvestmentModalOpen: boolean;
  setAddInvestmentModalOpen: (open: boolean) => void;
  
  addLentMoneyModalOpen: boolean;
  setAddLentMoneyModalOpen: (open: boolean) => void;
  
  // Theme
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  
  // Filter States
  selectedMonth: Date;
  setSelectedMonth: (date: Date) => void;
  
  selectedWeek: Date;
  setSelectedWeek: (date: Date) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // User Authentication
      user: null,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      isAuthenticated: false,
      
      // UI State
      sidebarOpen: false,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      
      // Modal States
      addExpenseModalOpen: false,
      setAddExpenseModalOpen: (open) => set({ addExpenseModalOpen: open }),
      
      addIncomeModalOpen: false,
      setAddIncomeModalOpen: (open) => set({ addIncomeModalOpen: open }),
      
      addInvestmentModalOpen: false,
      setAddInvestmentModalOpen: (open) => set({ addInvestmentModalOpen: open }),
      
      addLentMoneyModalOpen: false,
      setAddLentMoneyModalOpen: (open) => set({ addLentMoneyModalOpen: open }),
      
      // Theme
      theme: 'light',
      setTheme: (theme) => set({ theme }),
      
      // Filter States
      selectedMonth: new Date(),
      setSelectedMonth: (date) => set({ selectedMonth: date }),
      
      selectedWeek: new Date(),
      setSelectedWeek: (date) => set({ selectedWeek: date }),
    }),
    {
      name: 'expense-tracker-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        theme: state.theme,
        selectedMonth: state.selectedMonth,
        selectedWeek: state.selectedWeek,
      }),
    }
  )
);
