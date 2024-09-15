'use client';

import { createContext, useContext, useEffect, useState } from "react";
import { useSocket } from "./socketContext";
import { getChat, getUser, updateMessageSeen,addChatToUser } from "../appwrite/api";

const chatContext = createContext(null);
export const useChat = () => useContext(chatContext);

export function ChatProvider({ children }) {
    const [chats, setChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);

    const { socket } = useSocket();
    const handleNewMessage = async (newMessage) => {
        console.log("New message received:", newMessage);

        const newChat = await getChat(newMessage.chatId);
        const isCurrentChat = currentChat?.$id === newMessage.chatId;


        if (isCurrentChat) {
            console.log('adding to current chat messages and emitting event for seen', newMessage);
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            socket.emit('SEEN_MESSAGE', { chatId: newMessage.chatId, partnerId: newMessage.senderId })
        } else {



            setChats((prevChats) => {

                const existingChat = prevChats.some((chat) => chat.$id === newMessage.chatId);
                if (existingChat) {
                    console.log('is chat already exists:', existingChat)
                    return prevChats.map((chat) => ({
                        ...chat,
                        unread: chat.$id === newMessage.chatId && !isCurrentChat ? chat.unread + 1 : chat.unread,
                    }));
                } else {
                    return [{ ...newChat, unread: 1 }, ...prevChats];
                }

            });
                const currentUserId = localStorage.getItem('currentUserId');
             await addChatToUser(currentUserId, newMessage.chatId);
        }
    }
    async function handleSeenMessage({ chatId }) {

        if (chatId === currentChat.$id) {

            console.log('updating current chat seen')

            setMessages((prevMessages) => {
                return prevMessages.map((message) => {
                    if (message.chatId === chatId) {
                        return { ...message, status: "seen" };
                    }
                    return message;
                });
            })

        } else {
            console.log('updating other chat seen')
            await updateMessageSeen(chatId);
        }
    }
    useEffect(() => {

        (async() => {
            console.log('occured2')

            const userId = localStorage.getItem("currentUserId");
            console.log('userId',userId)
            if (userId) {
                const user = await getUser(userId);
                console.log('user.chats', user.chats)
                setChats(user.chats)
            }

        })()

    }, [])

    useEffect(() => {
        if (socket) {

            socket.on("RECEIVE_MSG_EVENT", handleNewMessage);
            socket.on("SEEN_MESSAGE", handleSeenMessage);
            return () => {
                socket.off("RECEIVE_MSG_EVENT", handleNewMessage); // Cleanup on unmount
            };
        }
    }, [socket]);

    return (
        <chatContext.Provider value={{ chats, setChats, currentChat, setCurrentChat, messages, setMessages }}>
            {children}
        </chatContext.Provider>
    )
}

