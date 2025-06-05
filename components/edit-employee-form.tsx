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
import type { Employee, Role } from "@/components/dashboard"

interface EditEmployeeFormProps {
  employee: Employee
  roles: Role[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onEmployeeUpdated: () => void
}

export default function EditEmployeeForm({
  employee,
  roles,
  open,
  onOpenChange,
  onEmployeeUpdated,
}: EditEmployeeFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    employee_id: employee.employee_id,
    role_id: employee.role_id.toString(),
    first_name: employee.first_name,
    last_name: employee.last_name,
    phone: employee.phone,
    email: employee.email,
    position: employee.position,
    hire_date: new Date(employee.hire_date).toISOString().split("T")[0],
    status: employee.status,
  })

  // Update form data when employee prop changes
  useEffect(() => {
    setFormData({
      employee_id: employee.employee_id,
      role_id: employee.role_id.toString(),
      first_name: employee.first_name,
      last_name: employee.last_name,
      phone: employee.phone,
      email: employee.email,
      position: employee.position,
      hire_date: new Date(employee.hire_date).toISOString().split("T")[0],
      status: employee.status,
    })
  }, [employee])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.first_name || !formData.last_name || !formData.role_id || !formData.email) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      const response = await fetch("http://localhost:3000/api/personnel/employee/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          employee_id: Number.parseInt(formData.employee_id.toString()),
          role_id: Number.parseInt(formData.role_id),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update employee")
      }

      toast({
        title: "Success",
        description: "Employee updated successfully",
      })

      onOpenChange(false)
      onEmployeeUpdated()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update employee. Please try again.",
        variant: "destructive",
      })
      console.error("Error updating employee:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
            <DialogDescription>Update employee information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <input type="hidden" name="employee_id" value={formData.employee_id} />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name *</Label>
                <Input id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name *</Label>
                <Input id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role_id">Role *</Label>
              <Select value={formData.role_id} onValueChange={(value) => handleSelectChange("role_id", value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.role_id} value={role.role_id.toString()}>
                      {role.role_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position *</Label>
              <Input id="position" name="position" value={formData.position} onChange={handleChange} required />
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hire_date">Hire Date</Label>
                <Input id="hire_date" name="hire_date" type="date" value={formData.hire_date} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="On Leave">On Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Employee"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
