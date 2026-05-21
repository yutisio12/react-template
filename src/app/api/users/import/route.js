import { NextResponse } from "next/server";
import { bulkCreateUsers } from "@/mock/db";
import { verifyToken } from "@/lib/jwt";
import { hasPermission } from "@/lib/permissions";
import { PERMISSIONS, ROLES } from "@/mock/roles";
import { delay } from "@/lib/utils";
import { APP_CONFIG } from "@/config/app";
import { cookies } from "next/headers";
import * as XLSX from "xlsx";

export async function POST(request) {
  await delay(APP_CONFIG.api.simulatedDelay);

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(APP_CONFIG.jwt.cookieName)?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!hasPermission(user, PERMISSIONS.CREATE_USER)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    if (jsonData.length === 0) {
      return NextResponse.json({ error: "File is empty" }, { status: 400 });
    }

    const validRoles = Object.values(ROLES);
    const users = jsonData.map((row) => ({
      name: row.name || row.Name || row.Nama || "",
      email: row.email || row.Email || "",
      password: row.password || row.Password || "password123",
      role: validRoles.includes(row.role || row.Role) ? (row.role || row.Role) : ROLES.USER,
      status: row.status || row.Status || "active",
    }));

    const result = bulkCreateUsers(users);

    return NextResponse.json(result, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to import file" }, { status: 500 });
  }
}
