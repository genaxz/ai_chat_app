'use client';

import React from 'react';
import { useChat } from '@/context/ChatContext';
import { formatDate } from '@/utils/formatDate';

const Sidebar: React.FC = () => {
  const { chats, currentChatId, setCurrentChatId, createNewChat, deleteChat } =
    useChat();

  const handleNewChat = () => {
    createNewChat();
  };

  const handleSelectChat = (id: string) => {
    setCurrentChatId(id);
  };

  const handleDeleteChat = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteChat(id);
  };

  return (
    <aside className="made-c-sidebar made-c-sidebar--light">
      <div className="made-c-sidebar__header">
        <div className="made-c-sidebar__logo">
          <svg
            className="made-c-logo"
            width="180"
            height="32"
            aria-label="AI Chat"
          >
            <text x="0" y="24" className="made-u-text-on-dark made-u-text-bold">
              AI Chat App
            </text>
          </svg>
        </div>
      </div>
      <div className="made-c-sidebar__body">
        <div className="made-u-padding-4">
          <button
            className="made-c-button made-c-button--primary made-c-button--full-width"
            onClick={handleNewChat}
          >
            New Chat
          </button>
        </div>
        <ul className="made-c-sidebar__nav">
          {chats.map((chat) => {
            const isActive = chat.id === currentChatId;
            return (
              <li
                key={chat.id}
                className={`made-c-sidebar__nav-item ${
                  isActive ? 'made-c-sidebar__nav-item--active' : ''
                }`}
                onClick={() => handleSelectChat(chat.id)}
              >
                <div className="made-c-sidebar__nav-link">
                  <div className="made-c-sidebar__nav-link-content">
                    <div className="made-u-text-truncate made-u-text-bold">
                      {chat.title}
                    </div>
                    <div className="made-u-text-small made-u-text-truncate made-u-margin-top-1">
                      {formatDate(chat.updatedAt)}
                    </div>
                  </div>
                  <button
                    className="made-c-button made-c-button--icon made-c-button--transparent"
                    onClick={(e) => handleDeleteChat(e, chat.id)}
                    aria-label="Delete chat"
                  >
                    <svg
                      className="made-c-button__icon"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4h-3.5z"
                      ></path>
                    </svg>
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
