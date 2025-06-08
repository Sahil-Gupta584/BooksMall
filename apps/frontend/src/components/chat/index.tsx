import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { BiMessageSquare } from "react-icons/bi";
import { backendUrl, useSession } from "../../lib/auth";
import { axiosInstance } from "../../lib/axiosInstance";
import type { Chat, Message, User } from "../../routes/-types";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";

export function ChatSection({ sellerId }: { sellerId: string }) {
  const { data } = useSession();
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [userChats, setUserChats] = useState<Chat[] | null>(null);
  const userChatsRef = useRef<Chat[] | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);

  const { isPending, isFetching } = useQuery({
    queryKey: ["getUserChats"],
    queryFn: async () => {
      const response = await axiosInstance.post("/api/chats/getUserChats", {
        userId: data?.user.id,
      });

      const chats: Chat[] = response.data;
      if (chats.length > 0 && !sellerId) {
        setOtherUser(
          chats[0].participants.find((p) => p._id !== data?.user.id) as User
        );
      }
      if (chats.length !== userChatsRef.current?.length) {
        setUserChats(chats);
      }

      return chats;
    },
    enabled: !!data?.user.id,
  });

  //set active chat according to sellerId in url
  const activeChat = useMemo(() => {
    return userChats?.find((chat) =>
      chat.participants.some((p) => p._id === sellerId)
    );
  }, [userChats, sellerId, isFetching]);

  //update events when activeChat changes
  useEffect(() => {
    userChatsRef.current = userChats;

    setUserChats((prev) =>
      prev
        ? prev.map((c) => {
            if (c._id === activeChat?._id) c.unreadCount = 0;
            return c;
          })
        : prev
    );
    if (activeChat && ws?.readyState === ws?.OPEN) {
      setOtherUser(
        activeChat.participants.find((p) => p._id !== data?.user.id) as User
      );
      ws?.send(JSON.stringify({ type: "seen", payload: { chat: activeChat } }));
      axiosInstance.post("/api/chats/updateSeen", {
        chat: activeChat,
        userId: data?.user.id,
      });
    }
  }, [sellerId, activeChat, ws, data]);

  //all the ws logics
  useEffect(() => {
    if (!data?.user.id) return;
    const socket = new WebSocket(backendUrl);
    socket.onopen = () => {
      console.log("connected to socket");
      if (socket.readyState !== socket.OPEN) return;
      setWs(socket);
      socket.send(
        JSON.stringify({ type: "online", payload: { userId: data?.user.id } })
      );
    };

    socket.onmessage = (event) => {
      const { type, payload } = JSON.parse(event.data);
      console.log({ type, payload });

      switch (type) {
        case "online": {
          const userId = payload.userId;
          const userChat = userChatsRef.current?.find((c) =>
            c.participants.some((p) => p._id === userId)
          );

          if (!userChat) break;

          setUserChats((prev) =>
            prev
              ? prev.map((c) => {
                  if (c._id === userChat._id) {
                    c.participants.forEach((p) => {
                      if (p._id === userId) {
                        console.log("updating status for user", p.email);

                        p.status = "online";
                      }
                    });
                  }
                  return c;
                })
              : prev
          );
          break;
        }
        case "message": {
          const msgChat = userChatsRef.current?.find(
            (c) => c._id === payload.message.chatId
          );

          if (!msgChat) return;
          if (msgChat._id === activeChat?._id) {
            setMessages((prev) => [...(prev ?? []), payload.message]);
            socket.send(
              JSON.stringify({
                type: "seen",
                payload: { chat: activeChat, userId: data.user.id },
              })
            );
            axiosInstance.post("/api/chats/updateSeen", {
              chat: activeChat,
              userId: data?.user.id,
            });

            setUserChats((prev) =>
              prev
                ? prev?.map((c) => {
                    if (c._id === msgChat._id) {
                      return {
                        ...c,
                        lastMessage: payload.message,
                      };
                    }
                    return c;
                  })
                : prev
            );
            break;
          }
          setUserChats((prev) =>
            prev
              ? prev?.map((c) => {
                  if (c._id === msgChat._id) {
                    return {
                      ...c,
                      unreadCount: c.unreadCount + 1,
                      lastMessage: payload.message,
                    };
                  }
                  return c;
                })
              : prev
          );

          break;
        }
        case "seen":
          if (activeChat?._id !== payload.chat._id) return;
          setMessages((prev) =>
            prev
              ? prev.map((msg) =>
                  msg.sender._id === data.user.id
                    ? { ...msg, status: "seen" }
                    : msg
                )
              : prev
          );
          setUserChats((prev) =>
            prev
              ? prev.map((c) => {
                  if (c._id === payload.chat._id) {
                    c.unreadCount = 0;
                  }
                  return c;
                })
              : prev
          );
          break;
      }
    };
    const handleBeforeUnload = () => {
      if (socket.readyState !== socket.OPEN) return;

      socket.send(
        JSON.stringify({
          type: "offline",
          payload: {
            userId: data?.user.id,
            lastActive: new Date().toISOString(),
          },
        })
      );
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      handleBeforeUnload(); // also call manually on cleanup
      socket.close();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [data?.user.id, activeChat]);

  const getChatMessagesQuery = useQuery({
    queryKey: ["getChatMessages"],
    queryFn: async (): Promise<Message[]> => {
      const msgs = await axiosInstance.post("/api/chats/getChatMessages", {
        chatId: activeChat?._id,
      });
      setMessages(msgs.data);
      return msgs.data;
    },
    enabled: !!activeChat?._id,
  });

  if (isPending) <ChatSectionLoadingSkeleton />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-serif font-bold text-gray-900 mb-6">
        My Chats
      </h1>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden min-h-[600px] border border-gray-200">
        {Array.isArray(userChats) && userChats.length > 0 ? (
          <div className="md:grid md:grid-cols-3 h-full">
            {/* Chat list - Hidden on mobile when a chat is active */}
            <div
              className={`${sellerId ? "hidden" : "block"} md:block md:col-span-1 border-r border-gray-200 h-full overflow-y-auto`}
            >
              <ChatList
                chats={userChats as Chat[]}
                currentUserId={data?.user.id as string}
                isLoading={isPending}
              />
            </div>

            {/* Active chat */}
            <div
              className={`${!sellerId ? "hidden" : "block"} md:block md:col-span-2 h-full`}
            >
              {activeChat && otherUser && ws ? (
                <ChatWindow
                  chatId={activeChat._id as string}
                  currentUserId={data?.user.id as string}
                  otherUser={otherUser}
                  isPending={getChatMessagesQuery.isPending}
                  messages={messages}
                  ws={ws}
                  activeChat={activeChat}
                  setMessages={setMessages}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <p className="text-gray-500">
                    Select a conversation or start a new one
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-96">
            <BiMessageSquare className="h-16 w-16 text-gray-300 mb-4" />
            <h2 className="text-xl font-medium text-gray-700 mb-2">
              No messages yet
            </h2>
            <p className="text-gray-500 text-center max-w-md mb-6">
              Start a conversation by browsing books and messaging a seller.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function ChatSectionLoadingSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-serif font-bold text-gray-900 mb-6">
        My Chats
      </h1>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden min-h-[600px] border border-gray-200">
        <div className="md:grid md:grid-cols-3 h-[600px]">
          <div className="md:col-span-1 border-r border-gray-200 h-full overflow-y-auto">
            <ChatList chats={[]} currentUserId={""} isLoading={true} />
          </div>
          <div className="hidden md:block md:col-span-2 h-full">
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <BiMessageSquare className="h-12 w-12 text-gray-300 mb-4" />
              <p>Select a conversation to start messaging</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
