import { NextResponse } from "next/server";
import { findUserByEmail } from "@/mock/db";
import { verifyTOTP } from "@/features/auth/totp";
import { signToken, getTokenCookieOptions } from "@/lib/jwt";
import { delay } from "@/lib/utils";
import { APP_CONFIG } from "@/config/app";
import { cookies } from "next/headers";

export async function POST(request) {
  await delay(APP_CONFIG.api.simulatedDelay);

  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and verification code are required" },
        { status: 400 }
      );
    }

    const user = findUserByEmail(email);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const isValid = verifyTOTP(user.totpSecret, code);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid verification code. Please try again." },
        { status: 401 }
      );
    }

    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
    };

    const token = await signToken(tokenPayload);
    const cookieOptions = getTokenCookieOptions();

    const cookieStore = await cookies();
    cookieStore.set(cookieOptions.name, token, {
      httpOnly: cookieOptions.httpOnly,
      secure: cookieOptions.secure,
      sameSite: cookieOptions.sameSite,
      path: cookieOptions.path,
      maxAge: cookieOptions.maxAge,
    });

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
      },
      message: "MFA verified successfully",
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
