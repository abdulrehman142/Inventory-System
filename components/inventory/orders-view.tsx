"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Search, Pencil, Trash2, Eye } from "lucide-react"
import type { Order, Customer, OrderItem, Product } from "./inventory-dashboard"
import AddOrderForm from "./forms/add-order-form"
import EditOrderForm from "./forms/edit-order-form"
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog"
import AddOrderItemForm from "./forms/add-order-item-form"
import EditOrderItemForm from "./forms/edit-order-item-form"

interface OrdersViewProps {
  orders: Order[]
  customers: Customer[]
  orderItems: OrderItem[]
  products: Product[]
  onOrderChange: () => void
}

export default function OrdersView({ orders, customers, orderItems, products, onOrderChange }: OrdersViewProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isItemsDialogOpen, setIsItemsDialogOpen] = useState(false)
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false)
  const [isEditItemDialogOpen, setIsEditItemDialogOpen] = useState(false)
  const [isDeleteItemDialogOpen, setIsDeleteItemDialogOpen] = useState(false)
  const [selectedOrderItem, setSelectedOrderItem] = useState<OrderItem | null>(null)

  const filteredOrders = orders.filter((order) => {
    const customer = customers.find((c) => c.customer_id === order.customer_id)
    const customerName = customer ? `${customer.first_name} ${customer.last_name}` : ""

    return (
      order.order_id.toString().includes(searchQuery) ||
      customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.order_status.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const handleEdit = (order: Order) => {
    setSelectedOrder(order)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (order: Order) => {
    setSelectedOrder(order)
    setIsDeleteDialogOpen(true)
  }

  const handleViewItems = (order: Order) => {
    setSelectedOrder(order)
    setIsItemsDialogOpen(true)
  }

  const handleAddItem = () => {
    setIsAddItemDialogOpen(true)
  }

  const handleEditItem = (item: OrderItem) => {
    setSelectedOrderItem(item)
    setIsEditItemDialogOpen(true)
  }

  const handleDeleteItem = (item: OrderItem) => {
    setSelectedOrderItem(item)
    setIsDeleteItemDialogOpen(true)
  }

  const getOrderItems = (orderId: number) => {
    return orderItems.filter(item => item.order_id === orderId)
  }

  const confirmDelete = async () => {
    if (!selectedOrder) return

    try {
      const response = await fetch(`http://localhost:3000/api/oap/orders/delete/${selectedOrder.order_id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        onOrderChange()
        setIsDeleteDialogOpen(false)
      } else {
        console.error("Failed to delete order")
      }
    } catch (error) {
      console.error("Error deleting order:", error)
    }
  }

  const confirmDeleteItem = async () => {
    if (!selectedOrderItem) return

    try {
      const response = await fetch(
        `http://localhost:3000/api/oap/order-items/delete/${selectedOrderItem.order_item_id}`,
        {
          method: "DELETE",
        },
      )

      if (response.ok) {
        onOrderChange()
        setIsDeleteItemDialogOpen(false)
      } else {
        console.error("Failed to delete order item")
      }
    } catch (error) {
      console.error("Error deleting order item:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "new":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "processing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "shipped":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "delivered":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Order
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search orders..."
          className="max-w-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Tax</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => {
                const customer = customers.find((c) => c.customer_id === order.customer_id)
                return (
                  <TableRow key={order.order_id}>
                    <TableCell className="font-medium">#{order.order_id}</TableCell>
                    <TableCell>
                      {customer ? `${customer.first_name} ${customer.last_name}` : "Unknown Customer"}
                    </TableCell>
                    <TableCell>{new Date(order.order_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.order_status)}>{order.order_status}</Badge>
                    </TableCell>
                    <TableCell>${order.total_amount.toFixed(2)}</TableCell>
                    <TableCell>${order.discount.toFixed(2)}</TableCell>
                    <TableCell>${order.tax.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleViewItems(order)}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View Items</span>
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(order)}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(order)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Order</DialogTitle>
            <DialogDescription>Create a new customer order.</DialogDescription>
          </DialogHeader>
          <AddOrderForm
            customers={customers}
            onOrderAdded={() => {
              onOrderChange()
              setIsAddDialogOpen(false)
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Order</DialogTitle>
            <DialogDescription>Update the order details.</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <EditOrderForm
              order={selectedOrder}
              customers={customers}
              onOrderUpdated={() => {
                onOrderChange()
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
        title="Delete Order"
        description="Are you sure you want to delete this order? This action cannot be undone."
      />

      {selectedOrder && (
        <Dialog open={isItemsDialogOpen} onOpenChange={setIsItemsDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <DialogTitle>Order Items - #{selectedOrder.order_id}</DialogTitle>
                  <DialogDescription>
                    Items in order from {customers.find(c => c.customer_id === selectedOrder.customer_id)?.first_name} {customers.find(c => c.customer_id === selectedOrder.customer_id)?.last_name}
                  </DialogDescription>
                </div>
                <Button onClick={handleAddItem}>
                  <PlusCircle className="mr-2 h-4 w-4" />
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
                    <TableHead>Price</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Subtotal</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getOrderItems(selectedOrder.order_id).length > 0 ? (
                    getOrderItems(selectedOrder.order_id).map((item) => {
                      const product = products.find((p) => p.product_id === item.product_id)
                      const subtotal = item.price * item.quantity - item.discount

                      return (
                        <TableRow key={item.order_item_id}>
                          <TableCell className="font-medium">#{item.order_item_id}</TableCell>
                          <TableCell>{product ? product.product_name : "Unknown Product"}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>${item.price.toFixed(2)}</TableCell>
                          <TableCell>${item.discount.toFixed(2)}</TableCell>
                          <TableCell>${subtotal.toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm" onClick={() => handleEditItem(item)}>
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteItem(item)}>
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No items found in this order.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {selectedOrder && (
        <Dialog open={isAddItemDialogOpen} onOpenChange={setIsAddItemDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Order Item</DialogTitle>
              <DialogDescription>Add a product to order #{selectedOrder.order_id}</DialogDescription>
            </DialogHeader>
            <AddOrderItemForm
              orders={[selectedOrder]}
              products={products}
              onOrderItemAdded={() => {
                onOrderChange()
                setIsAddItemDialogOpen(false)
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      {selectedOrderItem && (
        <Dialog open={isEditItemDialogOpen} onOpenChange={setIsEditItemDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Order Item</DialogTitle>
              <DialogDescription>Update the order item details.</DialogDescription>
            </DialogHeader>
            <EditOrderItemForm
              orderItem={selectedOrderItem}
              orders={orders}
              products={products}
              onOrderItemUpdated={() => {
                onOrderChange()
                setIsEditItemDialogOpen(false)
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      <DeleteConfirmationDialog
        isOpen={isDeleteItemDialogOpen}
        onClose={() => setIsDeleteItemDialogOpen(false)}
        onConfirm={confirmDeleteItem}
        title="Delete Order Item"
        description="Are you sure you want to delete this order item? This action cannot be undone."
      />
    </div>
  )
}
