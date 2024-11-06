import { useChat } from "@/app/context/chatContext";
import { useSocket } from "@/app/context/socketContext";
import { useEffect, useState } from "react";


const Partner = ({ chat, currentUserId, info }) => {
  const [isPartnerTyping, setIsPartnerTyping] = useState(false)
  console.log('chat:', chat)
  const chatPartner = chat.participants.find((p) => p._id !== currentUserId);
  console.log('chatPartner:', chatPartner)
  const { onlineUsers, socket } = useSocket();
  const isOnline = onlineUsers.includes(chatPartner._id);
  const { setCurrentChat } = useChat()
  useEffect(() => {
    console.log('onlineUsers', onlineUsers);
    console.log('isOnline', isOnline);

    socket.on("TYPING_EVENT", ({ partnerId, isTyping }) => {
      setIsPartnerTyping(isTyping)
    })

    return () => {
      socket.off("TYPING_EVENT");
    }
  }, [socket])


  return (
    <>
      {!info && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
        className={`block md:hidden w-6 h-6 mr-2 cursor-pointer`}
        onClick={() => setCurrentChat(null)}>
        <path d="M20 12H4M10 18L4 12L10 6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>}
      <div className="avatar">
        <div className="w-12 rounded-full">
          <img src={`https://api.multiavatar.com/${chatPartner.email}.svg`} alt='Photo' />
        </div>
      </div>
      <div className="ml-2">
        <h3 className="font-bold">{chatPartner?.name}</h3>
        <p className="text-sm text-gray-600">{info && chat?.lastMessage}</p>
        <p className={`text-[14px] ${isOnline ? 'text-green-400' : 'text-gray-400'}`}>
          {isPartnerTyping ? 'Typing...' : isOnline ? 'Online' : 'Offline'}
        </p>
      </div>
      {info && chat.unread > 0 && (
        <div className="ml-auto bg-blue-500 text-white rounded-full px-2 py-1 text-xs">
          {chat.unread}
        </div>
      )}
    </>
  );
};

export default Partner;
