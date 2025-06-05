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

interface AddAttendanceFormProps {
  employees: Employee[]
  onAttendanceAdded: () => void
}

export default function AddAttendanceForm({ employees, onAttendanceAdded }: AddAttendanceFormProps) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    employee_id: "",
    attendance_date: new Date().toISOString().split("T")[0],
    clock_in: "09:00:00",
    clock_out: "17:00:00",
    status: "Present",
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
      const response = await fetch("http://localhost:3000/api/personnel/attendance/add", {
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
        throw new Error("Failed to add attendance record")
      }

      toast({
        title: "Success",
        description: "Attendance record added successfully",
      })

      setFormData({
        employee_id: "",
        attendance_date: new Date().toISOString().split("T")[0],
        clock_in: "09:00:00",
        clock_out: "17:00:00",
        status: "Present",
      })

      setOpen(false)
      onAttendanceAdded()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add attendance record. Please try again.",
        variant: "destructive",
      })
      console.error("Error adding attendance:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Attendance
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Attendance Record</DialogTitle>
            <DialogDescription>Record employee attendance for a specific date.</DialogDescription>
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
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Record"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
