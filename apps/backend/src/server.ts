import { toNodeHandler } from "better-auth/node";
import console from "console";
import cors from "cors";
import { configDotenv } from "dotenv";
import express from "express";
import http from "http";
import mongoose from "mongoose";
import multer from "multer";
import WebSocket from "ws";
import { booksRouter } from "./controllers/books";
import { chatRouter } from "./controllers/chat";
import { feedbackRouter } from "./controllers/feedback";
import { Users } from "./db/modals";
import { auth } from "./lib/auth";

configDotenv();
const storage = multer.memoryStorage();
const upload = multer({ storage });

const app = express();
app.use(
  cors({
    origin: [process.env.FRONTEND_URL!],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.all("/api/auth/*any", toNodeHandler(auth));

const server = http.createServer(app);

const clients = new Map();

const wss = new WebSocket.Server({ server });
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
  await mongoose.connect(process.env.MONGODB_URL!);
}

main()
  .then(() => console.log("connected to db"))
  .catch((err) => console.log("Error connecting db:", err));

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

app.use(express.json());

app.use("/api/books", booksRouter);
app.use("/api/chats", chatRouter);
app.use("/api/feedbacks", feedbackRouter);

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

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
