"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Search, Pencil, Trash2 } from "lucide-react"
import type { Payment, Invoice } from "./inventory-dashboard"
import AddPaymentForm from "./forms/add-payment-form"
import EditPaymentForm from "./forms/edit-payment-form"
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog"

interface PaymentsViewProps {
  payments: Payment[]
  invoices: Invoice[]
  onPaymentChange: () => void
}

export default function PaymentsView({ payments, invoices, onPaymentChange }: PaymentsViewProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)

  const filteredPayments = payments.filter((payment) => {
    return (
      payment.payment_id.toString().includes(searchQuery) ||
      payment.invoice_id.toString().includes(searchQuery) ||
      payment.payment_method.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.transaction_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.status.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const handleEdit = (payment: Payment) => {
    setSelectedPayment(payment)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (payment: Payment) => {
    setSelectedPayment(payment)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedPayment) return

    try {
      const response = await fetch(`http://localhost:3000/api/oap/payments/delete/${selectedPayment.payment_id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        onPaymentChange()
        setIsDeleteDialogOpen(false)
      } else {
        console.error("Failed to delete payment")
      }
    } catch (error) {
      console.error("Error deleting payment:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "refunded":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    }
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case "credit card":
        return "💳"
      case "paypal":
        return "🅿️"
      case "bank transfer":
        return "🏦"
      case "cash":
        return "💵"
      default:
        return "💰"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Payments</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Payment
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search payments..."
          className="max-w-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Payment ID</TableHead>
              <TableHead>Invoice ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.length > 0 ? (
              filteredPayments.map((payment) => (
                <TableRow key={payment.payment_id}>
                  <TableCell className="font-medium">#{payment.payment_id}</TableCell>
                  <TableCell>#{payment.invoice_id}</TableCell>
                  <TableCell>{new Date(payment.payment_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <span className="flex items-center gap-2">
                      <span>{getPaymentMethodIcon(payment.payment_method)}</span>
                      {payment.payment_method}
                    </span>
                  </TableCell>
                  <TableCell>${payment.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <span className="font-mono text-xs">{payment.transaction_id}</span>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(payment.status)}>{payment.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(payment)}>
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(payment)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No payments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Payment</DialogTitle>
            <DialogDescription>Record a new payment for an invoice.</DialogDescription>
          </DialogHeader>
          <AddPaymentForm
            invoices={invoices}
            onPaymentAdded={() => {
              onPaymentChange()
              setIsAddDialogOpen(false)
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Payment</DialogTitle>
            <DialogDescription>Update the payment details.</DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <EditPaymentForm
              payment={selectedPayment}
              invoices={invoices}
              onPaymentUpdated={() => {
                onPaymentChange()
                setIsEditDialogOpen(false)
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Payment"
        description="Are you sure you want to delete this payment record? This action cannot be undone."
      />
    </div>
  )
}
