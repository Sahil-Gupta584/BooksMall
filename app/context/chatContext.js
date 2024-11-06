'use client';

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useSocket } from "./socketContext";
import { updateMessageSeen, addChatToUser } from "../actions/api";

const chatContext = createContext(null);
export const useChat = () => useContext(chatContext);

export function ChatProvider({ children }) {
    const [chats, setChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const { socket, currUser } = useSocket();
    const currentChatRef = useRef(null);

    useEffect(() => {
        currentChatRef.current = currentChat;
    }, [currentChat]);

    const handleNewMessage = async (newMessage) => {
        console.log("New message received:", newMessage);
        const isCurrentChat = currentChatRef.current?._id === newMessage.chatId;
        let isExistingChat;

        if (isCurrentChat) {
            console.log('adding to current chat messages and emitting event for seen', newMessage);
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            socket.emit('SEEN_MESSAGE', { chatId: newMessage.chatId, partnerId: newMessage.senderId });
        } else {

            setChats((prevChats) => {
                console.log('prevchats from context', prevChats);
                isExistingChat = prevChats.some((chat) => chat._id === newMessage.chatId);
                console.log('is chat already exists:', isExistingChat);

                if (isExistingChat) {
                    return prevChats.map((chat) => ({
                        ...chat,
                        unread: chat._id === newMessage.chatId && !isCurrentChat ? (chat.unread ?? 0) + 1 : chat.unread,
                    }));
                }
                return prevChats;
            });

            if (!isExistingChat) {
                console.log('adding new chat to user!');
                await addChatToUser(currUser._id, newMessage.chatId);
                window.location.reload()

            }
        }
    };

    async function handleSeenMessage({ chatId }) {
        console.log(currentChatRef);
        if (currentChatRef.current && chatId === currentChatRef.current._id) {
            console.log('updating current chat seen');
            setMessages((prevMessages) =>
                prevMessages.map((msg) => ({ ...msg, status: "seen" }))
            );
        } else {
            console.log('updating other chat seen');
            await updateMessageSeen(chatId);
        }
    }

    useEffect(() => {
        (async () => {
            if (currUser?.chats) setChats(currUser.chats);
        })();
    }, [currUser]);

    useEffect(() => {
        if (socket) {
            socket.on("RECEIVE_MSG_EVENT", handleNewMessage);
            socket.on("SEEN_MESSAGE", handleSeenMessage);
            return () => {
                socket.off("RECEIVE_MSG_EVENT", handleNewMessage);
                socket.off("SEEN_MESSAGE", handleSeenMessage);
            };
        }
    }, [socket]);

    return (
        <chatContext.Provider value={{ chats, setChats, currentChat, setCurrentChat, messages, setMessages }}>
            {children}
        </chatContext.Provider>
    );
}
