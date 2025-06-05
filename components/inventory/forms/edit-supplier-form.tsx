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
import type { Supplier } from "../inventory-dashboard"

interface EditSupplierFormProps {
  supplier: Supplier
  open: boolean
  onOpenChange: (open: boolean) => void
  onSupplierUpdated: () => void
}

export default function EditSupplierForm({ supplier, open, onOpenChange, onSupplierUpdated }: EditSupplierFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    supplier_id: supplier.supplier_id,
    supplier_name: supplier.supplier_name,
    contact_person: supplier.contact_person,
    email: supplier.email,
    phone: supplier.phone,
    address: supplier.address,
  })

  // Update form data when supplier prop changes
  useEffect(() => {
    setFormData({
      supplier_id: supplier.supplier_id,
      supplier_name: supplier.supplier_name,
      contact_person: supplier.contact_person,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
    })
  }, [supplier])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.supplier_name || !formData.contact_person || !formData.email) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      const response = await fetch("http://localhost:3000/api/poi/supplier/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to update supplier")
      }

      toast({
        title: "Success",
        description: "Supplier updated successfully",
      })

      onOpenChange(false)
      onSupplierUpdated()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update supplier. Please try again.",
        variant: "destructive",
      })
      console.error("Error updating supplier:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Supplier</DialogTitle>
            <DialogDescription>Update supplier information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <input type="hidden" name="supplier_id" value={formData.supplier_id} />
            <div className="space-y-2">
              <Label htmlFor="supplier_name">Supplier Name *</Label>
              <Input
                id="supplier_name"
                name="supplier_name"
                value={formData.supplier_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_person">Contact Person *</Label>
              <Input
                id="contact_person"
                name="contact_person"
                value={formData.contact_person}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" value={formData.address} onChange={handleChange} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Supplier"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
