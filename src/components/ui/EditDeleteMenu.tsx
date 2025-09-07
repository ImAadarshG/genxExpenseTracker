"use client";

import React, { useState } from "react";
import { Edit2, Trash2, MoreVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface EditDeleteMenuProps {
  onEdit: () => void;
  onDelete: () => void;
  className?: string;
}

export function EditDeleteMenu({ onEdit, onDelete, className = "" }: EditDeleteMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    onEdit();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    onDelete();
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-1.5 rounded-lg hover:bg-purple-50 transition-colors"
      >
        <MoreVertical className="h-4 w-4 text-gray-500" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.1 }}
              className="absolute right-0 top-8 z-20 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden min-w-[120px]"
            >
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-purple-50 transition-colors text-left"
              >
                <Edit2 className="h-3.5 w-3.5 text-purple-600" />
                <span className="text-gray-700">Edit</span>
              </button>
              
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-red-50 transition-colors text-left border-t border-gray-50"
              >
                <Trash2 className="h-3.5 w-3.5 text-red-600" />
                <span className="text-gray-700">Delete</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
