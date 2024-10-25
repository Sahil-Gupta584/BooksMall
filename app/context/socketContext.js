'use client';
import { createContext, useContext, useEffect, useState } from "react";
import { io as ClientIO } from "socket.io-client";

const SocketContext = createContext({
  socket: null,
  isConnected: false,
  onlineUsers: [],
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const socketInstance = new ClientIO({
      path: "/api/socket/io",
    });

    socketInstance.on("connect", () => {
      console.log("Connected to Socket.IO");
      setIsConnected(true);

      if (typeof window !== 'undefined') {
        const userId = localStorage.getItem('currentUserId'); // Assuming you store the user ID in localStorage
        console.log(`saving user ${userId} to localstorage`);
        if (userId) {
          socketInstance.emit('REGISTER_USER', userId);

        }
      }
    });

    socketInstance.on("ACTIVE_USERS", (activeUsers) => {
      setOnlineUsers(activeUsers);
    });

    
    
    socketInstance.on("disconnect", () => {
      console.log("Disconnected from Socket.IO");
      setIsConnected(false);
    });


    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};