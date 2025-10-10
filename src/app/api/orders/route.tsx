/* eslint-disable @typescript-eslint/no-explicit-any */
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { CreateOrders } from "@/lib/dtos"

/**
 *  @method  POST
 *  @route   ~/api/orders
 *  @desc    Create New Orders
 *  @access  public
 */
export async function POST(request: NextRequest) {
    try {
        const body = (await request.json()) as CreateOrders

        const {
            customerName,
            customerEmail,
            status,
            items,
            subtotal,
            tax,
            shipping,
            total,
            shippingAddress,
            userId,
        } = body

        // Validate required fields
        if (!customerName || !customerEmail || !items || items.length === 0) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
        }

        // Generate order number
        const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

        // Create order with items
        const order = await prisma.order.create({
            data: {
                orderNumber: orderNumber,
                customerName: customerName,
                customerEmail: customerEmail,
                status: status,
                subtotal: subtotal,
                tax: tax,
                shipping: shipping,
                total: total,
                shippingAddress: shippingAddress,
                userId: userId,
                items: {
                    create: items.map((item: any) => ({
                        productId: item.id,
                        title: item.title,
                        description: item.description,
                        price: item.price,
                        quantity: item.quantity,
                        discount: item.discount,
                        image: item.image,
                        category: item.category,
                        model: item.model,
                        subtotal:
                            item.quantity *
                            (item.discount ? item.price * (1 - item.discount / 100) : item.price),
                    })),
                },
            },
            include: {
                items: true,
            },
        })

        return NextResponse.json({
            success: true,
            order,
            message: "Order created successfully",
        })
    } catch (error) {
        console.error("Error creating order:", error)
        return NextResponse.json(
            { message: "Failed to create order", error: String(error) },
            { status: 500 },
        )
    }
}

/**
 *  @method  GET
 *  @route   ~/api/orders
 *  @desc    Get All Orders (Admin) or by Email
 *  @access  public
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const email = searchParams.get("email")

        const orders = await prisma.order.findMany({
            where: email ? { customerEmail: email } : undefined,
            include: { items: true },
            orderBy: { createdAt: "desc" },
        })

        return NextResponse.json({ orders })
    } catch (error) {
        console.error("Error fetching orders:", error)
        return NextResponse.json(
            { message: "Failed to fetch orders", error: String(error) },
            { status: 500 },
        )
    }
}
