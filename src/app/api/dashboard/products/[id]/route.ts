import { UpdateProduction } from "@/lib/dtos";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/verifyToken";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: Promise<{ id: string }>;
}

/**
 *
 * @method GET
 * @route  ~/api/dashboard/products/:id
 * @desc   Get production By id
 * @access private (only user himself can get his production)
 */

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const production = await prisma.products.findUnique({
      where: { id: (await params).id },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        discount: true,
        status: true,
        quantity: true,
        category: true,
        model: true,
        images: {
          select: {
            imageUrl: true,
          },
        },

        createdAt: true,
      },
    });

    if (!production) {
      return NextResponse.json(
        { message: "production Not Found" },
        { status: 404 }
      );
    }

    const userFromToken = verifyToken(request);

    if (userFromToken !== null && !userFromToken.isAdmin) {
      return NextResponse.json(
        { message: "your are not allowed, access denied" },
        { status: 403 }
      );
    }

    console.log(production);
    return NextResponse.json(production, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "internal server error sorry" },
      { status: 500 }
    );
  }
}

/**
 * @method PUT
 * @route  ~/api/dashboard/products/:id
 * @desc   Update products
 * @access private (Only owner od the productsn)
 */

// export async function PUT(request: NextRequest, { params }: Props) {
//   try {
//     const product = await prisma.products.findUnique({
//       where: { id: (await params).id },
//     });

//     if (!product) {
//       return NextResponse.json(
//         { message: "product not found" },
//         { status: 404 }
//       );
//     }

//     const user = verifyToken(request);
//     if (user === null) {
//       return NextResponse.json(
//         { message: "you are not allowed, access denied" },
//         { status: 403 }
//       );
//     }

//     const body = (await request.json()) as UpdateProduction;

//     const category = await prisma.category.findFirst({
//       where: { name: body.categoryName },
//     });

//     const model = await prisma.model.findFirst({
//       where: { name: body.modelName },
//     });

//     const updateProduct = await prisma.products.update({
//       where: { id: (await params).id }, // required!
//       data: {
//         title: body.title,
//         price: body.price,
//         discount: body.discount,
//         status: body.status,
//         quantity: body.quantity,
//         description: body.description,
//         categoryId: category?.id,
//         modelId: model?.id,
//         images: {
//           create: body.image.map((url) => ({
//             imageUrl: url.imageUrl,
//           })),
//         },
//       },
//       include: {
//         images: true,
//         category: true,
//         model: true,
//       },
//     });

//     return NextResponse.json(updateProduct, { status: 200 });
//   } catch (error) {
//     return NextResponse.json(
//       { message: "internal server error" },
//       { status: 500 }
//     );
//   }
// }

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const product = await prisma.products.findUnique({
      where: { id: (await params).id },
      select: { categoryId: true, modelId: true }, // keep old refs
    });

    if (!product) {
      return NextResponse.json(
        { message: "product not found" },
        { status: 404 }
      );
    }

    const user = verifyToken(request);
    if (user === null) {
      return NextResponse.json(
        { message: "you are not allowed, access denied" },
        { status: 403 }
      );
    }

    const body = (await request.json()) as UpdateProduction;

    // ✅ Upsert category and model by name
    const category =
      body.categoryName &&
      (await prisma.category.upsert({
        where: { name: body.categoryName },
        update: {},
        create: { name: body.categoryName },
      }));

    const model =
      body.modelName &&
      (await prisma.model.upsert({
        where: { name: body.modelName },
        update: {},
        create: { name: body.modelName },
      }));

    const updateProduct = await prisma.products.update({
      where: { id: (await params).id },
      data: {
        title: body.title,
        price: body.price,
        discount: body.discount,
        status: body.status,
        quantity: body.quantity,
        description: body.description,

        ...(category && { category: { connect: { id: category.id } } }),
        ...(model && { model: { connect: { id: model.id } } }),

        images: {
          deleteMany: {}, // remove old images
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

    // ✅ Cleanup orphan category
    if (product.categoryId) {
      await prisma.category.deleteMany({
        where: {
          id: product.categoryId,
          Products: { none: {} },
        },
      });
    }

    // ✅ Cleanup orphan model
    if (product.modelId) {
      await prisma.model.deleteMany({
        where: {
          id: product.modelId,
          Products: { none: {} },
        },
      });
    }

    return NextResponse.json(updateProduct, { status: 200 });
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}

/**
 *
 * @method DELETE
 * @route  ~/api/dashboard/products/:id
 * @desc   Delete products
 * @access private (only admin can delete producs)
 */

export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const user = verifyToken(request);
    if (user === null || user.isAdmin === false) {
      return NextResponse.json(
        { message: "only admin, access denied" },
        { status: 403 }
      );
    }

    const product = await prisma.products.findUnique({
      where: { id: (await params).id },
      include: { images: true, category: true, model: true },
    });

    if (!product) {
      return NextResponse.json(
        { message: "product not found" },
        { status: 404 }
      );
    }

    // await prisma.products.delete({
    //   where: { id: (await params).id },
    // });

    await prisma.products.delete({
      where: { id: (await params).id },
    });

    // cleanup orphan category if no products left
    await prisma.category.deleteMany({
      where: {
        id: product.categoryId,
        Products: { none: {} },
      },
    });

    // cleanup orphan model if no products left
    await prisma.model.deleteMany({
      where: {
        id: product.modelId,
        Products: { none: {} },
      },
    });

    return NextResponse.json({ message: "product deleted" }, { status: 200 });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
