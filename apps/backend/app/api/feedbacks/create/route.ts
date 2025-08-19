import { connectDb, Feedbacks } from "@repo/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { feedback } = await req.json();
    if (!feedback) throw new Error("Invalid payload");

    await connectDb();
    const createRes = await Feedbacks.create(feedback);

    return NextResponse.json({ ok: true, res: createRes });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
