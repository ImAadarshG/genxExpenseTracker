"use client";

import React, { useEffect, useState } from "react";
import { ModernHeader } from "@/components/layout/ModernHeader";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { ModernFloatingButton } from "@/components/layout/ModernFloatingButton";
import { ModernStatsCards } from "@/components/dashboard/ModernStatsCards";
import { AddExpenseForm } from "@/components/forms/AddExpenseForm";
import { AddIncomeForm } from "@/components/forms/AddIncomeForm";
import { AddInvestmentForm } from "@/components/forms/AddInvestmentForm";
import { AddLentMoneyForm } from "@/components/forms/AddLentMoneyForm";
import { dbHelpers } from "@/lib/db";
import { useLiveQuery } from "dexie-react-hooks";
import type { DashboardStats } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { motion } from "framer-motion";
import { 
  Receipt,
  ChevronRight,
  Sparkles,
  Brain,
  Zap
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";

export default function HomePage() {
  const router = useRouter();
  const { user } = useStore();
  const [stats, setStats] = useState<DashboardStats>({
    monthlyExpenses: 0,
    dailyExpenses: 0,
    monthlyIncome: 0,
    currentBalance: 0,
    totalInvestments: 0,
    creditCardSpending: 0,
  });

  // Live query to update stats when data changes
  const liveStats = useLiveQuery(async () => {
    return await dbHelpers.getDashboardStats();
  });

  useEffect(() => {
    if (liveStats) {
      setStats(liveStats);
    }
  }, [liveStats]);

  // Get recent transactions
  const recentTransactions = useLiveQuery(async () => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
    const expenses = await dbHelpers.getExpensesByDateRange(
      thirtyDaysAgo,
      new Date()
    );
    return expenses
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  });

  const getCategoryEmoji = (category: string) => {
    const emojiMap: { [key: string]: string } = {
      'food_dining': '🍔',
      'shopping': '🛍️',
      'transportation': '🚗',
      'entertainment': '🎬',
      'bills_utilities': '📱',
      'healthcare': '🏥',
      'education': '📚',
      'travel': '✈️',
      'personal_care': '💅',
      'groceries': '🛒',
      'rent_mortgage': '🏠',
      'insurance': '🛡️',
      'gifts_donations': '🎁',
      'others': '💳'
    };
    return emojiMap[category] || '💳';
  };

  const getPaymentMethodLabel = (method: string) => {
    const labelMap: { [key: string]: string } = {
      'credit_card': 'Card',
      'debit_card': 'Debit',
      'cash': 'Cash',
      'bank_transfer': 'Transfer',
      'upi': 'UPI',
      'wallet': 'Wallet',
      'other': 'Other'
    };
    return labelMap[method] || 'Other';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
      <ModernHeader />
      <Sidebar />
      
      <main className="pb-24 lg:pb-20">
        {/* Welcome Section */}
        <div className="px-4 pt-4 pb-2">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Welcome back{user ? `, ${user.name.split(' ')[0]}` : ''}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Here&apos;s your financial overview
          </p>
        </div>

        {/* AI Assistant Card - Coming Soon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-4 mb-6"
        >
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 p-[1px]">
            <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl p-4 sm:p-5 overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                  backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(168, 85, 247, 0.1) 10px, rgba(168, 85, 247, 0.1) 20px)`,
                }}/>
              </div>
              
              {/* Content */}
              <div className="relative flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <motion.div
                      animate={{ 
                        rotate: [0, 360],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ 
                        rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                        scale: { duration: 2, repeat: Infinity }
                      }}
                      className="relative"
                    >
                      <Brain className="h-6 w-6 text-purple-600" />
                      <motion.div
                        className="absolute inset-0"
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Sparkles className="h-6 w-6 text-yellow-500" />
                      </motion.div>
                    </motion.div>
                    <h2 className="text-lg sm:text-xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      GenX Expense Saver AI
                    </h2>
                    <motion.span
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="ml-auto px-2 py-0.5 text-[10px] sm:text-xs font-bold rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-600"
                    >
                      COMING SOON
                    </motion.span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Your AI-powered financial assistant will analyze spending patterns, predict trends, and save you money! 🚀
                  </p>
                </div>
                
                {/* Animated Icon */}
                <motion.div
                  className="hidden sm:block ml-4"
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-xl opacity-50" />
                    <Zap className="h-10 w-10 text-purple-600 relative" />
                  </div>
                </motion.div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"
                  initial={{ width: "0%" }}
                  animate={{ width: "75%" }}
                  transition={{ duration: 2, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="mb-6">
          <ModernStatsCards stats={stats} />
        </div>

        {/* Recent Transactions */}
        {recentTransactions && recentTransactions.length > 0 && (
          <div className="mx-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              {/* Header */}
              <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Receipt className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">Recent</h2>
                </div>
                <button
                  onClick={() => router.push("/tracking")}
                  className="flex items-center gap-0.5 text-xs sm:text-sm text-purple-600 font-medium"
                >
                  See all
                  <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
              </div>

              {/* Transactions List */}
              <div className="divide-y divide-gray-50">
                {recentTransactions.slice(0, 3).map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      {/* Icon */}
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-100 flex items-center justify-center text-base sm:text-lg flex-shrink-0">
                        {getCategoryEmoji(transaction.category)}
                      </div>
                      
                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">
                          {transaction.title.length > 20 
                            ? `${transaction.title.substring(0, 20)}...` 
                            : transaction.title}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] sm:text-xs text-gray-500">
                            {formatDate(new Date(transaction.date))}
                          </span>
                          <span className="text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full bg-purple-50 text-purple-600 font-medium">
                            {getPaymentMethodLabel(transaction.paymentMethod)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Amount */}
                    <p className="font-semibold text-red-600 text-sm sm:text-base flex-shrink-0">
                      -{formatCurrency(transaction.amount).length > 10 
                        ? `${formatCurrency(transaction.amount).substring(0, 10)}...` 
                        : formatCurrency(transaction.amount)}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {(!recentTransactions || recentTransactions.length === 0) && (
          <div className="mx-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 text-center">
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">📊</div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">
                No transactions yet
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                Start tracking your expenses by tapping the + button
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden">
        <MobileBottomNav />
      </div>

      {/* Floating Action Button - Hidden on mobile when bottom nav is visible */}
      <div className="hidden lg:block">
        <ModernFloatingButton />
      </div>

      {/* Modals */}
      <AddExpenseForm />
      <AddIncomeForm />
      <AddInvestmentForm />
      <AddLentMoneyForm />
    </div>
  );
}