import { connectDb, Feedbacks } from "@repo/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();
    const readRes = await Feedbacks.find({})
      .populate("upVotedBy")
      .populate("user");
    return NextResponse.json(readRes);
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
