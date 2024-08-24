'use client';
import { addChatPartner, getUser } from '@/app/appwrite/api';
import Chat from '@/app/components/Chat'
import Protect from '@/app/components/Protect'
import { useLayoutEffect } from 'react';

const Page = ({ searchParams, currentUser }) => {

  let currentUserId = currentUser.$id;
  const sellerId = searchParams?.chatId?.split('-')[1];
  useLayoutEffect(() => {
    (async () => {
      if (searchParams.chatId) {
        
        const user = await getUser(currentUser.$id);
        console.log(user)
        user.chatPartners.includes(sellerId) ? null :
        await addChatPartner(currentUser.$id,sellerId);
      }

   })()

  },[])
  return (
    
    <Chat currentUser={currentUser} sellerId={sellerId} />
  )
}

export default Protect(Page);