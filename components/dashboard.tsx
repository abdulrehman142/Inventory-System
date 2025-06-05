"use client"

import { useEffect, useState } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { useAuth } from "@/lib/auth-context"
import DashboardSidebar from "@/components/dashboard-sidebar"
import DashboardHeader from "@/components/dashboard-header"
import EmployeeTable from "@/components/employee-table"
import RolesTable from "@/components/roles-table"
import OverviewCards from "@/components/overview-cards"
import AttendanceView from "@/components/attendance-view"
import PerformanceView from "@/components/performance-view"
import ScheduleView from "@/components/schedule-view"
import { Toaster } from "@/components/ui/toaster"

export type Employee = {
  employee_id: number
  role_id: number
  first_name: string
  last_name: string
  phone: string
  email: string
  position: string
  hire_date: string
  status: string
}

export type Role = {
  role_id: number
  role_name: string
  description: string
}

export type Attendance = {
  attendance_id: number
  employee_id: number
  attendance_date: string
  clock_in: string
  clock_out: string
  status: string
}

export type Performance = {
  performance_id: number
  employee_id: number
  review_date: string
  performance_score: number
  comments: string
  incentive: string
}

export type Schedule = {
  schedule_id: number
  employee_id: number
  shift_date: string
  shift_start: string
  shift_end: string
  shift_status: string
}

export default function Dashboard() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [attendance, setAttendance] = useState<Attendance[]>([])
  const [performance, setPerformance] = useState<Performance[]>([])
  const [schedule, setSchedule] = useState<Schedule[]>([])
  const [activeView, setActiveView] = useState("dashboard")
  const [isLoading, setIsLoading] = useState(true)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const { logout } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [employeesResponse, rolesResponse, attendanceResponse, performanceResponse, scheduleResponse] =
          await Promise.all([
            fetch("http://localhost:3000/api/personnel/employee/"),
            fetch("http://localhost:3000/api/personnel/role/"),
            fetch("http://localhost:3000/api/personnel/attendance/"),
            fetch("http://localhost:3000/api/personnel/performance/"),
            fetch("http://localhost:3000/api/personnel/schedule/"),
          ])

        const employeesData = await employeesResponse.json()
        const rolesData = await rolesResponse.json()
        const attendanceData = await attendanceResponse.json()
        const performanceData = await performanceResponse.json()
        const scheduleData = await scheduleResponse.json()

        setEmployees(employeesData)
        setRoles(rolesData)
        setAttendance(attendanceData)
        setPerformance(performanceData)
        setSchedule(scheduleData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [refreshTrigger])

  const handleDataRefresh = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return <OverviewCards employees={employees} roles={roles} attendance={attendance} performance={performance} />
      case "employees":
        return <EmployeeTable employees={employees} roles={roles} />
      case "roles":
        return <RolesTable roles={roles} />
      case "attendance":
        return <AttendanceView employees={employees} attendance={attendance} />
      case "performance":
        return <PerformanceView employees={employees} performance={performance} />
      case "schedule":
        return <ScheduleView employees={employees} schedule={schedule} />
      default:
        return <OverviewCards employees={employees} roles={roles} attendance={attendance} performance={performance} />
    }
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        {/* Fixed width sidebar with proper z-index */}
        <div className="w-64 flex-shrink-0 z-30 relative">
          <DashboardSidebar activeView={activeView} setActiveView={setActiveView} onLogout={logout} />
        </div>

        {/* Main content area that stretches fully */}
        <div className="flex flex-col flex-1 overflow-auto">
          <DashboardHeader />
          <main className="flex-1 p-6 w-full">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              renderContent()
            )}
          </main>
        </div>
      </div>
      <Toaster />
    </SidebarProvider>
  )
}
