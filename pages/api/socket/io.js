import { Server as ServerIO } from "socket.io";

export const config = {
  api: {
    bodyParser: false,
  },
};

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new ServerIO(res.socket.server, {
      path: "/api/socket/io",
      pingTimeout: 60000,
    });
    res.socket.server.io = io;

    io.on("connection", (socket) => {
  

      socket.on("JOIN_ROOM", (roomId) => {

        socket.rooms.forEach((room) => {
          if (room !== socket.id && room !== roomId) {
            socket.leave(room);
          }
        });

        socket.join(roomId);
        console.log('joined room', roomId)
      });

      socket.on("SEND_MESSAGE", (data) => {
        // Emit the message to both rooms (sender-receiver and receiver-sender)
        const room1 = `${data.senderId}-${data.receiverId}`;
        const room2 = `${data.receiverId}-${data.senderId}`;
        console.log(data)
        socket.emit('RECEIVE_MSG_EVENT', data);
        // io.emit('RECEIVE_MSG_EVENT', data);
        io.to(room1).to(room2).emit('RECEIVE_MSG_EVENT', data);
      
        // Emit an event to update the chat list for the receiver
        io.to(data.receiverId).emit('NEW_CHAT', {
          partnerId: data.senderId,
          lastMessage: data.content,
          timestamp: data.timestamp
        });
      });





      socket.on('TYPING_EVENT', (data) => {
        // Handle typing events
        socket.broadcast.emit('TYPING_EVENT', data);
      });

      // Add more event handlers as needed

      socket.on("disconnect", () => {
        console.log("Client disconnected",socket.id);
      });
    });
  }
  res.end();
};

export default SocketHandler;