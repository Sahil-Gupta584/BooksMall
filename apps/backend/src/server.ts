import { toNodeHandler } from "better-auth/node";
import console from "console";
import cors from "cors";
import { configDotenv } from "dotenv";
import express from "express";
import http from "http";
import mongoose from "mongoose";
import multer from "multer";
import { Server } from "socket.io";
import WebSocket from "ws";
import { z } from "zod";
import { Books, Chats, Feedbacks, Messages, Users } from "./db/modals";
import { auth } from "./lib/auth";
configDotenv();
const app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(
  cors({
    origin: [
      "https://books-mall.vercel.app",
      "http://localhost:5173",
      "https://booksmall-1.onrender.com",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
const server = http.createServer(app);
const io = new Server(server, {
  path: "/socket.io",
  cors: {
    origin: [
      "https://books-mall.vercel.app",
      "http://localhost:5173",
      "https://booksmall-1.onrender.com",
    ], // The URL of your Vercel app
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const onlineUsers = new Map();
const offlineMessages = new Map();

const broadcastOnlineUsers = () => {
  const activeUsers = Array.from(onlineUsers.keys());
  io.emit("ACTIVE_USERS", activeUsers);
  console.log("activeUsers", activeUsers);
};

io.on("connection", (socket) => {
  console.log("Socket Connection done");

  socket.on("REGISTER_USER", (userId) => {
    onlineUsers.set(userId, socket.id);
    broadcastOnlineUsers();
    console.log("OnlineUsers", onlineUsers);

    // Deliver any offline messages for this user
    const offlineMessageQueue = offlineMessages.get(userId) || [];
    console.log("offlinemessages", offlineMessageQueue);
    offlineMessageQueue.forEach((message) => {
      console.log("from offline message");
      io.to(socket.id).emit("RECEIVE_MSG_EVENT", message);
    });
    offlineMessages.delete(userId);
  });

  socket.on("TYPING_EVENT", ({ partnerId, isTyping }) => {
    const partnerSocketId = onlineUsers.get(partnerId);
    console.log("partnerSocketId", partnerSocketId);
    io.to(partnerSocketId).emit("TYPING_EVENT", { partnerId, isTyping });
  });

  socket.on("SEEN_MESSAGE", ({ chatId, partnerId }) => {
    const partnerSocketId = onlineUsers.get(partnerId);
    console.log("partnerSocketId", partnerSocketId);
    console.log("emitting seen message from backend");
    io.to(partnerSocketId).emit("SEEN_MESSAGE", { chatId });
  });

  socket.on("SEND_MESSAGE", (newMessage) => {
    const receiverSocketId = onlineUsers.get(newMessage.receiverId);
    if (receiverSocketId) {
      console.log("sendin for online");
      io.to(receiverSocketId).emit("RECEIVE_MSG_EVENT", newMessage);
    } else {
      // Store the message for later delivery
      console.log("saving for offline");
      let offlineMessageQueue =
        offlineMessages.get(newMessage.receiverId) || [];
      offlineMessageQueue.push(newMessage);
      offlineMessages.set(newMessage.receiverId, offlineMessageQueue);
    }
  });

  socket.on("disconnect", () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
    broadcastOnlineUsers();
  });
});

const clients = new Map();
const wss = new WebSocket.Server({ port: 8080 });
wss.on("connection", (ws) => {
  console.log("ws started on 8080");

  ws.on("message", async (data) => {
    const { type, payload } = JSON.parse(data.toString());

    switch (type) {
      case "online":
        clients.forEach((socket, userId) => {
          socket.send(
            JSON.stringify({
              type: "online",
              payload: { userId: payload.userId },
            })
          );
        });
        clients.set(payload.userId, ws);
        break;
      case "offline":
        clients.delete(payload.userId);
        const res = await Users.updateOne(
          { _id: payload.userId },
          { lastActive: payload.lastActive }
        );

        break;

      case "message":
        const recipientWs = clients.get(payload.message.receiver._id);

        if (recipientWs && recipientWs.readyState === WebSocket.OPEN) {
          recipientWs.send(JSON.stringify({ type: "message", payload }));
        }
      case "seen": {
        const { chat, userId } = payload;
        if (!chat || !chat._id || !userId) return;
        const recipient = chat.participants.find(
          (p: { _id: string }) => p._id !== userId
        );

        const recipientWs = clients.get(recipient._id);
        if (!recipientWs) return;

        if (recipientWs && recipientWs.readyState === WebSocket.OPEN) {
          recipientWs.send(JSON.stringify({ type: "seen", payload }));
        }
      }
      default:
        break;
    }
  });
});

async function main() {
  await mongoose.connect(
    "mongodb+srv://guptas3067:root123@cluster0.6yerxth.mongodb.net/Booksmall"
  );
}

main()
  .then(() => console.log("connected to db"))
  .catch((err) => console.log("Error connecting db:", err));

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

app.all("/api/auth/*any", toNodeHandler(auth));

app.use(express.json());

app.get("/api/books", async (req, res) => {
  try {
    const { min, max } = req.query;

    const conditions = req.query["condition[]"];
    const categories = req.query["categories[]"];
    const filter: mongoose.RootFilterQuery<any> = {};
    if (min || max) {
      filter.price = {};
      if (min) filter.price.$gte = Number(min);
      if (max) filter.price.$lte = Number(max);
    }
    if (categories) filter.categories = categories;
    if (conditions) filter.conditions = { $in: [conditions] };

    const books = await Books.find(filter).populate("owner");
    res.json(books);
  } catch (error) {
    res.status(500).json(JSON.stringify(error));
  }
});

app.post("/api/books/create", async (req, res) => {
  try {
    const { bookData } = req.body;
    const book = await Books.create(bookData);
    res.json({ ok: true, book });
  } catch (error) {
    res.status(500).json(JSON.stringify(error));
  }
});
app.post("/api/books/update", async (req, res) => {
  try {
    const { bookData } = req.body;
    const book = await Books.updateOne({ _id: bookData._id }, bookData);
    res.json({ ok: true, book });
  } catch (error) {
    res.status(500).json(JSON.stringify(error));
  }
});
app.post("/api/books/delete", async (req, res) => {
  try {
    const { bookId } = req.body;
    const book = await Books.deleteOne({ _id: bookId });
    res.json({ ok: true, book });
  } catch (error) {
    res.status(500).json(JSON.stringify(error));
  }
});

app.get("/api/books/:bookId", async (req, res) => {
  const { bookId } = req.params;
  const book = await Books.find({ _id: bookId }).populate("owner");
  res.json(book[0]);
});

app.post("/api/books/myBooks", async (req, res) => {
  const { userId } = req.body;
  if (!userId) throw new Error("userId is required!");

  const book = await Books.find({ owner: userId });
  res.json(book);
});

app.post("/api/fileToUrl", upload.single("image"), async (req, res) => {
  try {
    let url = null;
    const file = req.file;
    if (!file) throw new Error("File not found");

    const form = new FormData();
    form.append("image", new Blob([file.buffer]), file.originalname);

    const imgRes = await fetch(
      "https://api.imgbb.com/1/upload?key=b10b7ca5ecd048d6a0ed9f9751cebbdc",
      {
        method: "POST",
        body: form,
      }
    );

    const result = await imgRes.json();
    console.log({ result });

    url = result.data.display_url;
    res.json({ ok: true, url });
  } catch (error) {
    console.log(error);

    res.status(500).json(JSON.stringify(error));
  }
});

app.post("/api/getUserChats", async (req, res) => {
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

app.post("/api/getChatMessages", async (req, res) => {
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
app.post("/api/sendMessage", async (req, res) => {
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
app.post("/api/createChat", async (req, res) => {
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
app.post("/api/updateSeen", async (req, res) => {
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

app.get("/api/feedbacks/read", async (req, res) => {
  try {
    const readRes = await Feedbacks.find({})
      .populate("upVotedBy")
      .populate("user");

    res.json(readRes);
  } catch (error) {
    console.log(error);
    res.status(500).json(JSON.stringify(error));
  }
});

app.post("/api/feedbacks/create", async (req, res) => {
  try {
    const { feedback } = req.body;
    if (!feedback) throw new Error("Invalid payload");
    const createRes = await Feedbacks.create(feedback);

    res.json({ ok: true, res: createRes });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: (error as Error).message });
  }
});

app.post("/api/feedbacks/upvote", async (req, res) => {
  try {
    const { feedbackId, userId } = req.body;
    if (!feedbackId || !userId) throw new Error("Invalid payload");

    const upvoteRes = await Feedbacks.updateOne(
      { _id: feedbackId },
      { $addToSet: { upVotedBy: userId } }
    );

    res.json({ ok: true, res: upvoteRes });
  } catch (error) {
    console.log(error);
    res.status(500).json(JSON.stringify(error));
  }
});

app.post("/api/feedbacks/devote", async (req, res) => {
  try {
    const { feedbackId, userId } = req.body;
    if (!feedbackId || !userId) throw new Error("Invalid payload");

    const upvoteRes = await Feedbacks.updateOne(
      { _id: feedbackId },
      { $pull: { upVotedBy: userId } }
    );

    res.json({ ok: true, res: upvoteRes });
  } catch (error) {
    console.log(error);
    res.status(500).json(JSON.stringify(error));
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
