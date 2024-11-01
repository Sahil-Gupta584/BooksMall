'use client';
import { getChat, getCurrUser } from '@/app/appwrite/api';
import Chat from '@/app/components/Chat'
import { useLayoutEffect, useState } from 'react';
import { useSocket } from '../context/socketContext';

const Page = ({ searchParams }) => {
  
  const [chat, setChat] = useState(false);
  const [isLoading, setisLoading] = useState(true);
  const chatId = searchParams?.chatId;
  const sellerId = searchParams?.sellerId;
  const { currUser } = useSocket();
  useLayoutEffect(() => {
    (async () => {
      if (searchParams.chatId) {
        console.log('initilChat:',true);
        console.log('chatId',chatId);
        
        const newChat = await getChat(chatId, sellerId , currUser._id);        
        setChat(newChat);
        setisLoading(false);
      } else {
        console.log('initilChat:',false);
        setisLoading(false)
      }
    })()

  }, [chatId, sellerId]);

  if (isLoading) {
    return <div className="isLoading universal isLoading-spinner h-[91vh] w-[100vw] "></div>;
  }

  if (!isLoading) {

    return (
      <Chat initialChat={chat} />
    )
  }
}

export default Page;