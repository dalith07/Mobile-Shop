import jwt from "jsonwebtoken";
import { JWTPayload } from "./utils";
import { serialize } from "cookie";

// Generate JWT Token
export function generateJWT(jwtPayload: JWTPayload): string {
  const privateKey = process.env.JWT_SECRET as string;
  const token = jwt.sign(jwtPayload, privateKey, {
    expiresIn: "30d", // ✅ Use `expiresIn` instead of `expireTime`
  });

  return token;
}

// Set Cookie With JWT
export function setCookie(jwtPayload: JWTPayload): string {
  const token = generateJWT(jwtPayload);

  const cookie = serialize("jwtToken", token, {
    httpOnly: true, // httpOnly : true => ykhali hetha el cookie security akther
    secure: process.env.NODE_ENV === "production", // secure: false => false yaani http w true yaani https
    // development=http, production=https //11:17
    sameSite: "strict", // yatii security akther lel cookie
    path: "/", // path: "/" yaani kol application maltek yet7aslo ala cookie ken nhot "/admin" ken el admin yet7asel ala cookie
    maxAge: 60 * 60 * 24 * 30, // 30 days hath yaani modeeet salahiyeeet cookie
    //  maxAge: 60, // 60 second yaani 1 minutes
    //  maxAge: 60 * 60, // yaani 1 hours
    //  maxAge: 60 * 60 * 2, // yaani 2 hours
    //  maxAge: 60 * 60 * 24, // yaani 24 hours
    //  maxAge: 60 * 60 * 24 * 4, // yaani 4 days
  });

  return cookie;
}
