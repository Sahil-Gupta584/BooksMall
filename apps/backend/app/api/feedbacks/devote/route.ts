import { connectDb, Feedbacks } from "@repo/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { feedbackId, userId } = await req.json();
    if (!feedbackId || !userId) throw new Error("Invalid payload");
    await connectDb();
    const devoteRes = await Feedbacks.updateOne(
      { _id: feedbackId },
      { $pull: { upVotedBy: userId } }
    );
    return NextResponse.json({ ok: true, res: devoteRes });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
