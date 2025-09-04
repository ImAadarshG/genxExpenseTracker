"use client";

import React, { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { FloatingActionButton } from "@/components/layout/FloatingActionButton";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { AddExpenseForm } from "@/components/forms/AddExpenseForm";
import { AddIncomeForm } from "@/components/forms/AddIncomeForm";
import { AddInvestmentForm } from "@/components/forms/AddInvestmentForm";
import { dbHelpers } from "@/lib/db";
import { useLiveQuery } from "dexie-react-hooks";
import type { DashboardStats } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { motion } from "framer-motion";

export default function HomePage() {
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      
      <main className="p-4 pb-20">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Track your expenses and manage your finances
            </p>
          </motion.div>

          {/* Stats Cards */}
          <StatsCards stats={stats} />

          {/* Recent Transactions */}
          {recentTransactions && recentTransactions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Recent Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentTransactions.map((transaction, index) => (
                      <motion.div
                        key={transaction.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{transaction.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(new Date(transaction.date))}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-red-600">
                            -{formatCurrency(transaction.amount)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {transaction.paymentMethod}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </main>

      {/* Floating Action Button */}
      <FloatingActionButton />

      {/* Modals */}
      <AddExpenseForm />
      <AddIncomeForm />
      <AddInvestmentForm />
    </div>
  );
}