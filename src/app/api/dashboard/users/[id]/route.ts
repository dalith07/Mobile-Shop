/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import { verifyToken, verifyTokenFroPage } from "@/lib/verifyToken";
import { prisma } from "@/lib/prisma";
import { createProfileSchema } from "@/lib/validationShema";
import { CreateProfileDto } from "@/lib/dtos";

interface Props {
  params: Promise<{ id: string }>;
}

/**
 *
 * @method PUT // yasn3 انشاء
 * @route   ~/api/dashboard/users/:id
 * @desc   Create Profiles Users
 * @access private (only user himself can get his account/profile)
 */

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const User = await prisma.user.findFirst({
      where: { id: (await params).id },
    });

    if (!User) {
      return NextResponse.json({ message: "Users Not Found" }, { status: 400 });
    }

    const user = verifyToken(request);
    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { message: "you are not allowed, access denied" },
        { status: 403 }
      );
    }

    const body = (await request.json()) as CreateProfileDto;
    const validation = createProfileSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors[0].message },
        { status: 400 }
      );
    }
    const targetUserId = (await params).id;
    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: {
        username: body.username,
        email: body.email,
        role: body.rols,
        status: body.status,
        profile: {
          upsert: {
            where: { userId: targetUserId },
            create: {
              phoneNumber: body.phoneNumber,
              streetAddress: body.streetAddress,
              city: body.city,
              postalCode: body.postalCode,
              country: body.country,
              imageUrl: body.imageUrl,
            },
            update: {
              phoneNumber: body.phoneNumber,
              streetAddress: body.streetAddress,
              city: body.city,
              postalCode: body.postalCode,
              country: body.country,
              imageUrl: body.imageUrl,
            },
          },
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        status: true,
        isAdmin: true,
        createdAt: true,
        updatedAt: true,
        profile: {
          select: {
            id: true,
            phoneNumber: true,
            streetAddress: true,
            city: true,
            postalCode: true,
            country: true,
            imageUrl: true,
            createdAt: true,
            updatedAt: true,
            userId: true,
          },
        },
      },
    });

    console.log("🧪 Payload received in body:", body);

    return NextResponse.json(updatedUser, { status: 201 });
  } catch (error) {
    console.log("❌❌❌ PUT Error:", error);
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}

// export async function POST(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const token = (await cookies()).get("jwtToken")?.value || "";
//     const payload = verifyTokenFroPage(token);
//     const userFromToken = verifyToken(request);

//     if (!payload?.id || !userFromToken) {
//       return NextResponse.json(
//         { message: "Unauthorized: Invalid token" },
//         { status: 401 }
//       );
//     }

//     const targetUserId = params.id; // Use route param
//     const isAdmin = payload.isAdmin === true;
//     const isSelf = payload.id === targetUserId;

//     // Only allow if user is self or admin
//     if (!isSelf && !isAdmin) {
//       return NextResponse.json(
//         { message: "Access denied: You can only modify your own data" },
//         { status: 403 }
//       );
//     }

//     const body = (await request.json()) as UpdateUsersDashboardDto;

//     const validation = createProfileSchema.safeParse(body);
//     if (!validation.success) {
//       return NextResponse.json(
//         { message: validation.error.errors[0].message },
//         { status: 400 }
//       );
//     }

//     // Check for email conflicts (ignore target user)
//     const existingUser = await prisma.user.findFirst({
//       where: {
//         email: body.email,
//         NOT: { id: targetUserId },
//       },
//     });

//     if (existingUser) {
//       return NextResponse.json(
//         { message: "Email already in use by another account" },
//         { status: 400 }
//       );
//     }

//     const updatedUser = await prisma.user.upsert({
//       where: { id: targetUserId },
//       update: {
//         username: body.username,
//         email: body.email,
//         role: body.rols,
//         status: body.status,
//         profile: {
//           upsert: {
//             where: { userId: targetUserId },
//             create: {
//               phoneNumber: body.phoneNumber,
//               streetAddress: body.streetAddress,
//               city: body.city,
//               postalCode: body.postalCode,
//               country: body.country,
//               imageUrl: body.imageUrl,
//             },
//             update: {
//               phoneNumber: body.phoneNumber,
//               streetAddress: body.streetAddress,
//               city: body.city,
//               postalCode: body.postalCode,
//               country: body.country,
//               imageUrl: body.imageUrl,
//             },
//           },
//         },
//       },
//       create: {
//         id: targetUserId,
//         username: body.username,
//         email: body.email,
//         role: body.rols,
//         status: body.status,
//         profile: {
//           create: {
//             phoneNumber: body.phoneNumber,
//             streetAddress: body.streetAddress,
//             city: body.city,
//             postalCode: body.postalCode,
//             country: body.country,
//             imageUrl: body.imageUrl,
//           },
//         },
//       },
//       select: {
//         id: true,
//         username: true,
//         email: true,
//         role: true,
//         status: true,
//         profile: {
//           select: {
//             phoneNumber: true,
//             streetAddress: true,
//             city: true,
//             postalCode: true,
//             country: true,
//             imageUrl: true,
//           },
//         },
//       },
//     });

//     return NextResponse.json(updatedUser, { status: 200 });
//   } catch (error) {
//     console.error("Error in POST /users/:id →", error);
//     return NextResponse.json(
//       { message: "Internal server error. Please try again." },
//       { status: 500 }
//     );
//   }
// }

/**
 *
 * @method GET
 * @route  ~/api/dashboard/users/:id
 * @desc   Get Profile By id
 * @access private (only user himself can get his account/profile)
 */

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: (await params).id },

      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        status: true,
        password: true,
        isAdmin: true,
        profile: {
          select: {
            imageUrl: true,
            phoneNumber: true,
            streetAddress: true,
            city: true,
            postalCode: true,
            country: true,
          },
        },
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User Not Found" }, { status: 404 });
    }

    const userFromToken = verifyToken(request);

    if (
      userFromToken !== null &&
      userFromToken.id !== user.id &&
      !userFromToken.isAdmin
    ) {
      return NextResponse.json(
        { message: "your are not allowed, access denied" },
        { status: 403 }
      );
    }

    console.log(user);
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error sorry" },
      { status: 500 }
    );
  }
}

// export async function GET(request: NextRequest, { params }: Props) {
//   try {
//     const userId = (await params).id;

//     const profile = await prisma.profile.findUnique({
//       where: {
//         userId: userId,
//       },
//       select: {
//         User: {
//           select: {
//             username: true,
//             email: true,
//             password: true,
//             role: true,
//             status: true,
//           },
//         },
//         imageUrl: true,
//         phoneNumber: true,
//         streetAddress: true,
//         city: true,
//         postalCode: true,
//         country: true,
//       },
//     });

//     if (!profile) {
//       return NextResponse.json(
//         { message: "Profile not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(profile, { status: 200 });
//   } catch (error) {
//     console.error("GET /api/dashboard/users error:", error);
//     return NextResponse.json(
//       { message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

/**
 *
 * @method DELETE
 * @route  ~/api/dashboard/users/:id
 * @desc   Delete users
 * @access private (only admin can delete users)
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
    const users = await prisma.user.findUnique({
      where: { id: (await params).id },
    });

    if (!users) {
      return NextResponse.json({ message: "users not found" }, { status: 404 });
    }

    await prisma.user.delete({
      where: { id: (await params).id },
    });

    return NextResponse.json({ message: "users deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
