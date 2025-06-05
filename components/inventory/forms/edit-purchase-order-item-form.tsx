"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import type { PurchaseOrderItem, PurchaseOrder, Product } from "../inventory-dashboard"

interface EditPurchaseOrderItemFormProps {
  purchaseOrderItem: PurchaseOrderItem
  purchaseOrders: PurchaseOrder[]
  products: Product[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onPurchaseOrderItemUpdated: () => void
}

export default function EditPurchaseOrderItemForm({
  purchaseOrderItem,
  purchaseOrders,
  products,
  open,
  onOpenChange,
  onPurchaseOrderItemUpdated,
}: EditPurchaseOrderItemFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    po_item_id: purchaseOrderItem.po_item_id,
    po_id: purchaseOrderItem.po_id.toString(),
    product_id: purchaseOrderItem.product_id.toString(),
    quantity: purchaseOrderItem.quantity.toString(),
    unit_cost: purchaseOrderItem.unit_cost.toString(),
  })

  // Update form data when purchaseOrderItem prop changes
  useEffect(() => {
    setFormData({
      po_item_id: purchaseOrderItem.po_item_id,
      po_id: purchaseOrderItem.po_id.toString(),
      product_id: purchaseOrderItem.product_id.toString(),
      quantity: purchaseOrderItem.quantity.toString(),
      unit_cost: purchaseOrderItem.unit_cost.toString(),
    })
  }, [purchaseOrderItem])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    // If product is selected, set default unit cost from product cost
    if (name === "product_id") {
      const selectedProduct = products.find((p) => p.product_id.toString() === value)
      if (selectedProduct) {
        setFormData((prev) => ({ ...prev, unit_cost: selectedProduct.cost.toString() }))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.po_id || !formData.product_id || !formData.quantity || !formData.unit_cost) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      const response = await fetch("http://localhost:3000/api/procurement/purchase-order-items/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          po_item_id: Number.parseInt(formData.po_item_id.toString()),
          po_id: Number.parseInt(formData.po_id),
          product_id: Number.parseInt(formData.product_id),
          quantity: Number.parseInt(formData.quantity),
          unit_cost: Number.parseFloat(formData.unit_cost),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update purchase order item")
      }

      toast({
        title: "Success",
        description: "Purchase order item updated successfully",
      })

      onOpenChange(false)
      onPurchaseOrderItemUpdated()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update purchase order item. Please try again.",
        variant: "destructive",
      })
      console.error("Error updating purchase order item:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Filter to only show active purchase orders (not cancelled)
  const activePurchaseOrders = purchaseOrders.filter((po) => po.status !== "Cancelled")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Purchase Order Item</DialogTitle>
            <DialogDescription>Update purchase order item information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <input type="hidden" name="po_item_id" value={formData.po_item_id} />

            <div className="space-y-2">
              <Label htmlFor="po_id">Purchase Order *</Label>
              <Select value={formData.po_id} onValueChange={(value) => handleSelectChange("po_id", value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a purchase order" />
                </SelectTrigger>
                <SelectContent>
                  {activePurchaseOrders.map((po) => (
                    <SelectItem key={po.po_id} value={po.po_id.toString()}>
                      PO-{po.po_id} - {po.supplier_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="product_id">Product *</Label>
              <Select
                value={formData.product_id}
                onValueChange={(value) => handleSelectChange("product_id", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.product_id} value={product.product_id.toString()}>
                      {product.product_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit_cost">Unit Cost *</Label>
                <Input
                  id="unit_cost"
                  name="unit_cost"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.unit_cost}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {formData.quantity && formData.unit_cost && (
              <div className="rounded-md bg-muted p-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total:</span>
                  <span className="text-sm font-bold">
                    ${(Number(formData.quantity || 0) * Number(formData.unit_cost || 0)).toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
