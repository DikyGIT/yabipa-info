import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export const proxy = auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;
  const role = session?.user?.role;

  
  const publicPages = ["/"];
  const isPublicPage = publicPages.some((page) => pathname === page);

  
  if (!session && !isPublicPage && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  
  if (session && pathname === "/login") {
    if (role === "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.redirect(new URL("/yabipa-home", req.url));
  }

  
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
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images/).*)"],
};
