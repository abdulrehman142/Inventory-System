"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Plus, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { ProductSupplier, Product, Supplier } from "./inventory-dashboard"
import AddProductSupplierForm from "./forms/add-product-supplier-form"
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog"

interface ProductSuppliersViewProps {
  productSuppliers: ProductSupplier[]
  products: Product[]
  suppliers: Supplier[]
  onProductSupplierChange: () => void
}

export default function ProductSuppliersView({
  productSuppliers,
  products,
  suppliers,
  onProductSupplierChange,
}: ProductSuppliersViewProps) {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddFormOpen, setIsAddFormOpen] = useState(false)
  const [deletingProductSupplier, setDeletingProductSupplier] = useState<ProductSupplier | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleDeleteProductSupplier = (productSupplier: ProductSupplier) => {
    setDeletingProductSupplier(productSupplier)
    setIsDeleteDialogOpen(true)
  }

  const handleProductSupplierDeleted = () => {
    onProductSupplierChange()
  }

  const getProductName = (productId: number) => {
    const product = products.find((p) => p.product_id === productId)
    return product ? product.product_name : "Unknown Product"
  }

  const getSupplierName = (supplierId: number) => {
    const supplier = suppliers.find((s) => s.supplier_id === supplierId)
    return supplier ? supplier.supplier_name : "Unknown Supplier"
  }

  const filteredProductSuppliers = productSuppliers.filter(
    (ps) =>
      getProductName(ps.product_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
      getSupplierName(ps.supplier_id).toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Product Suppliers</h2>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Product-Supplier Relationships</CardTitle>
              <CardDescription>Manage which suppliers provide which products</CardDescription>
            </div>
            <Button onClick={() => setIsAddFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Relationship
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search relationships..."
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
                  <TableHead>Supplier</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProductSuppliers.length > 0 ? (
                  filteredProductSuppliers.map((ps, index) => (
                    <TableRow key={`${ps.product_id}-${ps.supplier_id}-${index}`}>
                      <TableCell className="font-medium">{getProductName(ps.product_id)}</TableCell>
                      <TableCell>{getSupplierName(ps.supplier_id)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteProductSupplier(ps)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      No product-supplier relationships found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AddProductSupplierForm
        open={isAddFormOpen}
        onOpenChange={setIsAddFormOpen}
        onProductSupplierAdded={onProductSupplierChange}
        products={products}
        suppliers={suppliers}
        existingRelationships={productSuppliers}
      />

      {deletingProductSupplier && (
        <DeleteConfirmationDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          title="Delete Product-Supplier Relationship"
          description={`Are you sure you want to delete this relationship between "${getProductName(deletingProductSupplier.product_id)}" and "${getSupplierName(deletingProductSupplier.supplier_id)}"?`}
          deleteUrl={`http://localhost:3000/api/poi/product_supplier/delete/${deletingProductSupplier.product_id}/${deletingProductSupplier.supplier_id}`}
          onDeleteSuccess={handleProductSupplierDeleted}
        />
      )}
    </div>
  )
}
