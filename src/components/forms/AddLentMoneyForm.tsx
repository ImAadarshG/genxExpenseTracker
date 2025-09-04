"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "@/store/useStore";
import { dbHelpers } from "@/lib/db";
import { toast } from "sonner";
import type { LentMoneyStatus } from "@/types";

export function AddLentMoneyForm() {
  const { addLentMoneyModalOpen, setAddLentMoneyModalOpen } = useStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    reason: "",
    givenDate: new Date().toISOString().split("T")[0],
    comment: "",
    status: "pending" as LentMoneyStatus,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.amount) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      await dbHelpers.addLentMoney({
        name: formData.name,
        amount: parseFloat(formData.amount),
        reason: formData.reason,
        givenDate: new Date(formData.givenDate),
        comment: formData.comment,
        status: formData.status,
      });

      toast.success("Money lent record added successfully!");
      setAddLentMoneyModalOpen(false);
      setFormData({
        name: "",
        amount: "",
        reason: "",
        givenDate: new Date().toISOString().split("T")[0],
        comment: "",
        status: "pending",
      });
    } catch (error) {
      toast.error("Failed to add record");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={addLentMoneyModalOpen} onOpenChange={setAddLentMoneyModalOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Money Lent</DialogTitle>
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

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setAddLentMoneyModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Record"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
