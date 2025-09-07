"use client";

import React, { useState, useEffect } from "react";
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
import type { Expense } from "@/types";

interface EditExpenseFormProps {
  expense: Expense;
  onSubmit: (expense: Partial<Expense>) => void;
  onCancel: () => void;
}

export function EditExpenseForm({ expense, onSubmit, onCancel }: EditExpenseFormProps) {
  const [formData, setFormData] = useState({
    title: expense.title,
    amount: expense.amount.toString(),
    category: expense.category,
    paymentMethod: expense.paymentMethod,
    date: new Date(expense.date).toISOString().split('T')[0],
    description: expense.description || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: formData.title,
      amount: parseFloat(formData.amount),
      category: formData.category,
      paymentMethod: formData.paymentMethod,
      date: new Date(formData.date),
      description: formData.description,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
        <Label htmlFor="category">Category</Label>
        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="food_dining">🍔 Food & Dining</SelectItem>
            <SelectItem value="shopping">🛍️ Shopping</SelectItem>
            <SelectItem value="transportation">🚗 Transportation</SelectItem>
            <SelectItem value="entertainment">🎬 Entertainment</SelectItem>
            <SelectItem value="bills_utilities">📱 Bills & Utilities</SelectItem>
            <SelectItem value="healthcare">🏥 Healthcare</SelectItem>
            <SelectItem value="education">📚 Education</SelectItem>
            <SelectItem value="travel">✈️ Travel</SelectItem>
            <SelectItem value="personal_care">💅 Personal Care</SelectItem>
            <SelectItem value="groceries">🛒 Groceries</SelectItem>
            <SelectItem value="rent_mortgage">🏠 Rent/Mortgage</SelectItem>
            <SelectItem value="insurance">🛡️ Insurance</SelectItem>
            <SelectItem value="gifts_donations">🎁 Gifts & Donations</SelectItem>
            <SelectItem value="others">💳 Others</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="paymentMethod">Payment Method</Label>
        <Select value={formData.paymentMethod} onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cash">💵 Cash</SelectItem>
            <SelectItem value="credit_card">💳 Credit Card</SelectItem>
            <SelectItem value="debit_card">💳 Debit Card</SelectItem>
            <SelectItem value="upi">📱 UPI</SelectItem>
            <SelectItem value="bank_transfer">🏦 Bank Transfer</SelectItem>
            <SelectItem value="wallet">👛 Digital Wallet</SelectItem>
            <SelectItem value="other">📝 Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Add notes..."
          className="resize-none"
        />
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit" className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          Update Expense
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
}
