import { Chats, connectDb, Messages } from "@repo/db";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();
    if (!userId) throw new Error("User id is required");
    const userObjectId = new mongoose.Types.ObjectId(userId);

    await connectDb();
    const rawChats = await Chats.find({ participants: userObjectId })
      .populate("participants")
      .populate("lastMessage");

    const chats = await Promise.all(
      rawChats.map(async (c) => {
        const unreadMessages = await Messages.find({
          receiver: userId,
          status: "sent",
          chatId: c._id,
        });

        return {
          ...c.toObject(), // convert Mongoose document to plain object
          unreadCount: unreadMessages.length,
        };
      })
    );
    return NextResponse.json(chats);
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
