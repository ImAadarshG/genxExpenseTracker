"use client";

import React from "react";
import { formatCurrency } from "@/lib/utils";
import {
  TrendingUp,
  Wallet,
  CreditCard,
  ArrowDownCircle,
  ArrowUpCircle,
  Banknote
} from "lucide-react";
import { motion } from "framer-motion";
import type { DashboardStats } from "@/types";

interface StatsCardsProps {
  stats: DashboardStats;
}

export function ModernStatsCards({ stats }: StatsCardsProps) {
  const formatAmount = (value: number) => {
    const formatted = formatCurrency(value);
    // For mobile, shorten large numbers
    if (formatted.length > 10) {
      const num = Math.abs(value);
      if (num >= 1000000) {
        return `${value < 0 ? '-' : ''}₹${(num / 1000000).toFixed(1)}M`;
      } else if (num >= 100000) {
        return `${value < 0 ? '-' : ''}₹${(num / 100000).toFixed(1)}L`;
      } else if (num >= 1000) {
        return `${value < 0 ? '-' : ''}₹${(num / 1000).toFixed(1)}K`;
      }
    }
    return formatted;
  };

  const cards = [
    {
      title: "Today",
      value: stats.dailyExpenses,
      icon: ArrowDownCircle,
      gradient: "from-red-400 to-pink-500",
      bgColor: "bg-red-50"
    },
    {
      title: "Monthly", 
      value: stats.monthlyExpenses,
      icon: Wallet,
      gradient: "from-orange-400 to-yellow-500",
      bgColor: "bg-orange-50"
    },
    {
      title: "Income",
      value: stats.monthlyIncome,
      icon: ArrowUpCircle,
      gradient: "from-green-400 to-emerald-500",
      bgColor: "bg-green-50"
    },
    {
      title: "Balance",
      value: stats.currentBalance,
      icon: Banknote,
      gradient: stats.currentBalance >= 0 
        ? "from-blue-400 to-cyan-500"
        : "from-gray-400 to-gray-500",
      bgColor: stats.currentBalance >= 0 ? "bg-blue-50" : "bg-gray-50"
    },
    {
      title: "Invested",
      value: stats.totalInvestments,
      icon: TrendingUp,
      gradient: "from-purple-400 to-violet-500",
      bgColor: "bg-purple-50"
    },
    {
      title: "Card",
      value: stats.creditCardSpending,
      icon: CreditCard,
      gradient: "from-indigo-400 to-blue-500",
      bgColor: "bg-indigo-50"
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3 px-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.3, 
              delay: index * 0.05,
            }}
            className={`${card.bgColor} rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/60`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-gradient-to-br ${card.gradient}`}>
                <Icon className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
              </div>
            </div>

            {/* Value */}
            <div className="mb-0.5 sm:mb-1">
              <p className="text-lg sm:text-2xl font-bold text-gray-900 leading-tight">
                {formatAmount(card.value)}
              </p>
            </div>

            {/* Title */}
            <p className="text-[10px] sm:text-xs text-gray-600 font-medium">
              {card.title}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}