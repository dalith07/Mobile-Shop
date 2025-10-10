"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import axios from "axios"
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowLeft,
  Mail,
} from "lucide-react"
import { useCart } from "@/lib/cart_context"
import { DOMAIN } from "@/lib/constants"
import { useOrders } from "@/lib/orders_context"

export default function CartPage() {
  const router = useRouter()
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCart()

  // (Temporary mock for orders context)
  const { setUserEmail, refreshOrderCount } = useOrders()

  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [customerName, setCustomerName] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [customerAddress, setCustomerAddress] = useState("")

  const subtotal = getTotalPrice()
  const tax = subtotal * 0.1 // 10% tax
  const shipping = subtotal > 50 ? 0 : 9.99 // Free shipping over $50
  const total = subtotal + tax + shipping

  // ✅ FIXED CHECKOUT FUNCTION
  const handleCheckout = async () => {
    if (!customerName.trim() || !customerEmail.trim() || !customerAddress.trim()) {
      toast.error("Please fill in all customer information")
      return
    }

    if (items.length === 0) {
      toast.error("Your cart is empty")
      return
    }

    try {
      setIsCheckingOut(true)

      await axios.post(`${DOMAIN}/api/orders`, {
        customerName,
        customerEmail,
        shippingAddress: customerAddress,
        items: items.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description || "",
          price: item.price,
          quantity: item.quantity,
          discount: item.discount || 0,
          image: item.image,
          category: item.category,
          model: item.model,
        })),
        subtotal,
        tax,
        shipping,
        total,
      })


      setUserEmail(customerEmail)
      clearCart()
      await refreshOrderCount()
      toast.success("Order placed successfully!")
      router.push("/orders")

    } catch (error) {
      console.error("Checkout error:", error)
      toast.error("An error occurred during checkout")
    } finally {
      setIsCheckingOut(false)
    }
  }

  // ✅ Empty cart display
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="pt-6">
            <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Add some products to get started!</p>
            <Button asChild>
              <Link href="/marketplace">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ✅ Main cart UI
  return (
    <div className="min-h-screen bg-background">
      <section className="py-12 px-4 bg-muted/50">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Shopping Cart</h1>
          <p className="text-muted-foreground">
            {items.length} {items.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>
      </section>

      <section className="py-8 px-4">
        <div className="container mx-auto">
          <Button variant="ghost" onClick={() => router.back()} className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Button>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Cart Items ({items.length})</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearCart}
                    className="text-destructive bg-transparent"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Cart
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item) => {
                    const itemPrice = item.discount
                      ? item.price * (1 - item.discount / 100)
                      : item.price
                    const itemTotal = itemPrice * item.quantity

                    return (
                      <div key={item.id}>
                        <div className="flex gap-4">
                          <div className="relative w-24 h-24 flex-shrink-0">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.title}
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>

                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold line-clamp-1">{item.title}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="secondary" className="text-xs">
                                    {item.category}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {item.model}
                                  </Badge>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive"
                                onClick={() => removeItem(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 bg-transparent"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-12 text-center font-semibold">{item.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 bg-transparent"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  disabled={item.quantity >= item.maxQuantity}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                                <span className="text-xs text-muted-foreground ml-2">
                                  Max: {item.maxQuantity}
                                </span>
                              </div>

                              <div className="text-right">
                                <div className="flex items-center gap-2">
                                  {item.discount ? (
                                    <>
                                      <span className="text-lg font-bold">
                                        {itemPrice.toFixed(2)} DT
                                      </span>
                                      <span className="text-sm text-muted-foreground line-through">
                                        {item.price.toFixed(2)} DT
                                      </span>
                                    </>
                                  ) : (
                                    <span className="text-lg font-bold">
                                      {item.price.toFixed(2)} DT
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  Total: {itemTotal.toFixed(2)} DT
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Separator className="mt-4" />
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary + Checkout */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      Order confirmation will be sent here
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Shipping Address</Label>
                    <Input
                      id="address"
                      placeholder="123 Main St, City, Country"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                  <CardDescription>Review your order details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{subtotal.toFixed(2)} DT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (10%)</span>
                    <span>{tax.toFixed(2)} DT</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{total.toFixed(2)} DT</span>
                  </div>
                  <Button className="w-full text-white" size="lg" onClick={handleCheckout} disabled={isCheckingOut}>
                    {isCheckingOut ? "Processing..." : "Place Order"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

