"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  X, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp,
  Send
} from "lucide-react";
import { useStore } from "@/store/useStore";

export function ModernFloatingButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    setAddExpenseModalOpen, 
    setAddIncomeModalOpen, 
    setAddInvestmentModalOpen,
    setAddLentMoneyModalOpen 
  } = useStore();

  const actions = [
    { 
      icon: ShoppingBag, 
      label: "Expense", 
      color: "bg-red-500",
      onClick: () => {
        setAddExpenseModalOpen(true);
        setIsOpen(false);
      }
    },
    { 
      icon: DollarSign, 
      label: "Income", 
      color: "bg-green-500",
      onClick: () => {
        setAddIncomeModalOpen(true);
        setIsOpen(false);
      }
    },
    { 
      icon: TrendingUp, 
      label: "Investment", 
      color: "bg-purple-500",
      onClick: () => {
        setAddInvestmentModalOpen(true);
        setIsOpen(false);
      }
    },
    { 
      icon: Send, 
      label: "Lent Money", 
      color: "bg-blue-500",
      onClick: () => {
        setAddLentMoneyModalOpen(true);
        setIsOpen(false);
      }
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed bottom-24 right-6 z-50 flex flex-col gap-3">
            {actions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={action.label}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: 1, 
                    opacity: 1,
                    transition: {
                      delay: index * 0.05
                    }
                  }}
                  exit={{ 
                    scale: 0, 
                    opacity: 0
                  }}
                  className="flex items-center gap-3 justify-end"
                >
                  <span className="px-3 py-1 rounded-lg bg-white shadow-md text-sm font-medium">
                    {action.label}
                  </span>
                  
                  <button
                    onClick={action.onClick}
                    className={`h-12 w-12 ${action.color} text-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform`}
                  >
                    <Icon className="h-5 w-5" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* Main Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`h-14 w-14 ${
            isOpen 
              ? 'bg-gray-500' 
              : 'bg-gradient-to-r from-purple-500 to-pink-500'
          } text-white rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-105`}
          style={{ 
            transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease'
          }}
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Plus className="h-6 w-6" />
          )}
        </button>
      </div>
    </>
  );
}