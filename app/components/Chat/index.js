'use client';
import React, { useEffect, useState } from 'react';
import Partner from './Partner';
import { getChatPartners, getPreviousMessages, } from '@/app/appwrite/api';
import { useSocket } from "@/app/context/socketContext";

export default function Chat({ currentUser, sellerId }) {

    const { socket, isConnected } = useSocket();
    const [chatPartners, setChatPartners] = useState([]);
    const [currentPartner, setCurrentPartner] = useState(null);
    const [messages, setMessages] = useState([]);


    useEffect(() => {
        (async () => {
            const partners = await getChatPartners(currentUser.$id);
            setChatPartners(partners);

            console.log(partners);
            if (sellerId) {

                setCurrentPartner(() => partners.map(p => p.$id == sellerId ? p : false))

                const prevMessages = await getPreviousMessages(currentUser.$id, sellerId);
                console.log(prevMessages, 'prevMessages');
                prevMessages && setMessages(prevMessages);


                // Join new room
            }

        })()
    }, [])

    useEffect(() => {
        socket.on("RECEIVE_MSG_EVENT", (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
            console.log(message, 'from reciving')
        });

        socket.on("NEW_CHAT", (chatData) => {
            setChatPartners((prevPartners) => {
                const existingPartnerIndex = prevPartners.findIndex(p => p.$id === chatData.partnerId);
                if (existingPartnerIndex !== -1) {
                    // Update existing partner
                    const updatedPartners = [...prevPartners];
                    updatedPartners[existingPartnerIndex] = {
                        ...updatedPartners[existingPartnerIndex],
                        lastMessage: chatData.lastMessage,
                        timestamp: chatData.timestamp,
                        unreadCount: (updatedPartners[existingPartnerIndex].unreadCount || 0) + 1
                    };
                    return updatedPartners;
                } else {
                    // Add new partner
                    return [...prevPartners, {
                        $id: chatData.partnerId,
                        lastMessage: chatData.lastMessage,
                        timestamp: chatData.timestamp,
                        unreadCount: 1
                    }];
                }
            });
        });

        return () => {
            socket.off("RECEIVE_MSG_EVENT");
            socket.off("NEW_CHAT");
        };
    }, [socket]);



    const handleSubmit = (e) => {
        e.preventDefault();

        const newMessage = {
            sender: currentUser,
            receiver: currentPartner,
            content: e.target.elements.message.value,
            // chat: currentChat,
            status: 'sent',
            timestamp: Date.now()
        };

        socket.emit('SEND_MESSAGE', newMessage);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        e.target.elements.message.value = '';
    };

    const handlePartnerClick = async (partner) => {
        // Join new room
        socket.emit('JOIN_ROOM', `${currentUser.$id}-${partner.$id}`);
        socket.emit('JOIN_ROOM', `${partner.$id}-${currentUser.$id}`);

        console.log(`in room:${currentUser.$id}-${partner.$id},${partner.$id}-${currentUser.$id}`)

        setCurrentPartner(partner);
        const previousMessages = await getPreviousMessages(currentUser.$id, partner.$id);
        setMessages(previousMessages);

        // Reset unread count
        setChatPartners((prevPartners) =>
            prevPartners.map(p =>
                p.$id === partner.$id ? { ...p, unreadCount: 0 } : p
            )
        );
    };




    return (
        <div className="flex flex-col sm:flex-row h-[91vh] bg-[#f3eaea]">
            <div className="w-full sm:w-1/3 lg:w-1/4 bg-[#f3eaea] border-b sm:border-r border-[#e0d5d5] overflow-y-auto max-h-[30vh] sm:max-h-full">
                {chatPartners && chatPartners.map((partner, index) => (
                    <div
                        className={`p-4 flex ${currentPartner === partner ? 'bg-[#e0d5d5]' : ''} items-center gap-2 border-b border-[#e0d5d5] hover:bg-[#e0d5d5] cursor-pointer`}
                        onClick={() => handlePartnerClick(partner)}
                        key={index}
                    >
                        <Partner partner={partner} />
                    </div>
                ))}
            </div>
            <div className="w-full sm:w-2/3 lg:w-3/4 flex flex-col h-[70vh] sm:h-full">
                <div className="flex items-center font-bold gap-2 bg-[#f3eaea] p-4 border-b border-[#e0d5d5]">
                    <Partner partner={currentPartner} />
                </div>
                {currentPartner ? (
                    <>
                        <div className="flex-grow bg-[#e4e4e4] overflow-y-auto p-4">
                            {messages.map((msg, index) => (
                                <div key={index} className={`mb-2 ${msg.senderId === currentUser.$id ? 'text-right' : 'text-left'}`}>
                                    {msg.content}
                                </div>
                            ))}
                        </div>
                        <form className="flex p-4 bg-[#f3eaea]" onSubmit={(e) => handleSubmit(e)}>
                            <input
                                type="text"
                                placeholder="Type a message"
                                name='message'
                                className="flex-grow p-[.70rem] border border-[#e0d5d5] rounded-full focus:outline-none focus:ring-2 focus:ring-[#25D366]"
                            />
                            <button
                                type="submit"
                                className="ml-2 sm:ml-4 px-4 sm:px-6 py-2 bg-[#25D366] text-white rounded-full hover:bg-[#128C7E] focus:outline-none focus:ring-2 focus:ring-[#25D366]"
                            >
                                Send
                            </button>
                        </form>
                    </>

                ) : (
                    <div className="flex-grow flex bg-[#e4e4e4] p-4">
                        <p className="text-center m-[auto]">Select a chat to talk to</p>
                    </div>
                )}

            </div>
        </div>
    );
}