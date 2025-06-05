"use client"

import type React from "react"

import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Supplier } from "../inventory-dashboard"

interface AddPurchaseOrderFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPurchaseOrderAdded: () => void
  suppliers: Supplier[]
}

export default function AddPurchaseOrderForm({
  open,
  onOpenChange,
  onPurchaseOrderAdded,
  suppliers,
}: AddPurchaseOrderFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    supplier_id: "",
    order_date: new Date().toISOString().split("T")[0],
    status: "Pending",
    total_amount: "",
    expected_delivery_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // Default to 2 weeks from now
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

    if (!formData.supplier_id || !formData.order_date || !formData.total_amount || !formData.expected_delivery_date) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      const response = await fetch("http://localhost:3000/api/procurement/purchase-orders/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          supplier_id: Number.parseInt(formData.supplier_id),
          total_amount: Number.parseFloat(formData.total_amount),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add purchase order")
      }

      toast({
        title: "Success",
        description: "Purchase order added successfully",
      })

      setFormData({
        supplier_id: "",
        order_date: new Date().toISOString().split("T")[0],
        status: "Pending",
        total_amount: "",
        expected_delivery_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      })

      onOpenChange(false)
      onPurchaseOrderAdded()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add purchase order. Please try again.",
        variant: "destructive",
      })
      console.error("Error adding purchase order:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Purchase Order</DialogTitle>
            <DialogDescription>Create a new purchase order for your inventory.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="supplier_id">Supplier *</Label>
              <Select
                value={formData.supplier_id}
                onValueChange={(value) => handleSelectChange("supplier_id", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.supplier_id} value={supplier.supplier_id.toString()}>
                      {supplier.supplier_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="order_date">Order Date *</Label>
                <Input
                  id="order_date"
                  name="order_date"
                  type="date"
                  value={formData.order_date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expected_delivery_date">Expected Delivery *</Label>
                <Input
                  id="expected_delivery_date"
                  name="expected_delivery_date"
                  type="date"
                  value={formData.expected_delivery_date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="total_amount">Total Amount *</Label>
                <Input
                  id="total_amount"
                  name="total_amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.total_amount}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Purchase Order"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
