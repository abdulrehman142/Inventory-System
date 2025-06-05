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
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Product, Supplier, ProductSupplier } from "../inventory-dashboard"

interface AddProductSupplierFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onProductSupplierAdded: () => void
  products: Product[]
  suppliers: Supplier[]
  existingRelationships: ProductSupplier[]
}

export default function AddProductSupplierForm({
  open,
  onOpenChange,
  onProductSupplierAdded,
  products,
  suppliers,
  existingRelationships,
}: AddProductSupplierFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    product_id: "",
    supplier_id: "",
  })

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.product_id || !formData.supplier_id) {
      toast({
        title: "Validation Error",
        description: "Please select both a product and a supplier.",
        variant: "destructive",
      })
      return
    }

    // Check if relationship already exists
    const relationshipExists = existingRelationships.some(
      (rel) =>
        rel.product_id === Number.parseInt(formData.product_id) &&
        rel.supplier_id === Number.parseInt(formData.supplier_id),
    )

    if (relationshipExists) {
      toast({
        title: "Validation Error",
        description: "This product-supplier relationship already exists.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      const response = await fetch("http://localhost:3000/api/poi/product_supplier/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: Number.parseInt(formData.product_id),
          supplier_id: Number.parseInt(formData.supplier_id),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add product-supplier relationship")
      }

      toast({
        title: "Success",
        description: "Product-supplier relationship added successfully",
      })

      setFormData({
        product_id: "",
        supplier_id: "",
      })

      onOpenChange(false)
      onProductSupplierAdded()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product-supplier relationship. Please try again.",
        variant: "destructive",
      })
      console.error("Error adding product-supplier relationship:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Product-Supplier Relationship</DialogTitle>
            <DialogDescription>Link a product to a supplier.</DialogDescription>
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
                  {products.map((product) => (
                    <SelectItem key={product.product_id} value={product.product_id.toString()}>
                      {product.product_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Relationship"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
