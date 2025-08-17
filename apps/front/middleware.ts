import { NextRequest, NextResponse } from "next/server";

const protectedPaths = ["/chats", "/feedbacks", "/myListings", "/sell"];

export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Build full URL to your API route
  const apiUrl = new URL("/api/user", req.nextUrl);
  console.log(req.nextUrl, apiUrl.toString());
  // Forward headers and cookies
  const res = await fetch(apiUrl.toString(), {
    headers: {
      ...Object.fromEntries(req.headers), // forward all headers
    },
  });
  const session = await res.json();
  console.log({ session });
  // Example usage:
  if (pathname === "/login" && session?.data?.user?.id) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (protectedPaths.includes(pathname) && !session?.data?.user?.id) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/user|_next/static|_next/image|favicon.ico).*)"],
};
