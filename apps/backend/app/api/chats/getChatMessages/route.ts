import { connectDb, Messages } from "@repo/db";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { chatId } = await req.json();
    if (!chatId) throw new Error("ChatId is required");
    const chatObjectId = new mongoose.Types.ObjectId(chatId);
    await connectDb();

    const messages = await Messages.find({ chatId: chatObjectId })
      .populate("sender")
      .populate("receiver");
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
