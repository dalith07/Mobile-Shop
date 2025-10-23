/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ShoppingCart, Package, Truck, CheckCircle, Clock, Home, RefreshCw } from "lucide-react"
import Link from "next/link"
import axios from "axios"
import { DOMAIN } from "@/lib/constants"
import { toast } from "sonner"
import { OrderDetailDialog } from "@/components/order_detail_dialog"
import { OrderItem } from "@prisma/client"


interface Order {
    id: string
    orderNumber: string
    customerName: string
    customerEmail: string
    customerAddress: string
    status: string
    subtotal: number
    tax: number
    shipping: number
    total: number
    items: OrderItem[]
    createdAt: string
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [selectedOrder, setSelectedOrder] = useState<Order | any>()
    const [dialogOpen, setDialogOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        processing: 0,
        delivered: 0,
    })

    const fetchOrders = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${DOMAIN}/api/orders`)
            const fetchedOrders = response.data.orders
            setOrders(fetchedOrders)

            // Calculate stats
            const statsData = {
                total: fetchedOrders.length,
                pending: fetchedOrders.filter((o: Order) => o.status === "Pending").length,
                processing: fetchedOrders.filter((o: Order) => o.status === "Processing").length,
                delivered: fetchedOrders.filter((o: Order) => o.status === "Delivered").length,
                completed: fetchedOrders.filter((o: Order) => o.status === "Completed").length,
            }
            setStats(statsData)
        } catch (error) {
            console.error("Error fetching orders:", error)
            toast.error("Failed to fetch orders")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    const handleViewOrder = (order: Order) => {
        setSelectedOrder(order)
        setDialogOpen(true)
    }


    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Completed":
                return <CheckCircle className="h-4 w-4 text-green-500" />
            case "Delivered":
                return <CheckCircle className="h-4 w-4 text-green-500" />
            case "Shipped":
                return <Truck className="h-4 w-4 text-blue-500" />
            case "Processing":
                return <Package className="h-4 w-4 text-yellow-500" />
            case "Pending":
                return <Clock className="h-4 w-4 text-gray-500" />
            default:
                return <ShoppingCart className="h-4 w-4" />
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Completed":
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{status}</Badge>
            case "Delivered":
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{status}</Badge>
            case "Shipped":
                return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">{status}</Badge>
            case "Processing":
                return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">{status}</Badge>
            case "Pending":
                return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{status}</Badge>
            default:
                return <Badge variant="secondary">{status}</Badge>
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <h1 className="text-lg font-semibold">Order Management</h1>
                <div className="ml-auto flex gap-2">
                    <Button variant="outline" size="sm" onClick={fetchOrders} disabled={loading}>
                        <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/">
                            <Home className="h-4 w-4 mr-2" />
                            Home
                        </Link>
                    </Button>
                </div>
            </header>

            <div className="flex-1 space-y-4 p-4">
                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                            <p className="text-xs text-muted-foreground">All time orders</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.pending}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0}% of total
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Processing</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.processing}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats.total > 0 ? Math.round((stats.processing / stats.total) * 100) : 0}% of total
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.delivered}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats.total > 0 ? Math.round((stats.delivered / stats.total) * 100) : 0}% of total
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Orders Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                        <CardDescription>Track and manage customer orders</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="text-center py-8">
                                <Package className="h-12 w-12 animate-spin mx-auto text-primary mb-4" />
                                <p className="text-muted-foreground">Loading orders...</p>
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="text-center py-8">
                                <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                <p className="text-muted-foreground">No orders yet</p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Order Number</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Items</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orders.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell className="font-medium">{order.orderNumber}</TableCell>
                                            <TableCell>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        {getStatusIcon(order.status)}
                                                        <span className="font-medium">{order.customerName}</span>
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">{order.customerEmail}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{getStatusBadge(order.status)}</TableCell>
                                            <TableCell>{order.items.length}</TableCell>
                                            <TableCell className="font-medium">${order.total.toFixed(2)}</TableCell>
                                            <TableCell>{formatDate(order.createdAt)}</TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Button variant="outline" size="sm" onClick={() => handleViewOrder(order)}>
                                                        View
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Order Detail Dialog */}
            <OrderDetailDialog order={selectedOrder} open={dialogOpen} onOpenChangeAction={setDialogOpen} />
        </div>
    )
}
