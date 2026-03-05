import { NextResponse } from "next/server";
import { getAllUsers, createUser as createUserInDb } from "@/mock/db";
import { verifyToken } from "@/lib/jwt";
import { hasPermission } from "@/lib/permissions";
import { PERMISSIONS } from "@/mock/roles";
import { delay } from "@/lib/utils";
import { APP_CONFIG } from "@/config/app";
import { cookies } from "next/headers";

async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(APP_CONFIG.jwt.cookieName)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function GET(request) {
  await delay(APP_CONFIG.api.simulatedDelay);

  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!hasPermission(user, PERMISSIONS.VIEW_USERS)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const result = getAllUsers({ page, pageSize, search, sortBy, sortOrder });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  await delay(APP_CONFIG.api.simulatedDelay);

  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!hasPermission(user, PERMISSIONS.CREATE_USER)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { name, email, password, role } = await request.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const result = createUserInDb({ name, email, password, role });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 409 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
