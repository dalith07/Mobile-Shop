/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 *
 * @method GET
 * @route  ~/api/dashboard/products/search?searchText=value
 * @desc   Get Articles By Search Text
 * @access public
 */

export async function GET(request: NextRequest) {
  try {
    const searchText = request.nextUrl.searchParams.get("searchText");
    let products;
    if (searchText) {
      products = await prisma.products.findMany({
        where: {
          title: {
            startsWith: searchText, // yatini kol title eli fih value l mech notlbo alih ena
            mode: "insensitive", // 7ases yaani yatini title itha ken minuscule OR majuscule
          },
        },
      });
    } else {
      products = await prisma.products.findMany({ take: 12 });
    }

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
