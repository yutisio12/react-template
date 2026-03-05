import { NextResponse } from "next/server";
import { getStats } from "@/mock/db";
import { verifyToken } from "@/lib/jwt";
import { hasPermission } from "@/lib/permissions";
import { PERMISSIONS } from "@/mock/roles";
import { delay } from "@/lib/utils";
import { APP_CONFIG } from "@/config/app";
import { cookies } from "next/headers";

export async function GET() {
  await delay(APP_CONFIG.api.simulatedDelay);

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(APP_CONFIG.jwt.cookieName)?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await verifyToken(token);

    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!hasPermission(user, PERMISSIONS.VIEW_ADMIN_PAGE)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const stats = getStats();

    return NextResponse.json(stats);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
