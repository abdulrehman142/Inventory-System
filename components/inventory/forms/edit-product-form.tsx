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
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Product, Category } from "../inventory-dashboard"

interface EditProductFormProps {
  product: Product
  categories: Category[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onProductUpdated: () => void
}

export default function EditProductForm({
  product,
  categories,
  open,
  onOpenChange,
  onProductUpdated,
}: EditProductFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    product_id: product.product_id,
    category_id: product.category_id.toString(),
    product_name: product.product_name,
    description: product.description,
    price: product.price.toString(),
    cost: product.cost.toString(),
    is_digital: product.is_digital,
    release_date: new Date(product.release_date).toISOString().split("T")[0],
  })

  // Update form data when product prop changes
  useEffect(() => {
    setFormData({
      product_id: product.product_id,
      category_id: product.category_id.toString(),
      product_name: product.product_name,
      description: product.description,
      price: product.price.toString(),
      cost: product.cost.toString(),
      is_digital: product.is_digital,
      release_date: new Date(product.release_date).toISOString().split("T")[0],
    })
  }, [product])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_digital: checked }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.product_name || !formData.category_id || !formData.price || !formData.cost) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      const response = await fetch("http://localhost:3000/api/poi/product/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          product_id: Number.parseInt(formData.product_id.toString()),
          category_id: Number.parseInt(formData.category_id),
          price: Number.parseFloat(formData.price),
          cost: Number.parseFloat(formData.cost),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update product")
      }

      toast({
        title: "Success",
        description: "Product updated successfully",
      })

      onOpenChange(false)
      onProductUpdated()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      })
      console.error("Error updating product:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update product information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <input type="hidden" name="product_id" value={formData.product_id} />
            <div className="space-y-2">
              <Label htmlFor="product_name">Product Name *</Label>
              <Input
                id="product_name"
                name="product_name"
                value={formData.product_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category_id">Category *</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => handleSelectChange("category_id", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.category_id} value={category.category_id.toString()}>
                      {category.category_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost">Cost *</Label>
                <Input
                  id="cost"
                  name="cost"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.cost}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="release_date">Release Date</Label>
              <Input
                id="release_date"
                name="release_date"
                type="date"
                value={formData.release_date}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="is_digital" checked={formData.is_digital} onCheckedChange={handleSwitchChange} />
              <Label htmlFor="is_digital">Digital Product</Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
