import React from 'react';
import ChatInput from './ChatInput';

function ChatWindow() {
  return (
    <div className="w-full sm:w-2/3 lg:w-3/4 flex flex-col h-[70vh] sm:h-full">
      <div className="bg-[#f3eaea] p-4 border-b border-[#e0d5d5]">
        Chat Header
      </div>
      <div className="flex-grow bg-white overflow-y-auto p-4">
        {/* Messages would go here */}
      </div>
      <ChatInput />
    </div>
  );
}

export default ChatWindow;