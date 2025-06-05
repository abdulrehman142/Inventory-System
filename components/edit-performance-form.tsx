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
import { Textarea } from "@/components/ui/textarea"
import type { Employee, Performance } from "@/components/dashboard"

interface EditPerformanceFormProps {
  performance: Performance
  employees: Employee[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onPerformanceUpdated: () => void
}

export default function EditPerformanceForm({
  performance,
  employees,
  open,
  onOpenChange,
  onPerformanceUpdated,
}: EditPerformanceFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    performance_id: performance.performance_id,
    employee_id: performance.employee_id.toString(),
    review_date: new Date(performance.review_date).toISOString().split("T")[0],
    performance_score: performance.performance_score.toString(),
    comments: performance.comments,
    incentive: performance.incentive ? performance.incentive.toString() : "",
  })

  // Update form data when performance prop changes
  useEffect(() => {
    setFormData({
      performance_id: performance.performance_id,
      employee_id: performance.employee_id.toString(),
      review_date: new Date(performance.review_date).toISOString().split("T")[0],
      performance_score: performance.performance_score.toString(),
      comments: performance.comments,
      incentive: performance.incentive ? performance.incentive.toString() : "",
    })
  }, [performance])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.employee_id || !formData.review_date || !formData.performance_score) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      const response = await fetch("http://localhost:3000/api/personnel/performance/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          performance_id: Number.parseInt(formData.performance_id.toString()),
          employee_id: Number.parseInt(formData.employee_id),
          performance_score: Number.parseFloat(formData.performance_score),
          incentive: formData.incentive ? Number.parseInt(formData.incentive) : null,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update performance record")
      }

      toast({
        title: "Success",
        description: "Performance record updated successfully",
      })

      onOpenChange(false)
      onPerformanceUpdated()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update performance record. Please try again.",
        variant: "destructive",
      })
      console.error("Error updating performance:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Performance Review</DialogTitle>
            <DialogDescription>Update employee performance information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <input type="hidden" name="performance_id" value={formData.performance_id} />
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
              <Label htmlFor="review_date">Review Date *</Label>
              <Input
                id="review_date"
                name="review_date"
                type="date"
                value={formData.review_date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="performance_score">Performance Score (0-10) *</Label>
              <Input
                id="performance_score"
                name="performance_score"
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={formData.performance_score}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="comments">Comments</Label>
              <Textarea id="comments" name="comments" value={formData.comments} onChange={handleChange} rows={3} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="incentive">Incentive Amount</Label>
              <Input
                id="incentive"
                name="incentive"
                type="number"
                min="0"
                value={formData.incentive}
                onChange={handleChange}
                placeholder="Enter amount (optional)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Review"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
