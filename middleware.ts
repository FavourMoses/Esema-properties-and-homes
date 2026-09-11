import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { hasPermission, permissionForPath } from "@/lib/permissions";
import { CUSTOMER_COOKIE_NAME, verifyCustomerToken } from "@/lib/customer-jwt";

const ADMIN_PUBLIC_PAGES = ["/admin/login", "/admin/forgot-password", "/admin/reset-password"];
const PORTAL_PUBLIC_PAGES = ["/portal/login", "/portal/forgot-password", "/portal/reset-password"];

export default auth(async (req) => {
  const { pathname } = req.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginPage = ADMIN_PUBLIC_PAGES.includes(pathname);

  if (isAdminRoute && !isLoginPage && !req.auth) {
    const loginUrl = new URL("/admin/login", req.nextUrl.origin);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Already logged in — no need to see the login/reset pages again.
  if (pathname === "/admin/login" && req.auth) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.nextUrl.origin));
  }

  if (isAdminRoute && !isLoginPage && req.auth) {
    const user = req.auth.user;

    // Managing other admin accounts is owner-only, full stop — not a
    // togglable permission, so a staff account can never grant itself more
    // access even if the checkbox list is somehow tampered with.
    if (pathname.startsWith("/admin/admin-users") && user.role !== "owner") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.nextUrl.origin));
    }

    const requiredPermission = permissionForPath(pathname);
    if (requiredPermission && !hasPermission(user, requiredPermission)) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.nextUrl.origin));
    }
  }

  // Customer portal — a completely separate session from admin, checked
  // independently here since it isn't part of Auth.js at all.
  const isPortalRoute = pathname.startsWith("/portal");
  const isPortalPublicPage = PORTAL_PUBLIC_PAGES.includes(pathname);

  if (isPortalRoute && !isPortalPublicPage) {
    const token = req.cookies.get(CUSTOMER_COOKIE_NAME)?.value;
    const session = token ? await verifyCustomerToken(token) : null;
    if (!session) {
      return NextResponse.redirect(new URL("/portal/login", req.nextUrl.origin));
    }
  }
  if (pathname === "/portal/login") {
    const token = req.cookies.get(CUSTOMER_COOKIE_NAME)?.value;
    const session = token ? await verifyCustomerToken(token) : null;
    if (session) {
      return NextResponse.redirect(new URL("/portal", req.nextUrl.origin));
    }
  }

  return NextResponse.next();
});

export const config = {
  // Also guard admin/portal API routes; everything else (the public site)
  // is untouched by this middleware.
  matcher: ["/admin/:path*", "/api/admin/:path*", "/portal/:path*"],
};
