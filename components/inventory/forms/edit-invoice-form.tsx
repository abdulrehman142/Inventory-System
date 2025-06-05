"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import type { Invoice, Order } from "../inventory-dashboard"

interface EditInvoiceFormProps {
  invoice: Invoice
  orders: Order[]
  onInvoiceUpdated: () => void
}

export default function EditInvoiceForm({ invoice, orders, onInvoiceUpdated }: EditInvoiceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    invoice_id: invoice.invoice_id,
    order_id: invoice.order_id.toString(),
    invoice_date: new Date(invoice.invoice_date).toISOString().split("T")[0],
    due_date: new Date(invoice.due_date).toISOString().split("T")[0],
    invoice_status: invoice.invoice_status,
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

    if (!formData.order_id || !formData.invoice_date || !formData.due_date) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      const response = await fetch("http://localhost:3000/api/oap/invoices/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          invoice_id: formData.invoice_id,
          order_id: Number.parseInt(formData.order_id),
          invoice_date: formData.invoice_date,
          due_date: formData.due_date,
          invoice_status: formData.invoice_status,
        }),
      })

      if (response.ok) {
        toast({
          title: "Invoice Updated",
          description: "The invoice has been successfully updated.",
        })
        onInvoiceUpdated()
      } else {
        toast({
          title: "Error",
          description: "Failed to update the invoice. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating invoice:", error)
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
          <Label htmlFor="order_id">Order</Label>
          <Select value={formData.order_id} onValueChange={(value) => handleSelectChange("order_id", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select an order" />
            </SelectTrigger>
            <SelectContent>
              {orders.map((order) => (
                <SelectItem key={order.order_id} value={order.order_id.toString()}>
                  Order #{order.order_id} - ${order.total_amount.toFixed(2)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="invoice_status">Status</Label>
          <Select
            value={formData.invoice_status}
            onValueChange={(value) => handleSelectChange("invoice_status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Unpaid">Unpaid</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Overdue">Overdue</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="invoice_date">Invoice Date</Label>
          <Input
            id="invoice_date"
            name="invoice_date"
            type="date"
            value={formData.invoice_date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="due_date">Due Date</Label>
          <Input id="due_date" name="due_date" type="date" value={formData.due_date} onChange={handleChange} required />
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update Invoice"}
        </Button>
      </div>
    </form>
  )
}
