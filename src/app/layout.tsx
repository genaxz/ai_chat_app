import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ChatProvider } from '@/context/ChatContext';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Chat App',
  description: 'AI Chat application similar to claude.ai',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/Mastercard/made@main/packages/made-css/dist/2.0.0/made.min.css"
        />
        <link
          rel="stylesheet"
          href="https://chttps://cdn.jsdelivr.net/gh/Mastercard/made@main/packages/made-design-tokens/dist/2.2.0/web/themes/b2b/tokens.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/Mastercard/made@main/packages/made-css/dist/2.0.0/made-css-variables.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/Mastercard/made@main/packages/made-css/dist/2.0.0/made-css-variables.min.css"
        />
      </head>
      <body className={`${inter.className} made-u-background-color-neutral-01`}>
        <ChatProvider>{children}</ChatProvider>
      </body>
    </html>
  );
}
