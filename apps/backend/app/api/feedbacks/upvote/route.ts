import { connectDb, Feedbacks } from "@repo/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { feedbackId, userId } = await req.json();
    if (!feedbackId || !userId) throw new Error("Invalid payload");

    await connectDb();
    const upvoteRes = await Feedbacks.updateOne(
      { _id: feedbackId },
      { $addToSet: { upVotedBy: userId } }
    );
    return NextResponse.json({ ok: true, res: upvoteRes });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
