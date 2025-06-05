"use client"

import {
  LayoutDashboard,
  Package,
  Tags,
  Truck,
  Link,
  Warehouse,
  Settings,
  Home,
  ShoppingCart,
  FileText,
  List,
  Users,
  MessageSquare,
  HeadphonesIcon,
  CreditCard,
  ShoppingBag,
  Receipt,
  DollarSign,
  Clipboard,
  PieChart,
  BoxesIcon,
  LogOut,
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface InventorySidebarProps {
  activeView: string
  setActiveView: (view: string) => void
  onLogout: () => void
}

export default function InventorySidebar({ activeView, setActiveView, onLogout }: InventorySidebarProps) {
  const mainMenuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "summaries", label: "Summaries", icon: PieChart },
  ]

  const inventoryItems = [
    { id: "categories", label: "Categories", icon: Tags },
    { id: "suppliers", label: "Suppliers", icon: Truck },
    { id: "products", label: "Products", icon: Package },
    { id: "product-suppliers", label: "Product Suppliers", icon: Link },
    { id: "inventory", label: "Inventory", icon: Warehouse },
  ]

  const procurementItems = [
    { id: "purchase-orders", label: "Purchase Orders", icon: FileText },
  ]

  const customerServiceItems = [
    { id: "customers", label: "Customers", icon: Users },
    { id: "feedback", label: "Feedback", icon: MessageSquare },
  ]

  const paymentOrderItems = [
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "invoices", label: "Invoices", icon: Receipt },
    { id: "payments", label: "Payments", icon: DollarSign },
  ]

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <Warehouse className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">Gaming Inventory</h1>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton isActive={activeView === item.id} onClick={() => setActiveView(item.id)}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* Inventory Section */}
              <Collapsible className="w-full group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <BoxesIcon className="h-4 w-4" />
                      <span>Inventory</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                </SidebarMenuItem>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {inventoryItems.map((item) => (
                      <SidebarMenuSubItem key={item.id}>
                        <SidebarMenuSubButton isActive={activeView === item.id} onClick={() => setActiveView(item.id)}>
                          <item.icon className="h-4 w-4 mr-2" />
                          {item.label}
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible className="w-full group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <ShoppingCart className="h-4 w-4" />
                      <span>Procurement</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                </SidebarMenuItem>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {procurementItems.map((item) => (
                      <SidebarMenuSubItem key={item.id}>
                        <SidebarMenuSubButton isActive={activeView === item.id} onClick={() => setActiveView(item.id)}>
                          <item.icon className="h-4 w-4 mr-2" />
                          {item.label}
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible className="w-full group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <HeadphonesIcon className="h-4 w-4" />
                      <span>Customer Service</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                </SidebarMenuItem>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {customerServiceItems.map((item) => (
                      <SidebarMenuSubItem key={item.id}>
                        <SidebarMenuSubButton isActive={activeView === item.id} onClick={() => setActiveView(item.id)}>
                          <item.icon className="h-4 w-4 mr-2" />
                          {item.label}
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible className="w-full group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <CreditCard className="h-4 w-4" />
                      <span>Payment Order</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                </SidebarMenuItem>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {paymentOrderItems.map((item) => (
                      <SidebarMenuSubItem key={item.id}>
                        <SidebarMenuSubButton isActive={activeView === item.id} onClick={() => setActiveView(item.id)}>
                          <item.icon className="h-4 w-4 mr-2" />
                          {item.label}
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
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
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/">
                    <Home className="h-4 w-4" />
                    <span>Back to Home</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-3 px-4 py-3">
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Inventory Manager" />
            <AvatarFallback>IM</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">Inventory Manager</span>
            <span className="text-xs text-muted-foreground">manager@example.com</span>
          </div>
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
            onClick={onLogout}
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
