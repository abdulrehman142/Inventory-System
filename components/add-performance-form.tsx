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
import { Textarea } from "@/components/ui/textarea"
import type { Employee } from "@/components/dashboard"
import { Plus } from "lucide-react"

interface AddPerformanceFormProps {
  employees: Employee[]
  onPerformanceAdded: () => void
}

export default function AddPerformanceForm({ employees, onPerformanceAdded }: AddPerformanceFormProps) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    employee_id: "",
    review_date: new Date().toISOString().split("T")[0],
    performance_score: "4.5",
    comments: "",
    incentive: "",
  })

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
      const response = await fetch("http://localhost:3000/api/personnel/performance/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          employee_id: Number.parseInt(formData.employee_id),
          performance_score: Number.parseFloat(formData.performance_score),
          incentive: formData.incentive ? Number.parseInt(formData.incentive) : null,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add performance record")
      }

      toast({
        title: "Success",
        description: "Performance record added successfully",
      })

      setFormData({
        employee_id: "",
        review_date: new Date().toISOString().split("T")[0],
        performance_score: "4.5",
        comments: "",
        incentive: "",
      })

      setOpen(false)
      onPerformanceAdded()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add performance record. Please try again.",
        variant: "destructive",
      })
      console.error("Error adding performance:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Performance
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Performance Review</DialogTitle>
            <DialogDescription>Record a performance review for an employee.</DialogDescription>
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
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Review"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
