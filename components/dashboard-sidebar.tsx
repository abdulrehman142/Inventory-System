"use client"
import { Button } from "@/components/ui/button"
import {
  LogOut,
  LayoutDashboard,
  Users,
  UserCog,
  Calendar,
  BarChart,
  Clock,
  Home,
  Settings,
  UserPlus,
  LogIn,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

interface DashboardSidebarProps {
  activeView: string
  setActiveView: (view: string) => void
  onLogout: () => void
}

export default function DashboardSidebar({ activeView, setActiveView, onLogout }: DashboardSidebarProps) {
  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "employees", label: "Employees", icon: Users },
    { id: "roles", label: "Roles", icon: UserCog },
    { id: "attendance", label: "Attendance", icon: Clock },
    { id: "performance", label: "Performance", icon: BarChart },
    { id: "schedule", label: "Schedule", icon: Calendar },
  ]

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-4 py-2">
            <Home className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Admin Portal</h1>
          </div>
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton isActive={activeView === item.id} onClick={() => setActiveView(item.id)}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarSeparator />
          <SidebarGroup>
            <SidebarGroupLabel>System</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center gap-3 px-4 py-3">
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Admin User" />
              <AvatarFallback>AU</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Admin User</span>
              <span className="text-xs text-muted-foreground">admin@example.com</span>
            </div>
          </div>
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex flex-col gap-2">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
              onClick={onLogout}
            >
              <LogOut className="h-5 w-5" />
              Logout
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
              asChild
            >
              <Link href="/signup">
                <UserPlus className="h-5 w-5" />
                Sign Up
              </Link>
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20"
              asChild
            >
              <Link href="/login">
                <LogIn className="h-5 w-5" />
                Login
              </Link>
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  )
}
  