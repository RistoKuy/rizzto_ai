'use client';

import { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';
import { useSettings } from '@/hooks/useSettings';
import SettingsModal from '@/components/SettingsModal';
import SettingsInfo from '@/components/SettingsInfo';

interface Message {
  role: 'user' | 'bot';
  content: string;
  isStreaming?: boolean; // Flag to indicate if message is still being streamed
}

export default function Home() {
  const { settings, toggleSettings } = useSettings();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      content: 'Hello! I&apos;m Risto&apos;s AI assistant. How can I help you today?'
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessageIndex, setStreamingMessageIndex] = useState<number | null>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change or during streaming
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages, isLoading, streamingMessageIndex]);

  const handleSendMessage = async () => {
    if (!userInput.trim() || isLoading) return;

    const newUserMessage: Message = {
      role: 'user',
      content: userInput
    };

    // Add user message and clear input
    setMessages(prev => [...prev, newUserMessage]);
    const currentInput = userInput;
    setUserInput('');
    setIsLoading(true);

    // Add empty bot message for streaming
    const botMessageIndex = messages.length + 1;
    setMessages(prev => [...prev, { 
      role: 'bot', 
      content: '', 
      isStreaming: true 
    }]);
    setStreamingMessageIndex(botMessageIndex);

    try {
      // Get conversation history based on contextWindow setting and mode
      let conversationHistory: Message[];
      
      if (settings.contextMode === 'tokens') {
        // For token-based context, we'll send all recent messages and let the API handle token limiting
        // This is a simplified approach - in a production app, you'd want to estimate tokens more precisely
        const maxMessages = Math.min(messages.length, 100); // Reasonable upper limit
        conversationHistory = messages.slice(-maxMessages);
      } else {
        // For message-based context, limit by number of messages
        conversationHistory = messages.slice(-(settings.contextWindow || 10));
      }
      
      // Map our internal message format to the API format
      const apiMessages = conversationHistory.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));
      
      // Make the API request with streaming enabled
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: currentInput,
          settings: settings,
          history: apiMessages
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              
              if (data === '[DONE]') {
                break;
              }

              try {
                const parsed = JSON.parse(data);
                const content = parsed.content;
                
                if (content) {
                  accumulatedContent += content;
                  
                  // Update the streaming message in real-time
                  setMessages(prev => prev.map((msg, index) => 
                    index === botMessageIndex 
                      ? { ...msg, content: accumulatedContent, isStreaming: true }
                      : msg
                  ));
                }
              } catch {
                // Skip invalid JSON lines
                continue;
              }
            }
          }
        }
      }

      // Mark streaming as complete
      setMessages(prev => prev.map((msg, index) => 
        index === botMessageIndex 
          ? { ...msg, content: accumulatedContent || 'Sorry, I couldn\'t process your request.', isStreaming: false }
          : msg
      ));

    } catch (error) {
      console.error('Error:', error);
      
      // Replace streaming message with error message
      setMessages(prev => prev.map((msg, index) => 
        index === botMessageIndex 
          ? { 
              ...msg, 
              content: 'Sorry, I encountered an error while processing your request. Please try again.',
              isStreaming: false 
            }
          : msg
      ));
    } finally {
      setIsLoading(false);
      setStreamingMessageIndex(null);
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
          {/* Show typing indicator for streaming messages */}
          {message.isStreaming && (
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-blue-500 dark:bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-blue-500 dark:bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-blue-500 dark:bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 italic">generating...</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <main className="w-full max-w-4xl h-[90vh] bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-600/20 flex flex-col overflow-hidden transition-all duration-300 hover:shadow-3xl">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 text-center relative shadow-lg flex justify-between items-center">
        <div className="w-8"> {/* Spacer */}</div>
        <h1 className="text-2xl sm:text-3xl font-light tracking-wider">Risto&apos;s Chatbot</h1>
        <button 
          onClick={toggleSettings}
          className="w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full transition-all duration-300"
          aria-label="Open settings"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
        </button>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-700/20 pointer-events-none"></div>
      </header>
      
      {/* Chat Window */}
      <div 
        ref={chatWindowRef}
        className="flex-1 p-4 sm:p-6 overflow-y-auto scroll-smooth scrollbar-custom bg-gradient-to-b from-gray-50/50 to-white/50 dark:from-gray-900/50 dark:to-gray-800/50"
      >
        <div className="space-y-4">
          {messages.map((message, index) => renderMessage(message, index))}
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
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Press Enter to send • AI responses may take a moment
          </p>
          <SettingsInfo />
        </div>
      </footer>
      
      {/* Settings Modal */}
      <SettingsModal />
    </main>
  );
}
