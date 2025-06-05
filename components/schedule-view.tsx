"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Employee, Schedule } from "@/components/dashboard"
import { Calendar, ChevronLeft, ChevronRight, Pencil, Trash2 } from "lucide-react"
import { useState } from "react"
import AddScheduleForm from "@/components/add-schedule-form"
import EditScheduleForm from "@/components/edit-schedule-form"
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog"

interface ScheduleViewProps {
  employees: Employee[]
  schedule: Schedule[]
}

export default function ScheduleView({ employees, schedule }: ScheduleViewProps) {
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [deletingSchedule, setDeletingSchedule] = useState<Schedule | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleScheduleAdded = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  const handleScheduleUpdated = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  const handleScheduleDeleted = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  const handleEditSchedule = (scheduleRecord: Schedule) => {
    setEditingSchedule(scheduleRecord)
    setIsEditDialogOpen(true)
  }

  const handleDeleteSchedule = (scheduleRecord: Schedule) => {
    setDeletingSchedule(scheduleRecord)
    setIsDeleteDialogOpen(true)
  }

  // Get employee name by ID
  const getEmployeeName = (employeeId: number) => {
    const employee = employees.find((emp) => emp.employee_id === employeeId)
    return employee ? `${employee.first_name} ${employee.last_name}` : "Unknown Employee"
  }

  // Get employee department (using position as a proxy since we don't have department data)
  const getEmployeeDepartment = (employeeId: number) => {
    const employee = employees.find((emp) => emp.employee_id === employeeId)
    return employee ? employee.position : "Unknown Department"
  }

  // Format time from ISO string (1970-01-01T08:00:00.000Z) to readable time (8:00 AM)
  const formatTime = (timeString: string) => {
    const date = new Date(timeString)
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  // Format date from ISO string to readable date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  // Determine shift type based on start time
  const getShiftType = (startTime: string) => {
    const hour = new Date(startTime).getHours()
    if (hour < 12) return "Morning"
    if (hour < 17) return "Afternoon"
    return "Evening"
  }

  // Get current week dates
  const today = new Date()
  const currentWeek = Array(7)
    .fill(null)
    .map((_, i) => {
      const date = new Date(today)
      date.setDate(today.getDate() - today.getDay() + i)
      return date
    })

  // Count shifts by type
  const morningShifts = schedule.filter((s) => getShiftType(s.shift_start) === "Morning").length
  const afternoonShifts = schedule.filter((s) => getShiftType(s.shift_start) === "Afternoon").length
  const eveningShifts = schedule.filter((s) => getShiftType(s.shift_start) === "Evening").length

  return (
    <div className="w-full sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Schedule</h2>
        <AddScheduleForm employees={employees} onScheduleAdded={handleScheduleAdded} />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Weekly Schedule</CardTitle>
              <CardDescription>
                {currentWeek[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })} -{" "}
                {currentWeek[6].toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Calendar className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="hidden md:table-cell">Department</TableHead>
                  <TableHead>Shift</TableHead>
                  <TableHead className="hidden md:table-cell">Start Time</TableHead>
                  <TableHead className="hidden md:table-cell">End Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedule.length > 0 ? (
                  schedule.map((record) => (
                    <TableRow key={record.schedule_id}>
                      <TableCell className="font-medium">{getEmployeeName(record.employee_id)}</TableCell>
                      <TableCell>{formatDate(record.shift_date)}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {getEmployeeDepartment(record.employee_id)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getShiftType(record.shift_start) === "Morning" ? "default" : "secondary"}>
                          {getShiftType(record.shift_start)}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{formatTime(record.shift_start)}</TableCell>
                      <TableCell className="hidden md:table-cell">{formatTime(record.shift_end)}</TableCell>
                      <TableCell>
                        <Badge variant={record.shift_status === "Scheduled" ? "outline" : "default"}>
                          {record.shift_status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditSchedule(record)}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteSchedule(record)}>
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
                      No schedule records found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Shift Distribution</CardTitle>
            <CardDescription>Current week shift allocation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Morning Shifts</span>
                <span className="font-medium">{morningShifts}</span>
              </div>
              <div className="h-2 w-full bg-muted overflow-hidden rounded-full">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${(morningShifts / (schedule.length || 1)) * 100}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between">
                <span>Afternoon Shifts</span>
                <span className="font-medium">{afternoonShifts}</span>
              </div>
              <div className="h-2 w-full bg-muted overflow-hidden rounded-full">
                <div
                  className="h-full bg-secondary"
                  style={{ width: `${(afternoonShifts / (schedule.length || 1)) * 100}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between">
                <span>Evening Shifts</span>
                <span className="font-medium">{eveningShifts}</span>
              </div>
              <div className="h-2 w-full bg-muted overflow-hidden rounded-full">
                <div
                  className="h-full bg-accent"
                  style={{ width: `${(eveningShifts / (schedule.length || 1)) * 100}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Time Off</CardTitle>
            <CardDescription>Scheduled absences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] flex items-center justify-center text-muted-foreground">
              No upcoming time off requests
            </div>
          </CardContent>
        </Card>
      </div>
      {editingSchedule && (
        <EditScheduleForm
          schedule={editingSchedule}
          employees={employees}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onScheduleUpdated={handleScheduleUpdated}
        />
      )}
      {deletingSchedule && (
        <DeleteConfirmationDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          title="Delete Schedule"
          description={`Are you sure you want to delete this schedule record?`}
          deleteUrl={`http://localhost:3000/api/personnel/schedule/delete/${deletingSchedule.schedule_id}`}
          onDeleteSuccess={handleScheduleDeleted}
        />
      )}
    </div>
  )
}
