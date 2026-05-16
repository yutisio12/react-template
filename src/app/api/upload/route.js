import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { APP_CONFIG } from "@/config/app";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(APP_CONFIG.jwt.cookieName)?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    verifyToken(token);

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 });
    }

    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be under 2MB" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    return NextResponse.json({ url: base64 });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
