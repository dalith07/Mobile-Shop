/* eslint-disable @typescript-eslint/no-unused-vars */
import { cookies, headers } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

/**
 *  @method GET
 *  @route ~/api/users/logout
 *  @desc Logout User
 *  @access public
 */

export async function GET(request: NextRequest) {
  try {
    const cookie = cookies();
    (await cookie).delete("jwtToken");
    return NextResponse.json({ message: "logout" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
