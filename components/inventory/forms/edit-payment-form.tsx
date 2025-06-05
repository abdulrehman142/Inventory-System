"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import type { Payment, Invoice } from "../inventory-dashboard"

interface EditPaymentFormProps {
  payment: Payment
  invoices: Invoice[]
  onPaymentUpdated: () => void
}

export default function EditPaymentForm({ payment, invoices, onPaymentUpdated }: EditPaymentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    payment_id: payment.payment_id,
    invoice_id: payment.invoice_id.toString(),
    payment_date: new Date(payment.payment_date).toISOString().split("T")[0],
    payment_method: payment.payment_method,
    amount: payment.amount.toString(),
    transaction_id: payment.transaction_id,
    status: payment.status,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.invoice_id || !formData.payment_date || !formData.amount) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      const response = await fetch("http://localhost:3000/api/oap/payments/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payment_id: formData.payment_id,
          invoice_id: Number.parseInt(formData.invoice_id),
          payment_date: formData.payment_date,
          payment_method: formData.payment_method,
          amount: Number.parseFloat(formData.amount),
          transaction_id: formData.transaction_id,
          status: formData.status,
        }),
      })

      if (response.ok) {
        toast({
          title: "Payment Updated",
          description: "The payment has been successfully updated.",
        })
        onPaymentUpdated()
      } else {
        toast({
          title: "Error",
          description: "Failed to update the payment. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating payment:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="invoice_id">Invoice</Label>
          <Select value={formData.invoice_id} onValueChange={(value) => handleSelectChange("invoice_id", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select an invoice" />
            </SelectTrigger>
            <SelectContent>
              {invoices.map((invoice) => (
                <SelectItem key={invoice.invoice_id} value={invoice.invoice_id.toString()}>
                  Invoice #{invoice.invoice_id} - {invoice.invoice_status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="payment_method">Payment Method</Label>
          <Select
            value={formData.payment_method}
            onValueChange={(value) => handleSelectChange("payment_method", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Credit Card">Credit Card</SelectItem>
              <SelectItem value="PayPal">PayPal</SelectItem>
              <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
              <SelectItem value="Cash">Cash</SelectItem>
              <SelectItem value="Check">Check</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="payment_date">Payment Date</Label>
          <Input
            id="payment_date"
            name="payment_date"
            type="date"
            value={formData.payment_date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount ($)</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="transaction_id">Transaction ID</Label>
          <Input
            id="transaction_id"
            name="transaction_id"
            value={formData.transaction_id}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Failed">Failed</SelectItem>
              <SelectItem value="Refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update Payment"}
        </Button>
      </div>
    </form>
  )
}
