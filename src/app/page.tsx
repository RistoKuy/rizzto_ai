'use client';

import { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';

interface Message {
  role: 'user' | 'bot';
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      content: 'Hello! I&apos;m Risto&apos;s AI assistant. How can I help you today?'
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!userInput.trim() || isLoading) return;

    const newUserMessage: Message = {
      role: 'user',
      content: userInput
    };

    // Add user message and clear input
    setMessages(prev => [...prev, newUserMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userInput }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      const botMessage: Message = {
        role: 'bot',
        content: data.response || 'Sorry, I couldn&apos;t process your request.'
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        role: 'bot',
        content: 'Sorry, I encountered an error while processing your request. Please try again.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderMessage = (message: Message, index: number) => {
    const htmlContent = marked(message.content);
    
    return (
      <div key={index} className={`mb-6 animate-fade-in-up ${message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}`}>
        <div 
          className={`max-w-[80%] sm:max-w-[70%] p-4 rounded-2xl shadow-lg break-words transition-all duration-200 hover:shadow-xl ${
            message.role === 'user' 
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-sm' 
              : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-sm border-l-4 border-blue-500 dark:border-purple-500'
          }`}
        >
          <div 
            className={message.role === 'user' ? 'prose prose-on-dark' : 'prose'}
            dangerouslySetInnerHTML={{ __html: htmlContent }} 
          />
        </div>
      </div>
    );
  };

  const LoadingIndicator = () => (
    <div className="flex justify-start mb-6">
      <div className="bg-white dark:bg-gray-700 p-4 rounded-2xl rounded-bl-sm border-l-4 border-blue-500 dark:border-purple-500 flex items-center gap-3 shadow-lg">
        <svg className="w-5 h-5 animate-spin text-blue-500 dark:text-purple-400" viewBox="0 0 24 24">
          <circle 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4" 
            fill="none" 
            strokeDasharray="32" 
            strokeLinecap="round"
          />
        </svg>
        <span className="text-gray-600 dark:text-gray-300 italic text-sm">Thinking...</span>
      </div>
    </div>
  );

  return (
    <main className="w-full max-w-4xl h-[90vh] bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-600/20 flex flex-col overflow-hidden transition-all duration-300 hover:shadow-3xl">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 text-center relative shadow-lg">
        <h1 className="text-2xl sm:text-3xl font-light tracking-wider">Risto&apos;s Chatbot</h1>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-700/20 pointer-events-none"></div>
      </header>
      
      {/* Chat Window */}
      <div 
        ref={chatWindowRef}
        className="flex-1 p-4 sm:p-6 overflow-y-auto scroll-smooth scrollbar-custom bg-gradient-to-b from-gray-50/50 to-white/50 dark:from-gray-900/50 dark:to-gray-800/50"
      >
        <div className="space-y-4">
          {messages.map((message, index) => renderMessage(message, index))}
          {isLoading && <LoadingIndicator />}
        </div>
      </div>
      
      {/* Input Container */}
      <footer className="p-4 sm:p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-600/50">
        <div className="flex gap-3 items-end max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <input
              type="text"
              className="w-full px-6 py-4 pr-12 border-2 border-gray-300 dark:border-gray-600 rounded-2xl text-base outline-none transition-all duration-300 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-purple-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-purple-900/30 focus:shadow-lg resize-none disabled:opacity-60 disabled:cursor-not-allowed"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message here..."
              disabled={isLoading}
              maxLength={1000}
            />
            <div className="absolute right-3 bottom-2 text-xs text-gray-400 dark:text-gray-500">
              {userInput.length}/1000
            </div>
          </div>
          <button
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-none px-6 py-4 rounded-2xl cursor-pointer text-base font-semibold transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2 min-w-[100px] justify-center"
            onClick={handleSendMessage}
            disabled={isLoading || !userInput.trim()}
          >
            {isLoading ? (
              <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="32" strokeLinecap="round"/>
              </svg>
            ) : (
              <>
                <span>Send</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </>
            )}
          </button>
        </div>
        
        {/* Footer info */}
        <div className="mt-3 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Press Enter to send • AI responses may take a moment
          </p>
        </div>
      </footer>
    </main>
  );
}
