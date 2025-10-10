/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 *
 * @method GET
 * @route  ~/api/dashboard/products/count
 * @desc   Get products Count
 * @access public
 */

export async function GET(request: NextRequest) {
  try {
    const count = await prisma.products.count();
    return NextResponse.json({ count }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
