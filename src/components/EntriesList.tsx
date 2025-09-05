"use client";

import React, { useState } from "react";
import { EntryCard } from "./EntryCard";
import { EditModal } from "./EditModal";
import { dbHelpers } from "@/lib/db";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { motion, AnimatePresence } from "framer-motion";
import type { Expense, Income, Investment, LentMoney } from "@/types";

type EntryType = 'expense' | 'income' | 'investment' | 'lent';
type Entry = Expense | Income | Investment | LentMoney;

interface EntriesListProps {
  entries: Entry[];
  type: EntryType;
  onUpdate?: () => void;
}

export function EntriesList({ entries, type, onUpdate }: EntriesListProps) {
  const { toast } = useToast();
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleEdit = (entry: Entry) => {
    setEditingEntry(entry);
  };

  const handleSaveEdit = async (updatedEntry: Partial<Entry>) => {
    if (!editingEntry || !editingEntry.id) return;

    try {
      switch (type) {
        case 'expense':
          await dbHelpers.updateExpense(editingEntry.id, updatedEntry as Partial<Expense>);
          break;
        case 'income':
          await dbHelpers.updateIncome(editingEntry.id, updatedEntry as Partial<Income>);
          break;
        case 'investment':
          await dbHelpers.updateInvestment(editingEntry.id, updatedEntry as Partial<Investment>);
          break;
        case 'lent':
          await dbHelpers.updateLentMoney(editingEntry.id, updatedEntry as Partial<LentMoney>);
          break;
      }

      toast({
        title: "Success",
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully`,
      });

      if (onUpdate) onUpdate();
      setEditingEntry(null);
    } catch (error) {
      console.error(`Error updating ${type}:`, error);
      toast({
        title: "Error",
        description: `Failed to update ${type}`,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      switch (type) {
        case 'expense':
          await dbHelpers.deleteExpense(deletingId);
          break;
        case 'income':
          await dbHelpers.deleteIncome(deletingId);
          break;
        case 'investment':
          await dbHelpers.deleteInvestment(deletingId);
          break;
        case 'lent':
          await dbHelpers.deleteLentMoney(deletingId);
          break;
      }

      toast({
        title: "Success",
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`,
      });

      if (onUpdate) onUpdate();
      setDeletingId(null);
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      toast({
        title: "Error",
        description: `Failed to delete ${type}`,
        variant: "destructive",
      });
    }
  };

  if (entries.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No {type}s found. Add your first {type}!
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-3">
        <AnimatePresence mode="popLayout">
          {entries.map((entry, index) => (
            <motion.div
              key={entry.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
            >
              <EntryCard
                entry={entry}
                type={type}
                onEdit={handleEdit}
                onDelete={setDeletingId}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Edit Modal */}
      <EditModal
        isOpen={!!editingEntry}
        onClose={() => setEditingEntry(null)}
        entry={editingEntry}
        type={type}
        onSave={handleSaveEdit}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this {type}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
