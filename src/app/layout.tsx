import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PromptHub",
  description:
    "PromptHub is an AI programming prompt asset management platform for discovering, organizing, and reusing high quality prompts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
