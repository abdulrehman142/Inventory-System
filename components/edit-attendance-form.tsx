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
import type { Employee, Attendance } from "@/components/dashboard"

interface EditAttendanceFormProps {
  attendance: Attendance
  employees: Employee[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onAttendanceUpdated: () => void
}

export default function EditAttendanceForm({
  attendance,
  employees,
  open,
  onOpenChange,
  onAttendanceUpdated,
}: EditAttendanceFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    attendance_id: attendance.attendance_id,
    employee_id: attendance.employee_id.toString(),
    attendance_date: new Date(attendance.attendance_date).toISOString().split("T")[0],
    clock_in: attendance.clock_in.substring(0, 5), // Extract HH:MM from time string
    clock_out: attendance.clock_out.substring(0, 5), // Extract HH:MM from time string
    status: attendance.status,
  })

  // Update form data when attendance prop changes
  useEffect(() => {
    setFormData({
      attendance_id: attendance.attendance_id,
      employee_id: attendance.employee_id.toString(),
      attendance_date: new Date(attendance.attendance_date).toISOString().split("T")[0],
      clock_in: attendance.clock_in.substring(0, 5),
      clock_out: attendance.clock_out.substring(0, 5),
      status: attendance.status,
    })
  }, [attendance])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.employee_id || !formData.attendance_date) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      const response = await fetch("http://localhost:3000/api/personnel/attendance/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          attendance_id: Number.parseInt(formData.attendance_id.toString()),
          employee_id: Number.parseInt(formData.employee_id),
          clock_in: formData.clock_in + ":00", // Add seconds for API format
          clock_out: formData.clock_out + ":00", // Add seconds for API format
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update attendance record")
      }

      toast({
        title: "Success",
        description: "Attendance record updated successfully",
      })

      onOpenChange(false)
      onAttendanceUpdated()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update attendance record. Please try again.",
        variant: "destructive",
      })
      console.error("Error updating attendance:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Attendance Record</DialogTitle>
            <DialogDescription>Update employee attendance information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <input type="hidden" name="attendance_id" value={formData.attendance_id} />
            <div className="space-y-2">
              <Label htmlFor="employee_id">Employee *</Label>
              <Select
                value={formData.employee_id}
                onValueChange={(value) => handleSelectChange("employee_id", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.employee_id} value={employee.employee_id.toString()}>
                      {employee.first_name} {employee.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="attendance_date">Date *</Label>
              <Input
                id="attendance_date"
                name="attendance_date"
                type="date"
                value={formData.attendance_date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clock_in">Clock In *</Label>
                <Input
                  id="clock_in"
                  name="clock_in"
                  type="time"
                  value={formData.clock_in}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clock_out">Clock Out *</Label>
                <Input
                  id="clock_out"
                  name="clock_out"
                  type="time"
                  value={formData.clock_out}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Present">Present</SelectItem>
                  <SelectItem value="Absent">Absent</SelectItem>
                  <SelectItem value="Late">Late</SelectItem>
                  <SelectItem value="Half Day">Half Day</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Record"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
