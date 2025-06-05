"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Plus, Pencil, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { Supplier } from "./inventory-dashboard"
import AddSupplierForm from "./forms/add-supplier-form"
import EditSupplierForm from "./forms/edit-supplier-form"
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog"

interface SuppliersViewProps {
  suppliers: Supplier[]
  onSupplierChange: () => void
}

export default function SuppliersView({ suppliers, onSupplierChange }: SuppliersViewProps) {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddFormOpen, setIsAddFormOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [isEditFormOpen, setIsEditFormOpen] = useState(false)
  const [deletingSupplier, setDeletingSupplier] = useState<Supplier | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleEditSupplier = (supplier: Supplier) => {
    setEditingSupplier(supplier)
    setIsEditFormOpen(true)
  }

  const handleDeleteSupplier = (supplier: Supplier) => {
    setDeletingSupplier(supplier)
    setIsDeleteDialogOpen(true)
  }

  const handleSupplierDeleted = () => {
    onSupplierChange()
  }

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.supplier_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.address.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Suppliers</h2>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Supplier Directory</CardTitle>
              <CardDescription>Manage your product suppliers</CardDescription>
            </div>
            <Button onClick={() => setIsAddFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Supplier
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search suppliers..."
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
                  <TableHead>Supplier Name</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden md:table-cell">Phone</TableHead>
                  <TableHead className="hidden lg:table-cell">Address</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.length > 0 ? (
                  filteredSuppliers.map((supplier) => (
                    <TableRow key={supplier.supplier_id}>
                      <TableCell className="font-medium">{supplier.supplier_name}</TableCell>
                      <TableCell>{supplier.contact_person}</TableCell>
                      <TableCell className="hidden md:table-cell">{supplier.email}</TableCell>
                      <TableCell className="hidden md:table-cell">{supplier.phone}</TableCell>
                      <TableCell className="hidden lg:table-cell">{supplier.address}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditSupplier(supplier)}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteSupplier(supplier)}>
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
                      No suppliers found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AddSupplierForm open={isAddFormOpen} onOpenChange={setIsAddFormOpen} onSupplierAdded={onSupplierChange} />

      {editingSupplier && (
        <EditSupplierForm
          supplier={editingSupplier}
          open={isEditFormOpen}
          onOpenChange={setIsEditFormOpen}
          onSupplierUpdated={onSupplierChange}
        />
      )}

      {deletingSupplier && (
        <DeleteConfirmationDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          title="Delete Supplier"
          description={`Are you sure you want to delete the supplier "${deletingSupplier.supplier_name}"?`}
          warningText="Deleting this supplier may affect product-supplier relationships."
          deleteUrl={`http://localhost:3000/api/poi/supplier/delete/${deletingSupplier.supplier_id}`}
          onDeleteSuccess={handleSupplierDeleted}
        />
      )}
    </div>
  )
}
