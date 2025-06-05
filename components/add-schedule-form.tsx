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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Employee } from "@/components/dashboard"
import { Plus } from "lucide-react"

interface AddScheduleFormProps {
  employees: Employee[]
  onScheduleAdded: () => void
}

export default function AddScheduleForm({ employees, onScheduleAdded }: AddScheduleFormProps) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    employee_id: "",
    shift_date: new Date().toISOString().split("T")[0],
    shift_start: "08:00:00",
    shift_end: "16:00:00",
    shift_status: "Scheduled",
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
      const response = await fetch("http://localhost:3000/api/personnel/schedule/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          employee_id: Number.parseInt(formData.employee_id),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add schedule")
      }

      toast({
        title: "Success",
        description: "Schedule added successfully",
      })

      setFormData({
        employee_id: "",
        shift_date: new Date().toISOString().split("T")[0],
        shift_start: "08:00:00",
        shift_end: "16:00:00",
        shift_status: "Scheduled",
      })

      setOpen(false)
      onScheduleAdded()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add schedule. Please try again.",
        variant: "destructive",
      })
      console.error("Error adding schedule:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Schedule
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Schedule</DialogTitle>
            <DialogDescription>Schedule a shift for an employee.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
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
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Schedule"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
