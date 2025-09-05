"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { format } from "date-fns";
import type { Expense, Income, Investment, LentMoney } from "@/types";

type EntryType = 'expense' | 'income' | 'investment' | 'lent';
type Entry = Expense | Income | Investment | LentMoney;

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: Entry | null;
  type: EntryType;
  onSave: (updatedEntry: Partial<Entry>) => void;
}

export function EditModal({ isOpen, onClose, entry, type, onSave }: EditModalProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>({});

  useEffect(() => {
    if (entry) {
      // Convert dates to string format for input fields
      const data: Record<string, unknown> = { ...entry };
      if ('date' in entry && entry.date) {
        data.date = format(new Date(entry.date), 'yyyy-MM-dd');
      }
      if ('givenDate' in entry && entry.givenDate) {
        data.givenDate = format(new Date(entry.givenDate), 'yyyy-MM-dd');
      }
      if ('returnDate' in entry && entry.returnDate) {
        data.returnDate = format(new Date(entry.returnDate), 'yyyy-MM-dd');
      }
      setFormData(data);
    }
  }, [entry]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert date strings back to Date objects
    const updatedData = { ...formData };
    if ('date' in updatedData && updatedData.date) {
      updatedData.date = new Date(updatedData.date as string);
    }
    if ('givenDate' in updatedData && updatedData.givenDate) {
      updatedData.givenDate = new Date(updatedData.givenDate as string);
    }
    if ('returnDate' in updatedData && updatedData.returnDate) {
      updatedData.returnDate = new Date(updatedData.returnDate as string);
    }
    
    onSave(updatedData);
    onClose();
  };

  const handleChange = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getTitle = () => {
    switch (type) {
      case 'expense': return 'Edit Expense';
      case 'income': return 'Edit Income';
      case 'investment': return 'Edit Investment';
      case 'lent': return 'Edit Lent Money';
      default: return 'Edit Entry';
    }
  };

  if (!entry) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="gradient-text text-xl">{getTitle()}</DialogTitle>
          <DialogDescription>Update the details below</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Amount Field - Common to all */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              value={(formData.amount as number) || ''}
              onChange={(e) => handleChange('amount', parseFloat(e.target.value))}
              required
              min="0"
              step="0.01"
            />
          </div>

          {/* Date Field */}
          {type !== 'lent' && (
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={(formData.date as string) || ''}
                onChange={(e) => handleChange('date', e.target.value)}
                required
              />
            </div>
          )}

          {/* Expense-specific fields */}
          {type === 'expense' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={(formData.description as string) || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={(formData.category as string) || ''}
                  onValueChange={(value) => handleChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="food">Food & Dining</SelectItem>
                    <SelectItem value="transport">Transport</SelectItem>
                    <SelectItem value="shopping">Shopping</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                    <SelectItem value="bills">Bills & Utilities</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select
                  value={(formData.paymentMethod as string) || ''}
                  onValueChange={(value) => handleChange('paymentMethod', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                    <SelectItem value="debit_card">Debit Card</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="net_banking">Net Banking</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.notes !== undefined && (
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={(formData.notes as string) || ''}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    rows={3}
                  />
                </div>
              )}
            </>
          )}

          {/* Income-specific fields */}
          {type === 'income' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <Input
                  id="source"
                  value={(formData.source as string) || ''}
                  onChange={(e) => handleChange('source', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={(formData.category as string) || ''}
                  onValueChange={(value) => handleChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="salary">Salary</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="investment">Investment Returns</SelectItem>
                    <SelectItem value="rental">Rental Income</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="isRecurring">Recurring?</Label>
                <Select
                  value={(formData.isRecurring as boolean) ? 'yes' : 'no'}
                  onValueChange={(value) => handleChange('isRecurring', value === 'yes')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {/* Investment-specific fields */}
          {type === 'investment' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Investment Name</Label>
                <Input
                  id="name"
                  value={(formData.name as string) || ''}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={(formData.type as string) || ''}
                  onValueChange={(value) => handleChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stocks">Stocks</SelectItem>
                    <SelectItem value="mutual_funds">Mutual Funds</SelectItem>
                    <SelectItem value="bonds">Bonds</SelectItem>
                    <SelectItem value="real_estate">Real Estate</SelectItem>
                    <SelectItem value="crypto">Cryptocurrency</SelectItem>
                    <SelectItem value="fd">Fixed Deposit</SelectItem>
                    <SelectItem value="gold">Gold</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="returnPercentage">Expected Return (%)</Label>
                <Input
                  id="returnPercentage"
                  type="number"
                  value={(formData.returnPercentage as number) || ''}
                  onChange={(e) => handleChange('returnPercentage', parseFloat(e.target.value))}
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="riskLevel">Risk Level</Label>
                <Select
                  value={(formData.riskLevel as string) || ''}
                  onValueChange={(value) => handleChange('riskLevel', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select risk level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {/* Lent Money-specific fields */}
          {type === 'lent' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Person Name</Label>
                <Input
                  id="name"
                  value={(formData.name as string) || ''}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={(formData.phone as string) || ''}
                  onChange={(e) => handleChange('phone', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="givenDate">Given Date</Label>
                <Input
                  id="givenDate"
                  type="date"
                  value={(formData.givenDate as string) || ''}
                  onChange={(e) => handleChange('givenDate', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="returnDate">Expected Return Date</Label>
                <Input
                  id="returnDate"
                  type="date"
                  value={(formData.returnDate as string) || ''}
                  onChange={(e) => handleChange('returnDate', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={(formData.status as string) || ''}
                  onValueChange={(value) => handleChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="returned">Returned</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason</Label>
                <Textarea
                  id="reason"
                  value={(formData.reason as string) || ''}
                  onChange={(e) => handleChange('reason', e.target.value)}
                  rows={3}
                />
              </div>
            </>
          )}

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
              <Button type="submit" className="w-full gradient-bg text-white">
                Save Changes
              </Button>
            </motion.div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
