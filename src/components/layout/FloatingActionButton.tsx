"use client";

import React from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useStore } from "@/store/useStore";

export function FloatingActionButton() {
  const { setAddExpenseModalOpen } = useStore();

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => setAddExpenseModalOpen(true)}
      className="fixed bottom-6 right-6 z-20 h-14 w-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
    >
      <Plus className="h-6 w-6" />
    </motion.button>
  );
}
