/* eslint-disable @typescript-eslint/no-unused-vars */
import jwt from "jsonwebtoken";
import { JWTPayload } from "./utils";
import { NextRequest } from "next/server";

// Verify Token For API End Point
export function verifyToken(request: NextRequest): JWTPayload | null {
  try {
    // 1: no5tho jwtToken token men cookie (name)
    const jwtToken = request.cookies.get("jwtToken");

    // 2: no5eth token men cookie (value)
    const token = jwtToken?.value as string;

    // 3: check itha ken token mfamech return null
    if (!token) return null;

    // 4: jebeet ek key men .env w type mtaaou string
    const priveteKey = process.env.JWT_SECRET as string;

    // 5: atito token w privetKey ww amleet verify lel token
    const userPayload = jwt.verify(token, priveteKey) as JWTPayload;

    // 6: itha ken kol chay mrigl namel return lel userPayload
    return userPayload;
  } catch (error) {
    return null;
  }
}

// Verify Toke For Page
export function verifyTokenFroPage(token: string): JWTPayload | null {
  try {
    // 1: na5tho privet key
    const priveteKey = process.env.JWT_SECRET as string;
    // console.log(priveteKey);
    // 2: namel verify l token yaani y7el tachfirr token
    const userPayload = jwt.verify(token, priveteKey) as JWTPayload;
    // console.log(userPayload);
    // 3: itha ken mfamech userPayload yaani fama error ex password ghalet wila ay haja return null
    if (!userPayload) return null;

    // 4: itha ken kol chay mrigl return userPayload
    return userPayload;
  } catch (error) {
    return null;
  }
}
