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

    const onlineUsers = new Map();
    const offlineMessages = new Map();

    const broadcastOnlineUsers = () => {
      const activeUsers = Array.from(onlineUsers.keys());
      io.emit('ACTIVE_USERS', activeUsers);
      console.log('activeUsers', activeUsers)

    };


    io.on("connection", (socket) => {

      socket.on('REGISTER_USER', (userId) => {

        onlineUsers.set(userId, socket.id);
        broadcastOnlineUsers()
        console.log('OnlineUsers',onlineUsers);
        
        // Deliver any offline messages for this user
        const offlineMessageQueue = offlineMessages.get(userId) || [];
        console.log('offlinemessages', offlineMessageQueue)
        offlineMessageQueue.forEach(message => {
          console.log('from offline message')
          io.to(socket.id).emit('RECEIVE_MSG_EVENT', message);
        });
        offlineMessages.delete(userId);
      });

      socket.on("TYPING_EVENT",({partnerId,isTyping})=>{
        
        const partnerSocketId = onlineUsers.get(partnerId);
        console.log('partnerSocketId',partnerSocketId)
        io.to(partnerSocketId).emit("TYPING_EVENT",{partnerId,isTyping})

      })

      socket.on("SEEN_MESSAGE", ({ chatId, partnerId }) => {
        const partnerSocketId = onlineUsers.get(partnerId);
        console.log('partnerSocketId',partnerSocketId);
        console.log('emitting seen message from backend');
        io.to(partnerSocketId).emit("SEEN_MESSAGE",{chatId})

      })

      socket.on('SEND_MESSAGE', (newMessage) => {
        const receiverSocketId = onlineUsers.get(newMessage.receiverId);
        if (receiverSocketId) {
          console.log('sendin for online');
          io.to(receiverSocketId).emit('RECEIVE_MSG_EVENT', newMessage);
        } else {
          // Store the message for later delivery
          console.log('saving for offline')
          let offlineMessageQueue = offlineMessages.get(newMessage.receiverId) || [];
          offlineMessageQueue.push(newMessage);
          offlineMessages.set(newMessage.receiverId, offlineMessageQueue);
        }
      });

      socket.on('disconnect', () => {
        for (const [userId, socketId] of onlineUsers.entries()) {
          if (socketId === socket.id) {
            onlineUsers.delete(userId);
            break;
          }
        }
        broadcastOnlineUsers();
      });
    });
  }
  res.end();
};

export default SocketHandler;