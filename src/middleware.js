import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { PERMISSIONS } from "@/mock/roles";

const JWT_SECRET = new TextEncoder().encode(
  "your-super-secret-jwt-key-change-in-production-min-32-chars!!"
);
const COOKIE_NAME = "auth_token";

const ROUTE_PERMISSIONS = {
  "/dashboard": PERMISSIONS.VIEW_DASHBOARD,
  "/dashboard/users": PERMISSIONS.VIEW_USERS,
  "/dashboard/admin": PERMISSIONS.VIEW_ADMIN_PAGE,
};

const PUBLIC_ROUTES = ["/login", "/register", "/mfa", "/api"];

function isPublicRoute(pathname) {
  return PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
}

function getRequiredPermission(pathname) {
  const exactMatch = ROUTE_PERMISSIONS[pathname];
  if (exactMatch) return exactMatch;

  const sortedRoutes = Object.keys(ROUTE_PERMISSIONS).sort(
    (a, b) => b.length - a.length
  );
  for (const route of sortedRoutes) {
    if (pathname.startsWith(route)) {
      return ROUTE_PERMISSIONS[route];
    }
  }

  return null;
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  if (isPublicRoute(pathname) || pathname === "/") {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);

    const requiredPermission = getRequiredPermission(pathname);

    if (requiredPermission) {
      const userPermissions = payload.permissions || [];
      if (!userPermissions.includes(requiredPermission)) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", payload.id);
    requestHeaders.set("x-user-role", payload.role);
    requestHeaders.set("x-user-email", payload.email);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
