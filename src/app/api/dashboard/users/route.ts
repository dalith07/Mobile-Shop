/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import { verifyToken, verifyTokenFroPage } from "@/lib/verifyToken";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { CreateProfileDto } from "@/lib/dtos";
import { createProfileSchema } from "@/lib/validationShema";

/**
 *
 * @method POST // yasn3 انشاء
 * @route   ~/api/dashboard/users
 * @desc   Create Profiles Users
 * @access private (only user himself can get his account/profile)
 */

// export async function POST(request: NextRequest) {
//   try {
//     const token = (await cookies()).get("jwtToken")?.value || "";
//     const payload = verifyTokenFroPage(token);

//     if (!payload?.id) {
//       return NextResponse.json(
//         { message: "Unauthorized: Invalid token or missing user ID" },
//         { status: 401 }
//       );
//     }

//     const userFromToken = verifyToken(request);
//     if (userFromToken && userFromToken.id !== payload.id) {
//       return NextResponse.json(
//         { message: "Access denied: Token mismatch" },
//         { status: 403 }
//       );
//     }

//     const body = (await request.json()) as CreateProfileDto;

//     const validation = createProfileSchema.safeParse(body);
//     if (!validation.success) {
//       return NextResponse.json(
//         { message: validation.error.errors[0].message },
//         { status: 400 }
//       );
//     }

//     const CreaetdUser = await prisma.user.upsert({
//       where: { id: payload.id },
//       update: {
//         username: body.username,
//         email: body.email,
//         role: body.rols,
//         status: body.status,
//         profile: {
//           upsert: {
//             where: { userId: payload.id },
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
//         id: payload.id,
//         username: body.username,
//         email: payload.email,
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

//     return NextResponse.json(CreaetdUser, { status: 200 });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { message: "Internal server error. Please try again." },
//       { status: 500 }
//     );
//   }
// }

/**
 *
 * @method GET
 * @route  ~/api/dashboard/users
 * @desc   Get data in profile
 * @access public
 */

// export async function GET(request: NextRequest) {
//   try {
//     const token = (await cookies()).get("jwtToken")?.value || "";
//     const payload = verifyTokenFroPage(token);

//     if (!payload?.id) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     const user = await prisma.user.findUnique({
//       where: { id: payload.id },
//       select: {
//         id: true,
//         email: true,
//         username: true,
//         password: true,
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

//     if (!user) {
//       return NextResponse.json({ message: "User not found" }, { status: 404 });
//     }

//     return NextResponse.json(user, { status: 200 });
//   } catch (error) {
//     console.error("GET /api/dashboard/users error:", error);
//     return NextResponse.json(
//       { message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

export async function GET(request: NextRequest) {
  try {
    const token = (await cookies()).get("jwtToken")?.value || "";

    const payload = verifyTokenFroPage(token);
    if (!payload?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: {
        userId: payload.id,
      },
      select: {
        imageUrl: true,
        phoneNumber: true,
        streetAddress: true,
        city: true,
        postalCode: true,
        country: true,
      },
    });

    if (!profile) {
      return NextResponse.json(
        { message: "Profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(profile, { status: 200 });
  } catch (error) {
    console.error("GET /api/users/profile error:", error);
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
