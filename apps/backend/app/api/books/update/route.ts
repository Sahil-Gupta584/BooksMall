import { auth } from "@/lib/auth";
import { Books, connectDb } from "@repo/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const { bookData } = await req.json();
    const session = await auth.api.getSession(req);
    if (session?.user.id && session.user.id !== bookData.owner) {
      return NextResponse.json(
        { error: "Invalid permission" },
        { status: 403 }
      );
    }
    const book = await Books.updateOne({ _id: bookData._id }, bookData);
    return NextResponse.json({ ok: true, data: book });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
