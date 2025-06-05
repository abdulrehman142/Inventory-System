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
import type { Role } from "@/components/dashboard"

interface EditRoleFormProps {
  role: Role
  open: boolean
  onOpenChange: (open: boolean) => void
  onRoleUpdated: () => void
}

export default function EditRoleForm({ role, open, onOpenChange, onRoleUpdated }: EditRoleFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    role_id: role.role_id,
    role_name: role.role_name,
    description: role.description,
  })

  // Update form data when role prop changes
  useEffect(() => {
    setFormData({
      role_id: role.role_id,
      role_name: role.role_name,
      description: role.description,
    })
  }, [role])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.role_name) {
      toast({
        title: "Validation Error",
        description: "Role name is required.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      const response = await fetch("http://localhost:3000/api/personnel/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          role_id: Number.parseInt(formData.role_id.toString()),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update role")
      }

      toast({
        title: "Success",
        description: "Role updated successfully",
      })

      onOpenChange(false)
      onRoleUpdated()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update role. Please try again.",
        variant: "destructive",
      })
      console.error("Error updating role:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>Update role information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <input type="hidden" name="role_id" value={formData.role_id} />
            <div className="space-y-2">
              <Label htmlFor="role_name">Role Name *</Label>
              <Input id="role_name" name="role_name" value={formData.role_name} onChange={handleChange} required />
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
              {isSubmitting ? "Updating..." : "Update Role"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
