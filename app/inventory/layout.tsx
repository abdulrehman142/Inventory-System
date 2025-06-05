import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../globals.css"
import { Toaster } from "@/components/ui/toaster"
import { InventorySidebarProvider } from "@/components/inventory/inventory-sidebar-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Inventory Management System",
  description: "Manage your inventory, products, suppliers, and categories",
}

export default function InventoryLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <InventorySidebarProvider>
          {children}
          <Toaster />
        </InventorySidebarProvider>
      </body>
    </html>
  )
}
