/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Package, RefreshCw, ArrowLeft, ShoppingBag, CheckCircle, Truck, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { useOrders } from "@/lib/orders_context"

interface OrderItem {
  id: string
  productId: string
  productTitle: string
  quantity: number
  price: number
  discount: number
  category: string
  model: string
  image: string | null
}

interface Order {
  id: string
  customerName: string
  customerEmail: string
  customerAddress: string
  total: number
  status: string
  createdAt: string
  items: OrderItem[]
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const { refreshOrderCount } = useOrders()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/orders`)
      if (response.ok) {
        const data = await response.json()

        // Handle API response safely
        if (Array.isArray(data)) {
          setOrders(data)
        } else if (Array.isArray(data.orders)) {
          setOrders(data.orders)
        } else {
          setOrders([])
        }

        await refreshOrderCount()
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    await fetchOrders()
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "Shipped":
        return <Truck className="h-4 w-4 text-blue-500" />
      case "Processing":
        return <Package className="h-4 w-4 text-yellow-500" />
      case "Pending":
        return <Clock className="h-4 w-4 text-gray-500" />
      default:
        return <ShoppingBag className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "Shipped":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "Processing":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "Completed":
        return "bg-green-500 text-white"
      case "Pending":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="h-12 w-12 animate-spin mx-auto text-primary mb-4" />
          <p className="text-muted-foreground">Loading your orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="py-12 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl md:text-5xl font-bold">All Orders</h1>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={handleRefresh} disabled={loading}>
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          {orders.length === 0 ? (
            <Card className="text-center">
              <CardContent className="pt-16 pb-16">
                <Package className="h-24 w-24 mx-auto mb-6 text-muted-foreground" />
                <h2 className="text-3xl font-bold mb-4">No Orders Found</h2>
                <p className="text-muted-foreground text-lg mb-8">
                  There are currently no orders in the system.
                </p>
                <Button size="lg" asChild>
                  <Link href="/marketplace">
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    Browse Products
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">
                  {orders.length} {orders.length === 1 ? "Order" : "Orders"}
                </h2>
              </div>

              {orders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          Order #{order.id.slice(0, 8).toUpperCase()}
                        </CardTitle>
                        <CardDescription>
                          Placed on{" "}
                          {new Date(order.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                        <p className="text-sm text-muted-foreground mt-2">
                          {order.items.length} {order.items.length === 1 ? "item" : "items"}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                      <div>
                        <p className="text-sm text-muted-foreground">Customer</p>
                        <p className="font-medium">{order.customerName}</p>
                        <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Shipping Address</p>
                        <p className="font-medium text-sm">{order.customerAddress}</p>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <h4 className="font-semibold">Order Items</h4>
                      {order.items.map((item) => (
                        <div key={item.id} className="flex gap-4 p-3 bg-muted/30 rounded-lg">
                          <div className="relative w-20 h-20 flex-shrink-0">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.productTitle}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                          <div className="flex-1 space-y-1">
                            <h5 className="font-medium line-clamp-1">{item.productTitle}</h5>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {item.category}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {item.model}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Qty: {item.quantity} × ${item.price.toFixed(2)}
                              {item.discount > 0 && <span className="text-green-600 ml-2">(-{item.discount}%)</span>}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              ${(item.price * item.quantity * (1 - item.discount / 100)).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">${order.total.toFixed(2)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
