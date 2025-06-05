"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Pencil, Trash2, Filter } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { Product, Category } from "./inventory-dashboard"
import AddProductForm from "./forms/add-product-form"
import EditProductForm from "./forms/edit-product-form"
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog"

interface ProductsViewProps {
  products: Product[]
  categories: Category[]
  onProductChange: () => void
}

export default function ProductsView({ products, categories, onProductChange }: ProductsViewProps) {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddFormOpen, setIsAddFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isEditFormOpen, setIsEditFormOpen] = useState(false)
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setIsEditFormOpen(true)
  }

  const handleDeleteProduct = (product: Product) => {
    setDeletingProduct(product)
    setIsDeleteDialogOpen(true)
  }

  const handleProductDeleted = () => {
    onProductChange()
  }

  const getCategoryName = (categoryId: number) => {
    const category = categories.find((c) => c.category_id === categoryId)
    return category ? category.category_name : "Unknown Category"
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

  const filteredProducts = products.filter(
    (product) =>
      product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getCategoryName(product.category_id).toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Products</h2>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Product Catalog</CardTitle>
              <CardDescription>Manage your product inventory</CardDescription>
            </div>
            <Button onClick={() => setIsAddFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
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
                  <TableHead>Product Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="hidden lg:table-cell">Cost</TableHead>
                  <TableHead className="hidden lg:table-cell">Release Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <TableRow key={product.product_id}>
                      <TableCell className="font-medium">{product.product_name}</TableCell>
                      <TableCell>{getCategoryName(product.category_id)}</TableCell>
                      <TableCell className="hidden md:table-cell max-w-[200px] truncate">
                        {product.description}
                      </TableCell>
                      <TableCell>{formatCurrency(product.price)}</TableCell>
                      <TableCell className="hidden lg:table-cell">{formatCurrency(product.cost)}</TableCell>
                      <TableCell className="hidden lg:table-cell">{formatDate(product.release_date)}</TableCell>
                      <TableCell>
                        <Badge variant={product.is_digital ? "outline" : "default"}>
                          {product.is_digital ? "Digital" : "Physical"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditProduct(product)}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteProduct(product)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No products found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AddProductForm
        open={isAddFormOpen}
        onOpenChange={setIsAddFormOpen}
        onProductAdded={onProductChange}
        categories={categories}
      />

      {editingProduct && (
        <EditProductForm
          product={editingProduct}
          categories={categories}
          open={isEditFormOpen}
          onOpenChange={setIsEditFormOpen}
          onProductUpdated={onProductChange}
        />
      )}

      {deletingProduct && (
        <DeleteConfirmationDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          title="Delete Product"
          description={`Are you sure you want to delete the product "${deletingProduct.product_name}"?`}
          warningText="Deleting this product will also remove its inventory records and supplier relationships."
          deleteUrl={`http://localhost:3000/api/poi/product/delete/${deletingProduct.product_id}`}
          onDeleteSuccess={handleProductDeleted}
        />
      )}
    </div>
  )
}
