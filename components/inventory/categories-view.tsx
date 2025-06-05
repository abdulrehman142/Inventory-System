"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Plus, Pencil, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { Category } from "./inventory-dashboard"
import AddCategoryForm from "./forms/add-category-form"
import EditCategoryForm from "./forms/edit-category-form"
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog"

interface CategoriesViewProps {
  categories: Category[]
  onCategoryChange: () => void
}

export default function CategoriesView({ categories, onCategoryChange }: CategoriesViewProps) {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddFormOpen, setIsAddFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isEditFormOpen, setIsEditFormOpen] = useState(false)
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setIsEditFormOpen(true)
  }

  const handleDeleteCategory = (category: Category) => {
    setDeletingCategory(category)
    setIsDeleteDialogOpen(true)
  }

  const handleCategoryDeleted = () => {
    onCategoryChange()
  }

  const filteredCategories = categories.filter(
    (category) =>
      category.category_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Product Categories</CardTitle>
              <CardDescription>Manage your product categories</CardDescription>
            </div>
            <Button onClick={() => setIsAddFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search categories..."
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
                  <TableHead>ID</TableHead>
                  <TableHead>Category Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => (
                    <TableRow key={category.category_id}>
                      <TableCell>{category.category_id}</TableCell>
                      <TableCell className="font-medium">{category.category_name}</TableCell>
                      <TableCell>{category.description}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditCategory(category)}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteCategory(category)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No categories found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AddCategoryForm open={isAddFormOpen} onOpenChange={setIsAddFormOpen} onCategoryAdded={onCategoryChange} />

      {editingCategory && (
        <EditCategoryForm
          category={editingCategory}
          open={isEditFormOpen}
          onOpenChange={setIsEditFormOpen}
          onCategoryUpdated={onCategoryChange}
        />
      )}

      {deletingCategory && (
        <DeleteConfirmationDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          title="Delete Category"
          description={`Are you sure you want to delete the category "${deletingCategory.category_name}"?`}
          warningText="Deleting this category may affect products assigned to it."
          deleteUrl={`http://localhost:3000/api/poi/category/delete/${deletingCategory.category_id}`}
          onDeleteSuccess={handleCategoryDeleted}
        />
      )}
    </div>
  )
}
