"use client"

import { Button } from "@/components/ui/button"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Pencil, Trash2 } from "lucide-react"
import type { Role } from "@/components/dashboard"
import { useState } from "react"
import AddRoleForm from "@/components/add-role-form"
import EditRoleForm from "@/components/edit-role-form"
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog"

interface RolesTableProps {
  roles: Role[]
}

export default function RolesTable({ roles }: RolesTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [deletingRole, setDeletingRole] = useState<Role | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleRoleAdded = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  const handleRoleUpdated = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  const handleRoleDeleted = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  const handleEditRole = (role: Role) => {
    setEditingRole(role)
    setIsEditDialogOpen(true)
  }

  const handleDeleteRole = (role: Role) => {
    setDeletingRole(role)
    setIsDeleteDialogOpen(true)
  }

  const filteredRoles = roles.filter(
    (role) =>
      role.role_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Roles</h2>
          <p className="text-muted-foreground">Manage employee roles and permissions</p>
        </div>
        <AddRoleForm onRoleAdded={handleRoleAdded} />
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative w-full sm:max-w-xs mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search roles..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Role Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoles.length > 0 ? (
                  filteredRoles.map((role) => (
                    <TableRow key={role.role_id}>
                      <TableCell>{role.role_id}</TableCell>
                      <TableCell className="font-medium">{role.role_name}</TableCell>
                      <TableCell>{role.description}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditRole(role)}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteRole(role)}>
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
                      No roles found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      {editingRole && (
        <EditRoleForm
          role={editingRole}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onRoleUpdated={handleRoleUpdated}
        />
      )}
      {deletingRole && (
        <DeleteConfirmationDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          title="Delete Role"
          description={`Are you sure you want to delete the role "${deletingRole.role_name}"?`}
          warningText="Deleting this role will also delete all employees assigned to this role and their related records (attendance, performance, schedule)."
          deleteUrl={`http://localhost:3000/api/personnel/role/delete/${deletingRole.role_id}`}
          onDeleteSuccess={handleRoleDeleted}
        />
      )}
    </div>
  )
}
