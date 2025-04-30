'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Chat, ChatContextType, ChatList, Message } from '@/types/chat';
import { fetchChatResponse } from '@/services/chatService';

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [chats, setChats] = useState<ChatList>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Load chats from localStorage on initial render
  useEffect(() => {
    const savedChats = localStorage.getItem('chats');
    const savedCurrentChatId = localStorage.getItem('currentChatId');

    if (savedChats) {
      setChats(JSON.parse(savedChats));
    }

    if (savedCurrentChatId) {
      setCurrentChatId(savedCurrentChatId);
    }
  }, []);

  // Save chats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chats', JSON.stringify(chats));
  }, [chats]);

  // Save currentChatId to localStorage whenever it changes
  useEffect(() => {
    if (currentChatId) {
      localStorage.setItem('currentChatId', currentChatId);
    } else {
      localStorage.removeItem('currentChatId');
    }
  }, [currentChatId]);

  const createNewChat = (): string => {
    const timestamp = Date.now();
    const newChat: Chat = {
      id: uuidv4(),
      title: 'New chat',
      messages: [],
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    setChats((prevChats) => [newChat, ...prevChats]);
    setCurrentChatId(newChat.id);
    return newChat.id;
  };

  const sendMessage = async (content: string): Promise<void> => {
    if (!currentChatId) {
      const newChatId = createNewChat();
      await addMessage(newChatId, 'user', content);
    } else {
      await addMessage(currentChatId, 'user', content);
    }
  };

  const addMessage = async (
    chatId: string,
    role: 'user' | 'assistant',
    content: string
  ): Promise<void> => {
    const message: Message = {
      id: uuidv4(),
      role,
      content,
      timestamp: Date.now(),
    };

    setChats((prevChats) => {
      const updatedChats = prevChats.map((chat) => {
        if (chat.id === chatId) {
          // Update chat title if it's the first user message
          let title = chat.title;
          if (chat.messages.length === 0 && role === 'user') {
            title =
              content.length > 30 ? `${content.substring(0, 30)}...` : content;
          }

          return {
            ...chat,
            title,
            messages: [...chat.messages, message],
            updatedAt: Date.now(),
          };
        }
        return chat;
      });

      return updatedChats;
    });

    // If user message, get AI response
    if (role === 'user') {
      await getAiResponse(chatId);
    }
  };

  const getAiResponse = async (chatId: string): Promise<void> => {
    const chat = chats.find((c) => c.id === chatId);
    if (!chat) return;

    setIsLoading(true);
    try {
      const response = await fetchChatResponse(chat.messages);
      await addMessage(chatId, 'assistant', response);
    } catch (error) {
      console.error('Error fetching AI response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteChat = (id: string): void => {
    setChats((prevChats) => prevChats.filter((chat) => chat.id !== id));

    if (currentChatId === id) {
      const remainingChats = chats.filter((chat) => chat.id !== id);
      setCurrentChatId(remainingChats.length > 0 ? remainingChats[0].id : null);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        currentChatId,
        setCurrentChatId,
        createNewChat,
        sendMessage,
        isLoading,
        deleteChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
