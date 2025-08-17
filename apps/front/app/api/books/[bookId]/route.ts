import { Books } from "@repo/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const bookId = searchParams.get("bookId");
    const book = await Books.find({ _id: bookId }).populate("owner");
    return NextResponse.json(book[0]);
  } catch (error) {
    return NextResponse.json(JSON.stringify(error));
  }
}
