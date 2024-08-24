'use client';
import React, { useState, useEffect } from 'react';

const ChatInput = ({ onSubmit, onTyping }) => {
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        let typingTimer;
        if (isTyping) {
            onTyping(true);
            typingTimer = setTimeout(() => {
                setIsTyping(false);
                onTyping(false);
            }, 3000);
        }
        return () => clearTimeout(typingTimer);
    }, [isTyping, onTyping]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim()) {
            onSubmit(message);
            setMessage('');
            setIsTyping(false);
            onTyping(false);
        }
    };

    const handleChange = (e) => {
        setMessage(e.target.value);
        if (!isTyping) {
            setIsTyping(true);
        }
    };

    return (
        <form className="flex p-4 bg-[#f3eaea]" onSubmit={handleSubmit}>
            <input
                type="text"
                value={message}
                onChange={handleChange}
                placeholder="Type a message"
                className="flex-grow p-[.70rem] border border-[#e0d5d5] rounded-full focus:outline-none focus:ring-2 focus:ring-[#25D366]"
            />
            <button
                type="submit"
                className="ml-2 sm:ml-4 px-4 sm:px-6 py-2 bg-[#25D366] text-white rounded-full hover:bg-[#128C7E] focus:outline-none focus:ring-2 focus:ring-[#25D366]"
            >
                Send
            </button>
        </form>
    );
};

export default ChatInput;