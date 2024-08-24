"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { io as ClientIO } from "socket.io-client";

const SocketContext = createContext({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketInstance = new ClientIO({
      path: "/api/socket/io",
    });

    socketInstance.on("connect", () => {
      console.log("Connected to Socket.IO");
      setIsConnected(true);

      socketInstance.on("RECEIVE_MSG_EVENT", (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
        console.log(message,'from reciving')
      });
      
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
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};