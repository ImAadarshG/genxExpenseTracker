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
import { RecentEntries } from "@/components/dashboard/RecentEntries";
import { dbHelpers } from "@/lib/db";
import { useLiveQuery } from "dexie-react-hooks";
import type { DashboardStats } from "@/types";
import { motion } from "framer-motion";
import { 
  Sparkles,
  Brain,
  Zap
} from "lucide-react";
import { useStore } from "@/store/useStore";

export default function HomePage() {
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

  // No need for recent transactions here as we're using RecentEntries component

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

        {/* Recent Entries with Edit/Delete */}
        <RecentEntries />
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