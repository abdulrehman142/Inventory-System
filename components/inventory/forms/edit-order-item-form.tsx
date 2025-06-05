"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import type { OrderItem, Order, Product } from "../inventory-dashboard"

interface EditOrderItemFormProps {
  orderItem: OrderItem
  orders: Order[]
  products: Product[]
  onOrderItemUpdated: () => void
}

export default function EditOrderItemForm({ orderItem, orders, products, onOrderItemUpdated }: EditOrderItemFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    order_item_id: orderItem.order_item_id,
    order_id: orderItem.order_id.toString(),
    product_id: orderItem.product_id.toString(),
    quantity: orderItem.quantity.toString(),
    price: orderItem.price.toString(),
    discount: orderItem.discount.toString(),
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    // If product is selected, set the default price
    if (name === "product_id") {
      const product = products.find((p) => p.product_id.toString() === value)
      if (product) {
        setFormData((prev) => ({ ...prev, price: product.price.toString() }))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.order_id || !formData.product_id || !formData.quantity || !formData.price) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      const response = await fetch("http://localhost:3000/api/oap/order-items/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_item_id: formData.order_item_id,
          order_id: Number.parseInt(formData.order_id),
          product_id: Number.parseInt(formData.product_id),
          quantity: Number.parseInt(formData.quantity),
          price: Number.parseFloat(formData.price),
          discount: Number.parseFloat(formData.discount || "0"),
        }),
      })

      if (response.ok) {
        toast({
          title: "Order Item Updated",
          description: "The order item has been successfully updated.",
        })
        onOrderItemUpdated()
      } else {
        toast({
          title: "Error",
          description: "Failed to update the order item. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating order item:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="order_id">Order</Label>
          <Select value={formData.order_id} onValueChange={(value) => handleSelectChange("order_id", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select an order" />
            </SelectTrigger>
            <SelectContent>
              {orders.map((order) => (
                <SelectItem key={order.order_id} value={order.order_id.toString()}>
                  Order #{order.order_id} - ${order.total_amount.toFixed(2)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="product_id">Product</Label>
          <Select value={formData.product_id} onValueChange={(value) => handleSelectChange("product_id", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a product" />
            </SelectTrigger>
            <SelectContent>
              {products.map((product) => (
                <SelectItem key={product.product_id} value={product.product_id.toString()}>
                  {product.product_name} - ${product.price.toFixed(2)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            name="quantity"
            type="number"
            min="1"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price per Unit ($)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="discount">Discount ($)</Label>
          <Input
            id="discount"
            name="discount"
            type="number"
            step="0.01"
            min="0"
            value={formData.discount}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update Order Item"}
        </Button>
      </div>
    </form>
  )
}
