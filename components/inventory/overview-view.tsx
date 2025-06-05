"use client"

import { CardDescription } from "@/components/ui/card"
import { CardContent } from "@/components/ui/card"
import { CardTitle } from "@/components/ui/card"
import { CardHeader } from "@/components/ui/card"
import { Card } from "@/components/ui/card"
import {
  Package,
  Truck,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Award,
  MessageSquare,
  Star,
  User,
  ShoppingBag,
  Receipt,
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react"
import type {
  Category,
  Supplier,
  Product,
  InventoryItem,
  PurchaseOrder,
  Customer,
  Feedback,
  Order,
  Invoice,
  Payment,
} from "./inventory-dashboard"

interface OverviewViewProps {
  categories: Category[]
  suppliers: Supplier[]
  products: Product[]
  inventory: InventoryItem[]
  purchaseOrders: PurchaseOrder[]
  customers: Customer[]
  feedback: Feedback[]
  orders: Order[]
  invoices: Invoice[]
  payments: Payment[]
}

export default function OverviewView({
  categories,
  suppliers,
  products,
  inventory,
  purchaseOrders,
  customers,
  feedback,
  orders,
  invoices,
  payments,
}: OverviewViewProps) {
  // Calculate total inventory value
  const totalInventoryValue = inventory.reduce((total, item) => {
    const product = products.find((p) => p.product_id === item.product_id)
    return total + (product ? product.price * item.quantity : 0)
  }, 0)

  // Calculate total cost value
  const totalCostValue = inventory.reduce((total, item) => {
    const product = products.find((p) => p.product_id === item.product_id)
    return total + (product ? product.cost * item.quantity : 0)
  }, 0)

  // Calculate potential profit
  const potentialProfit = totalInventoryValue - totalCostValue

  // Find low stock items (less than 10 units)
  const lowStockItems = inventory.filter((item) => item.quantity < 10).length

  // Calculate average stock per product
  const averageStock =
    inventory.length > 0 ? inventory.reduce((sum, item) => sum + item.quantity, 0) / inventory.length : 0

  // Calculate total purchase orders value
  const totalPurchaseOrdersValue = purchaseOrders.reduce((total, order) => total + order.total_amount, 0)

  // Count purchase orders by status
  const pendingOrders = purchaseOrders.filter((order) => order.status === "Pending").length
  const approvedOrders = purchaseOrders.filter((order) => order.status === "Approved").length

  // Customer service statistics
  const totalCustomers = customers.length
  const averageLoyaltyPoints =
    customers.length > 0 ? customers.reduce((sum, customer) => sum + customer.loyalty_points, 0) / customers.length : 0

  // Feedback statistics
  const totalFeedback = feedback.length
  const averageRating = feedback.length > 0 ? feedback.reduce((sum, item) => sum + item.rating, 0) / feedback.length : 0
  const recentFeedback = [...feedback]
    .sort((a, b) => new Date(b.feedback_date).getTime() - new Date(a.feedback_date).getTime())
    .slice(0, 5)

  // Payment Order statistics
  const totalOrders = orders.length
  const totalOrderValue = orders.reduce((total, order) => total + order.total_amount, 0)

  // Order status counts
  const newOrders = orders.filter((order) => order.order_status === "New").length
  const processingOrders = orders.filter((order) => order.order_status === "Processing").length
  const shippedOrders = orders.filter((order) => order.order_status === "Shipped").length

  // Invoice statistics
  const totalInvoices = invoices.length
  const paidInvoices = invoices.filter((invoice) => invoice.invoice_status === "Paid").length
  const unpaidInvoices = invoices.filter((invoice) => invoice.invoice_status === "Unpaid").length

  // Payment statistics
  const totalPayments = payments.length
  const totalPaymentAmount = payments.reduce((total, payment) => total + payment.amount, 0)
  const completedPayments = payments.filter((payment) => payment.status === "Completed").length
  const pendingPayments = payments.filter((payment) => payment.status === "Pending").length

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Inventory Dashboard</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">Across {categories.length} categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Suppliers</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{suppliers.length}</div>
            <p className="text-xs text-muted-foreground">Active partnerships</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalInventoryValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Total retail value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockItems}</div>
            <p className="text-xs text-muted-foreground">Items with less than 10 units</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Potential Profit</CardTitle>
            <CardDescription>Based on current inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">${potentialProfit.toFixed(2)}</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Profit margin: {totalInventoryValue > 0 ? ((potentialProfit / totalInventoryValue) * 100).toFixed(1) : 0}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Purchase Orders</CardTitle>
            <CardDescription>Current procurement status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">${totalPurchaseOrdersValue.toFixed(2)}</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Pending Orders</span>
                <span className="text-sm font-medium">{pendingOrders}</span>
              </div>
              <div className="h-2 w-full bg-muted overflow-hidden rounded-full">
                <div
                  className="h-full bg-yellow-500"
                  style={{ width: `${purchaseOrders.length > 0 ? (pendingOrders / purchaseOrders.length) * 100 : 0}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Approved Orders</span>
                <span className="text-sm font-medium">{approvedOrders}</span>
              </div>
              <div className="h-2 w-full bg-muted overflow-hidden rounded-full">
                <div
                  className="h-full bg-green-500"
                  style={{
                    width: `${purchaseOrders.length > 0 ? (approvedOrders / purchaseOrders.length) * 100 : 0}%`,
                  }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory Statistics</CardTitle>
            <CardDescription>Stock levels and distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Average Stock per Product</span>
                  <span className="text-sm font-medium">{averageStock.toFixed(0)} units</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Stock Count</span>
                  <span className="text-sm font-medium">
                    {inventory.reduce((sum, item) => sum + item.quantity, 0)} units
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Products with Inventory</span>
                  <span className="text-sm font-medium">
                    {inventory.length} / {products.length}
                  </span>
                </div>
                <div className="mt-1 h-2 w-full bg-muted overflow-hidden rounded-full">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${products.length > 0 ? (inventory.length / products.length) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Service Section */}
      <h2 className="text-2xl font-bold tracking-tight mt-8">Customer Service</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">Registered accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Loyalty Points</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageLoyaltyPoints.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">Points per customer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Feedback Count</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFeedback}</div>
            <p className="text-xs text-muted-foreground">Customer reviews</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating.toFixed(1)}/5</div>
            <p className="text-xs text-muted-foreground">Customer satisfaction</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Order Section */}
      <h2 className="text-2xl font-bold tracking-tight mt-8">Payment & Orders</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">Customer purchases</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Order Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalOrderValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Total sales value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Invoices</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInvoices}</div>
            <p className="text-xs text-muted-foreground">
              {paidInvoices} paid, {unpaidInvoices} unpaid
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPaymentAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Total received payments</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
            <CardDescription>Current order distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm">New Orders</span>
                </div>
                <span className="text-sm font-medium">{newOrders}</span>
              </div>
              <div className="h-2 w-full bg-muted overflow-hidden rounded-full">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${orders.length > 0 ? (newOrders / orders.length) * 100 : 0}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <span className="text-sm">Processing</span>
                </div>
                <span className="text-sm font-medium">{processingOrders}</span>
              </div>
              <div className="h-2 w-full bg-muted overflow-hidden rounded-full">
                <div
                  className="h-full bg-yellow-500"
                  style={{ width: `${orders.length > 0 ? (processingOrders / orders.length) * 100 : 0}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span className="text-sm">Shipped</span>
                </div>
                <span className="text-sm font-medium">{shippedOrders}</span>
              </div>
              <div className="h-2 w-full bg-muted overflow-hidden rounded-full">
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${orders.length > 0 ? (shippedOrders / orders.length) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Status</CardTitle>
            <CardDescription>Current payment distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Completed Payments</span>
                </div>
                <span className="text-sm font-medium">{completedPayments}</span>
              </div>
              <div className="h-2 w-full bg-muted overflow-hidden rounded-full">
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${payments.length > 0 ? (completedPayments / payments.length) * 100 : 0}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">Pending Payments</span>
                </div>
                <span className="text-sm font-medium">{pendingPayments}</span>
              </div>
              <div className="h-2 w-full bg-muted overflow-hidden rounded-full">
                <div
                  className="h-full bg-yellow-500"
                  style={{ width: `${payments.length > 0 ? (pendingPayments / payments.length) * 100 : 0}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm">Unpaid Invoices</span>
                </div>
                <span className="text-sm font-medium">{unpaidInvoices}</span>
              </div>
              <div className="h-2 w-full bg-muted overflow-hidden rounded-full">
                <div
                  className="h-full bg-red-500"
                  style={{ width: `${invoices.length > 0 ? (unpaidInvoices / invoices.length) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Feedback</CardTitle>
            <CardDescription>Latest customer reviews</CardDescription>
          </CardHeader>
          <CardContent>
            {recentFeedback.length > 0 ? (
              <div className="space-y-4">
                {recentFeedback.map((item) => {
                  const customer = customers.find((c) => c.customer_id === item.customer_id)
                  const product = products.find((p) => p.product_id === item.product_id)

                  return (
                    <div key={item.feedback_id} className="border-b pb-3 last:border-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">
                            {customer ? `${customer.first_name} ${customer.last_name}` : "Unknown Customer"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {product ? product.product_name : "Unknown Product"} •{" "}
                            {new Date(item.feedback_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < item.rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm mt-1 line-clamp-2">{item.comment}</p>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                No feedback available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Loyalty</CardTitle>
            <CardDescription>Top customers by loyalty points</CardDescription>
          </CardHeader>
          <CardContent>
            {customers.length > 0 ? (
              <div className="space-y-4">
                {[...customers]
                  .sort((a, b) => b.loyalty_points - a.loyalty_points)
                  .slice(0, 5)
                  .map((customer) => (
                    <div key={customer.customer_id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {customer.first_name} {customer.last_name}
                          </p>
                          <p className="text-xs text-muted-foreground">{customer.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="h-4 w-4 text-primary" />
                        <span className="font-medium">{customer.loyalty_points}</span>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                No customers available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
