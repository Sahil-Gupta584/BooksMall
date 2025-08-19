import { Books, connectDb } from "@repo/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();
    if (!userId) throw new Error("userId is required!");

    await connectDb();
    const book = await Books.find({ owner: userId });
    return NextResponse.json(book[0]);
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
