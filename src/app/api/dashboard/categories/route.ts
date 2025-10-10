import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * @method GET
 * @route  ~/api/dashboard/categories
 * @desc   Get categories
 * @access private (Only owner Get the categories)
 */

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        Products: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
