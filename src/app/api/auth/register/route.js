import { NextResponse } from "next/server";
import { createUser } from "@/mock/db";
import { generateSecret, generateQRCode } from "@/features/auth/totp";
import { delay } from "@/lib/utils";
import { APP_CONFIG } from "@/config/app";
import { ROLES } from "@/mock/roles";

const ALLOWED_ROLES = [ROLES.ADMIN, ROLES.MANAGER, ROLES.USER];

export async function POST(request) {
  await delay(APP_CONFIG.api.simulatedDelay);

  try {
    const { name, email, password, role } = await request.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (!ALLOWED_ROLES.includes(role)) {
      return NextResponse.json(
        { error: "Invalid role selected" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const { secret, otpauthUrl } = generateSecret(email);
    const qrCode = await generateQRCode(otpauthUrl);

    const result = createUser({
      name,
      email,
      password,
      role,
    });

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 409 }
      );
    }

    return NextResponse.json({
      user: result.user,
      mfa: {
        secret,
        qrCode,
        otpauthUrl,
        message: "Scan this QR code with Google Authenticator",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
