"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import type { Employee, Performance } from "@/components/dashboard"
import { useState } from "react"
import { Pencil, Trash2 } from "lucide-react"
import AddPerformanceForm from "@/components/add-performance-form"
import EditPerformanceForm from "@/components/edit-performance-form"
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog"

interface PerformanceViewProps {
  employees: Employee[]
  performance: Performance[]
}

export default function PerformanceView({ employees, performance }: PerformanceViewProps) {
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [editingPerformance, setEditingPerformance] = useState<Performance | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [deletingPerformance, setDeletingPerformance] = useState<Performance | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handlePerformanceAdded = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  const handlePerformanceUpdated = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  const handlePerformanceDeleted = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  const handleEditPerformance = (performanceRecord: Performance) => {
    setEditingPerformance(performanceRecord)
    setIsEditDialogOpen(true)
  }

  const handleDeletePerformance = (performanceRecord: Performance) => {
    setDeletingPerformance(performanceRecord)
    setIsDeleteDialogOpen(true)
  }

  // Get employee name by ID
  const getEmployeeName = (employeeId: number) => {
    const employee = employees.find((emp) => emp.employee_id === employeeId)
    return employee ? `${employee.first_name} ${employee.last_name}` : "Unknown Employee"
  }

  // Get employee position by ID
  const getEmployeePosition = (employeeId: number) => {
    const employee = employees.find((emp) => emp.employee_id === employeeId)
    return employee ? employee.position : "Unknown Position"
  }

  // Format date from ISO string to readable date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Normalize performance score to ensure it's on a 0-100 scale
  const normalizeScore = (score: number) => {
    // If score is already between 0-100, return as is
    if (score >= 0 && score <= 100) return score
    // If score is on a 0-10 scale, multiply by 10
    if (score >= 0 && score <= 10) return score * 10
    // Default fallback
    return score
  }

  // Calculate average performance score
  const calculateAverageScore = () => {
    if (performance.length === 0) return 0
    const sum = performance.reduce((acc, curr) => acc + normalizeScore(curr.performance_score), 0)
    return sum / performance.length
  }

  // Sort by performance score (descending)
  const sortedPerformance = [...performance].sort(
    (a, b) => normalizeScore(b.performance_score) - normalizeScore(a.performance_score),
  )

  // Get top performers
  const topPerformers = sortedPerformance.slice(0, 5)

  const averageScore = calculateAverageScore()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Performance</h2>
        <AddPerformanceForm employees={employees} onPerformanceAdded={handlePerformanceAdded} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageScore.toFixed(1)}%</div>
            <Progress value={averageScore} className="h-2 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Top Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {performance.length > 0
                ? normalizeScore(Math.max(...performance.map((p) => p.performance_score))).toFixed(1) + "%"
                : "N/A"}
            </div>
            <Progress
              value={
                performance.length > 0 ? normalizeScore(Math.max(...performance.map((p) => p.performance_score))) : 0
              }
              className="h-2 mt-2"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performance.length}</div>
            <p className="text-xs text-muted-foreground">Total performance reviews</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Incentives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {performance.filter((p) => p.incentive && p.incentive.toString().trim() !== "").length}
            </div>
            <p className="text-xs text-muted-foreground">Employees with incentives</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Performers</CardTitle>
          <CardDescription>Employees with the highest performance ratings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead className="hidden md:table-cell">Review Date</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead className="hidden lg:table-cell">Incentive</TableHead>
                  <TableHead className="hidden md:table-cell">Comments</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topPerformers.length > 0 ? (
                  topPerformers.map((record) => (
                    <TableRow key={record.performance_id}>
                      <TableCell className="font-medium">{getEmployeeName(record.employee_id)}</TableCell>
                      <TableCell>{getEmployeePosition(record.employee_id)}</TableCell>
                      <TableCell className="hidden md:table-cell">{formatDate(record.review_date)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{normalizeScore(record.performance_score).toFixed(1)}%</span>
                          <Progress value={normalizeScore(record.performance_score)} className="h-2 w-16" />
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">{record.incentive || "None"}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="line-clamp-1">{record.comments}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditPerformance(record)}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeletePerformance(record)}>
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
                      No performance records found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Performance Details</CardTitle>
          <CardDescription>All employee performance reviews</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Review Date</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead className="hidden md:table-cell">Comments</TableHead>
                  <TableHead className="hidden lg:table-cell">Incentive</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {performance.length > 0 ? (
                  performance.map((record) => (
                    <TableRow key={record.performance_id}>
                      <TableCell className="font-medium">{getEmployeeName(record.employee_id)}</TableCell>
                      <TableCell>{formatDate(record.review_date)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{normalizeScore(record.performance_score).toFixed(1)}%</span>
                          <Progress value={normalizeScore(record.performance_score)} className="h-2 w-16" />
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="line-clamp-1">{record.comments}</span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">{record.incentive || "None"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditPerformance(record)}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeletePerformance(record)}>
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
                      No performance records found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      {editingPerformance && (
        <EditPerformanceForm
          performance={editingPerformance}
          employees={employees}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onPerformanceUpdated={handlePerformanceUpdated}
        />
      )}
      {deletingPerformance && (
        <DeleteConfirmationDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          title="Delete Performance Record"
          description={`Are you sure you want to delete this performance record?`}
          deleteUrl={`http://localhost:3000/api/personnel/performance/delete/${deletingPerformance.performance_id}`}
          onDeleteSuccess={handlePerformanceDeleted}
        />
      )}
    </div>
  )
}
