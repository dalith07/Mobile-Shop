/* eslint-disable @typescript-eslint/no-explicit-any */
//

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/verifyToken";

/**
 *  @method  POST
 *  @route   ~/api/orders
 *  @desc    Create a new order (User only)
 *  @access  Private
 */
export async function POST(request: NextRequest) {
  try {
    // ✅ 1. Check user authentication
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized, please log in" },
        { status: 401 }
      );
    }

    // ✅ 2. Parse request body
    const body = await request.json();

    // Expected `body` shape:
    // {
    //   items: [{ productId: string, quantity: number }],
    //   totalPrice: number
    // }

    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { message: "No items provided" },
        { status: 400 }
      );
    }

    // ✅ 3. Create order
    const newOrder = await prisma.order.create({
      data: {
        userId: user.id,
        orderNumber: `ORD-${Date.now()}`, // or generate UUID
        customerName: body.customerName,
        customerEmail: body.customerEmail,
        subtotal: body.totalPrice,
        tax: body.tax ?? 0,
        shipping: 0,
        total: 0,
        status: "PENDING",
        shippingAddress: "",
        items: {
          create: body.items.map((item: { productId: any; quantity: any }) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error("POST /orders error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
