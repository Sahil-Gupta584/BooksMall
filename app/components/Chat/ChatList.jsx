import React from 'react';

function ChatList() {
  const chats = ['Chat 1', 'Chat 2', 'Chat 3']; // Example chat list

  return (
    <div className="w-full sm:w-1/3 lg:w-1/4 bg-[#f3eaea] border-b sm:border-r border-[#e0d5d5] overflow-y-auto max-h-[30vh] sm:max-h-full">
      {chats.map((chat, index) => (
        <div key={index} className="p-4 border-b border-[#e0d5d5] hover:bg-[#e0d5d5] cursor-pointer">
          {chat}
        </div>
      ))}
    </div>
  );
}

export default ChatList;