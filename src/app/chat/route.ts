import { NextRequest, NextResponse } from 'next/server';
import { Message } from '@/types/chat';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages } = body as { messages: Message[] };

    // Validate input
    if (!Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    // In a real implementation, you would call your AI service here
    // This is just a simple mock response
    const lastMessage = messages[messages.length - 1];
    const response = `This is a mock response to: "${lastMessage.content}". In a production app, you would replace this with a call to an actual AI service like Claude.`;

    // Simulate a delay to mimic API latency
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error processing chat request:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}
