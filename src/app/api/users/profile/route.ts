/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { authOptions } from "@/lib/authOptions";
import { CreateProfileDto } from "@/lib/dtos";
import { setCookie } from "@/lib/generateToken";
import { prisma } from "@/lib/prisma";
import { createProfileSchema } from "@/lib/validationShema";
import { verifyToken, verifyTokenFroPage } from "@/lib/verifyToken";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// Type of expected request body
type UpdateProfileDto = {
  username?: string;
  password?: string;
  phoneNumber?: string;
  streetAddress?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  imageUrl?: string;
};

/**
 *
 * @method PUT
 * @route  ~/api/users/profile
 * @desc   Update UserName Profile
 * @access private (only user himself can update his account/profile)
 */

export async function PUT(request: NextRequest) {
  try {
    const token = (await cookies()).get("jwtToken")?.value || "";
    // const payload = verifyTokenFroPage(token);

    // 🟢 Use `let` instead of `const`
    let payload: any = verifyTokenFroPage(token);

    // if (!payload?.id) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    // ✅ Fallback to NextAuth session
    if (!payload?.id) {
      const session = await getServerSession(authOptions);
      if (session?.user?.email) {
        const user = await prisma.user.findUnique({
          where: { email: session.user.email },
        });
        if (user) {
          payload = { id: user.id, email: user.email, isAdmin: user.isAdmin };
        }
      }
    }

    if (!payload?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user) {
      return NextResponse.json({ message: "User Not Found" }, { status: 404 });
    }

    const body = (await request.json()) as UpdateProfileDto;

    // Hash password if provided
    let hashedPassword = undefined;
    if (body.password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(body.password, salt);
    }

    // Update user and profile
    const updatedUser = await prisma.user.update({
      where: { id: payload.id },
      data: {
        username: body.username ?? user.username,
        password: hashedPassword ?? user.password,
        profile: {
          upsert: {
            where: { userId: payload.id }, // ✅ This is required
            update: {
              phoneNumber: body.phoneNumber,
              streetAddress: body.streetAddress,
              city: body.city,
              postalCode: body.postalCode,
              country: body.country,
              imageUrl: body.imageUrl,
            },
            create: {
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
      include: { profile: true },
    });

    // Optional: Set new cookie (if needed for auth state)
    const newCookie = setCookie({
      id: updatedUser.id,
      email: updatedUser.email,
      username: updatedUser.username ?? "",
      isAdmin: updatedUser.isAdmin,
    });

    const response = NextResponse.json(
      { message: "Profile updated" },
      { status: 200 }
    );
    response.headers.set("Set-Cookie", newCookie);

    return response;
  } catch (error) {
    console.error("PUT /api/users/profile error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 *
 * @method POST // yasn3 انشاء
 * @route   ~/api/users/profile
 * @desc   Create phone, address, city, postalCode,country
 * @access
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

//     // Check if profile exists using userId (now marked as unique in schema)
//     const existingProfile = await prisma.profile.findUnique({
//       where: { userId: payload.id },
//     });

//     let profile;

//     if (existingProfile) {
//       // ✅ Update existing profile
//       profile = await prisma.profile.update({
//         where: { userId: payload.id },
//         data: {
//           phoneNumber: body.phoneNumber,
//           streetAddress: body.streetAddress,
//           city: body.city,
//           postalCode: body.postalCode,
//           country: body.country,
//           imageUrl: body.imageUrl,
//         },
//         select: {
//           phoneNumber: true,
//           streetAddress: true,
//           city: true,
//           postalCode: true,
//           country: true,
//           imageUrl: true,
//         },
//       });
//     } else {
//       // ✅ Create new profile
//       profile = await prisma.profile.create({
//         data: {
//           userId: payload.id,
//           phoneNumber: body.phoneNumber,
//           streetAddress: body.streetAddress,
//           city: body.city,
//           postalCode: body.postalCode,
//           country: body.country,
//           imageUrl: body.imageUrl,
//         },
//         select: {
//           phoneNumber: true,
//           streetAddress: true,
//           city: true,
//           postalCode: true,
//           country: true,
//           imageUrl: true,
//         },
//       });
//     }

//     return NextResponse.json(profile, { status: 200 });
//   } catch (error) {
//     console.error(
//       "Profile POST error:",
//       error instanceof Error ? error.message : error
//     );
//     return NextResponse.json(
//       { message: "Internal server error. Please try again." },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     const token = (await cookies()).get("jwtToken")?.value || "";

//     // 🟢 Allow re-assignment
//     let payload: any = verifyTokenFroPage(token);

//     // ✅ Fallback: try NextAuth session if no JWT
//     if (!payload?.id) {
//       const session = await getServerSession(authOptions);
//       if (session?.user?.email) {
//         const user = await prisma.user.findUnique({
//           where: { email: session.user.email },
//         });
//         if (user) {
//           payload = { id: user.id, email: user.email };
//         }
//       }
//     }

//     if (!payload?.id) {
//       return NextResponse.json(
//         { message: "Unauthorized: Invalid token or missing user ID" },
//         { status: 401 }
//       );
//     }

//     // 🧾 Validate body
//     const body = (await request.json()) as CreateProfileDto;
//     const validation = createProfileSchema.safeParse(body);
//     if (!validation.success) {
//       return NextResponse.json(
//         { message: validation.error.errors[0].message },
//         { status: 400 }
//       );
//     }

//     // 🧠 Upsert user profile
//     const profile = await prisma.profile.upsert({
//       where: { userId: payload.id },
//       update: {
//         phoneNumber: body.phoneNumber,
//         streetAddress: body.streetAddress,
//         city: body.city,
//         postalCode: body.postalCode,
//         country: body.country,
//         imageUrl: body.imageUrl,
//       },
//       create: {
//         userId: payload.id,
//         phoneNumber: body.phoneNumber,
//         streetAddress: body.streetAddress,
//         city: body.city,
//         postalCode: body.postalCode,
//         country: body.country,
//         imageUrl: body.imageUrl,
//       },
//       select: {
//         phoneNumber: true,
//         streetAddress: true,
//         city: true,
//         postalCode: true,
//         country: true,
//         imageUrl: true,
//       },
//     });

//     return NextResponse.json(profile, { status: 200 });
//   } catch (error) {
//     console.error("Profile POST error:", error);
//     return NextResponse.json(
//       { message: "Internal server error. Please try again." },
//       { status: 500 }
//     );
//   }
// }

export async function POST(request: NextRequest) {
  try {
    // 🍪 Get JWT token from cookies
    const token = (await cookies()).get("jwtToken")?.value || "";
    console.log("🔹 Token from cookies:", token);

    // 🔑 Verify token
    let payload: any = verifyTokenFroPage(token);
    console.log("🔹 Decoded payload:", payload);

    // ✅ Try session fallback if JWT not valid
    if (!payload?.id) {
      console.log("⚠️ No payload.id found, trying NextAuth session...");
      const session = await getServerSession(authOptions);
      console.log("🔹 NextAuth session:", session);

      if (session?.user?.email) {
        const user = await prisma.user.findUnique({
          where: { email: session.user.email },
        });
        console.log("🔹 Found user via session:", user);

        if (user) payload = { id: user.id, email: user.email };
      }
    }

    // ❌ Still no user ID?
    if (!payload?.id) {
      console.log("🚫 No valid user ID found, unauthorized request.");
      return NextResponse.json(
        { message: "Unauthorized: Invalid token or missing user ID" },
        { status: 401 }
      );
    }

    // 🧾 Parse and validate request body
    const body = (await request.json()) as CreateProfileDto;
    console.log("🔹 Request body:", body);

    const validation = createProfileSchema.safeParse(body);
    if (!validation.success) {
      console.log("🚫 Validation failed:", validation.error.errors);
      return NextResponse.json(
        { message: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    // 🔍 Check if user exists before upsert
    const existingUser = await prisma.user.findUnique({
      where: { id: payload.id },
    });
    console.log("🔹 Existing user check:", existingUser);

    if (!existingUser) {
      console.log("🚫 User not found in database for ID:", payload.id);
      return NextResponse.json(
        { message: "User not found. Cannot create profile." },
        { status: 404 }
      );
    }

    // 🧠 Upsert profile
    console.log("🧠 Creating or updating profile for user:", payload.id);
    const profile = await prisma.profile.upsert({
      where: { userId: payload.id },
      update: {
        phoneNumber: body.phoneNumber,
        streetAddress: body.streetAddress,
        city: body.city,
        postalCode: body.postalCode,
        country: body.country,
        imageUrl: body.imageUrl,
      },
      create: {
        userId: payload.id,
        phoneNumber: body.phoneNumber,
        streetAddress: body.streetAddress,
        city: body.city,
        postalCode: body.postalCode,
        country: body.country,
        imageUrl: body.imageUrl,
      },
      select: {
        phoneNumber: true,
        streetAddress: true,
        city: true,
        postalCode: true,
        country: true,
        imageUrl: true,
      },
    });

    console.log("✅ Profile upserted successfully:", profile);
    return NextResponse.json(profile, { status: 200 });
  } catch (error: any) {
    console.error("🔥 Profile POST error:", error);
    return NextResponse.json(
      { message: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}

/**
 *
 * @method GET
 * @route  ~/api/users/profile
 * @desc   Get data in profile
 * @access public
 */

export async function GET(request: NextRequest) {
  try {
    // Get the token from cookies
    const token = (await cookies()).get("jwtToken")?.value || "";

    // Verify token and get user ID
    const payload = verifyTokenFroPage(token);
    if (!payload?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Fetch profile from the database
    // const profile = await prisma.profile.findUnique({
    //   where: {
    //     userId: payload.id,
    //   },
    //   select: {
    //     imageUrl: true,
    //     phoneNumber: true,
    //     streetAddress: true,
    //     city: true,
    //     postalCode: true,
    //     country: true,
    //   },
    // });
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
        User: {
          select: {
            password: true,
          },
        },
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
