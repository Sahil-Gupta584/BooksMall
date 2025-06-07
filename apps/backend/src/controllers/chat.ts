import express from "express";
import mongoose, { Error } from "mongoose";
import z from "zod";
import { Chats, Messages } from "../db/modals";
const chatRouter = express.Router();

chatRouter.post("/api/getUserChats", async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) throw new Error("User id is required");
    const userObjectId = new mongoose.Types.ObjectId(userId);

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

    res.json(chats);
  } catch (error) {
    console.log(error);

    res.status(500).json(JSON.stringify(error));
  }
});

chatRouter.post("/api/getChatMessages", async (req, res) => {
  try {
    const { chatId } = req.body;
    if (!chatId) throw new Error("ChatId is required");
    const chatObjectId = new mongoose.Types.ObjectId(chatId);

    const chats = await Messages.find({ chatId: chatObjectId })
      .populate("sender")
      .populate("receiver");
    res.json(chats);
  } catch (error) {
    console.log(error);

    res.status(500).json(JSON.stringify(error));
  }
});
chatRouter.post("/api/sendMessage", async (req, res) => {
  try {
    const { message } = req.body;
    delete message._id;
    if (!message.chatId) throw new Error("Invalid message payload");
    const result = await Messages.create(message);
    await Chats.findByIdAndUpdate(message.chatId, { lastMessage: result });
    res.json({ ok: true, message: result });
  } catch (error) {
    console.log(error);
    res.status(500).json(JSON.stringify(error));
  }
});
const createChatSchema = z.object({
  userId: z.string(),
  sellerId: z.string(),
});
chatRouter.post("/api/createChat", async (req, res) => {
  try {
    const data = await createChatSchema.parseAsync(req.body);
    const { sellerId, userId } = data;
    let chat = await Chats.findOne({
      participants: { $all: [sellerId, userId] },
    });

    if (!chat) {
      chat = await Chats.create({ participants: [sellerId, userId] });
    }
    res.json({ ok: true, chat });
  } catch (error) {
    console.log(error);
    res.status(500).json(JSON.stringify(error));
  }
});
chatRouter.post("/api/updateSeen", async (req, res) => {
  try {
    const { chat, userId } = req.body;
    // const receiverObjId =
    if (!chat || !chat._id || !userId) throw new Error("Invalid payload");
    const updateRes = await Messages.updateMany(
      { chatId: chat._id, receiver: userId, status: "sent" },
      { status: "seen" }
    );

    res.json({ ok: true, res: updateRes });
  } catch (error) {
    console.log(error);
    res.status(500).json(JSON.stringify(error));
  }
});

export { chatRouter };
