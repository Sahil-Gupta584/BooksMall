import { Books, connectDb } from "@repo/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { bookData } = await req.json();
    await connectDb();

    const book = await Books.create(bookData);
    return NextResponse.json({ ok: true, book });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
