import { Chats, connectDb, Messages } from "@repo/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    delete message._id;
    if (!message.chatId) throw new Error("Invalid message payload");

    await connectDb();
    const result = await Messages.create(message);
    await Chats.findByIdAndUpdate(message.chatId, { lastMessage: result });
    return NextResponse.json({ ok: true, message: result });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
