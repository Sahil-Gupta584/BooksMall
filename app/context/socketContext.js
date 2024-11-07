'use client';
import { createContext, useContext, useEffect, useState } from "react";
import { io as ClientIO } from "socket.io-client";
import { getCurrUser } from "../actions/api";

const SocketContext = createContext({
  socket: null,
  isConnected: false,
  onlineUsers: [],
  currUser:null
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currUser, setCurrUser] = useState(null)

  useEffect(() => {


    const socketInstance = new ClientIO("http://localhost:3001", {
      path: "/socket.io",
      withCredentials: true,
      

    });

    console.log('connecting to socket!');
    
    socketInstance.on("connect", async () => {
      const user = await getCurrUser();
      console.log('connected to socket!');
      setCurrUser(user)
      setIsConnected(true);

      if (typeof window !== 'undefined') {
        if (user) {
          console.log(`saving user ${user?._id} to socket!`);
          socketInstance.emit('REGISTER_USER', user._id);
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

  if (isConnected) {
    console.log('Connected user',currUser,'toSocket!');
    
    return(
    <SocketContext.Provider value={{ socket, isConnected, onlineUsers, currUser }}>
      {children}
    </SocketContext.Provider>)
  }

  return <div className="universal loading loading-spinner h-[91vh] w-[100vw] "></div>;

};
