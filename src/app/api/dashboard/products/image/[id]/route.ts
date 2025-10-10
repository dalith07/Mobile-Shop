import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/verifyToken";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: Promise<{ id: string }>;
}

/**
 *
 * @method DELETE
 * @route  ~/api/dashboard/products/image/:id
 * @desc   Delete image By id
 * @access private (only user himself can delete his image)
 */

export async function DELETE(request: NextRequest, props: Props) {
  try {
    const { id } = await props.params;

    const user = verifyToken(request);
    if (user === null || user.isAdmin === false) {
      return NextResponse.json(
        { message: "only admin, access denied" },
        { status: 403 }
      );
    }

    const image = await prisma.image.findUnique({
      where: { id },
    });

    if (!image) {
      return NextResponse.json({ message: "image not found" }, { status: 404 });
    }

    await prisma.image.delete({
      where: { id },
    });

    return NextResponse.json({ message: "image deleted" }, { status: 200 });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
