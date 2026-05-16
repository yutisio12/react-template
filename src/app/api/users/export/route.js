import { NextResponse } from "next/server";
import { getAllUsers } from "@/mock/db";
import { verifyToken } from "@/lib/jwt";
import { hasPermission } from "@/lib/permissions";
import { PERMISSIONS } from "@/mock/roles";
import { APP_CONFIG } from "@/config/app";
import { cookies } from "next/headers";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

export async function GET(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(APP_CONFIG.jwt.cookieName)?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!hasPermission(user, PERMISSIONS.VIEW_USERS)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") || "excel";

    const result = getAllUsers({ page: 1, pageSize: 9999 });
    const users = result.data;

    if (format === "pdf") {
      return exportPDF(users);
    }

    return exportExcel(users);
  } catch {
    return NextResponse.json({ error: "Failed to export data" }, { status: 500 });
  }
}

function exportExcel(users) {
  const data = users.map((u) => ({
    Name: u.name,
    Email: u.email,
    Role: u.role,
    Status: u.status,
    "Created At": new Date(u.createdAt).toLocaleDateString(),
  }));

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data);

  worksheet["!cols"] = [
    { wch: 25 }, { wch: 30 }, { wch: 15 }, { wch: 12 }, { wch: 18 },
  ];

  XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": "attachment; filename=users_export.xlsx",
    },
  });
}

function exportPDF(users) {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Users Report", 14, 22);
  doc.setFontSize(10);
  doc.setTextColor(128);
  doc.text(`Generated on ${new Date().toLocaleDateString()} | Total: ${users.length} users`, 14, 30);

  const tableData = users.map((u) => [
    u.name,
    u.email,
    u.role,
    u.status,
    new Date(u.createdAt).toLocaleDateString(),
  ]);

  doc.autoTable({
    startY: 36,
    head: [["Name", "Email", "Role", "Status", "Created"]],
    body: tableData,
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [99, 102, 241], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    margin: { left: 14, right: 14 },
  });

  const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=users_report.pdf",
    },
  });
}
