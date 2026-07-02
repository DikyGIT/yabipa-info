import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;
  const role = session?.user?.role;

  // Belum login → redirect ke login (kecuali halaman login)
  if (!session && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Sudah login → redirect dari /login
  if (session && pathname === "/login") {
    if (role === "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.redirect(new URL("/yabipa-home", req.url));
  }

  // Proteksi /dashboard → HANYA admin
  if (pathname.startsWith("/dashboard")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/yabipa-home", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  runtime: "nodejs",
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images/).*)"],
};
