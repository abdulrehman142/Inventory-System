"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Employee, Attendance } from "@/components/dashboard"
import { Calendar, Pencil, Trash2 } from "lucide-react"
import { useState } from "react"
import AddAttendanceForm from "@/components/add-attendance-form"
import EditAttendanceForm from "@/components/edit-attendance-form"
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog"

interface AttendanceViewProps {
  employees: Employee[]
  attendance: Attendance[]
}

export default function AttendanceView({ employees, attendance }: AttendanceViewProps) {
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [editingAttendance, setEditingAttendance] = useState<Attendance | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [deletingAttendance, setDeletingAttendance] = useState<Attendance | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleAttendanceAdded = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  const handleAttendanceUpdated = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  const handleAttendanceDeleted = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  const handleEditAttendance = (attendanceRecord: Attendance) => {
    setEditingAttendance(attendanceRecord)
    setIsEditDialogOpen(true)
  }

  const handleDeleteAttendance = (attendanceRecord: Attendance) => {
    setDeletingAttendance(attendanceRecord)
    setIsDeleteDialogOpen(true)
  }

  // Format time from ISO string (1970-01-01T08:30:00.000Z) to readable time (8:30 AM)
  const formatTime = (timeString: string) => {
    const date = new Date(timeString)
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  // Calculate total hours between clock in and clock out
  const calculateHours = (clockIn: string, clockOut: string) => {
    const start = new Date(clockIn)
    const end = new Date(clockOut)
    const diffMs = end.getTime() - start.getTime()
    const diffHrs = diffMs / (1000 * 60 * 60)
    return diffHrs.toFixed(2)
  }

  // Get employee name by ID
  const getEmployeeName = (employeeId: number) => {
    const employee = employees.find((emp) => emp.employee_id === employeeId)
    return employee ? `${employee.first_name} ${employee.last_name}` : "Unknown Employee"
  }

  // Format date from ISO string to readable date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Get today's date for display
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Calculate statistics
  const presentCount = attendance.filter((a) => a.status === "Present").length
  const absentCount = attendance.filter((a) => a.status !== "Present").length
  const totalCount = attendance.length
  const presentPercentage = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0
  const absentPercentage = totalCount > 0 ? Math.round((absentCount / totalCount) * 100) : 0

  // Calculate average hours
  const averageHours =
    attendance.reduce((acc, curr) => {
      return acc + Number.parseFloat(calculateHours(curr.clock_in, curr.clock_out))
    }, 0) / (attendance.length || 1)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Attendance</h2>
        <div className="flex items-center gap-4 mt-2 sm:mt-0">
          <div className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            <span>{today}</span>
          </div>
          <AddAttendanceForm employees={employees} onAttendanceAdded={handleAttendanceAdded} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Present</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{presentCount}</div>
            <p className="text-xs text-muted-foreground">{presentPercentage}% of total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Absent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{absentCount}</div>
            <p className="text-xs text-muted-foreground">{absentPercentage}% of total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageHours.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Hours per employee</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
          <CardDescription>Employee check-in and check-out times</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Check In</TableHead>
                  <TableHead className="hidden md:table-cell">Check Out</TableHead>
                  <TableHead className="hidden lg:table-cell">Total Hours</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendance.length > 0 ? (
                  attendance.map((record) => (
                    <TableRow key={record.attendance_id}>
                      <TableCell className="font-medium">{getEmployeeName(record.employee_id)}</TableCell>
                      <TableCell>{formatDate(record.attendance_date)}</TableCell>
                      <TableCell>
                        <Badge variant={record.status === "Present" ? "default" : "destructive"}>{record.status}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{formatTime(record.clock_in)}</TableCell>
                      <TableCell className="hidden md:table-cell">{formatTime(record.clock_out)}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {calculateHours(record.clock_in, record.clock_out)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditAttendance(record)}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteAttendance(record)}>
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
                      No attendance records found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      {editingAttendance && (
        <EditAttendanceForm
          attendance={editingAttendance}
          employees={employees}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onAttendanceUpdated={handleAttendanceUpdated}
        />
      )}
      {deletingAttendance && (
        <DeleteConfirmationDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          title="Delete Attendance Record"
          description={`Are you sure you want to delete this attendance record?`}
          deleteUrl={`http://localhost:3000/api/personnel/attendance/delete/${deletingAttendance.attendance_id}`}
          onDeleteSuccess={handleAttendanceDeleted}
        />
      )}
    </div>
  )
}
