"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import InventorySidebar from "@/components/inventory/inventory-sidebar"
import InventoryHeader from "@/components/inventory/inventory-header"
import CategoriesView from "@/components/inventory/categories-view"
import SuppliersView from "@/components/inventory/suppliers-view"
import ProductsView from "@/components/inventory/products-view"
import ProductSuppliersView from "@/components/inventory/product-suppliers-view"
import InventoryView from "@/components/inventory/inventory-view"
import OverviewView from "@/components/inventory/overview-view"
import PurchaseOrdersView from "@/components/inventory/purchase-orders-view"
import CustomersView from "@/components/inventory/customers-view"
import FeedbackView from "@/components/inventory/feedback-view"
import OrdersView from "@/components/inventory/orders-view"
import InvoicesView from "@/components/inventory/invoices-view"
import PaymentsView from "@/components/inventory/payments-view"
import SummariesView from "@/components/inventory/summaries-view"
// Define types for our data
export type Category = {
  category_id: number
  category_name: string
  description: string
}

export type Supplier = {
  supplier_id: number
  supplier_name: string
  contact_person: string
  email: string
  phone: string
  address: string
}

export type Product = {
  product_id: number
  category_id: number
  product_name: string
  description: string
  price: number
  cost: number
  is_digital: boolean
  release_date: string
}

export type ProductSupplier = {
  product_id: number
  supplier_id: number
}

export type InventoryItem = {
  inventory_id: number
  product_id: number
  quantity: number
}

export type PurchaseOrder = {
  po_id: number
  supplier_id: number
  supplier_name: string
  order_date: string
  status: string
  total_amount: number
  expected_delivery_date: string
}

export type PurchaseOrderItem = {
  po_item_id: number
  po_id: number
  product_id: number
  product_name: string
  quantity: number
  unit_cost: number
}

export type Customer = {
  customer_id: number
  first_name: string
  last_name: string
  phone: string
  email: string
  address: string
  loyalty_points: number
}

export type Feedback = {
  feedback_id: number
  customer_id: number
  product_id: number
  rating: number
  comment: string
  feedback_date: string
}

export type Order = {
  order_id: number
  customer_id: number
  order_date: string
  order_status: string
  total_amount: number
  discount: number
  tax: number
}

export type OrderItem = {
  order_item_id: number
  order_id: number
  product_id: number
  quantity: number
  price: number
  discount: number
}

export type Invoice = {
  invoice_id: number
  order_id: number
  invoice_date: string
  due_date: string
  invoice_status: string
}

export type Payment = {
  payment_id: number
  invoice_id: number
  payment_date: string
  payment_method: string
  amount: number
  transaction_id: string
  status: string
}

export default function InventoryDashboard() {
  const [activeView, setActiveView] = useState("overview")
  const [categories, setCategories] = useState<Category[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [productSuppliers, setProductSuppliers] = useState<ProductSupplier[]>([])
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([])
  const [purchaseOrderItems, setPurchaseOrderItems] = useState<PurchaseOrderItem[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const { logout } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [
          categoriesResponse,
          suppliersResponse,
          productsResponse,
          productSuppliersResponse,
          inventoryResponse,
          purchaseOrdersResponse,
          purchaseOrderItemsResponse,
          customersResponse,
          feedbackResponse,
          ordersResponse,
          orderItemsResponse,
          invoicesResponse,
          paymentsResponse,
        ] = await Promise.all([
          fetch("http://localhost:3000/api/poi/categories"),
          fetch("http://localhost:3000/api/poi/suppliers"),
          fetch("http://localhost:3000/api/poi/products"),
          fetch("http://localhost:3000/api/poi/productsuppliers"),
          fetch("http://localhost:3000/api/poi/inventory"),
          fetch("http://localhost:3000/api/procurement/purchaseOrder"),
          fetch("http://localhost:3000/api/procurement/purchaseOrderItems"),
          fetch("http://localhost:3000/api/poa/customer"),
          fetch("http://localhost:3000/api/poa/feedback"),
          fetch("http://localhost:3000/api/oap/orders"),
          fetch("http://localhost:3000/api/oap/orderItems"),
          fetch("http://localhost:3000/api/oap/invoices"),
          fetch("http://localhost:3000/api/oap/payments"),
        ])

        const categoriesData = await categoriesResponse.json()
        const suppliersData = await suppliersResponse.json()
        const productsData = await productsResponse.json()
        const productSuppliersData = await productSuppliersResponse.json()
        const inventoryData = await inventoryResponse.json()
        const purchaseOrdersData = await purchaseOrdersResponse.json()
        const purchaseOrderItemsData = await purchaseOrderItemsResponse.json()
        const customersData = await customersResponse.json()
        const feedbackData = await feedbackResponse.json()
        const ordersData = await ordersResponse.json()
        const orderItemsData = await orderItemsResponse.json()
        const invoicesData = await invoicesResponse.json()
        const paymentsData = await paymentsResponse.json()

        // Map supplier names to purchase orders
        const purchaseOrdersWithSupplierNames = purchaseOrdersData.map((po: PurchaseOrder) => {
          const supplier = suppliersData.find((s: Supplier) => s.supplier_id === po.supplier_id)
          return {
            ...po,
            supplier_name: supplier ? supplier.supplier_name : 'Unknown Supplier'
          }
        })

        // Map product names to purchase order items
        const purchaseOrderItemsWithProductNames = purchaseOrderItemsData.map((item: PurchaseOrderItem) => {
          const product = productsData.find((p: Product) => p.product_id === item.product_id)
          return {
            ...item,
            product_name: product ? product.product_name : 'Unknown Product'
          }
        })

        setCategories(categoriesData)
        setSuppliers(suppliersData)
        setProducts(productsData)
        setProductSuppliers(productSuppliersData)
        setInventory(inventoryData)
        setPurchaseOrders(purchaseOrdersWithSupplierNames)
        setPurchaseOrderItems(purchaseOrderItemsWithProductNames)
        setCustomers(customersData)
        setFeedback(feedbackData)
        setOrders(ordersData)
        setOrderItems(orderItemsData)
        setInvoices(invoicesData)
        setPayments(paymentsData)
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
      case "overview":
        return (
          <OverviewView
            categories={categories}
            suppliers={suppliers}
            products={products}
            inventory={inventory}
            purchaseOrders={purchaseOrders}
            customers={customers}
            feedback={feedback}
            orders={orders}
            invoices={invoices}
            payments={payments}
          />
        )
      case "summaries":
        return <SummariesView />
      case "categories":
        return <CategoriesView categories={categories} onCategoryChange={handleDataRefresh} />
      case "suppliers":
        return <SuppliersView suppliers={suppliers} onSupplierChange={handleDataRefresh} />
      case "products":
        return <ProductsView products={products} categories={categories} onProductChange={handleDataRefresh} />
      case "product-suppliers":
        return (
          <ProductSuppliersView
            productSuppliers={productSuppliers}
            products={products}
            suppliers={suppliers}
            onProductSupplierChange={handleDataRefresh}
          />
        )
      case "inventory":
        return <InventoryView inventory={inventory} products={products} onInventoryChange={handleDataRefresh} />
      case "purchase-orders":
        return (
          <PurchaseOrdersView
            purchaseOrders={purchaseOrders}
            suppliers={suppliers}
            purchaseOrderItems={purchaseOrderItems}
            products={products}
            onPurchaseOrderChange={handleDataRefresh}
          />
        )
      case "customers":
        return <CustomersView customers={customers} onCustomerChange={handleDataRefresh} />
      case "feedback":
        return <FeedbackView feedback={feedback} customers={customers} products={products} onFeedbackChange={handleDataRefresh} />
      case "orders":
        return (
          <OrdersView
            orders={orders}
            customers={customers}
            orderItems={orderItems}
            products={products}
            onOrderChange={handleDataRefresh}
          />
        )
      case "invoices":
        return <InvoicesView invoices={invoices} orders={orders} onInvoiceChange={handleDataRefresh} />
      case "payments":
        return <PaymentsView payments={payments} invoices={invoices} onPaymentChange={handleDataRefresh} />
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Fixed width sidebar with proper z-index */}
      <div className="w-64 flex-shrink-0 z-30 relative">
        <InventorySidebar activeView={activeView} setActiveView={setActiveView} onLogout={logout} />
      </div>

      {/* Main content area that stretches fully */}
      <div className="flex flex-col flex-1 overflow-auto">
        <InventoryHeader />
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
  )
}
