"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Search, Pencil, Trash2 } from "lucide-react"
import type { Invoice, Order } from "./inventory-dashboard"
import AddInvoiceForm from "./forms/add-invoice-form"
import EditInvoiceForm from "./forms/edit-invoice-form"
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog"

interface InvoicesViewProps {
  invoices: Invoice[]
  orders: Order[]
  onInvoiceChange: () => void
}

export default function InvoicesView({ invoices, orders, onInvoiceChange }: InvoicesViewProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)

  const filteredInvoices = invoices.filter((invoice) => {
    return (
      invoice.invoice_id.toString().includes(searchQuery) ||
      invoice.order_id.toString().includes(searchQuery) ||
      invoice.invoice_status.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const handleEdit = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedInvoice) return

    try {
      const response = await fetch(`http://localhost:3000/api/oap/invoices/delete/${selectedInvoice.invoice_id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        onInvoiceChange()
        setIsDeleteDialogOpen(false)
      } else {
        console.error("Failed to delete invoice")
      }
    } catch (error) {
      console.error("Error deleting invoice:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "unpaid":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "cancelled":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Invoices</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Invoice
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search invoices..."
          className="max-w-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice ID</TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>Invoice Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map((invoice) => {
                const order = orders.find((o) => o.order_id === invoice.order_id)
                const amount = order ? order.total_amount : 0

                return (
                  <TableRow key={invoice.invoice_id}>
                    <TableCell className="font-medium">#{invoice.invoice_id}</TableCell>
                    <TableCell>#{invoice.order_id}</TableCell>
                    <TableCell>{new Date(invoice.invoice_date).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(invoice.due_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(invoice.invoice_status)}>{invoice.invoice_status}</Badge>
                    </TableCell>
                    <TableCell>${amount.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(invoice)}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(invoice)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No invoices found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Invoice</DialogTitle>
            <DialogDescription>Create a new invoice for an order.</DialogDescription>
          </DialogHeader>
          <AddInvoiceForm
            orders={orders}
            onInvoiceAdded={() => {
              onInvoiceChange()
              setIsAddDialogOpen(false)
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Invoice</DialogTitle>
            <DialogDescription>Update the invoice details.</DialogDescription>
          </DialogHeader>
          {selectedInvoice && (
            <EditInvoiceForm
              invoice={selectedInvoice}
              orders={orders}
              onInvoiceUpdated={() => {
                onInvoiceChange()
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
        title="Delete Invoice"
        description="Are you sure you want to delete this invoice? This action cannot be undone."
      />
    </div>
  )
}
