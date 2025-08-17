import { Users } from "@repo/db";
import { config } from "dotenv";
import { WebSocket, WebSocketServer } from "ws";
config();

const clients = new Map();

const wss = new WebSocketServer({ port: Number(process.env.WS_PORT!) });
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
