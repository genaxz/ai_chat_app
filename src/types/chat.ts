export type MessageRole = 'user' | 'assistant';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export type ChatList = Chat[];

export interface ChatContextType {
  chats: ChatList;
  currentChatId: string | null;
  setCurrentChatId: (id: string | null) => void;
  createNewChat: () => string;
  sendMessage: (content: string) => Promise<void>;
  isLoading: boolean;
  deleteChat: (id: string) => void;
}
