'use client';

import React, { useEffect, useRef } from 'react';
import { Message as MessageType } from '@/types/chat';
import Message from '../Message';

interface MessageListProps {
  messages: MessageType[];
  isLoading: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div
      className="made-u-padding-4 made-u-overflow-y-auto"
      style={{ height: 'calc(100vh - 120px)' }}
    >
      {messages.length === 0 ? (
        <div className="made-u-text-align-center made-u-margin-top-6">
          <h2 className="made-u-h2">Welcome to AI Chat</h2>
          <p className="made-u-margin-top-2 made-u-margin-bottom-4">
            Ask me anything, and I'll do my best to help you.
          </p>
        </div>
      ) : (
        messages.map((message) => (
          <Message key={message.id} message={message} />
        ))
      )}

      {isLoading && (
        <div className="made-u-margin-bottom-4 made-u-padding-4 made-u-border-radius-sm made-u-background-color-neutral-02">
          <div className="made-u-display-flex made-u-align-items-center made-u-margin-bottom-2">
            <div className="made-c-avatar made-c-avatar--small made-c-avatar--secondary made-u-margin-right-2">
              AI
            </div>
            <div className="made-u-text-bold">Assistant</div>
          </div>
          <div className="made-u-font-size-2 made-u-line-height-4">
            <div className="made-c-loading-indicator">
              <span className="made-c-loading-indicator__dot"></span>
              <span className="made-c-loading-indicator__dot"></span>
              <span className="made-c-loading-indicator__dot"></span>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
