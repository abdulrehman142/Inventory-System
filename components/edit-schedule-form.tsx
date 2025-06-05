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
import type { Employee, Schedule } from "@/components/dashboard"

interface EditScheduleFormProps {
  schedule: Schedule
  employees: Employee[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onScheduleUpdated: () => void
}

export default function EditScheduleForm({
  schedule,
  employees,
  open,
  onOpenChange,
  onScheduleUpdated,
}: EditScheduleFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    schedule_id: schedule.schedule_id,
    employee_id: schedule.employee_id.toString(),
    shift_date: new Date(schedule.shift_date).toISOString().split("T")[0],
    shift_start: schedule.shift_start.substring(0, 5), // Extract HH:MM from time string
    shift_end: schedule.shift_end.substring(0, 5), // Extract HH:MM from time string
    shift_status: schedule.shift_status,
  })

  // Update form data when schedule prop changes
  useEffect(() => {
    setFormData({
      schedule_id: schedule.schedule_id,
      employee_id: schedule.employee_id.toString(),
      shift_date: new Date(schedule.shift_date).toISOString().split("T")[0],
      shift_start: schedule.shift_start.substring(0, 5),
      shift_end: schedule.shift_end.substring(0, 5),
      shift_status: schedule.shift_status,
    })
  }, [schedule])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.employee_id || !formData.shift_date) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      const response = await fetch("http://localhost:3000/api/personnel/schedule/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          schedule_id: Number.parseInt(formData.schedule_id.toString()),
          employee_id: Number.parseInt(formData.employee_id),
          shift_start: formData.shift_start + ":00", // Add seconds for API format
          shift_end: formData.shift_end + ":00", // Add seconds for API format
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update schedule")
      }

      toast({
        title: "Success",
        description: "Schedule updated successfully",
      })

      onOpenChange(false)
      onScheduleUpdated()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update schedule. Please try again.",
        variant: "destructive",
      })
      console.error("Error updating schedule:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Schedule</DialogTitle>
            <DialogDescription>Update employee schedule information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <input type="hidden" name="schedule_id" value={formData.schedule_id} />
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
              <Label htmlFor="shift_date">Shift Date *</Label>
              <Input
                id="shift_date"
                name="shift_date"
                type="date"
                value={formData.shift_date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="shift_start">Start Time *</Label>
                <Input
                  id="shift_start"
                  name="shift_start"
                  type="time"
                  value={formData.shift_start}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shift_end">End Time *</Label>
                <Input
                  id="shift_end"
                  name="shift_end"
                  type="time"
                  value={formData.shift_end}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="shift_status">Status</Label>
              <Select
                value={formData.shift_status}
                onValueChange={(value) => handleSelectChange("shift_status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Schedule"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
