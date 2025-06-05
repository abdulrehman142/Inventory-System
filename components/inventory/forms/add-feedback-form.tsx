"use client"

import type React from "react"

import { useState } from "react"
import type { Customer, Product } from "@/components/inventory/inventory-dashboard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star } from "lucide-react"

interface AddFeedbackFormProps {
  customers: Customer[]
  products: Product[]
  onSuccess: () => void
}

export default function AddFeedbackForm({ customers, products, onSuccess }: AddFeedbackFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    customer_id: "",
    product_id: "",
    rating: 5,
    comment: "",
    feedback_date: new Date().toISOString().split("T")[0],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.customer_id) {
      newErrors.customer_id = "Customer is required"
    }

    if (!formData.product_id) {
      newErrors.product_id = "Product is required"
    }

    if (!formData.comment.trim()) {
      newErrors.comment = "Comment is required"
    }

    if (!formData.feedback_date) {
      newErrors.feedback_date = "Date is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("http://localhost:3000/api/poa/feedback/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          customer_id: Number.parseInt(formData.customer_id),
          product_id: Number.parseInt(formData.product_id),
          rating: Number.parseInt(formData.rating.toString()),
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Feedback added successfully",
        })
        onSuccess()
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.message || "Failed to add feedback",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error adding feedback:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderRatingSelector = () => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleSelectChange("rating", star.toString())}
            className="focus:outline-none"
          >
            <Star
              className={`h-6 w-6 ${
                star <= Number.parseInt(formData.rating.toString())
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="customer_id">Customer</Label>
        <Select value={formData.customer_id} onValueChange={(value) => handleSelectChange("customer_id", value)}>
          <SelectTrigger className={errors.customer_id ? "border-red-500" : ""}>
            <SelectValue placeholder="Select a customer" />
          </SelectTrigger>
          <SelectContent>
            {customers.map((customer) => (
              <SelectItem key={customer.customer_id} value={customer.customer_id.toString()}>
                {customer.first_name} {customer.last_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.customer_id && <p className="text-sm text-red-500">{errors.customer_id}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="product_id">Product</Label>
        <Select value={formData.product_id} onValueChange={(value) => handleSelectChange("product_id", value)}>
          <SelectTrigger className={errors.product_id ? "border-red-500" : ""}>
            <SelectValue placeholder="Select a product" />
          </SelectTrigger>
          <SelectContent>
            {products.map((product) => (
              <SelectItem key={product.product_id} value={product.product_id.toString()}>
                {product.product_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.product_id && <p className="text-sm text-red-500">{errors.product_id}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="rating">Rating</Label>
        {renderRatingSelector()}
      </div>

      <div className="space-y-2">
        <Label htmlFor="comment">Comment</Label>
        <Textarea
          id="comment"
          name="comment"
          value={formData.comment}
          onChange={handleChange}
          className={errors.comment ? "border-red-500" : ""}
          rows={4}
        />
        {errors.comment && <p className="text-sm text-red-500">{errors.comment}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="feedback_date">Feedback Date</Label>
        <Input
          id="feedback_date"
          name="feedback_date"
          type="date"
          value={formData.feedback_date}
          onChange={handleChange}
          className={errors.feedback_date ? "border-red-500" : ""}
        />
        {errors.feedback_date && <p className="text-sm text-red-500">{errors.feedback_date}</p>}
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Feedback"}
        </Button>
      </div>
    </form>
  )
}
