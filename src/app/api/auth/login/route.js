import { NextResponse } from "next/server";
import { findUserByEmail } from "@/mock/db";
import { delay } from "@/lib/utils";
import { APP_CONFIG } from "@/config/app";

export async function POST(request) {
  await delay(APP_CONFIG.api.simulatedDelay);

  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = findUserByEmail(email);

    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      requireMfa: true,
      email: user.email,
      message: "Please verify your identity with MFA",
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
