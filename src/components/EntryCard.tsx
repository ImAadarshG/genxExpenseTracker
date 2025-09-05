"use client";

import React from "react";
import { formatCurrency } from "@/lib/utils";
import { Edit2, Trash2, Calendar, Tag, DollarSign, CreditCard, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import type { Expense, Income, Investment, LentMoney } from "@/types";

type EntryType = 'expense' | 'income' | 'investment' | 'lent';
type Entry = Expense | Income | Investment | LentMoney;

interface EntryCardProps {
  entry: Entry;
  type: EntryType;
  onEdit: (entry: Entry) => void;
  onDelete: (id: number) => void;
}

export function EntryCard({ entry, type, onEdit, onDelete }: EntryCardProps) {
  const getCardColor = () => {
    switch (type) {
      case 'expense': return 'from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border-red-200 dark:border-red-800';
      case 'income': return 'from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800';
      case 'investment': return 'from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800';
      case 'lent': return 'from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800';
      default: return 'from-gray-50 to-gray-100 dark:from-gray-950/20 dark:to-gray-900/20 border-gray-200 dark:border-gray-800';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'expense': return <DollarSign className="w-4 h-4" />;
      case 'income': return <Briefcase className="w-4 h-4" />;
      case 'investment': return <Tag className="w-4 h-4" />;
      case 'lent': return <CreditCard className="w-4 h-4" />;
      default: return null;
    }
  };

  const getTitle = () => {
    if (type === 'expense' && 'description' in entry) return entry.description;
    if (type === 'income' && 'source' in entry) return entry.source;
    if (type === 'investment' && 'name' in entry) return entry.name;
    if (type === 'lent' && 'name' in entry) return `Lent to ${entry.name}`;
    return 'Entry';
  };

  const getSubtitle = () => {
    if (type === 'expense' && 'category' in entry) return entry.category;
    if (type === 'income' && 'category' in entry) return entry.category;
    if (type === 'investment' && 'type' in entry) return entry.type;
    if (type === 'lent' && 'status' in entry) return entry.status;
    return '';
  };

  const getDate = () => {
    if (type === 'lent' && 'givenDate' in entry) return entry.givenDate;
    if ('date' in entry) return entry.date;
    return new Date();
  };

  const getPaymentMethod = () => {
    if (type === 'expense' && 'paymentMethod' in entry) {
      return entry.paymentMethod.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className={`relative p-4 rounded-xl bg-gradient-to-br ${getCardColor()} border backdrop-blur-sm transition-all duration-200`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {getIcon()}
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">
              {getTitle()}
            </h3>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            {getSubtitle() && (
              <span className="px-2 py-0.5 rounded-full bg-white/50 dark:bg-gray-800/50">
                {getSubtitle()}
              </span>
            )}
            
            {getPaymentMethod() && (
              <span className="px-2 py-0.5 rounded-full bg-white/50 dark:bg-gray-800/50">
                {getPaymentMethod()}
              </span>
            )}
            
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{format(new Date(getDate()), 'MMM d, yyyy')}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-bold text-lg text-gray-900 dark:text-gray-100">
            {formatCurrency(entry.amount)}
          </span>
          
          <div className="flex gap-1 ml-2">
            <button
              onClick={() => onEdit(entry)}
              className="p-1.5 rounded-lg bg-white/50 dark:bg-gray-800/50 hover:bg-blue-500 hover:text-white transition-all duration-200"
              aria-label="Edit entry"
            >
              <Edit2 className="w-3 h-3" />
            </button>
            
            <button
              onClick={() => entry.id && onDelete(entry.id)}
              className="p-1.5 rounded-lg bg-white/50 dark:bg-gray-800/50 hover:bg-red-500 hover:text-white transition-all duration-200"
              aria-label="Delete entry"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {type === 'lent' && 'returnDate' in entry && entry.returnDate && (
        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          <span className="text-xs text-gray-600 dark:text-gray-400">
            Expected return: {format(new Date(entry.returnDate), 'MMM d, yyyy')}
          </span>
        </div>
      )}

      {type === 'investment' && 'returnPercentage' in entry && (entry as Investment).returnPercentage && (
        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          <span className="text-xs text-gray-600 dark:text-gray-400">
            Expected return: {(entry as Investment).returnPercentage}%
          </span>
        </div>
      )}
    </motion.div>
  );
}
