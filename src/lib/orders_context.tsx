/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface OrdersContextType {
    orderCount: number
    userEmail: string | null
    setUserEmail: (email: string) => void
    refreshOrderCount: () => Promise<void>
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined)

export function OrdersProvider({ children }: { children: React.ReactNode }) {
    const [orderCount, setOrderCount] = useState(0)
    const [userEmail, setUserEmailState] = useState<string | null>(null)

    useEffect(() => {
        // Load email from localStorage on mount
        const savedEmail = localStorage.getItem("userEmail")
        if (savedEmail) {
            setUserEmailState(savedEmail)
        }
    }, [])

    useEffect(() => {
        // Fetch order count when email changes
        if (userEmail) {
            refreshOrderCount()
        }
    }, [userEmail])

    const setUserEmail = (email: string) => {
        localStorage.setItem("userEmail", email)
        setUserEmailState(email)
    }

    const refreshOrderCount = async () => {
        if (!userEmail) return

        try {
            const response = await fetch(`/api/orders/count?email=${encodeURIComponent(userEmail)}`)
            if (response.ok) {
                const data = await response.json()
                setOrderCount(data.count || 0)
            }
        } catch (error) {
            console.error("Failed to fetch order count:", error)
        }
    }

    return (
        <OrdersContext.Provider value={{ orderCount, userEmail, setUserEmail, refreshOrderCount }}>
            {children}
        </OrdersContext.Provider>
    )
}

export function useOrders() {
    const context = useContext(OrdersContext)
    if (context === undefined) {
        throw new Error("useOrders must be used within an OrdersProvider")
    }
    return context
}
