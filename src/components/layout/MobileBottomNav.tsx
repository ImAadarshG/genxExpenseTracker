"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  PieChart,
  Plus,
  TrendingUp,
  Settings
} from "lucide-react";
import { useStore } from "@/store/useStore";

export function MobileBottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [showAddMenu, setShowAddMenu] = useState(false);
  const { 
    setAddExpenseModalOpen, 
    setAddIncomeModalOpen, 
    setAddInvestmentModalOpen,
    setAddLentMoneyModalOpen 
  } = useStore();

  const navItems = [
    {
      icon: Home,
      label: "Home",
      path: "/",
      active: pathname === "/"
    },
    {
      icon: PieChart,
      label: "Track",
      path: "/tracking",
      active: pathname === "/tracking"
    },
    {
      icon: Plus,
      label: "Add",
      isAdd: true
    },
    {
      icon: TrendingUp,
      label: "Insights",
      path: "/insights",
      active: pathname === "/insights"
    },
    {
      icon: Settings,
      label: "More",
      path: "/settings",
      active: pathname === "/settings"
    }
  ];

  const addOptions = [
    {
      label: "Expense",
      emoji: "💸",
      color: "bg-red-500",
      onClick: () => {
        setAddExpenseModalOpen(true);
        setShowAddMenu(false);
      }
    },
    {
      label: "Income",
      emoji: "💰",
      color: "bg-green-500",
      onClick: () => {
        setAddIncomeModalOpen(true);
        setShowAddMenu(false);
      }
    },
    {
      label: "Investment",
      emoji: "📈",
      color: "bg-purple-500",
      onClick: () => {
        setAddInvestmentModalOpen(true);
        setShowAddMenu(false);
      }
    },
    {
      label: "Lent",
      emoji: "🤝",
      color: "bg-blue-500",
      onClick: () => {
        setAddLentMoneyModalOpen(true);
        setShowAddMenu(false);
      }
    }
  ];

  return (
    <>
      {/* Add Menu Overlay */}
      {showAddMenu && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddMenu(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          
          {/* Add Options */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed bottom-20 left-4 right-4 z-50 max-w-sm mx-auto"
          >
            <div className="bg-white rounded-2xl shadow-xl p-4">
              <p className="text-xs font-bold text-gray-700 mb-3 text-center">Quick Add</p>
              <div className="grid grid-cols-2 gap-2">
                {addOptions.map((option) => (
                  <motion.button
                    key={option.label}
                    whileTap={{ scale: 0.95 }}
                    onClick={option.onClick}
                    className={`${option.color} text-white p-3 rounded-xl flex items-center justify-center gap-2 font-medium text-sm shadow-lg`}
                  >
                    <span className="text-lg">{option.emoji}</span>
                    <span>{option.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-30 safe-bottom">
        <div className="flex items-center justify-around h-16 pb-safe">
          {navItems.map((item) => {
            const Icon = item.icon;
            
            if (item.isAdd) {
              // Special Add Button
              return (
                <motion.button
                  key="add"
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowAddMenu(!showAddMenu)}
                  className="relative"
                >
                  <motion.div 
                    className={`w-11 h-11 rounded-full flex items-center justify-center shadow-lg ${
                      showAddMenu 
                        ? 'bg-gray-500' 
                        : 'bg-gradient-to-r from-purple-500 to-pink-500'
                    } transition-all duration-300`}
                    animate={{ rotate: showAddMenu ? 45 : 0 }}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </motion.div>
                </motion.button>
              );
            }

            // Regular Navigation Items
            return (
              <motion.button
                key={item.path}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push(item.path!)}
                className="flex flex-col items-center justify-center py-2 px-2 min-w-[60px]"
              >
                <Icon 
                  className={`h-5 w-5 transition-colors ${
                    item.active 
                      ? 'text-purple-600' 
                      : 'text-gray-400'
                  }`} 
                />
                <span 
                  className={`text-[10px] mt-0.5 font-medium transition-colors ${
                    item.active 
                      ? 'text-purple-600' 
                      : 'text-gray-400'
                  }`}
                >
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </nav>

      {/* Add some global styles for safe area */}
      <style jsx global>{`
        .safe-bottom {
          padding-bottom: env(safe-area-inset-bottom);
        }
        .pb-safe {
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
    </>
  );
}