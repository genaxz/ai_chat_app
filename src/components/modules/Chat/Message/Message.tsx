'use client';

import React from 'react';
import { Message as MessageType } from '@/types/chat';
import { formatDate } from '@/utils/formatDate';

interface MessageProps {
  message: MessageType;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div
      className={`made-u-margin-bottom-4 made-u-padding-4 made-u-border-radius-sm ${
        isUser
          ? 'made-u-background-color-primary-02'
          : 'made-u-background-color-neutral-02'
      }`}
    >
      <div className="made-u-display-flex made-u-justify-content-between made-u-align-items-center made-u-margin-bottom-2">
        <div className="made-u-display-flex made-u-align-items-center">
          <div
            className={`made-u-margin-right-2 made-c-avatar made-c-avatar--small ${
              isUser ? 'made-c-avatar--primary' : 'made-c-avatar--secondary'
            }`}
          >
            {isUser ? 'U' : 'AI'}
          </div>
          <div className="made-u-text-bold">{isUser ? 'You' : 'Assistant'}</div>
        </div>
        <div className="made-u-text-small made-u-text-color-neutral-05">
          {formatDate(message.timestamp)}
        </div>
      </div>
      <div className="made-u-font-size-2 made-u-line-height-4">
        {message.content}
      </div>
    </div>
  );
};

export default Message;
