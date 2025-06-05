"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Pencil, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { InventoryItem, Product } from "./inventory-dashboard"
import AddInventoryForm from "./forms/add-inventory-form"
import EditInventoryForm from "./forms/edit-inventory-form"
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog"

interface InventoryViewProps {
  inventory: InventoryItem[]
  products: Product[]
  onInventoryChange: () => void
}

export default function InventoryView({ inventory, products, onInventoryChange }: InventoryViewProps) {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddFormOpen, setIsAddFormOpen] = useState(false)
  const [editingInventory, setEditingInventory] = useState<InventoryItem | null>(null)
  const [isEditFormOpen, setIsEditFormOpen] = useState(false)
  const [deletingInventory, setDeletingInventory] = useState<InventoryItem | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleEditInventory = (inventoryItem: InventoryItem) => {
    setEditingInventory(inventoryItem)
    setIsEditFormOpen(true)
  }

  const handleDeleteInventory = (inventoryItem: InventoryItem) => {
    setDeletingInventory(inventoryItem)
    setIsDeleteDialogOpen(true)
  }

  const handleInventoryDeleted = () => {
    onInventoryChange()
  }

  const getProductName = (productId: number) => {
    const product = products.find((p) => p.product_id === productId)
    return product ? product.product_name : "Unknown Product"
  }

  const getProductPrice = (productId: number) => {
    const product = products.find((p) => p.product_id === productId)
    return product ? product.price : 0
  }

  const getStockStatus = (quantity: number) => {
    if (quantity <= 0) return { label: "Out of Stock", variant: "destructive" as const }
    if (quantity < 10) return { label: "Low Stock", variant: "warning" as const }
    return { label: "In Stock", variant: "default" as const }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const filteredInventory = inventory.filter((item) =>
    getProductName(item.product_id).toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Stock Levels</CardTitle>
              <CardDescription>Manage your product inventory levels</CardDescription>
            </div>
            <Button onClick={() => setIsAddFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Inventory
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search inventory..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Unit Price</TableHead>
                  <TableHead className="hidden lg:table-cell">Total Value</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.length > 0 ? (
                  filteredInventory.map((item) => {
                    const status = getStockStatus(item.quantity)
                    const unitPrice = getProductPrice(item.product_id)
                    const totalValue = unitPrice * item.quantity

                    return (
                      <TableRow key={item.inventory_id}>
                        <TableCell className="font-medium">{getProductName(item.product_id)}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{formatCurrency(unitPrice)}</TableCell>
                        <TableCell className="hidden lg:table-cell">{formatCurrency(totalValue)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEditInventory(item)}>
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteInventory(item)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No inventory records found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AddInventoryForm
        open={isAddFormOpen}
        onOpenChange={setIsAddFormOpen}
        onInventoryAdded={onInventoryChange}
        products={products}
        existingInventory={inventory}
      />

      {editingInventory && (
        <EditInventoryForm
          inventory={editingInventory}
          products={products}
          open={isEditFormOpen}
          onOpenChange={setIsEditFormOpen}
          onInventoryUpdated={onInventoryChange}
        />
      )}

      {deletingInventory && (
        <DeleteConfirmationDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          title="Delete Inventory Record"
          description={`Are you sure you want to delete the inventory record for "${getProductName(deletingInventory.product_id)}"?`}
          deleteUrl={`http://localhost:3000/api/poi/inventory/delete/${deletingInventory.inventory_id}`}
          onDeleteSuccess={handleInventoryDeleted}
        />
      )}
    </div>
  )
}
