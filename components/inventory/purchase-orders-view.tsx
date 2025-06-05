"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Pencil, Trash2, Filter, Eye } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { PurchaseOrder, Supplier, PurchaseOrderItem, Product } from "./inventory-dashboard"
import AddPurchaseOrderForm from "./forms/add-purchase-order-form"
import EditPurchaseOrderForm from "./forms/edit-purchase-order-form"
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import AddPurchaseOrderItemForm from "./forms/add-purchase-order-item-form"
import EditPurchaseOrderItemForm from "./forms/edit-purchase-order-item-form"

interface PurchaseOrdersViewProps {
  purchaseOrders: PurchaseOrder[]
  suppliers: Supplier[]
  purchaseOrderItems: PurchaseOrderItem[]
  products: Product[]
  onPurchaseOrderChange: () => void
}

export default function PurchaseOrdersView({
  purchaseOrders,
  suppliers,
  purchaseOrderItems,
  products,
  onPurchaseOrderChange,
}: PurchaseOrdersViewProps) {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddFormOpen, setIsAddFormOpen] = useState(false)
  const [editingPurchaseOrder, setEditingPurchaseOrder] = useState<PurchaseOrder | null>(null)
  const [isEditFormOpen, setIsEditFormOpen] = useState(false)
  const [deletingPurchaseOrder, setDeletingPurchaseOrder] = useState<PurchaseOrder | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState<PurchaseOrder | null>(null)
  const [isItemsDialogOpen, setIsItemsDialogOpen] = useState(false)
  const [isAddItemFormOpen, setIsAddItemFormOpen] = useState(false)
  const [editingPurchaseOrderItem, setEditingPurchaseOrderItem] = useState<PurchaseOrderItem | null>(null)
  const [isEditItemFormOpen, setIsEditItemFormOpen] = useState(false)
  const [deletingPurchaseOrderItem, setDeletingPurchaseOrderItem] = useState<PurchaseOrderItem | null>(null)
  const [isDeleteItemDialogOpen, setIsDeleteItemDialogOpen] = useState(false)

  const handleEditPurchaseOrder = (purchaseOrder: PurchaseOrder) => {
    setEditingPurchaseOrder(purchaseOrder)
    setIsEditFormOpen(true)
  }

  const handleDeletePurchaseOrder = (purchaseOrder: PurchaseOrder) => {
    setDeletingPurchaseOrder(purchaseOrder)
    setIsDeleteDialogOpen(true)
  }

  const handlePurchaseOrderDeleted = () => {
    onPurchaseOrderChange()
  }

  const handleViewItems = (purchaseOrder: PurchaseOrder) => {
    setSelectedPurchaseOrder(purchaseOrder)
    setIsItemsDialogOpen(true)
  }

  const getPurchaseOrderItems = (poId: number) => {
    return purchaseOrderItems.filter(item => item.po_id === poId)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const getStatusBadgeVariant = (status?: string) => {
    switch ((status ?? '').toLowerCase()) {
      case "pending":
        return "warning" as const
      case "approved":
        return "default" as const
      case "completed":
        return "secondary" as const
      case "cancelled":
        return "destructive" as const
      default:
        return "outline" as const
    }
  }

  const filteredPurchaseOrders = purchaseOrders.filter((po) => {
    const term = searchTerm.toLowerCase()
    const supplier = (po.supplier_name ?? '').toLowerCase()
    const status = (po.status ?? '').toLowerCase()
    const orderDate = po.order_date
      ? formatDate(po.order_date).toLowerCase()
      : ''

    return (
      supplier.includes(term) ||
      status.includes(term) ||
      orderDate.includes(term)
    )
  })

  const handleAddItem = () => {
    setIsAddItemFormOpen(true)
  }

  const handleEditItem = (item: PurchaseOrderItem) => {
    setEditingPurchaseOrderItem(item)
    setIsEditItemFormOpen(true)
  }

  const handleDeleteItem = (item: PurchaseOrderItem) => {
    setDeletingPurchaseOrderItem(item)
    setIsDeleteItemDialogOpen(true)
  }

  const handleItemDeleted = () => {
    onPurchaseOrderChange()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Purchase Orders</h2>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Purchase Order Management</CardTitle>
              <CardDescription>Create and manage purchase orders for your inventory</CardDescription>
            </div>
            <Button onClick={() => setIsAddFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Purchase Order
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search purchase orders..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>PO #</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Order Date</TableHead>
                  <TableHead>Expected Delivery</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPurchaseOrders.length > 0 ? (
                  filteredPurchaseOrders.map((po) => (
                    <TableRow key={po.po_id}>
                      <TableCell className="font-medium">PO-{po.po_id}</TableCell>
                      <TableCell>{po.supplier_name}</TableCell>
                      <TableCell>{formatDate(po.order_date)}</TableCell>
                      <TableCell>{formatDate(po.expected_delivery_date)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(po.status)}>{po.status}</Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(po.total_amount)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleViewItems(po)}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View Items</span>
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEditPurchaseOrder(po)}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeletePurchaseOrder(po)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No purchase orders found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AddPurchaseOrderForm
        open={isAddFormOpen}
        onOpenChange={setIsAddFormOpen}
        onPurchaseOrderAdded={onPurchaseOrderChange}
        suppliers={suppliers}
      />

      {editingPurchaseOrder && (
        <EditPurchaseOrderForm
          purchaseOrder={editingPurchaseOrder}
          suppliers={suppliers}
          open={isEditFormOpen}
          onOpenChange={setIsEditFormOpen}
          onPurchaseOrderUpdated={onPurchaseOrderChange}
        />
      )}

      {deletingPurchaseOrder && (
        <DeleteConfirmationDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          title="Delete Purchase Order"
          description={`Are you sure you want to delete purchase order PO-${deletingPurchaseOrder.po_id}?`}
          warningText="Deleting this purchase order will also remove all associated purchase order items."
          deleteUrl={`http://localhost:3000/api/procurement/purchase-orders/delete/${deletingPurchaseOrder.po_id}`}
          onDeleteSuccess={handlePurchaseOrderDeleted}
        />
      )}

      {selectedPurchaseOrder && (
        <Dialog open={isItemsDialogOpen} onOpenChange={setIsItemsDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <DialogTitle>Purchase Order Items - PO-{selectedPurchaseOrder.po_id}</DialogTitle>
                  <DialogDescription>
                    Items in purchase order from {selectedPurchaseOrder.supplier_name}
                  </DialogDescription>
                </div>
                <Button onClick={handleAddItem}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </div>
            </DialogHeader>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item ID</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit Cost</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getPurchaseOrderItems(selectedPurchaseOrder.po_id).length > 0 ? (
                    getPurchaseOrderItems(selectedPurchaseOrder.po_id).map((item) => (
                      <TableRow key={item.po_item_id}>
                        <TableCell className="font-medium">{item.po_item_id}</TableCell>
                        <TableCell>{item.product_name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{formatCurrency(item.unit_cost)}</TableCell>
                        <TableCell>{formatCurrency(item.quantity * item.unit_cost)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEditItem(item)}>
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteItem(item)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No items found in this purchase order.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {selectedPurchaseOrder && (
        <AddPurchaseOrderItemForm
          open={isAddItemFormOpen}
          onOpenChange={setIsAddItemFormOpen}
          onPurchaseOrderItemAdded={onPurchaseOrderChange}
          purchaseOrders={[selectedPurchaseOrder]}
          products={products}
        />
      )}

      {editingPurchaseOrderItem && (
        <EditPurchaseOrderItemForm
          purchaseOrderItem={editingPurchaseOrderItem}
          purchaseOrders={purchaseOrders}
          products={products}
          open={isEditItemFormOpen}
          onOpenChange={setIsEditItemFormOpen}
          onPurchaseOrderItemUpdated={onPurchaseOrderChange}
        />
      )}

      {deletingPurchaseOrderItem && (
        <DeleteConfirmationDialog
          open={isDeleteItemDialogOpen}
          onOpenChange={setIsDeleteItemDialogOpen}
          title="Delete Purchase Order Item"
          description={`Are you sure you want to delete this purchase order item?`}
          deleteUrl={`http://localhost:3000/api/procurement/purchase-order-items/delete/${deletingPurchaseOrderItem.po_item_id}`}
          onDeleteSuccess={handleItemDeleted}
        />
      )}
    </div>
  )
}
//