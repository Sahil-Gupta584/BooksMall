import { auth } from "@/lib/auth";
import { Books, connectDb } from "@repo/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { bookId } = await req.json();
    await connectDb();

    const book = await Books.findOne({ _id: bookId });
    const session = await auth.api.getSession(req);

    if (session?.user.id && session.user.id !== book.owner) {
      return NextResponse.json(
        { error: "Invalid permission" },
        { status: 403 }
      );
    }
    const deleteRes = await Books.deleteOne({ _id: bookId });
    return NextResponse.json({ ok: true, deleteRes });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
