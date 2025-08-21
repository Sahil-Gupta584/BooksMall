import { Link } from "@tanstack/react-router";
import React from "react";
import { FaCircle } from "react-icons/fa";
import type { Chat } from "../../routes/-types";
import { formatTime } from "../../utils/dateUtils";

interface ChatListProps {
  chats: Chat[];
  currentUserId: string;
  isLoading?: boolean;
}

const ChatListSkeleton = () => (
  <div className="divide-y divide-gray-200">
    {[...Array(3)].map((_, index) => (
      <div key={index} className="py-4 px-4 animate-pulse">
        <div className="flex items-start space-x-4">
          <div className="relative">
            <div className="h-12 w-12 rounded-full bg-gray-200" />
            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-gray-200" />
          </div>
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center justify-between">
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-3 bg-gray-200 rounded w-1/4" />
            </div>
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const getStatusColor = (status: string | null) => {
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

export const getStatusText = (status: string | null, lastActive: Date) => {
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

const ChatList: React.FC<ChatListProps> = ({
  chats,
  currentUserId,
  isLoading,
}) => {
  if (isLoading) {
    return <ChatListSkeleton />;
  }

  if (chats.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No conversations yet
        </h3>
        <p className="text-gray-500 mb-4">
          Start a conversation by browsing books and messaging a seller.
        </p>
        <Link to="/" className="btn btn-primary">
          Browse Books
        </Link>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200 p-2">
      {chats.map((chat) => {
        const otherUser = chat.participants.find(
          (p) => p._id !== currentUserId
        );
        const lastMessageTime = otherUser?.lastActive || chat.updatedAt;
        if (!otherUser) return;
        return (
          <Link
            key={chat._id}
            to={`/chats/$sellerId`}
            params={{ sellerId: otherUser._id }}
            className="py-4 px-4 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div className="flex items-start space-x-4">
              <div className="relative">
                <img
                  src={otherUser.image}
                  alt={otherUser.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <FaCircle
                  className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ${getStatusColor(otherUser.status as string)} fill-current`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {otherUser.name}
                  </h3>
                  {lastMessageTime && (
                    <span className="text-xs text-gray-500">
                      {formatTime(new Date(lastMessageTime))}
                    </span>
                  )}
                </div>
                {chat.lastMessage && (
                  <p
                    className={`text-sm truncate ${
                      chat.unreadCount > 0 &&
                      chat.lastMessage.sender._id !== currentUserId
                        ? "font-medium text-gray-900"
                        : "text-gray-500"
                    }`}
                  >
                    {chat.lastMessage.sender._id === currentUserId
                      ? "You: "
                      : ""}
                    {chat.lastMessage.content}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  {getStatusText(
                    otherUser.status as string,
                    otherUser.lastActive
                  )}
                </p>
              </div>
              {chat.unreadCount > 0 &&
                chat.lastMessage &&
                chat.lastMessage.sender._id !== currentUserId && (
                  <span className="flex-shrink-0  h-5 w-5 rounded-full bg-accent-500 text-white text-xs font-medium flex items-center justify-center">
                    {chat.unreadCount}
                  </span>
                )}
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default ChatList;
