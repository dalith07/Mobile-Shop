/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Package, Calendar, User, Mail, MapPin, CheckCircle, Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"
import axios from "axios"
import { DOMAIN } from "@/lib/constants"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

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

interface OrderDetailDialogProps {
    order: Order
    open: boolean
    onOpenChangeAction: (open: boolean) => void
    onOrderUpdated?: () => void
}

export function OrderDetailDialog({ order, open, onOpenChangeAction, onOrderUpdated }: OrderDetailDialogProps) {
    const [confirmLoading, setConfirmLoading] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)

    if (!order) return null

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Delivered":
            case "Confirmed":
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
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const calculateItemTotal = (item: OrderItem) => {
        const discountedPrice = item.price * (1 - item.discount / 100)
        return discountedPrice * item.quantity
    }

    const handleConfirmOrder = async () => {
        try {
            setConfirmLoading(true)
            await axios.put(`${DOMAIN}/api/orders/${order.id}`, {
                status: "Completed",
            })

            toast.success("Order confirmed successfully!")
            onOrderUpdated?.()
            onOpenChangeAction(false)

        } catch (error: any) {
            console.error("Error confirming order:", error)
            toast.error(error.response?.data?.error || "Failed to confirm order")
        } finally {
            setConfirmLoading(false)
        }
    }

    const handleDeleteOrder = async () => {
        try {
            setDeleteLoading(true)
            const response = await axios.delete(`${DOMAIN}/api/orders/${order.id}`)

            if (response.data.success) {
                toast.success("Order deleted successfully!")
                onOrderUpdated?.()
                setDeleteDialogOpen(false)
                console.log()
                onOpenChangeAction(false)
            }
        } catch (error: any) {
            console.error("Error deleting order:", error)
            toast.error(error.response?.data?.error || "Failed to delete order")
        } finally {
            setDeleteLoading(false)
        }
    }

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChangeAction}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">Order Details</DialogTitle>
                        <DialogDescription>Order #{order.orderNumber}</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                        {/* Order Status and Date */}
                        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                            <div className="flex items-center gap-2">
                                <Package className="h-5 w-5 text-muted-foreground" />
                                <span className="font-medium">Status:</span>
                                {getStatusBadge(order.status)}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                {formatDate(order.createdAt)}
                            </div>
                        </div>

                        {/* Customer Information */}
                        <div>
                            <h3 className="font-semibold mb-3 text-lg">Customer Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                                <div className="flex items-start gap-2">
                                    <User className="h-4 w-4 mt-1 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Name</p>
                                        <p className="font-medium">{order.customerName}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <Mail className="h-4 w-4 mt-1 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Email</p>
                                        <p className="font-medium">{order.customerEmail}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Address</p>
                                        <p className="font-medium">{order.customerAddress || "Not provided"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Order Items */}
                        <div>
                            <h3 className="font-semibold mb-3 text-lg">Order Items ({order.items.length})</h3>
                            <div className="space-y-3">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                        <div className="relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                                            {item.image ? (
                                                <Image
                                                    src={item.image || "/placeholder.svg"}
                                                    alt={item.productTitle}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full">
                                                    <Package className="h-8 w-8 text-muted-foreground" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <h4 className="font-medium line-clamp-2">{item.productTitle}</h4>
                                                    <div className="flex gap-2 mt-1">
                                                        {item.category && (
                                                            <Badge variant="secondary" className="text-xs">
                                                                {item.category}
                                                            </Badge>
                                                        )}
                                                        {item.model && (
                                                            <Badge variant="outline" className="text-xs">
                                                                {item.model}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold">${calculateItemTotal(item).toFixed(2)}</p>
                                                    {item.discount > 0 && (
                                                        <p className="text-sm text-muted-foreground line-through">
                                                            ${(item.price * item.quantity).toFixed(2)}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                                <span>${item.price.toFixed(2)} each</span>
                                                <span>×</span>
                                                <span>Qty: {item.quantity}</span>
                                                {item.discount > 0 && (
                                                    <Badge variant="destructive" className="text-xs">
                                                        -{item.discount}% OFF
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Separator />

                        {/* Order Summary */}
                        <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                            <h3 className="font-semibold mb-3 text-lg">Order Summary</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span className="font-medium">${order.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Tax</span>
                                    <span className="font-medium">${order.tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span className="font-medium">${order.shipping.toFixed(2)}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between text-lg font-bold pt-2">
                                    <span>Total</span>
                                    <span className="text-primary">${order.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-3 justify-end mt-4">
                            {order.status === "Pending" && (
                                <Button
                                    onClick={handleConfirmOrder}
                                    disabled={confirmLoading}
                                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white shadow-md transition-all duration-200 rounded-xl px-5 py-2"
                                >
                                    {confirmLoading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            <span>Confirming...</span>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="h-4 w-4" />
                                            <span>Confirm Order</span>
                                        </>
                                    )}
                                </Button>
                            )}

                            <Button
                                variant="destructive"
                                onClick={() => setDeleteDialogOpen(true)}
                                disabled={deleteLoading}
                                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white shadow-md transition-all duration-200 rounded-xl px-5 py-2"
                            >
                                {deleteLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Removing...</span>
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="h-4 w-4" />
                                        <span>Remove Order</span>
                                    </>
                                )}
                            </Button>

                            <Button variant="outline" onClick={() => onOpenChangeAction(false)}>
                                Close
                            </Button>
                        </div>

                    </div>
                </DialogContent>
            </Dialog>

            {/* <Button variant="outline" onClick={() => window.print()}>
                                Print Order
                            </Button> */}
            {/* <Button variant="outline" onClick={() => onOpenChangeAction(false)}>
                                Close
                            </Button> */}


            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the order
                            <span className="font-semibold"> #{order.orderNumber}</span> and remove all associated data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleteLoading}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteOrder}
                            disabled={deleteLoading}
                            className="bg-destructive hover:bg-destructive/90 text-white"
                        >
                            {deleteLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Yes, Delete Order"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
