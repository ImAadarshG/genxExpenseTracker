"use client";

import React, { useEffect, useState } from "react";
import { ModernHeader } from "@/components/layout/ModernHeader";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { dbHelpers } from "@/lib/db";
import { useLiveQuery } from "dexie-react-hooks";
import {
  formatCurrency,
  EXPENSE_CATEGORIES,
} from "@/lib/utils";
import {
  format,
  subMonths,
  startOfMonth,
  endOfMonth,
  differenceInDays,
} from "date-fns";
import {
  TrendingUp,
  TrendingDown,
  Target,
  AlertCircle,
  DollarSign,
  PiggyBank,
} from "lucide-react";

const COLORS = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
  "#FF6384",
  "#C9CBCF",
  "#4BC0C0",
];

export default function InsightsPage() {
  const [monthlyTrends, setMonthlyTrends] = useState<
    Array<{
      month: string;
      expenses: number;
      income: number;
      savings: number;
    }>
  >([]);

  const [categorySpending, setCategorySpending] = useState<
    Array<{
      category: string;
      thisMonth: number;
      lastMonth: number;
      average: number;
    }>
  >([]);

  const [savingsRate, setSavingsRate] = useState(0);
  const [topCategories, setTopCategories] = useState<
    Array<{ name: string; value: number; percentage: number }>
  >([]);

  // Fetch all data for insights
  const allExpenses = useLiveQuery(async () => {
    const sixMonthsAgo = subMonths(new Date(), 6);
    return await dbHelpers.getExpensesByDateRange(sixMonthsAgo, new Date());
  });

  const allIncomes = useLiveQuery(async () => {
    const sixMonthsAgo = subMonths(new Date(), 6);
    return await dbHelpers.getIncomesByDateRange(sixMonthsAgo, new Date());
  });

  const allInvestments = useLiveQuery(async () => {
    const sixMonthsAgo = subMonths(new Date(), 6);
    return await dbHelpers.getInvestmentsByDateRange(sixMonthsAgo, new Date());
  });

  // Calculate monthly trends
  useEffect(() => {
    if (allExpenses && allIncomes) {
      const trends: Record<
        string,
        { expenses: number; income: number; savings: number }
      > = {};

      // Initialize last 6 months
      for (let i = 5; i >= 0; i--) {
        const date = subMonths(new Date(), i);
        const monthKey = format(date, "MMM yyyy");
        trends[monthKey] = { expenses: 0, income: 0, savings: 0 };
      }

      // Aggregate expenses
      allExpenses.forEach((expense) => {
        const monthKey = format(new Date(expense.date), "MMM yyyy");
        if (trends[monthKey]) {
          trends[monthKey].expenses += expense.amount;
        }
      });

      // Aggregate incomes
      allIncomes.forEach((income) => {
        const monthKey = format(new Date(income.date), "MMM yyyy");
        if (trends[monthKey]) {
          trends[monthKey].income += income.amount;
        }
      });

      // Calculate savings
      Object.keys(trends).forEach((month) => {
        trends[month].savings = trends[month].income - trends[month].expenses;
      });

      setMonthlyTrends(
        Object.entries(trends).map(([month, data]) => ({
          month,
          ...data,
        }))
      );

      // Calculate savings rate for current month
      const currentMonthKey = format(new Date(), "MMM yyyy");
      if (trends[currentMonthKey] && trends[currentMonthKey].income > 0) {
        setSavingsRate(
          (trends[currentMonthKey].savings / trends[currentMonthKey].income) *
            100
        );
      }
    }
  }, [allExpenses, allIncomes]);

  // Calculate category spending patterns
  useEffect(() => {
    if (allExpenses) {
      const currentMonth = new Date();
      const lastMonth = subMonths(currentMonth, 1);

      const categoryData: Record<
        string,
        { thisMonth: number; lastMonth: number; total: number; count: number }
      > = {};

      // Initialize categories
      EXPENSE_CATEGORIES.forEach((cat) => {
        categoryData[cat.value] = {
          thisMonth: 0,
          lastMonth: 0,
          total: 0,
          count: 0,
        };
      });

      // Aggregate by category and month
      allExpenses.forEach((expense) => {
        const expenseDate = new Date(expense.date);
        const category = expense.category;

        if (categoryData[category]) {
          categoryData[category].total += expense.amount;
          categoryData[category].count++;

          if (
            expenseDate >= startOfMonth(currentMonth) &&
            expenseDate <= endOfMonth(currentMonth)
          ) {
            categoryData[category].thisMonth += expense.amount;
          } else if (
            expenseDate >= startOfMonth(lastMonth) &&
            expenseDate <= endOfMonth(lastMonth)
          ) {
            categoryData[category].lastMonth += expense.amount;
          }
        }
      });

      const spendingData = Object.entries(categoryData)
        .filter((entry) => entry[1].total > 0)
        .map(([category, data]) => {
          const categoryInfo = EXPENSE_CATEGORIES.find(
            (c) => c.value === category
          );
          return {
            category: categoryInfo?.label || category,
            thisMonth: data.thisMonth,
            lastMonth: data.lastMonth,
            average: data.count > 0 ? data.total / 6 : 0, // 6-month average
          };
        })
        .sort((a, b) => b.thisMonth - a.thisMonth);

      setCategorySpending(spendingData);

      // Set top categories
      const totalThisMonth = spendingData.reduce(
        (sum, cat) => sum + cat.thisMonth,
        0
      );
      setTopCategories(
        spendingData.slice(0, 5).map((cat) => ({
          name: cat.category,
          value: cat.thisMonth,
          percentage: totalThisMonth > 0 ? (cat.thisMonth / totalThisMonth) * 100 : 0,
        }))
      );
    }
  }, [allExpenses]);

  // Calculate insights metrics
  const getInsightMetrics = () => {
    if (!allExpenses || !allIncomes || !allInvestments) {
      return {
        avgDailyExpense: 0,
        avgMonthlyIncome: 0,
        totalInvestments: 0,
        expenseGrowth: 0,
        incomeGrowth: 0,
        mostExpensiveDay: null,
      };
    }

    const currentMonth = new Date();
    const lastMonth = subMonths(currentMonth, 1);

    // Current month data
    const currentMonthExpenses = allExpenses.filter(
      (e) =>
        new Date(e.date) >= startOfMonth(currentMonth) &&
        new Date(e.date) <= endOfMonth(currentMonth)
    );
    const currentMonthIncome = allIncomes.filter(
      (i) =>
        new Date(i.date) >= startOfMonth(currentMonth) &&
        new Date(i.date) <= endOfMonth(currentMonth)
    );

    // Last month data
    const lastMonthExpenses = allExpenses.filter(
      (e) =>
        new Date(e.date) >= startOfMonth(lastMonth) &&
        new Date(e.date) <= endOfMonth(lastMonth)
    );
    const lastMonthIncome = allIncomes.filter(
      (i) =>
        new Date(i.date) >= startOfMonth(lastMonth) &&
        new Date(i.date) <= endOfMonth(lastMonth)
    );

    const currentExpenseTotal = currentMonthExpenses.reduce(
      (sum, e) => sum + e.amount,
      0
    );
    const lastExpenseTotal = lastMonthExpenses.reduce(
      (sum, e) => sum + e.amount,
      0
    );
    const currentIncomeTotal = currentMonthIncome.reduce(
      (sum, i) => sum + i.amount,
      0
    );
    const lastIncomeTotal = lastMonthIncome.reduce(
      (sum, i) => sum + i.amount,
      0
    );

    // Find most expensive day
    const expensesByDay: Record<string, number> = {};
    allExpenses.forEach((expense) => {
      const dayKey = format(new Date(expense.date), "yyyy-MM-dd");
      expensesByDay[dayKey] = (expensesByDay[dayKey] || 0) + expense.amount;
    });
    const mostExpensiveDay = Object.entries(expensesByDay).sort(
      (a, b) => b[1] - a[1]
    )[0];

    return {
      avgDailyExpense:
        currentExpenseTotal / differenceInDays(new Date(), startOfMonth(currentMonth)),
      avgMonthlyIncome: currentIncomeTotal,
      totalInvestments: allInvestments.reduce((sum, i) => sum + i.amount, 0),
      expenseGrowth:
        lastExpenseTotal > 0
          ? ((currentExpenseTotal - lastExpenseTotal) / lastExpenseTotal) * 100
          : 0,
      incomeGrowth:
        lastIncomeTotal > 0
          ? ((currentIncomeTotal - lastIncomeTotal) / lastIncomeTotal) * 100
          : 0,
      mostExpensiveDay: mostExpensiveDay
        ? { date: mostExpensiveDay[0], amount: mostExpensiveDay[1] }
        : null,
    };
  };

  const metrics = getInsightMetrics();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
      <ModernHeader />
      <Sidebar />

      <main className="p-4 pb-24 lg:pb-20">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Insights</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Your spending patterns
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Savings Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  <span className="text-xl sm:text-2xl font-bold">
                    {savingsRate.toFixed(1)}%
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                  Of monthly income
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Avg Daily Expense
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-orange-600" />
                  <span className="text-2xl font-bold">
                    {formatCurrency(metrics.avgDailyExpense)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  This month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Expense Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {metrics.expenseGrowth >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-red-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-green-600" />
                  )}
                  <span className="text-2xl font-bold">
                    {Math.abs(metrics.expenseGrowth).toFixed(1)}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  vs last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Invested
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <PiggyBank className="h-4 w-4 text-purple-600" />
                  <span className="text-2xl font-bold">
                    {formatCurrency(metrics.totalInvestments)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Last 6 months
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Monthly Trends */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-base sm:text-lg">6-Month Trend</CardTitle>
              </CardHeader>
              <CardContent className="p-2 sm:p-6">
                <ResponsiveContainer width="100%" height={200} className="sm:h-[300px]">
                  <LineChart 
                    data={monthlyTrends}
                    margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fontSize: 10 }}
                      interval="preserveStartEnd"
                    />
                    <YAxis 
                      tick={{ fontSize: 10 }}
                      tickFormatter={(value) => {
                        if (value >= 1000000) {
                          return `${(value / 1000000).toFixed(1)}M`;
                        } else if (value >= 1000) {
                          return `${(value / 1000).toFixed(0)}k`;
                        }
                        return value;
                      }}
                    />
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{ fontSize: '12px' }}
                    />
                    <Legend 
                      wrapperStyle={{ fontSize: '11px' }}
                      iconSize={10}
                    />
                    <Line
                      type="monotone"
                      dataKey="income"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="expenses"
                      stroke="#ef4444"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="savings"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Spending Categories */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-base sm:text-lg">Top Categories</CardTitle>
              </CardHeader>
              <CardContent className="p-2 sm:p-6">
                {topCategories.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={180} className="sm:hidden">
                      <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                        <Pie
                          data={topCategories}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={60}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {topCategories.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: number) => formatCurrency(value)}
                          contentStyle={{ fontSize: '12px' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <ResponsiveContainer width="100%" height={300} className="hidden sm:block">
                      <PieChart>
                        <Pie
                          data={topCategories}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percentage }) =>
                            `${name} ${percentage.toFixed(0)}%`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {topCategories.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      </PieChart>
                    </ResponsiveContainer>
                    {/* Mobile Legend */}
                    <div className="grid grid-cols-2 gap-2 mt-3 sm:hidden">
                      {topCategories.slice(0, 4).map((item, index) => (
                        <div key={item.name} className="flex items-center gap-1 text-xs">
                          <div 
                            className="w-3 h-3 rounded-full flex-shrink-0" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="truncate">{item.name}</span>
                          <span className="text-muted-foreground">
                            {item.percentage.toFixed(0)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-[180px] sm:h-[300px] text-muted-foreground text-sm">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Category Comparison */}
            <Card className="lg:col-span-2 overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-base sm:text-lg">Spending Comparison</CardTitle>
              </CardHeader>
              <CardContent className="p-2 sm:p-6">
                <div className="overflow-x-auto">
                  <ResponsiveContainer width="100%" height={200} className="sm:h-[300px]" minWidth={300}>
                    <BarChart 
                      data={categorySpending}
                      margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                      <XAxis 
                        dataKey="category" 
                        tick={{ fontSize: 10 }}
                        interval={0}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis 
                        tick={{ fontSize: 10 }}
                        tickFormatter={(value) => {
                          if (value >= 1000) {
                            return `${(value / 1000).toFixed(0)}k`;
                          }
                          return value;
                        }}
                      />
                      <Tooltip 
                        formatter={(value: number) => formatCurrency(value)}
                        contentStyle={{ fontSize: '12px' }}
                      />
                      <Legend 
                        wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                        iconSize={10}
                      />
                      <Bar dataKey="lastMonth" fill="#94a3b8" />
                      <Bar dataKey="thisMonth" fill="#3b82f6" />
                      <Bar dataKey="average" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Insights and Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Smart Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {savingsRate < 20 && (
                  <div className="flex gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-orange-900 dark:text-orange-100">
                        Low Savings Rate
                      </p>
                      <p className="text-sm text-orange-700 dark:text-orange-200">
                        Your current savings rate is {savingsRate.toFixed(1)}%.
                        Consider aiming for at least 20% to build a healthy
                        financial cushion.
                      </p>
                    </div>
                  </div>
                )}

                {metrics.expenseGrowth > 10 && (
                  <div className="flex gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-900 dark:text-red-100">
                        Expenses Increasing
                      </p>
                      <p className="text-sm text-red-700 dark:text-red-200">
                        Your expenses grew {metrics.expenseGrowth.toFixed(1)}%
                        compared to last month. Review your spending in top
                        categories.
                      </p>
                    </div>
                  </div>
                )}

                {metrics.mostExpensiveDay && (
                  <div className="flex gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900 dark:text-blue-100">
                        Highest Spending Day
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-200">
                        You spent {formatCurrency(metrics.mostExpensiveDay.amount)}{" "}
                        on {format(new Date(metrics.mostExpensiveDay.date), "MMM d, yyyy")}.
                        Consider spreading large purchases across the month.
                      </p>
                    </div>
                  </div>
                )}

                {savingsRate >= 20 && (
                  <div className="flex gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <Target className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-900 dark:text-green-100">
                        Great Savings Rate!
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-200">
                        You&apos;re saving {savingsRate.toFixed(1)}% of your income.
                        Keep up the excellent financial discipline!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden">
        <MobileBottomNav />
      </div>
    </div>
  );
}
