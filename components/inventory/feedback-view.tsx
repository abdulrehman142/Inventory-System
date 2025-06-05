"use client"

import { useState } from "react"
import type { Feedback, Customer, Product } from "@/components/inventory/inventory-dashboard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Search, Plus, Pencil, Trash2, Star, Calendar } from "lucide-react"
import AddFeedbackForm from "@/components/inventory/forms/add-feedback-form"
import EditFeedbackForm from "@/components/inventory/forms/edit-feedback-form"
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog"
import { format } from "date-fns"

interface FeedbackViewProps {
  feedback: Feedback[]
  customers: Customer[]
  products: Product[]
  onFeedbackChange: () => void
}

export default function FeedbackView({ feedback, customers, products, onFeedbackChange }: FeedbackViewProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null)

  const filteredFeedback = feedback.filter((item) => {
    const customer = customers.find((c) => c.customer_id === item.customer_id)
    const product = products.find((p) => p.product_id === item.product_id)

    return (
      (customer?.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer?.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product?.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.rating.toString().includes(searchTerm)) ??
      false
    )
  })

  const getCustomerName = (customerId: number) => {
    const customer = customers.find((c) => c.customer_id === customerId)
    return customer ? `${customer.first_name} ${customer.last_name}` : "Unknown Customer"
  }

  const getProductName = (productId: number) => {
    const product = products.find((p) => p.product_id === productId)
    return product ? product.product_name : "Unknown Product"
  }

  const handleEditClick = (feedback: Feedback) => {
    setSelectedFeedback(feedback)
    setIsEditDialogOpen(true)
  }

  const handleDeleteClick = (feedback: Feedback) => {
    setSelectedFeedback(feedback)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedFeedback) return

    try {
      const response = await fetch(`http://localhost:3000/api/poa/feedback/delete/${selectedFeedback.feedback_id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        onFeedbackChange()
        setIsDeleteDialogOpen(false)
      } else {
        console.error("Failed to delete feedback")
      }
    } catch (error) {
      console.error("Error deleting feedback:", error)
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
        ))}
        <span className="ml-2 text-sm font-medium">{rating}/5</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Customer Feedback</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Feedback
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Feedback</DialogTitle>
            </DialogHeader>
            <AddFeedbackForm
              customers={customers}
              products={products}
              onSuccess={() => {
                onFeedbackChange()
                setIsAddDialogOpen(false)
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search feedback..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Comment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredFeedback.length > 0 ? (
                filteredFeedback.map((item) => (
                  <tr key={item.feedback_id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {item.feedback_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {getCustomerName(item.customer_id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {getProductName(item.product_id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {renderStars(item.rating)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                      {item.comment}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        {format(new Date(item.feedback_date), "MMM d, yyyy")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="icon" onClick={() => handleEditClick(item)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDeleteClick(item)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No feedback found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Feedback</DialogTitle>
          </DialogHeader>
          {selectedFeedback && (
            <EditFeedbackForm
              feedback={selectedFeedback}
              customers={customers}
              products={products}
              onSuccess={() => {
                onFeedbackChange()
                setIsEditDialogOpen(false)
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this feedback?</AlertDialogTitle>
          </AlertDialogHeader>
          <DeleteConfirmationDialog
            onConfirm={handleDeleteConfirm}
            onCancel={() => setIsDeleteDialogOpen(false)}
            message="This will permanently delete the feedback entry."
          />
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
