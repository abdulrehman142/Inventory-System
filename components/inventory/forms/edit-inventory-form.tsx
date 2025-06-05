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
import type { InventoryItem, Product } from "../inventory-dashboard"

interface EditInventoryFormProps {
  inventory: InventoryItem
  products: Product[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onInventoryUpdated: () => void
}

export default function EditInventoryForm({
  inventory,
  products,
  open,
  onOpenChange,
  onInventoryUpdated,
}: EditInventoryFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    inventory_id: inventory.inventory_id,
    quantity: inventory.quantity.toString(),
  })

  // Update form data when inventory prop changes
  useEffect(() => {
    setFormData({
      inventory_id: inventory.inventory_id,
      quantity: inventory.quantity.toString(),
    })
  }, [inventory])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const getProductName = (productId: number) => {
    const product = products.find((p) => p.product_id === productId)
    return product ? product.product_name : "Unknown Product"
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.quantity === "") {
      toast({
        title: "Validation Error",
        description: "Please enter a quantity.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      const response = await fetch("http://localhost:3000/api/poi/inventory/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inventory_id: Number.parseInt(formData.inventory_id.toString()),
          quantity: Number.parseInt(formData.quantity),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update inventory")
      }

      toast({
        title: "Success",
        description: "Inventory updated successfully",
      })

      onOpenChange(false)
      onInventoryUpdated()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update inventory. Please try again.",
        variant: "destructive",
      })
      console.error("Error updating inventory:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Inventory</DialogTitle>
            <DialogDescription>Update inventory quantity for {getProductName(inventory.product_id)}.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <input type="hidden" name="inventory_id" value={formData.inventory_id} />
            <div className="space-y-2">
              <Label htmlFor="product">Product</Label>
              <Input id="product" value={getProductName(inventory.product_id)} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Inventory"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
