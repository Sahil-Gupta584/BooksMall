import type { Chat, Message, User } from "@/-types";
import { formatTime } from "@/lib/dateUtils";
import { addToast, Button } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { FaCircle } from "react-icons/fa6";
import { FiSend } from "react-icons/fi";
import { axiosInstance } from "../../lib/axiosInstance";

interface ChatWindowProps {
  chatId: string;
  currentUserId: string;
  otherUser: User;
  messages: Message[] | null;
  setMessages: React.Dispatch<React.SetStateAction<Message[] | null>>;
  isPending: boolean;
  ws: WebSocket;
  activeChat: Chat;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  chatId,
  currentUserId,
  otherUser,
  isPending,
  messages,
  ws,
  setMessages,
  activeChat,
}) => {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  const { mutateAsync, isPending: isSendingMessage } = useMutation({
    mutationFn: async ({ message }: { message: Message }) => {
      return (await axiosInstance.post("/api/chats/sendMessage", { message }))
        .data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      if (ws.readyState !== ws.OPEN) window.location.reload();
      e.preventDefault();
      if (!newMessage.trim()) return;
      setNewMessage("");

      if (!chatId || !otherUser) return;

      const receiver = activeChat.participants.find(
        (p) => p._id !== currentUserId
      );

      const sender = activeChat.participants.find(
        (p) => p._id === currentUserId
      );
      if (!sender || !receiver) return;
      const newMessageInstance: Message = {
        content: newMessage,
        chatId: chatId,
        status: "sent" as const,
        _id: "temp-" + Date.now(),
        createdAt: new Date(),
        updatedAt: new Date(),
        receiver,
        sender,
      };
      setMessages((prev) => (prev ? [...prev, newMessageInstance] : prev));
      const res = await mutateAsync({ message: newMessageInstance });
      ws.send(
        JSON.stringify({
          type: "message",
          payload: { message: newMessageInstance },
        })
      );
      if (!res.ok) {
        addToast({ color: "danger", title: "Failed to send message" });
      }
    } catch (error) {
      console.log(error);
      addToast({ color: "danger", title: "Failed to send message" });
    }
  };

  const goBack = () => {
    navigate({ to: "/chats" });
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "online":
        return "text-green-500";
      case "offline":
        return "text-gray-400";
      case "typing":
        return "text-blue-500";
      default:
        return "text-gray-400";
    }
  };

  const getStatusText = (status: string | null, lastActive: Date) => {
    switch (status) {
      case "online":
        return "Online";
      case "typing":
        return "Typing...";
      case "offline":
        return `Last seen ${new Date(lastActive).toLocaleString()}`;
      default:
        return "Offline";
    }
  };

  const groupedMessages = useMemo(() => {
    if (!messages) return {};

    return messages.reduce(
      (acc, message) => {
        const date = new Date(message.createdAt).toLocaleDateString();
        if (!acc[date]) acc[date] = [];
        acc[date].push(message);
        return acc;
      },
      {} as { [key: string]: Message[] }
    );
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center p-4 border-b bg-white shadow-sm">
        <button
          onClick={goBack}
          className="md:hidden mr-2 p-1 rounded-full hover:bg-gray-100"
        >
          <FaArrowLeft className="h-5 w-5 text-gray-500" />
        </button>
        <div className="relative">
          <img
            src={otherUser.image ?? ""}
            alt={otherUser.name}
            className="h-10 w-10 rounded-full object-cover"
          />
          <FaCircle
            className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ${getStatusColor(otherUser.status as string)} fill-current`}
          />
        </div>
        <div className="ml-3 flex-1">
          <div className="flex items-center">
            <h3 className="font-medium text-gray-900">{otherUser.name}</h3>
          </div>
          <div className="flex items-center text-sm">
            <span
              className={`${getStatusColor(otherUser.status || "offline")}`}
            >
              {getStatusText(otherUser.status as string, otherUser.lastActive)}
            </span>
            <span className="mx-2 text-gray-300">•</span>
            {/* <span className="text-gray-500">{otherUser.booksCount} books</span> */}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        className=" overflow-y-auto p-4 space-y-6 h-[600px]"
        ref={messagesEndRef}
      >
        {isPending ? (
          <MessageSkeleton />
        ) : (
          Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date}>
              <div className="flex justify-center mb-4">
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                  {date}
                </span>
              </div>
              <div className="space-y-3">
                {dateMessages.map((message) => (
                  <div
                    key={message._id}
                    className={`flex ${message.sender._id === currentUserId ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-2 rounded-lg ${
                        message.sender._id === currentUserId
                          ? "chat-bubble-sender"
                          : "chat-bubble-receiver"
                      }`}
                    >
                      <p className="text-gray-800">{message.content}</p>
                      <p className="text-right text-xs text-gray-500 mt-1">
                        {formatTime(new Date(message.createdAt))}

                        {/* Status icon or text for current user's message */}
                        {message.sender._id === currentUserId && (
                          <span className="ml-1">
                            {message.status === "sent" && "✓"}
                            {message.status === "seen" && (
                              <span className="text-blue-500">✓✓</span>
                            )}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
        <div className="flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="input flex-1 mr-2"
            disabled={isPending}
          />
          <Button
            isLoading={isSendingMessage}
            type="submit"
            className=" cursor-pointer rounded-full bg-primary-500 text-white disabled:opacity-50 hover:bg-primary-600 transition-colors"
            isDisabled={!newMessage.trim()}
            isIconOnly
          >
            <FiSend className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </div>
  );
};

const MessageSkeleton = () => (
  <div className="space-y-6">
    {[...Array(3)].map((_, groupIndex) => (
      <div key={groupIndex}>
        <div className="flex justify-center mb-4">
          <div className="h-5 w-20 bg-gray-200 rounded-full animate-pulse" />
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, messageIndex) => {
            const isRight = (messageIndex + groupIndex) % 2 === 0;
            return (
              <div
                key={messageIndex}
                className={`flex ${isRight ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-lg ${
                    isRight ? "bg-gray-200" : "bg-gray-100"
                  } animate-pulse`}
                >
                  <div className="h-4 w-32 bg-gray-300 rounded mb-2" />
                  <div className="h-3 w-16 bg-gray-300 rounded" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    ))}
  </div>
);

export default ChatWindow;
