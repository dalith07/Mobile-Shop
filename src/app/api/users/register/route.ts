import bcrypt from "bcryptjs";
import { RegisterUserDto } from "@/lib/dtos";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validationShema";
import { NextRequest, NextResponse } from "next/server";
import { setCookie } from "@/lib/generateToken";

/**
 *
 * @method POST // yasn3 انشاء
 * @route  ~/api/users/register
 * @desc   Create New User [(regisetr) (sign up) (انشاء حساب)]
 * @access public
 */

export async function POST(request: NextRequest) {
  try {
    // Stage 1: Get request body
    const body = (await request.json()) as RegisterUserDto;

    // Stage 2: Validate input
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    // Stage 3: Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "This user already registered" },
        { status: 400 }
      );
    }

    // Stage 4: Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.password, salt);

    const newUser = await prisma.user.create({
      data: {
        username: body.username,
        email: body.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        email: true,
        isAdmin: true,
      },
    });

    // Stage 6: Ensure required fields are not null
    if (!newUser.username || !newUser.email) {
      return NextResponse.json(
        { message: "Something went wrong with user creation" },
        { status: 500 }
      );
    }

    const cookie = setCookie({
      id: newUser.id,
      isAdmin: newUser.isAdmin,
      username: newUser.username,
      email: newUser.email,
    });

    return NextResponse.json(
      { ...newUser },
      {
        status: 201,
        headers: { "Set-Cookie": cookie },
      }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "internal server error sorry" },
      { status: 500 }
    );
  }
}
