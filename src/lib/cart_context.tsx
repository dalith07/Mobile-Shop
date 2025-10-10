"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { toast } from "sonner"

export interface CartItem {
    description: string
    id: string
    title: string
    price: number
    discount?: number
    quantity: number
    image: string
    category: string
    model: string
    maxQuantity: number
}

interface CartContextType {
    items: CartItem[]
    addItem: (item: Omit<CartItem, "quantity">) => void
    removeItem: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clearCart: () => void
    getTotalItems: () => number
    getTotalPrice: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])
    const [isLoaded, setIsLoaded] = useState(false)

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem("shopping-cart")
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart))
            } catch (error) {
                console.error("Error loading cart:", error)
            }
        }
        setIsLoaded(true)
    }, [])

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("shopping-cart", JSON.stringify(items))
        }
    }, [items, isLoaded])

    const addItem = (newItem: Omit<CartItem, "quantity">) => {
        setItems((currentItems) => {
            const existingItem = currentItems.find((item) => item.id === newItem.id)

            if (existingItem) {
                // Check if we can add more
                if (existingItem.quantity >= existingItem.maxQuantity) {
                    toast.error(`Maximum quantity (${existingItem.maxQuantity}) reached for this item`)
                    return currentItems
                }

                // Increase quantity
                toast.success(`Increased quantity of ${newItem.title}`)
                return currentItems.map((item) => (item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item))
            }

            // Add new item
            toast.success(`Added ${newItem.title} to cart`)
            return [...currentItems, { ...newItem, quantity: 1 }]
        })
    }

    const removeItem = (id: string) => {
        setItems((currentItems) => {
            const item = currentItems.find((item) => item.id === id)
            if (item) {
                toast.success(`Removed ${item.title} from cart`)
            }
            return currentItems.filter((item) => item.id !== id)
        })
    }

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity < 1) {
            removeItem(id)
            return
        }

        setItems((currentItems) => {
            return currentItems.map((item) => {
                if (item.id === id) {
                    if (quantity > item.maxQuantity) {
                        toast.error(`Maximum quantity is ${item.maxQuantity}`)
                        return item
                    }
                    return { ...item, quantity }
                }
                return item
            })
        })
    }

    const clearCart = () => {
        setItems([])
        toast.success("Cart cleared")
    }

    const getTotalItems = () => {
        return items.reduce((total, item) => total + item.quantity, 0)
    }

    const getTotalPrice = () => {
        return items.reduce((total, item) => {
            const price = item.discount ? item.price * (1 - item.discount / 100) : item.price
            return total + price * item.quantity
        }, 0)
    }

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                getTotalItems,
                getTotalPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider")
    }
    return context
}
