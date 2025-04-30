import { Message } from '@/types/chat';

export const fetchChatResponse = async (
  messages: Message[]
): Promise<string> => {
  try {
    // Use Next.js 15 App Router API route
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch AI response');
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error in fetchChatResponse:', error);

    // Fallback to a simple response in case of an error
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      return `I received your message: "${lastMessage.content}", but I'm currently having trouble processing it. Please try again later.`;
    } else {
      return 'Hello! How can I assist you today?';
    }
  }
};
