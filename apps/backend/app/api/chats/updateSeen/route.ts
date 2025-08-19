import { connectDb, Messages } from "@repo/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { chat, userId } = await req.json();
    // const receiverObjId =
    if (!chat || !chat._id || !userId) throw new Error("Invalid payload");

    await connectDb();
    const updateRes = await Messages.updateMany(
      { chatId: chat._id, receiver: userId, status: "sent" },
      { status: "seen" }
    );
    return NextResponse.json({ ok: true, res: updateRes });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
