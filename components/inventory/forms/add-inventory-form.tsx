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
import type { Product, InventoryItem } from "../inventory-dashboard"

interface AddInventoryFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onInventoryAdded: () => void
  products: Product[]
  existingInventory: InventoryItem[]
}

export default function AddInventoryForm({
  open,
  onOpenChange,
  onInventoryAdded,
  products,
  existingInventory,
}: AddInventoryFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    product_id: "",
    quantity: "0",
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

    if (!formData.product_id || formData.quantity === "") {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    // Check if inventory already exists for this product
    const inventoryExists = existingInventory.some((item) => item.product_id === Number.parseInt(formData.product_id))

    if (inventoryExists) {
      toast({
        title: "Validation Error",
        description: "Inventory for this product already exists. Please use the edit function instead.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      const response = await fetch("http://localhost:3000/api/poi/inventory/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: Number.parseInt(formData.product_id),
          quantity: Number.parseInt(formData.quantity),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add inventory")
      }

      toast({
        title: "Success",
        description: "Inventory added successfully",
      })

      setFormData({
        product_id: "",
        quantity: "0",
      })

      onOpenChange(false)
      onInventoryAdded()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add inventory. Please try again.",
        variant: "destructive",
      })
      console.error("Error adding inventory:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Filter out products that already have inventory
  const availableProducts = products.filter(
    (product) => !existingInventory.some((item) => item.product_id === product.product_id),
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Inventory</DialogTitle>
            <DialogDescription>Add inventory for a product.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
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
                  {availableProducts.length > 0 ? (
                    availableProducts.map((product) => (
                      <SelectItem key={product.product_id} value={product.product_id.toString()}>
                        {product.product_name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      No available products
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {availableProducts.length === 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  All products already have inventory records. Use the edit function to update quantities.
                </p>
              )}
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
            <Button type="submit" disabled={isSubmitting || availableProducts.length === 0}>
              {isSubmitting ? "Adding..." : "Add Inventory"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
