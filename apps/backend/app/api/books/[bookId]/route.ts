import { Books, connectDb } from "@repo/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ bookId: string }> }
) {
  try {
    const { bookId } = await params;
    await connectDb();

    const book = await Books.find({ _id: bookId }).populate("owner");
    return NextResponse.json(book[0]);
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
