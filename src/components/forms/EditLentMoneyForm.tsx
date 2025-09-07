"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
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
import type { LentMoney } from "@/types";

interface EditLentMoneyFormProps {
  lentMoney: LentMoney;
  onSubmit: (lentMoney: Partial<LentMoney>) => void;
  onCancel: () => void;
}

export function EditLentMoneyForm({ lentMoney, onSubmit, onCancel }: EditLentMoneyFormProps) {
  const [formData, setFormData] = useState({
    borrowerName: lentMoney.borrowerName,
    amount: lentMoney.amount.toString(),
    purpose: lentMoney.purpose || '',
    lentDate: new Date(lentMoney.lentDate).toISOString().split('T')[0],
    expectedReturnDate: lentMoney.expectedReturnDate 
      ? new Date(lentMoney.expectedReturnDate).toISOString().split('T')[0]
      : '',
    status: lentMoney.status,
    notes: lentMoney.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      borrowerName: formData.borrowerName,
      amount: parseFloat(formData.amount),
      purpose: formData.purpose,
      lentDate: new Date(formData.lentDate),
      expectedReturnDate: formData.expectedReturnDate ? new Date(formData.expectedReturnDate) : undefined,
      status: formData.status as 'pending' | 'returned',
      notes: formData.notes,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="borrowerName">Borrower Name</Label>
        <Input
          id="borrowerName"
          value={formData.borrowerName}
          onChange={(e) => setFormData({ ...formData, borrowerName: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="purpose">Purpose (Optional)</Label>
        <Input
          id="purpose"
          value={formData.purpose}
          onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
          placeholder="What was it for?"
        />
      </div>

      <div>
        <Label htmlFor="lentDate">Lent Date</Label>
        <Input
          id="lentDate"
          type="date"
          value={formData.lentDate}
          onChange={(e) => setFormData({ ...formData, lentDate: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="expectedReturnDate">Expected Return Date (Optional)</Label>
        <Input
          id="expectedReturnDate"
          type="date"
          value={formData.expectedReturnDate}
          onChange={(e) => setFormData({ ...formData, expectedReturnDate: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">⏳ Pending</SelectItem>
            <SelectItem value="returned">✅ Returned</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Additional notes..."
          className="resize-none"
        />
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit" className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          Update Record
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
}
