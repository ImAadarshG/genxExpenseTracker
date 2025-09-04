"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/useStore";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  PlusCircle,
  DollarSign,
  TrendingUp,
  UserCheck,
  Calendar,
  CalendarDays,
  ChartBar,
  Settings,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "#", label: "Add Income", icon: PlusCircle, action: "income" },
  { href: "#", label: "Add Investment", icon: TrendingUp, action: "investment" },
  { href: "/money-lent", label: "Money Lent", icon: UserCheck },
  { href: "/tracking?view=monthly", label: "Monthly Tracking", icon: Calendar },
  { href: "/tracking?view=weekly", label: "Weekly Tracking", icon: CalendarDays },
  { href: "/insights", label: "Insights", icon: ChartBar },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen, setAddIncomeModalOpen, setAddInvestmentModalOpen } = useStore();

  const handleMenuClick = (action?: string) => {
    if (action === "income") {
      setAddIncomeModalOpen(true);
      setSidebarOpen(false);
    } else if (action === "investment") {
      setAddInvestmentModalOpen(true);
      setSidebarOpen(false);
    } else {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-0 top-0 h-full w-72 bg-card border-r z-50 shadow-xl"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">Expense Tracker</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="p-4 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || 
                  (item.href.includes('tracking') && pathname === '/tracking');

                if (item.action) {
                  return (
                    <button
                      key={item.label}
                      onClick={() => handleMenuClick(item.action)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                        "hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </button>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
