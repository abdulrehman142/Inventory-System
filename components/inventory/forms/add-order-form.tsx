"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import type { Customer } from "../inventory-dashboard"

interface AddOrderFormProps {
  customers: Customer[]
  onOrderAdded: () => void
}

export default function AddOrderForm({ customers, onOrderAdded }: AddOrderFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    customer_id: "",
    order_date: new Date().toISOString().split("T")[0],
    order_status: "New",
    total_amount: "",
    discount: "0",
    tax: "",
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

    if (!formData.customer_id || !formData.total_amount) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      const response = await fetch("http://localhost:3000/api/oap/orders/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_id: Number.parseInt(formData.customer_id),
          order_date: formData.order_date,
          order_status: formData.order_status,
          total_amount: Number.parseFloat(formData.total_amount),
          discount: Number.parseFloat(formData.discount || "0"),
          tax: Number.parseFloat(formData.tax || "0"),
        }),
      })

      if (response.ok) {
        toast({
          title: "Order Added",
          description: "The order has been successfully created.",
        })
        onOrderAdded()
      } else {
        toast({
          title: "Error",
          description: "Failed to add the order. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error adding order:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Calculate tax automatically based on total amount (6% tax rate)
  const calculateTax = (total: string) => {
    if (!total || isNaN(Number.parseFloat(total))) return "0"
    const taxAmount = Number.parseFloat(total) * 0.06
    return taxAmount.toFixed(2)
  }

  // Update tax when total amount changes
  const handleTotalAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setFormData((prev) => ({
      ...prev,
      total_amount: value,
      tax: calculateTax(value),
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="customer_id">Customer</Label>
          <Select value={formData.customer_id} onValueChange={(value) => handleSelectChange("customer_id", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a customer" />
            </SelectTrigger>
            <SelectContent>
              {customers.map((customer) => (
                <SelectItem key={customer.customer_id} value={customer.customer_id.toString()}>
                  {customer.first_name} {customer.last_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="order_date">Order Date</Label>
          <Input id="order_date" name="order_date" type="date" value={formData.order_date} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="order_status">Status</Label>
          <Select value={formData.order_status} onValueChange={(value) => handleSelectChange("order_status", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="New">New</SelectItem>
              <SelectItem value="Processing">Processing</SelectItem>
              <SelectItem value="Shipped">Shipped</SelectItem>
              <SelectItem value="Delivered">Delivered</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="total_amount">Total Amount ($)</Label>
          <Input
            id="total_amount"
            name="total_amount"
            type="number"
            step="0.01"
            min="0"
            value={formData.total_amount}
            onChange={handleTotalAmountChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="discount">Discount ($)</Label>
          <Input
            id="discount"
            name="discount"
            type="number"
            step="0.01"
            min="0"
            value={formData.discount}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tax">Tax ($)</Label>
          <Input id="tax" name="tax" type="number" step="0.01" min="0" value={formData.tax} onChange={handleChange} />
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Order"}
        </Button>
      </div>
    </form>
  )
}
