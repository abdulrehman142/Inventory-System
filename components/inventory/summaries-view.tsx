"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  ShoppingBag,
  Truck,
  MessageSquare,
  TrendingUp,
  Calendar,
  Clock,
  AlertCircle,
  Star,
  DollarSign,
  Package,
  BadgeCheck,
  Receipt,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

// Define the types for our data
interface EmployeeDetail {
  employee_id: number
  first_name: string
  last_name: string
  phone: string
  email: string
  position: string
  hire_date: string
  status: string
  role_name: string
  role_description: string
}

interface OrderSummary {
  order_id: number
  order_date: string
  order_status: string
  total_amount: number
  discount: number
  tax: number
  final_amount: number
  customer_name: string
  customer_email: string
  invoice_status: string
  due_date: string
}

interface PurchaseOrderSummary {
  po_id: number
  order_date: string
  status: string
  total_amount: number
  expected_delivery_date: string
  supplier_name: string
  supplier_phone: string
  total_items_ordered: number
}

interface CustomerFeedback {
  feedback_id: number
  feedback_date: string
  rating: number
  comment: string
  customer_name: string
  customer_email: string
  product_name: string
}

export default function SummariesView() {
  const [employeeDetails, setEmployeeDetails] = useState<EmployeeDetail[]>([])
  const [orderSummaries, setOrderSummaries] = useState<OrderSummary[]>([])
  const [purchaseOrderSummaries, setPurchaseOrderSummaries] = useState<PurchaseOrderSummary[]>([])
  const [customerFeedbacks, setCustomerFeedbacks] = useState<CustomerFeedback[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [employeeDetailsResponse, orderSummaryResponse, purchaseOrderSummaryResponse, customerFeedbackResponse] =
          await Promise.all([
            fetch("http://localhost:3000/api/custom/empDetails"),
            fetch("http://localhost:3000/api/custom/orderSummary"),
            fetch("http://localhost:3000/api/custom/purchaseOrderSummary"),
            fetch("http://localhost:3000/api/custom/customerFeedback"),
          ])

        const employeeDetailsData = await employeeDetailsResponse.json()
        const orderSummaryData = await orderSummaryResponse.json()
        const purchaseOrderSummaryData = await purchaseOrderSummaryResponse.json()
        const customerFeedbackData = await customerFeedbackResponse.json()

        setEmployeeDetails(employeeDetailsData)
        setOrderSummaries(orderSummaryData)
        setPurchaseOrderSummaries(purchaseOrderSummaryData)
        setCustomerFeedbacks(customerFeedbackData)
      } catch (error) {
        console.error("Error fetching summary data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Calculate key metrics
  const totalEmployees = employeeDetails.length
  const activeEmployees = employeeDetails.filter((emp) => emp.status === "Active").length

  const totalOrders = orderSummaries.length
  const totalOrdersValue = orderSummaries.reduce((sum, order) => sum + order.total_amount, 0)
  const completedOrders = orderSummaries.filter((order) => order.order_status === "Completed").length
  const pendingOrders = orderSummaries.filter((order) => order.order_status === "Pending").length
  const paidInvoices = orderSummaries.filter((order) => order.invoice_status === "Paid").length

  const totalPurchaseOrders = purchaseOrderSummaries.length
  const totalPurchaseOrdersValue = purchaseOrderSummaries.reduce((sum, po) => sum + po.total_amount, 0)
  const completedPOs = purchaseOrderSummaries.filter((po) => po.status === "Completed").length

  const totalFeedbacks = customerFeedbacks.length
  const avgRating =
    customerFeedbacks.length > 0
      ? customerFeedbacks.reduce((sum, feedback) => sum + feedback.rating, 0) / customerFeedbacks.length
      : 0

  // Get the most recent items for each category
  const recentEmployees = [...employeeDetails]
    .sort((a, b) => new Date(b.hire_date).getTime() - new Date(a.hire_date).getTime())
    .slice(0, 5)

  const recentOrders = [...orderSummaries]
    .sort((a, b) => new Date(b.order_date).getTime() - new Date(a.order_date).getTime())
    .slice(0, 5)

  const recentFeedbacks = [...customerFeedbacks]
    .sort((a, b) => new Date(b.feedback_date).getTime() - new Date(a.feedback_date).getTime())
    .slice(0, 5)

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "completed":
      case "paid":
        return "bg-green-500 hover:bg-green-600"
      case "pending":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "inactive":
      case "cancelled":
      case "unpaid":
        return "bg-red-500 hover:bg-red-600"
      default:
        return "bg-blue-500 hover:bg-blue-600"
    }
  }

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Summary Dashboard</h2>
          <p className="text-muted-foreground">
            A comprehensive overview of your business metrics and performance indicators.
          </p>
        </div>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>Last Updated: {new Date().toLocaleDateString()}</span>
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalEmployees}</div>
                <p className="text-xs text-muted-foreground">{activeEmployees} active employees</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Orders</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalOrders}</div>
                <p className="text-xs text-muted-foreground">${totalOrdersValue.toFixed(2)} total value</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Purchase Orders</CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalPurchaseOrders}</div>
                <p className="text-xs text-muted-foreground">${totalPurchaseOrdersValue.toFixed(2)} total value</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customer Feedback</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalFeedbacks}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <div className="flex mr-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-3 w-3 ${
                          star <= Math.round(avgRating) ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  {avgRating.toFixed(1)} average rating
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Business Performance</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Order Completion Rate</span>
                    <span className="text-sm text-muted-foreground">
                      {totalOrders > 0 ? ((completedOrders / totalOrders) * 100).toFixed(0) : 0}%
                    </span>
                  </div>
                  <Progress value={totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Invoice Payment Rate</span>
                    <span className="text-sm text-muted-foreground">
                      {totalOrders > 0 ? ((paidInvoices / totalOrders) * 100).toFixed(0) : 0}%
                    </span>
                  </div>
                  <Progress value={totalOrders > 0 ? (paidInvoices / totalOrders) * 100 : 0} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Purchase Order Completion</span>
                    <span className="text-sm text-muted-foreground">
                      {totalPurchaseOrders > 0 ? ((completedPOs / totalPurchaseOrders) * 100).toFixed(0) : 0}%
                    </span>
                  </div>
                  <Progress
                    value={totalPurchaseOrders > 0 ? (completedPOs / totalPurchaseOrders) * 100 : 0}
                    className="h-2"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Employee Activation</span>
                    <span className="text-sm text-muted-foreground">
                      {totalEmployees > 0 ? ((activeEmployees / totalEmployees) * 100).toFixed(0) : 0}%
                    </span>
                  </div>
                  <Progress value={totalEmployees > 0 ? (activeEmployees / totalEmployees) * 100 : 0} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest events across your business</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[...recentOrders, ...recentFeedbacks]
                  .sort((a, b) => {
                    const dateA = "order_date" in a ? new Date(a.order_date) : new Date(a.feedback_date)
                    const dateB = "order_date" in b ? new Date(b.order_date) : new Date(b.feedback_date)
                    return dateB.getTime() - dateA.getTime()
                  })
                  .slice(0, 5)
                  .map((item, index) => (
                    <div key={index} className="flex items-start gap-4 border-b pb-3 last:border-0 last:pb-0">
                      {"order_date" in item ? (
                        <>
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <ShoppingBag className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium">New Order #{item.order_id}</p>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Calendar className="mr-1 h-3 w-3" /> {new Date(item.order_date).toLocaleDateString()}
                              <Badge
                                className={`ml-2 text-white ${getStatusColor(item.order_status)}`}
                                variant="secondary"
                              >
                                {getStatusText(item.order_status)}
                              </Badge>
                            </div>
                            <p className="text-xs font-medium">Customer: {item.customer_name}</p>
                          </div>
                          <div className="text-sm font-medium">${item.total_amount.toFixed(2)}</div>
                        </>
                      ) : (
                        <>
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <MessageSquare className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium">New Feedback</p>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Calendar className="mr-1 h-3 w-3" /> {new Date(item.feedback_date).toLocaleDateString()}
                              <div className="flex ml-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-3 w-3 ${
                                      star <= item.rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-xs">
                              {item.comment.length > 50 ? `${item.comment.substring(0, 50)}...` : item.comment}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Employees Tab */}
        <TabsContent value="employees" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Employee Status</CardTitle>
                <CardDescription>Current employee distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-8">
                  <div className="space-y-4 text-center">
                    <div className="text-5xl font-bold">
                      {activeEmployees}/{totalEmployees}
                    </div>
                    <p className="text-muted-foreground">Active Employees</p>
                    <Progress value={(activeEmployees / totalEmployees) * 100} className="h-2 w-[200px]" />
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                    <BadgeCheck className="h-6 w-6 text-green-500 mb-2" />
                    <div className="text-xl font-bold">{activeEmployees}</div>
                    <p className="text-xs text-muted-foreground">Active</p>
                  </div>
                  <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                    <AlertCircle className="h-6 w-6 text-red-500 mb-2" />
                    <div className="text-xl font-bold">{totalEmployees - activeEmployees}</div>
                    <p className="text-xs text-muted-foreground">Inactive</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Recently Hired Employees</CardTitle>
                <CardDescription>Employees sorted by hire date</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentEmployees.map((employee) => (
                    <div
                      key={employee.employee_id}
                      className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={`/placeholder.svg?height=40&width=40`}
                          alt={`${employee.first_name} ${employee.last_name}`}
                        />
                        <AvatarFallback>
                          {employee.first_name.charAt(0)}
                          {employee.last_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">
                          {employee.first_name} {employee.last_name}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <p>{employee.position}</p>
                          <span>•</span>
                          <p>{employee.role_name}</p>
                        </div>
                      </div>
                      <div className="text-sm">
                        <div className="flex flex-col items-end">
                          <Badge
                            variant="outline"
                            className={`${
                              employee.status === "Active"
                                ? "border-green-500 text-green-600"
                                : "border-red-500 text-red-600"
                            }`}
                          >
                            {employee.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground mt-1">
                            Hired: {new Date(employee.hire_date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  View All Employees
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalOrders}</div>
                <p className="text-xs text-muted-foreground">{completedOrders} completed orders</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingOrders}</div>
                <p className="text-xs text-muted-foreground">
                  {pendingOrders > 0 ? "Requires attention" : "All orders processed"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Order Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalOrdersValue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  Avg: ${(totalOrdersValue / totalOrders).toFixed(2)} per order
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Invoice Status</CardTitle>
                <Receipt className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {paidInvoices}/{totalOrders}
                </div>
                <p className="text-xs text-muted-foreground">Paid invoices</p>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest customer orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2 font-medium">Order ID</th>
                      <th className="text-left py-3 px-2 font-medium">Customer</th>
                      <th className="text-left py-3 px-2 font-medium">Date</th>
                      <th className="text-left py-3 px-2 font-medium">Status</th>
                      <th className="text-right py-3 px-2 font-medium">Amount</th>
                      <th className="text-center py-3 px-2 font-medium">Invoice Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.order_id} className="border-b last:border-0 hover:bg-muted/50">
                        <td className="py-3 px-2">#{order.order_id}</td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{order.customer_name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{order.customer_name}</p>
                              <p className="text-xs text-muted-foreground">{order.customer_email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-sm">{new Date(order.order_date).toLocaleDateString()}</td>
                        <td className="py-3 px-2">
                          <Badge className={`text-white ${getStatusColor(order.order_status)}`}>
                            {getStatusText(order.order_status)}
                          </Badge>
                        </td>
                        <td className="py-3 px-2 text-right font-medium">${order.total_amount.toFixed(2)}</td>
                        <td className="py-3 px-2 text-center">
                          <Badge
                            variant="outline"
                            className={
                              order.invoice_status === "Paid"
                                ? "border-green-500 text-green-600"
                                : "border-yellow-500 text-yellow-600"
                            }
                          >
                            {order.invoice_status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                View All Orders
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Feedback Tab */}
        <TabsContent value="feedback" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalFeedbacks}</div>
                <p className="text-xs text-muted-foreground">Customer reviews</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgRating.toFixed(1)}/5</div>
                <div className="flex mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= Math.round(avgRating) ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Products Reviewed</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{new Set(customerFeedbacks.map((f) => f.product_name)).size}</div>
                <p className="text-xs text-muted-foreground">Unique products with feedback</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">High Ratings</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{customerFeedbacks.filter((f) => f.rating >= 4).length}</div>
                <p className="text-xs text-muted-foreground">
                  {((customerFeedbacks.filter((f) => f.rating >= 4).length / totalFeedbacks) * 100).toFixed(0)}% of
                  total feedback
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Recent Feedback</CardTitle>
              <CardDescription>Latest customer reviews</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recentFeedbacks.map((feedback) => (
                  <div key={feedback.feedback_id} className="space-y-2 border-b pb-4 last:border-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{feedback.customer_name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{feedback.customer_name}</p>
                          <p className="text-xs text-muted-foreground">{feedback.customer_email}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 items-center">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= feedback.rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(feedback.feedback_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Product: {feedback.product_name}</p>
                      <p className="text-sm text-muted-foreground">{feedback.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                View All Feedback
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
