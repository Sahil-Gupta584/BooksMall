import { Chats, connectDb } from "@repo/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: NextRequest) {
  try {
    const createChatSchema = z.object({
      userId: z.string(),
      sellerId: z.string(),
    });
    const data = await createChatSchema.parseAsync(await req.json());
    const { sellerId, userId } = data;

    await connectDb();
    let chat = await Chats.findOne({
      participants: { $all: [sellerId, userId] },
    });

    if (!chat) {
      chat = await Chats.create({ participants: [sellerId, userId] });
    }
    return NextResponse.json({ ok: true, chat });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
