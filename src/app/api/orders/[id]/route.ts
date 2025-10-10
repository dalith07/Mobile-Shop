import { UpdateOrders } from "@/lib/dtos";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/verifyToken";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: { id: string };
}

/**
 *  @method  PUT
 *  @route   ~/api/orders/:id
 *  @desc    Update order by ID (Admin only)
 *  @access  Private (Admin)
 */

// Update order status
export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: (await params).id },
      select: { items: true },
    });

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    const user = verifyToken(request);
    if (user === null) {
      return NextResponse.json(
        { message: "you are not allowed, access denied" },
        { status: 403 }
      );
    }

    const body = (await request.json()) as UpdateOrders;

    const updateOrder = await prisma.order.update({
      where: { id: (await params).id },
      data: {
        status: body.status,
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(updateOrder, { status: 200 });
  } catch (error) {
    console.error("Order product error:", error);
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}

/**
 *  @method  DELETE
 *  @route   ~/api/orders/:id
 *  @desc    Delete order by ID (Admin only)
 *  @access  Private (Admin)
 */

// Delete order
export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const user = verifyToken(request);
    if (!user || user.isAdmin === false) {
      return NextResponse.json(
        { message: "only admin, access denied" },
        { status: 403 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ message: "order not found" }, { status: 404 });
    }

    // Delete order items first (to maintain referential integrity)
    await prisma.orderItem.deleteMany({
      where: { orderId: params.id },
    });

    // Then delete the order itself
    await prisma.order.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: "order deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
