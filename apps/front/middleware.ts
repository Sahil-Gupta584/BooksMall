import { NextRequest, NextResponse } from "next/server";

const protectedPaths = ["/chats", "/feedbacks", "/myListings", "/sell"];

export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const apiUrl = new URL("/api/user", process.env.NEXT_PUBLIC_BACKEND_URL);
  // console.log(apiUrl.href);
  
  // Forward headers and cookies
  const res = await fetch(apiUrl.href, {
    headers: {
      ...Object.fromEntries(req.headers),
    },
  });
  const session = await res.json();
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
