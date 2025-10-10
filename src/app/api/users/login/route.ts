import { LoginUserDto } from "@/lib/dtos";
import { setCookie } from "@/lib/generateToken";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validationShema";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

/**
 *
 * @method POST
 * @route  ~/api/users/login
 * @desc   Login User
 * @access public
 */

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as LoginUserDto;
    console.log("🚀 Incoming body:", body);

    // Validate request body
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (!user || !user.password || !user.username || !user.email) {
      return NextResponse.json(
        { message: "invalid email or password" },
        { status: 400 }
      );
    }

    // Compare passwords
    const isPasswordMatch = await bcrypt.compare(body.password, user.password);
    if (!isPasswordMatch) {
      return NextResponse.json(
        { message: "invalid email or password" },
        { status: 400 }
      );
    }

    // Generate cookie
    const cookie = setCookie({
      id: user.id,
      isAdmin: user.isAdmin,
      username: user.username,
      email: user.email,
    });

    return NextResponse.json(
      { message: "Authenticated" },
      { status: 200, headers: { "Set-Cookie": cookie } }
    );
  } catch (error) {
    console.error("🔥 Login error:", error);
    return NextResponse.json(
      { message: "internal server error sorry" },
      { status: 500 }
    );
  }
}
