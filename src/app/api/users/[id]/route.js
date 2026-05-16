import { NextResponse } from "next/server";
import { findUserById, updateUser as updateUserInDb, deleteUser as deleteUserInDb } from "@/mock/db";
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

export async function GET(request, { params }) {
  await delay(APP_CONFIG.api.simulatedDelay);

  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!hasPermission(user, PERMISSIONS.VIEW_USERS)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const found = findUserById(id);
    if (!found) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { password, totpSecret, ...safeUser } = found;
    return NextResponse.json({ user: safeUser });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  await delay(APP_CONFIG.api.simulatedDelay);

  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!hasPermission(user, PERMISSIONS.EDIT_USER)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    const result = updateUserInDb(id, body);
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  await delay(APP_CONFIG.api.simulatedDelay);

  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!hasPermission(user, PERMISSIONS.DELETE_USER)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    if (user.id === id) {
      return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
    }

    const result = deleteUserInDb(id);
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted successfully" });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
