import { Books } from "@repo/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { bookData } = await req.json();
    const book = await Books.create(bookData);
    return NextResponse.json({ ok: true, book });
  } catch (error) {
    return NextResponse.json(JSON.stringify(error));
  }
}
