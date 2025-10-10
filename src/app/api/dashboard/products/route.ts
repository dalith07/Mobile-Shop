import { CreateProducts } from "@/lib/dtos";
import { prisma } from "@/lib/prisma";
import { createProductsShema } from "@/lib/validationShema";
import { verifyToken } from "@/lib/verifyToken";
import { NextRequest, NextResponse } from "next/server";

/**
 *  @method  POST
 *  @route   ~/api/dashboard/products
 *  @desc    Create New Production
 *  @access  private (only admin can create Products)
 */

export async function POST(request: NextRequest) {
  try {
    const user = verifyToken(request);
    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { message: "only admin, access denied" },
        { status: 403 }
      );
    }

    const body = (await request.json()) as CreateProducts;

    const validation = createProductsShema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    // Ensure images exist
    if (!body.image || !Array.isArray(body.image) || body.image.length === 0) {
      return NextResponse.json(
        { message: "At least one image is required." },
        { status: 400 }
      );
    }

    console.log(body.image);

    const newProducts = await prisma.products.create({
      data: {
        title: body.title,
        price: body.price,
        discount: body.discount,
        status: body.status,
        quantity: body.quantity,
        description: body.description,
        category: {
          connectOrCreate: {
            where: { name: body.categoryName },
            create: { name: body.categoryName },
          },
        },
        model: {
          connectOrCreate: {
            where: { name: body.modelName },
            create: { name: body.modelName },
          },
        },
        images: {
          create: body.image.map((url) => ({
            imageUrl: url.imageUrl,
          })),
        },
      },
      include: {
        images: true,
        category: true,
        model: true,
      },
    });

    return NextResponse.json(newProducts, { status: 201 });
  } catch (error) {
    console.log("❌ Error:", error);
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}

/**
 *  @method  GET
 *  @route   ~/api/dashboard/products
 *  @desc     Get production with pagination
 *  @access  public
 */

// export async function GET(request: NextRequest) {
//   try {
//     const pageNumber = parseInt(
//       request.nextUrl.searchParams.get("pageNumber") || "1"
//     );

//     const totalCount = await prisma.products.count();

//     const products = await prisma.products.findMany({
//       skip: ARTICLE_PER_PAGE * (pageNumber - 1),
//       take: ARTICLE_PER_PAGE,
//       orderBy: { createdAt: "desc" },
//       include: {
//         images: true,
//         category: true,
//         model: true,
//       },
//     });

//     return NextResponse.json({
//       success: true,
//       data: products,
//       pagination: {
//         currentPage: pageNumber,
//         totalPages: Math.ceil(totalCount / ARTICLE_PER_PAGE),
//         totalCount,
//         pageSize: ARTICLE_PER_PAGE,
//       },
//     });
//   } catch (error) {
//     console.error("❌ API error:", error);
//     return NextResponse.json(
//       { success: false, message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

export async function GET() {
  try {
    const totalCount = await prisma.products.count();

    const products = await prisma.products.findMany({
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
      count: {
        totalCount,
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
