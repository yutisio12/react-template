import { SignJWT, jwtVerify } from "jose";
import { APP_CONFIG } from "@/config/app";

const secret = new TextEncoder().encode(APP_CONFIG.jwt.secret);

export async function signToken(payload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(APP_CONFIG.jwt.expiresIn)
    .sign(secret);

  return token;
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

export function getTokenCookieOptions() {
  return {
    name: APP_CONFIG.jwt.cookieName,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60,
  };
}
