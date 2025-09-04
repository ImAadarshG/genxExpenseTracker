"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ModernHeader } from "@/components/layout/ModernHeader";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { dbHelpers } from "@/lib/db";
import { useLiveQuery } from "dexie-react-hooks";
import {
  formatCurrency,
  formatDate,
  getStartOfMonth,
  getEndOfMonth,
  EXPENSE_CATEGORIES,
} from "@/lib/utils";
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import type { Expense, Income } from "@/types";

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

function TrackingContent() {
  const searchParams = useSearchParams();
  const view = searchParams.get("view") || "monthly";
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [monthlyData, setMonthlyData] = useState<{
    expenses: Expense[];
    incomes: Income[];
  }>({ expenses: [], incomes: [] });
  const [weeklyData, setWeeklyData] = useState<{
    expenses: Expense[];
    incomes: Income[];
  }>({ expenses: [], incomes: [] });

  // Fetch monthly data
  const monthlyExpenses = useLiveQuery(async () => {
    if (view === "monthly") {
      const start = getStartOfMonth(selectedDate);
      const end = getEndOfMonth(selectedDate);
      return await dbHelpers.getExpensesByDateRange(start, end);
    }
    return [];
  }, [selectedDate, view]);

  const monthlyIncomes = useLiveQuery(async () => {
    if (view === "monthly") {
      const start = getStartOfMonth(selectedDate);
      const end = getEndOfMonth(selectedDate);
      return await dbHelpers.getIncomesByDateRange(start, end);
    }
    return [];
  }, [selectedDate, view]);

  // Fetch weekly data
  const weeklyExpenses = useLiveQuery(async () => {
    if (view === "weekly") {
      const start = startOfWeek(selectedDate, { weekStartsOn: 0 });
      const end = endOfWeek(selectedDate, { weekStartsOn: 0 });
      return await dbHelpers.getExpensesByDateRange(start, end);
    }
    return [];
  }, [selectedDate, view]);

  const weeklyIncomes = useLiveQuery(async () => {
    if (view === "weekly") {
      const start = startOfWeek(selectedDate, { weekStartsOn: 0 });
      const end = endOfWeek(selectedDate, { weekStartsOn: 0 });
      return await dbHelpers.getIncomesByDateRange(start, end);
    }
    return [];
  }, [selectedDate, view]);

  useEffect(() => {
    if (monthlyExpenses && monthlyIncomes) {
      setMonthlyData({
        expenses: monthlyExpenses,
        incomes: monthlyIncomes,
      });
    }
  }, [monthlyExpenses, monthlyIncomes]);

  useEffect(() => {
    if (weeklyExpenses && weeklyIncomes) {
      setWeeklyData({
        expenses: weeklyExpenses,
        incomes: weeklyIncomes,
      });
    }
  }, [weeklyExpenses, weeklyIncomes]);

  // Calculate category-wise breakdown
  const getCategoryBreakdown = (expenses: Expense[]) => {
    const breakdown: Record<string, number> = {};
    expenses.forEach((expense) => {
      if (!breakdown[expense.category]) {
        breakdown[expense.category] = 0;
      }
      breakdown[expense.category] += expense.amount;
    });

    return Object.entries(breakdown).map(([category, amount]) => {
      const categoryInfo = EXPENSE_CATEGORIES.find(
        (c) => c.value === category
      );
      return {
        name: categoryInfo?.label || category,
        value: amount,
        icon: categoryInfo?.icon || "📦",
      };
    });
  };

  // Get daily trend data for line chart
  const getDailyTrend = () => {
    if (view === "weekly") {
      const start = startOfWeek(selectedDate, { weekStartsOn: 0 });
      const end = endOfWeek(selectedDate, { weekStartsOn: 0 });
      const days = eachDayOfInterval({ start, end });

      return days.map((day) => {
        const dayExpenses = weeklyData.expenses.filter(
          (e) =>
            new Date(e.date).toDateString() === day.toDateString()
        );
        const dayIncomes = weeklyData.incomes.filter(
          (i) =>
            new Date(i.date).toDateString() === day.toDateString()
        );

        return {
          date: format(day, "EEE"),
          expenses: dayExpenses.reduce((sum, e) => sum + e.amount, 0),
          income: dayIncomes.reduce((sum, i) => sum + i.amount, 0),
        };
      });
    }

    // For monthly view, show weekly aggregates
    const weeks: Record<string, { expenses: number; income: number }> = {};
    monthlyData.expenses.forEach((expense) => {
      const weekNum = Math.floor(new Date(expense.date).getDate() / 7);
      const weekKey = `Week ${weekNum + 1}`;
      if (!weeks[weekKey]) {
        weeks[weekKey] = { expenses: 0, income: 0 };
      }
      weeks[weekKey].expenses += expense.amount;
    });

    monthlyData.incomes.forEach((income) => {
      const weekNum = Math.floor(new Date(income.date).getDate() / 7);
      const weekKey = `Week ${weekNum + 1}`;
      if (!weeks[weekKey]) {
        weeks[weekKey] = { expenses: 0, income: 0 };
      }
      weeks[weekKey].income += income.amount;
    });

    return Object.entries(weeks).map(([week, data]) => ({
      date: week,
      expenses: data.expenses,
      income: data.income,
    }));
  };

  const navigatePeriod = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate);
    if (view === "monthly") {
      newDate.setMonth(
        newDate.getMonth() + (direction === "prev" ? -1 : 1)
      );
    } else {
      newDate.setDate(
        newDate.getDate() + (direction === "prev" ? -7 : 7)
      );
    }
    setSelectedDate(newDate);
  };

  const exportData = () => {
    const data = view === "monthly" ? monthlyData : weeklyData;
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${view}-tracking-${format(
      selectedDate,
      "yyyy-MM-dd"
    )}.json`;
    link.click();
  };

  const currentData = view === "monthly" ? monthlyData : weeklyData;
  const totalExpenses = currentData.expenses.reduce(
    (sum, e) => sum + e.amount,
    0
  );
  const totalIncome = currentData.incomes.reduce(
    (sum, i) => sum + i.amount,
    0
  );
  const categoryData = getCategoryBreakdown(currentData.expenses);
  const trendData = getDailyTrend();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
      <ModernHeader />
      <Sidebar />

      <main className="p-4 pb-24 lg:pb-20">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header with Period Selector */}
          <div className="space-y-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">
                {view === "monthly" ? "Monthly" : "Weekly"} Tracking
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Analyze your financial patterns
              </p>
            </div>
            <div className="flex items-center justify-between gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigatePeriod("prev")}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="px-3 py-1.5 bg-accent rounded-lg flex-1 text-center text-sm">
                {view === "monthly"
                  ? format(selectedDate, "MMM yyyy")
                  : `${format(
                      startOfWeek(selectedDate, { weekStartsOn: 0 }),
                      "MMM d"
                    )} - ${format(
                      endOfWeek(selectedDate, { weekStartsOn: 0 }),
                      "MMM d"
                    )}`}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigatePeriod("next")}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={exportData}
                className="h-8 px-2"
              >
                <Download className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Tabs for Monthly/Weekly View */}
          <Tabs value={view} className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
              <TabsTrigger
                value="monthly"
                onClick={() =>
                  window.location.href = "/tracking?view=monthly"
                }
              >
                Monthly
              </TabsTrigger>
              <TabsTrigger
                value="weekly"
                onClick={() =>
                  window.location.href = "/tracking?view=weekly"
                }
              >
                Weekly
              </TabsTrigger>
            </TabsList>

            <TabsContent value={view} className="space-y-6 mt-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">
                      Total Income
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(totalIncome)}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">
                      Total Expenses
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      {formatCurrency(totalExpenses)}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">
                      Net Savings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      className={`text-2xl font-bold ${
                        totalIncome - totalExpenses >= 0
                          ? "text-blue-600"
                          : "text-orange-600"
                      }`}
                    >
                      {formatCurrency(totalIncome - totalExpenses)}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Category Breakdown Pie Chart */}
                <Card className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base sm:text-lg">Expense Categories</CardTitle>
                  </CardHeader>
                  <CardContent className="p-2 sm:p-6">
                    {categoryData.length > 0 ? (
                      <>
                        <ResponsiveContainer width="100%" height={200} className="sm:hidden">
                          <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                            <Pie
                              data={categoryData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={60}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {categoryData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip
                              formatter={(value: number) =>
                                formatCurrency(value)
                              }
                            />
                          </PieChart>
                        </ResponsiveContainer>
                        <ResponsiveContainer width="100%" height={300} className="hidden sm:block">
                          <PieChart>
                            <Pie
                              data={categoryData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) =>
                                `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                              }
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {categoryData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip
                              formatter={(value: number) =>
                                formatCurrency(value)
                              }
                            />
                          </PieChart>
                        </ResponsiveContainer>
                        {/* Mobile Legend */}
                        <div className="grid grid-cols-2 gap-2 mt-4 sm:hidden">
                          {categoryData.slice(0, 4).map((item, index) => (
                            <div key={item.name} className="flex items-center gap-1 text-xs">
                              <div 
                                className="w-3 h-3 rounded-full flex-shrink-0" 
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                              />
                              <span className="truncate">{item.name}</span>
                              <span className="text-muted-foreground">
                                {Math.round((item.value / categoryData.reduce((a, b) => a + b.value, 0)) * 100)}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-[200px] sm:h-[300px] text-muted-foreground text-sm">
                        No expense data available
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Trend Line Chart */}
                <Card className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base sm:text-lg">
                      {view === "monthly" ? "Weekly" : "Daily"} Trend
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-2 sm:p-6">
                    {trendData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={200} className="sm:h-[300px]">
                        <LineChart 
                          data={trendData}
                          margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                          <XAxis 
                            dataKey="date" 
                            tick={{ fontSize: 10 }}
                            interval="preserveStartEnd"
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
                            formatter={(value: number) =>
                              formatCurrency(value)
                            }
                            contentStyle={{ fontSize: '12px' }}
                          />
                          <Legend 
                            wrapperStyle={{ fontSize: '12px' }}
                            iconSize={12}
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
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-[200px] sm:h-[300px] text-muted-foreground text-sm">
                        No trend data available
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Transaction List */}
              <Card>
                <CardHeader>
                  <CardTitle>Transaction List</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {currentData.expenses
                      .sort(
                        (a, b) =>
                          new Date(b.date).getTime() -
                          new Date(a.date).getTime()
                      )
                      .map((expense) => (
                        <div
                          key={expense.id}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors"
                        >
                          <div>
                            <p className="font-medium">{expense.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(new Date(expense.date))} •{" "}
                              {
                                EXPENSE_CATEGORIES.find(
                                  (c) => c.value === expense.category
                                )?.label
                              }
                            </p>
                          </div>
                          <p className="font-semibold text-red-600">
                            -{formatCurrency(expense.amount)}
                          </p>
                        </div>
                      ))}
                    {currentData.incomes
                      .sort(
                        (a, b) =>
                          new Date(b.date).getTime() -
                          new Date(a.date).getTime()
                      )
                      .map((income) => (
                        <div
                          key={`income-${income.id}`}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors"
                        >
                          <div>
                            <p className="font-medium">{income.source}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(new Date(income.date))}
                            </p>
                          </div>
                          <p className="font-semibold text-green-600">
                            +{formatCurrency(income.amount)}
                          </p>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden">
        <MobileBottomNav />
      </div>
    </div>
  );
}

export default function TrackingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading tracking data...</p>
        </div>
      </div>
    }>
      <TrackingContent />
    </Suspense>
  );
}
