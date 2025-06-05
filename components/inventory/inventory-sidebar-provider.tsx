"use client"

import { SidebarProvider } from "@/components/ui/sidebar"
import type { ReactNode } from "react"

interface InventorySidebarProviderProps {
  children: ReactNode
}

export function InventorySidebarProvider({ children }: InventorySidebarProviderProps) {
  return <SidebarProvider defaultOpen={true}>{children}</SidebarProvider>
}
