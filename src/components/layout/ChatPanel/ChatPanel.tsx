'use client';

import React from 'react';
import { useChat } from '@/context/ChatContext';
import MessageList from '@/components/modules/Chat/MessageList';
import ChatInput from '@/components/modules/Chat/ChatInput';

const ChatPanel: React.FC = () => {
  const { chats, currentChatId, sendMessage, isLoading } = useChat();

  // Find the current chat
  const currentChat = currentChatId
    ? chats.find((chat) => chat.id === currentChatId)
    : null;
  const messages = currentChat ? currentChat.messages : [];

  const handleSendMessage = async (content: string) => {
    await sendMessage(content);
  };

  return (
    <div className="made-u-flex-grow-1 made-u-display-flex made-u-flex-direction-column">
      <div className="made-u-flex-grow-1 made-u-overflow-hidden">
        <MessageList messages={messages} isLoading={isLoading} />
      </div>
      <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default ChatPanel;
