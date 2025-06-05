"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import type { Order } from "../inventory-dashboard"

interface AddInvoiceFormProps {
  orders: Order[]
  onInvoiceAdded: () => void
}

export default function AddInvoiceForm({ orders, onInvoiceAdded }: AddInvoiceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    order_id: "",
    invoice_date: new Date().toISOString().split("T")[0],
    due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 14 days from now
    invoice_status: "Unpaid",
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

      const response = await fetch("http://localhost:3000/api/oap/invoices/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_id: Number.parseInt(formData.order_id),
          invoice_date: formData.invoice_date,
          due_date: formData.due_date,
          invoice_status: formData.invoice_status,
        }),
      })

      if (response.ok) {
        toast({
          title: "Invoice Added",
          description: "The invoice has been successfully created.",
        })
        onInvoiceAdded()
      } else {
        toast({
          title: "Error",
          description: "Failed to add the invoice. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error adding invoice:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Filter out orders that already have invoices
  const availableOrders = orders.filter(
    (order) => order.order_status !== "Cancelled" && order.order_status !== "Returned",
  )

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
              {availableOrders.map((order) => (
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
          {isSubmitting ? "Adding..." : "Add Invoice"}
        </Button>
      </div>
    </form>
  )
}
