"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { dbHelpers } from "@/lib/db";
import { useLiveQuery } from "dexie-react-hooks";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { Plus, Check, X, Clock } from "lucide-react";
import { motion } from "framer-motion";
import type { LentMoney, LentMoneyStatus } from "@/types";

export default function MoneyLentPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LentMoney | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    reason: "",
    givenDate: new Date().toISOString().split("T")[0],
    comment: "",
    status: "pending" as LentMoneyStatus,
  });

  // Get all lent money records
  const lentMoneyRecords = useLiveQuery(async () => {
    const records = await dbHelpers.db.lentMoney.toArray();
    return records.sort(
      (a, b) =>
        new Date(b.givenDate).getTime() - new Date(a.givenDate).getTime()
    );
  });

  const pendingRecords =
    lentMoneyRecords?.filter((r) => r.status === "pending") || [];
  const returnedRecords =
    lentMoneyRecords?.filter((r) => r.status === "returned") || [];

  const totalPending = pendingRecords.reduce(
    (sum, record) => sum + record.amount,
    0
  );
  const totalReturned = returnedRecords.reduce(
    (sum, record) => sum + record.amount,
    0
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.amount) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      if (editingItem) {
        await dbHelpers.updateLentMoney(editingItem.id!, {
          name: formData.name,
          amount: parseFloat(formData.amount),
          reason: formData.reason,
          givenDate: new Date(formData.givenDate),
          comment: formData.comment,
          status: formData.status,
          returnDate:
            formData.status === "returned" ? new Date() : undefined,
        });
        toast.success("Record updated successfully!");
      } else {
        await dbHelpers.addLentMoney({
          name: formData.name,
          amount: parseFloat(formData.amount),
          reason: formData.reason,
          givenDate: new Date(formData.givenDate),
          comment: formData.comment,
          status: formData.status,
        });
        toast.success("Record added successfully!");
      }

      setModalOpen(false);
      resetForm();
    } catch (error) {
      toast.error("Failed to save record");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      amount: "",
      reason: "",
      givenDate: new Date().toISOString().split("T")[0],
      comment: "",
      status: "pending",
    });
    setEditingItem(null);
  };

  const handleEdit = (record: LentMoney) => {
    setEditingItem(record);
    setFormData({
      name: record.name,
      amount: record.amount.toString(),
      reason: record.reason || "",
      givenDate: new Date(record.givenDate).toISOString().split("T")[0],
      comment: record.comment || "",
      status: record.status,
    });
    setModalOpen(true);
  };

  const handleMarkReturned = async (record: LentMoney) => {
    try {
      await dbHelpers.updateLentMoney(record.id!, {
        status: "returned",
        returnDate: new Date(),
      });
      toast.success("Marked as returned!");
          } catch {
        toast.error("Failed to update status");
      }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this record?")) {
      try {
        await dbHelpers.deleteLentMoney(id);
        toast.success("Record deleted successfully!");
      } catch {
        toast.error("Failed to delete record");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />

      <main className="p-4 pb-20">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Money Lent Tracker</h1>
              <p className="text-muted-foreground">
                Keep track of money you&apos;ve lent to others
              </p>
            </div>
            <Button onClick={() => setModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Record
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  Total Pending
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {formatCurrency(totalPending)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {pendingRecords.length} active records
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  Total Returned
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalReturned)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {returnedRecords.length} completed records
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Pending Records */}
          {pendingRecords.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Pending Returns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pendingRecords.map((record, index) => (
                    <motion.div
                      key={record.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-3 rounded-lg border hover:bg-accent transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-orange-600" />
                            <p className="font-semibold">{record.name}</p>
                          </div>
                          <p className="text-lg font-bold text-orange-600 mt-1">
                            {formatCurrency(record.amount)}
                          </p>
                          {record.reason && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Reason: {record.reason}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            Given on {formatDate(new Date(record.givenDate))}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleMarkReturned(record)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(record)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(record.id!)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Returned Records */}
          {returnedRecords.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Returned</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {returnedRecords.map((record, index) => (
                    <motion.div
                      key={record.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-3 rounded-lg border opacity-75"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-600" />
                            <p className="font-semibold">{record.name}</p>
                          </div>
                          <p className="text-lg font-bold text-green-600 mt-1">
                            {formatCurrency(record.amount)}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Given: {formatDate(new Date(record.givenDate))} |
                            Returned:{" "}
                            {record.returnDate
                              ? formatDate(new Date(record.returnDate))
                              : "N/A"}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(record.id!)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Add/Edit Modal */}
      <Dialog
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Edit Record" : "Add Money Lent Record"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                placeholder="Person's name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">
                  ₹
                </span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="pl-8"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                placeholder="Why was the money given? (optional)"
                value={formData.reason}
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="givenDate">Given Date</Label>
              <Input
                id="givenDate"
                type="date"
                value={formData.givenDate}
                onChange={(e) =>
                  setFormData({ ...formData, givenDate: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment">Comment</Label>
              <Textarea
                id="comment"
                placeholder="Additional notes (optional)"
                value={formData.comment}
                onChange={(e) =>
                  setFormData({ ...formData, comment: e.target.value })
                }
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: LentMoneyStatus) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="returned">Returned</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setModalOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading
                  ? "Saving..."
                  : editingItem
                  ? "Update"
                  : "Add Record"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
