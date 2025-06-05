"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Pencil, Trash2 } from "lucide-react"
import type { Employee, Role } from "@/components/dashboard"
import AddEmployeeForm from "@/components/add-employee-form"
import EditEmployeeForm from "@/components/edit-employee-form"
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog"

interface EmployeeTableProps {
  employees: Employee[]
  roles: Role[]
}

export default function EmployeeTable({ employees, roles }: EmployeeTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleEmployeeAdded = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  const handleEmployeeUpdated = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  const handleEmployeeDeleted = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee)
    setIsEditDialogOpen(true)
  }

  const handleDeleteEmployee = (employee: Employee) => {
    setDeletingEmployee(employee)
    setIsDeleteDialogOpen(true)
  }

  const getRoleName = (roleId: number) => {
    const role = roles.find((r) => r.role_id === roleId)
    return role ? role.role_name : "Unknown Role"
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getRoleName(employee.role_id).toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="w-full sm:px-6 lg:px-8">
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Employees</CardTitle>
            <CardDescription>Manage your employee information</CardDescription>
          </div>
          <AddEmployeeForm roles={roles} onEmployeeAdded={handleEmployeeAdded} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search employees..."
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
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="hidden md:table-cell">Position</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden lg:table-cell">Phone</TableHead>
                <TableHead className="hidden lg:table-cell">Hire Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => (
                  <TableRow key={employee.employee_id}>
                    <TableCell className="font-medium">
                      {employee.first_name} {employee.last_name}
                    </TableCell>
                    <TableCell>{getRoleName(employee.role_id)}</TableCell>
                    <TableCell className="hidden md:table-cell">{employee.position}</TableCell>
                    <TableCell className="hidden md:table-cell">{employee.email}</TableCell>
                    <TableCell className="hidden lg:table-cell">{employee.phone}</TableCell>
                    <TableCell className="hidden lg:table-cell">{formatDate(employee.hire_date)}</TableCell>
                    <TableCell>
                      <Badge variant={employee.status === "Active" ? "default" : "secondary"}>{employee.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditEmployee(employee)}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteEmployee(employee)}>
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
                    No employees found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      {editingEmployee && (
        <EditEmployeeForm
          employee={editingEmployee}
          roles={roles}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onEmployeeUpdated={handleEmployeeUpdated}
        />
      )}
      {deletingEmployee && (
        <DeleteConfirmationDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          title="Delete Employee"
          description={`Are you sure you want to delete ${deletingEmployee.first_name} ${deletingEmployee.last_name}?`}
          warningText="Deleting this employee will also delete all related attendance, performance, and schedule records."
          deleteUrl={`http://localhost:3000/api/personnel/employee/delete/${deletingEmployee.employee_id}`}
          onDeleteSuccess={handleEmployeeDeleted}
        />
      )}
    </Card>
    </div>
  )
}
