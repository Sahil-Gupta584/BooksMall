import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await auth.api.getSession({ headers: await headers() });
    return NextResponse.json({ status: "success", data: user });
  } catch (error) {
    console.error("error for /api/user", error);
    return NextResponse.json(
      { status: "error", message: "Failed to create user" },
      { status: 500 }
    );
  }
}
