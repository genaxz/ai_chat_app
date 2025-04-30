'use client';

import { useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ChatPanel from '@/components/layout/ChatPanel';
import { useChat } from '@/context/ChatContext';

export default function Home() {
  const { chats, createNewChat } = useChat();

  // Create a new chat if there are no chats
  useEffect(() => {
    if (chats.length === 0) {
      createNewChat();
    }
  }, [chats.length, createNewChat]);

  return (
    <MainLayout>
      <ChatPanel />
    </MainLayout>
  );
}
