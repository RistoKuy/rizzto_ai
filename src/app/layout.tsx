import type { Metadata } from "next";
import ClientLayout from "../components/ClientLayout";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rizzto AI Chatbot",
  description: "A modern AI chatbot built with Next.js and Tailwind CSS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gray-100 dark:bg-gray-900 font-sans antialiased">
        <ClientLayout>
          <main className="min-h-screen flex flex-col items-center justify-center p-4">
            {children}
          </main>
        </ClientLayout>
      </body>
    </html>
  );
}
