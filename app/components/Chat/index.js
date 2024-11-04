import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { useSocket } from "@/app/context/socketContext";
import { getPreviousMessages, uploadMessage, updateMessageSeen, addChatToUser } from "@/app/actions/api";
import Partner from "./Partner";
import { getTimeElapsed } from "@/app/resource";
import { useChat } from "@/app/context/chatContext";

export default function Chat({ initialChat }) {
    const currentChatRef = useRef(null); // Use ref for currentChat
    const [isTyping, setIsTyping] = useState(false)
    const { setChats, chats, currentChat, setCurrentChat, messages, setMessages } = useChat();
    const { socket, onlineUsers,currUser } = useSocket();

    const TYPING_TIMER_LENGTH = 800; // 500ms
    let typingTimer;

    const messagesEndRef = useRef(null);

    useEffect(() => {
        (async () => {
            console.log('currUser',currUser);
            
            console.log('chats:', chats);

            if (initialChat) {
                console.log('initialChat:', initialChat)

                setChats((prevChats) => {
                    if (!prevChats.includes(initialChat)) 
                        return [initialChat, ...prevChats]
                    
                    return [...prevChats]
                })

                setCurrentChat(initialChat);
                const res = await getPreviousMessages(initialChat._id);
                setMessages(res);
                await addChatToUser(currUser._id,initialChat._id)
            }
        })()
    }, [])

    useLayoutEffect(() => {
        // scrollToBottom
        (() => {
            if (messagesEndRef.current) {
                messagesEndRef.current.scrollIntoView({ behavior: "auto" });
            }
        })()
    }, [messages]);

    // Update currentChatRef whenever currentChat changes
    useEffect(() => {
        currentChatRef.current = currentChat;
        console.log('resetting unread')
        setChats(prevChats =>
            prevChats.map(chat =>
                chat._id === currentChat?._id ? { ...chat, unread: 0 } : chat
            )
        );
    }, [currentChat]);



useEffect(()=> console.log('chats from effect:',chats),[chats])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const content = e.target.elements.message.value;
        if (!content.trim()) return;
        const receiver = currentChatRef.current.participants.find((p) => p._id !== currUser._id);

        const newMessage = {
            senderId: currUser._id,
            receiverId: receiver._id,
            content,
            chatId: currentChatRef.current._id,
            status: "sent",
            timestamp: Date.now().toString(),
        };

        setMessages((prevMessages) => [...prevMessages, newMessage]);
        e.target.elements.message.value = "";

        await uploadMessage(newMessage);
        socket.emit("SEND_MESSAGE", newMessage);
        console.log('send message event emitted')

    };

    function handleChange(params) {

        const partnerId = currentChatRef.current.participants.find((p) => p._id !== currUser._id)._id
        console.log('partnerId:', partnerId)

        if (!isTyping) {
            setIsTyping(true);
            socket.emit("TYPING_EVENT", { partnerId, isTyping: true });
            console.log('typing event emitted')
        }

        // Clearing timeout to prevent long queues in event loop!
        clearTimeout(typingTimer);
        typingTimer = setTimeout(() => {
            setIsTyping(false);
            socket.emit('TYPING_EVENT', { partnerId, isTyping: false });
        }, TYPING_TIMER_LENGTH);


    }

    const handlePartnerClick = async (chat) => {
        console.log('updating currentChat!');
        
        setCurrentChat(chat);

        const previousMessages = await getPreviousMessages(chat._id);
        setMessages(previousMessages);
        console.log('previousMessages:', previousMessages)

        const partnerId = chat.participants.find((p) => p._id !== currUser._id)._id

        if (onlineUsers.includes(partnerId)) {
            console.log('updating seen for online partner', partnerId)
            socket.emit("SEEN_MESSAGE", { chatId: currentChatRef.current._id, partnerId: partnerId });
            console.log('seen message event emitted');
        } else {
            console.log('updating seen for offline partner')
            await updateMessageSeen(chat._id);
        }


    };

    return (
        <div className="flex h-[91vh] bg-[#f3eaea]">
            <div className={`md:block ${currentChat ? 'hidden' : 'w-full'} w-1/4 bg-[#f3eaea] border-r border-[#e0d5d5] overflow-y-auto"`}>
                {chats?.length > 0 ? chats.map((chat, i) => {
                    console.log('chats', chats);

                    console.log('chat', i, chat);

                    return (
                        <div
                            className={`p-4 flex ${currentChat?._id === chat?._id ? "bg-[#e0d5d5]" : ""
                                } items-center gap-2 border-b border-[#e0d5d5] hover:bg-[#e0d5d5] cursor-pointer`}
                            onClick={() => handlePartnerClick(chat)}
                            key={i}
                        >
                            <Partner chat={chat} currentUserId={currUser._id} info={true} />
                        </div>
                    )
                }) : (
                    <p className="font-bold text-xl">Oops, You don have any past converations</p>
                )}
            </div>
            <div className={`md:w-3/4 ${!currentChat ? 'hidden' : ''} w-full flex flex-col`}>
                {currentChat ? (
                    <>
                        <div className="flex items-center font-bold gap-2 bg-[#f3eaea] p-2 border-b border-[#e0d5d5]">
                            <Partner chat={currentChat} currentUserId={currUser._id} />
                        </div>
                        <div className="message-box flex-grow bg-[#e4e4e4] overflow-y-auto py-4 px-1">
                            {messages.map((msg, index) => (
                                <div
                                    className={`mb-4 flex flex-col ${msg.senderId === currUser._id ? " items-end" : "items-start"}`}
                                    id={msg.timestamp}
                                    key={index}
                                >
                                    <span className="text-[9px] text-gray-500">{getTimeElapsed(msg.timestamp)}</span>
                                    <div
                                        className={`w-fit p-4 ${msg.senderId === currUser._id
                                            ? "bg-[#d97f02] rounded-tl-3xl rounded-tr-2xl rounded-bl-3xl"
                                            : "bg-[#f3aa4b] rounded-tl-2xl rounded-tr-3xl rounded-br-3xl"
                                            } break-all`}
                                    >
                                        {msg.content}
                                    </div>
                                    {msg.senderId === currUser._id && <span className="text-[13px]">{msg.status}</span>}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />

                        </div>
                        <form className="flex p-4 bg-[#f3eaea]" onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Type a message"
                                name="message"
                                className="flex-grow p-[.70rem] border border-[#e0d5d5] rounded-full focus:outline-none focus:ring-2 focus:ring-[#25D366]"
                                onChange={handleChange}
                            />
                            <button
                                type="submit"
                                className="ml-4 px-6 py-2 bg-[#25D366] text-white rounded-full hover:bg-[#128C7E] focus:outline-none focus:ring-2 focus:ring-[#25D366]"
                            >
                                Send
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="md:block hidden flex-grow flex bg-[#e4e4e4] p-4">
                        <p className="text-center m-auto">Select a chat to start talking</p>
                    </div>
                )}
            </div>
        </div>
    );
}
