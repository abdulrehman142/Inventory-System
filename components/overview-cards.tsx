"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Employee, Role, Attendance, Performance } from "@/components/dashboard"
import { Users, ClipboardList, UserCheck, UserX, Calendar, TrendingUp } from "lucide-react"

interface OverviewCardsProps {
  employees: Employee[]
  roles: Role[]
  attendance?: Attendance[]
  performance?: Performance[]
}

export default function OverviewCards({
  employees,
  roles,
  attendance = [],
  performance = [],
}: OverviewCardsProps) {
  const activeEmployees = employees.filter((emp) => emp.status === "Active").length
  const inactiveEmployees = employees.length - activeEmployees

  // Calculate attendance statistics
  const presentCount = attendance.filter((a) => a.status === "Present").length
  const absentCount = attendance.filter((a) => a.status !== "Present").length
  const attendanceRate = attendance.length > 0 ? (presentCount / attendance.length) * 100 : 0

  // Calculate average performance score
  const normalizeScore = (score: number) => {
    if (score >= 0 && score <= 100) return score
    if (score >= 0 && score <= 10) return score * 10
    return score
  }
  const averagePerformance =
    performance.length > 0
      ? performance.reduce((acc, curr) => acc + normalizeScore(curr.performance_score), 0) / performance.length
      : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      {/* top row: 4 cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.length}</div>
            <p className="text-xs text-muted-foreground">Across all departments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roles.length}</div>
            <p className="text-xs text-muted-foreground">Available in the system</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeEmployees}</div>
            <p className="text-xs text-muted-foreground">Currently working</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Inactive Employees</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inactiveEmployees}</div>
            <p className="text-xs text-muted-foreground">On leave or terminated</p>
          </CardContent>
        </Card>
      </div>

      {/* second row: 3 cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceRate.toFixed(1)}%</div>
            <div className="mt-2 h-2 w-full bg-muted overflow-hidden rounded-full">
              <div className="h-full bg-primary" style={{ width: `${attendanceRate}%` }} />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {presentCount} present, {absentCount} absent
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averagePerformance.toFixed(1)}%</div>
            <div className="mt-2 h-2 w-full bg-muted overflow-hidden rounded-full">
              <div className="h-full bg-primary" style={{ width: `${averagePerformance}%` }} />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Based on {performance.length} performance reviews
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Role Distribution</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {roles.slice(0, 3).map((role) => {
                const count = employees.filter((e) => e.role_id === role.role_id).length
                const pct = employees.length > 0 ? (count / employees.length) * 100 : 0
                return (
                  <div key={role.role_id}>
                    <div className="flex justify-between text-sm">
                      <span>{role.role_name}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                    <div className="mt-1 h-2 w-full bg-muted overflow-hidden rounded-full">
                      <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
              {roles.length > 3 && (
                <div className="text-xs text-muted-foreground text-center">+{roles.length - 3} more roles</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* third row: 2 chart placeholders */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Employee activity in the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] flex items-center justify-center text-muted-foreground">
              Activity chart will be displayed here
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
            <CardDescription>Monthly performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] flex items-center justify-center text-muted-foreground">
              Performance trend chart will be displayed here
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
