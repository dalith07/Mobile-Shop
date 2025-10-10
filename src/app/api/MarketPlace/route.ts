import { ARTICLE_PER_PAGE } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 *  @method  GET
 *  @route   ~/api/MarketPlace
 *  @desc     Get production with pagination
 *  @access  public
 */

export async function GET(request: NextRequest) {
  try {
    const pageNumber = parseInt(
      request.nextUrl.searchParams.get("pageNumber") || "1"
    );

    const totalCount = await prisma.products.count();

    const products = await prisma.products.findMany({
      skip: ARTICLE_PER_PAGE * (pageNumber - 1),
      take: ARTICLE_PER_PAGE,
      orderBy: { createdAt: "desc" },
      include: {
        images: true,
        category: true,
        model: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(totalCount / ARTICLE_PER_PAGE),
        totalCount,
        pageSize: ARTICLE_PER_PAGE,
      },
    });
  } catch (error) {
    console.error("❌ API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
