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
import type { LentMoney, LentMoneyStatus } from "@/types";

interface EditLentMoneyFormProps {
  lentMoney: LentMoney;
  onSubmit: (lentMoney: Partial<LentMoney>) => void;
  onCancel: () => void;
}

export function EditLentMoneyForm({ lentMoney, onSubmit, onCancel }: EditLentMoneyFormProps) {
  const [formData, setFormData] = useState({
    name: lentMoney.name,
    amount: lentMoney.amount.toString(),
    reason: lentMoney.reason || '',
    givenDate: new Date(lentMoney.givenDate).toISOString().split('T')[0],
    returnDate: lentMoney.returnDate 
      ? new Date(lentMoney.returnDate).toISOString().split('T')[0]
      : '',
    status: lentMoney.status,
    comment: lentMoney.comment || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      amount: parseFloat(formData.amount),
      reason: formData.reason,
      givenDate: new Date(formData.givenDate),
      returnDate: formData.returnDate ? new Date(formData.returnDate) : undefined,
      status: formData.status as 'pending' | 'returned',
      comment: formData.comment,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Borrower Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
        <Label htmlFor="reason">Reason (Optional)</Label>
        <Input
          id="reason"
          value={formData.reason}
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          placeholder="What was it for?"
        />
      </div>

      <div>
        <Label htmlFor="givenDate">Given Date</Label>
        <Input
          id="givenDate"
          type="date"
          value={formData.givenDate}
          onChange={(e) => setFormData({ ...formData, givenDate: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="returnDate">Return Date (Optional)</Label>
        <Input
          id="returnDate"
          type="date"
          value={formData.returnDate}
          onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as LentMoneyStatus })}>
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
        <Label htmlFor="comment">Comment (Optional)</Label>
        <Textarea
          id="comment"
          value={formData.comment}
          onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
          placeholder="Additional comments..."
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
