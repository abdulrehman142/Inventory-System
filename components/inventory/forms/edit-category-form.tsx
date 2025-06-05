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
import type { Category } from "../inventory-dashboard"

interface EditCategoryFormProps {
  category: Category
  open: boolean
  onOpenChange: (open: boolean) => void
  onCategoryUpdated: () => void
}

export default function EditCategoryForm({ category, open, onOpenChange, onCategoryUpdated }: EditCategoryFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    category_id: category.category_id,
    category_name: category.category_name,
    description: category.description,
  })

  // Update form data when category prop changes
  useEffect(() => {
    setFormData({
      category_id: category.category_id,
      category_name: category.category_name,
      description: category.description,
    })
  }, [category])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.category_name) {
      toast({
        title: "Validation Error",
        description: "Category name is required.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      const response = await fetch("http://localhost:3000/api/poi/category/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to update category")
      }

      toast({
        title: "Success",
        description: "Category updated successfully",
      })

      onOpenChange(false)
      onCategoryUpdated()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update category. Please try again.",
        variant: "destructive",
      })
      console.error("Error updating category:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update category information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <input type="hidden" name="category_id" value={formData.category_id} />
            <div className="space-y-2">
              <Label htmlFor="category_name">Category Name *</Label>
              <Input
                id="category_name"
                name="category_name"
                value={formData.category_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
