'use client';
import { getChat } from '@/app/appwrite/api';
import Chat from '@/app/components/Chat'
import Protect from '@/app/components/Protect'
import { useLayoutEffect, useState } from 'react';

const Page = ({ searchParams, currentUser }) => {
  
  const [chat, setChat] = useState(false);
  const [isLoading, setisLoading] = useState(true)
  const chatId = searchParams?.chatId;
  const sellerId = searchParams?.sellerId;

  useLayoutEffect(() => {
    (async () => {
      if (searchParams.chatId) {

        const newChat = await getChat(chatId, sellerId, currentUser);
        setChat(newChat);
        setisLoading(false)
      } else {
        setisLoading(false)
      }
    })()

  }, [chatId, sellerId, currentUser]);

  if (isLoading) {
    return <div className="isLoading universal isLoading-spinner h-[91vh] w-[100vw] "></div>;
  }

  if (!isLoading) {

    return (

      <Chat currentUser={currentUser} initialChat={chat} />
    )
  }
}

export default Protect(Page);