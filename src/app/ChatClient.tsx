"use client";

import { useState, useEffect } from "react";
import { useUser, useClerk, SignedIn, UserButton } from '@clerk/nextjs'; // Added SignedIn and UserButton import

// Define types for our chat data
interface Chat {
  id: number;
  title: string;
  responses: any[];
}

export default function ChatClient() {
  const { user } = useUser();
  const { signOut } = useClerk(); // Added useClerk hook
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [chatHistory, setChatHistory] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);
  const [showGreenLine, setShowGreenLine] = useState(false);

  const maxMessages = 3;

  // Initialize with a default chat
  useEffect(() => {
    const initialChat: Chat = { 
      id: 1, 
      title: "New Chat", 
      responses: [] 
    };
    setChatHistory([initialChat]);
    setCurrentChatId(1);
  }, []);

  // Get current chat responses
  const currentChat = chatHistory.find(chat => chat.id === currentChatId);
  const responses = currentChat ? currentChat.responses : [];

  const startNewChat = () => {
    if (messageCount >= maxMessages) {
      setShowLimitModal(true);
      return;
    }
    
    // Show green line animation
    setShowGreenLine(true);
    
    const newChatId = Date.now();
    const newChat: Chat = { 
      id: newChatId, 
      title: "New Chat", 
      responses: [] 
    };
    
    setChatHistory(prev => [...prev, newChat]);
    setCurrentChatId(newChatId);
    setMessage("");
    
    // Hide green line after animation completes
    setTimeout(() => setShowGreenLine(false), 1000);
  };

  const switchChat = (chatId: number) => {
    setCurrentChatId(chatId);
    setMessage("");
  };

  const deleteChat = (chatId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the chat switch
    
    if (chatHistory.length <= 1) {
      // Don't allow deleting the last chat
      return;
    }
    
    setChatHistory(prev => prev.filter(chat => chat.id !== chatId));
    
    // If we're deleting the current chat, switch to the first available chat
    if (currentChatId === chatId) {
      const remainingChats = chatHistory.filter(chat => chat.id !== chatId);
      setCurrentChatId(remainingChats[0].id);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || messageCount >= maxMessages) {
      setShowLimitModal(true);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ messages: [{ role: "user", content: message }] }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to get response");

      const data = await res.json();
      
      // Update the current chat with the new response
      setChatHistory(prev => 
        prev.map(chat => 
          chat.id === currentChatId 
            ? { ...chat, responses: [...chat.responses, data] } 
            : chat
        )
      );
      
      setMessageCount((prev) => prev + 1);
      
      // Update chat title with first message if it's the default title
      if (message.trim() && currentChat?.title === "New Chat") {
        const newTitle = message.length > 20 ? `${message.substring(0, 20)}...` : message;
        setChatHistory(prev => 
          prev.map(chat => 
            chat.id === currentChatId ? { ...chat, title: newTitle } : chat
          )
        );
      }
    } catch (err) {
      // Add error to current chat responses
      setChatHistory(prev => 
        prev.map(chat => 
          chat.id === currentChatId 
            ? { ...chat, responses: [...chat.responses, { error: "Something went wrong." }] } 
            : chat
        )
      );
      console.error("Chat error:", err);
    } finally {
      setLoading(false);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

useEffect(() => {
  if (showLimitModal) {
    const timeout = setTimeout(() => setShowLimitModal(false), 3000);
    return () => clearTimeout(timeout);
  }
}, [showLimitModal]);

  return (
    <div className="h-screen flex bg-black text-white overflow-hidden">
      {/* Green Line Animation */}
      {showGreenLine && (
        <div className="fixed top-0 left-0 w-full h-1 bg-green-500 z-50 animate-green-line"></div>
      )}
      
      {/* Add custom animation to CSS */}
      <style jsx>{`
        @keyframes greenLine {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-green-line {
          animation: greenLine 1s ease-in-out forwards;
        }
      `}</style>

      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-[#121212] border-r border-gray-800 flex flex-col transition-all duration-300`}>
        {/* Toggle Button */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-4 text-gray-400 hover:text-white transition-colors"
        >
          {isSidebarOpen ? '←' : '→'}
        </button>
        
        {/* Sidebar Content */}
        {isSidebarOpen && (
          <>
            <div className="p-4">
              <h1 className="text-xl font-bold mb-6">AI Fiesta</h1>
              
              <button 
                onClick={startNewChat}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md mb-8 flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105"
              >
                <span>+</span>
                <span>New Chat</span>
              </button>
              
              <div className="mb-6">
                <h2 className="text-sm uppercase text-gray-500 mb-4">Chat History</h2>
                <ul className="space-y-2">
                  {chatHistory.map(chat => (
                    <li 
                      key={chat.id} 
                      className={`group py-2 px-3 rounded-md cursor-pointer truncate flex justify-between items-center ${currentChatId === chat.id ? 'bg-gray-800 text-white' : 'text-gray-300 hover:text-white'}`}
                      onClick={() => switchChat(chat.id)}
                      title={chat.title}
                    >
                      <span className="truncate flex-1">{chat.title}</span>
                      {chatHistory.length > 1 && (
                        <button 
                          onClick={(e) => deleteChat(chat.id, e)}
                          className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-500 ml-2 transition-opacity"
                          title="Delete chat"
                        >
                          ×
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* User Info and Upgrade Section */}
            <div className="mt-auto p-4 border-t border-gray-800">
              {/* User Info */}
              {user && (
                <div className="flex items-center gap-3 mb-4">
                    <img    
                    src={user.imageUrl} 
                    alt={user.fullName || 'User'} 
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="text-sm">
                    <div className="font-medium">{user.fullName}</div>
                    <div className="text-gray-400 text-xs">{user.primaryEmailAddress?.emailAddress}</div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-300">Free Plan</span>
                <button className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded">
                  Upgrade
                </button>
              </div>
              <div className="text-xs text-gray-400 mb-2">
                {messageCount} / {maxMessages} messages used
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all duration-300"
                  style={{ width: `${(messageCount / maxMessages) * 100}%` }}
                />
              </div>
            </div>
          </>
        )}
        
        {/* Collapsed Sidebar View */}
        {!isSidebarOpen && (
          <div className="flex flex-col items-center mt-8 space-y-6">
            <div className="text-xl font-bold">AI</div>
            <button 
              onClick={startNewChat}
              className="text-green-500 text-xl hover:text-green-400 transition-colors"
              title="New Chat"
            >
              +
            </button>
            {user && (
              <img 
                src={user.imageUrl} 
                alt={user.fullName || 'User'} 
                className="w-8 h-8 rounded-full"
              />
            )}
            <div className="mt-auto mb-4 text-xs text-gray-400">
              {messageCount}/{maxMessages}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="w-full px-4 py-3 bg-gray-900 border-b border-gray-800 flex justify-between items-center">
            <h1 className="text-xl font-bold">ai-fiesta-opensource</h1>
            <div className="flex items-center gap-4">
                <a
                href="https://github.com/ad1tyaydv/ai-fiesta-opensource"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border border-gray-300 px-3 py-1.5 rounded-full hover:bg-white hover:text-black transition text-sm font-medium"
                >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                    className="w-4 h-4"
                >
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59..." />
                </svg>
                Star Project
                </a>

                {/* Clerk Avatar */}
                <SignedIn>
                <UserButton afterSignOutUrl="/" />
                </SignedIn>
            </div>
        </div>

        {/* AI Response Panels - Always side by side with horizontal scrolling */}
        <div className="flex-1 overflow-x-auto">
          <div className="flex flex-nowrap h-full min-w-max divide-x divide-gray-800">
            {["gemini", "groq", "openrouter", "qwen"].map((model, idx) => (
              <div key={model} className="w-[300px] min-w-[300px] p-4 overflow-y-auto">
                <h2 className="text-white font-semibold mb-2 text-lg">
                  {model === "gemini" ? "Gemini 1.5 Flash" :
                   model === "groq" ? "Mixtral-8x7B" :
                   model === "openrouter" ? "DeepSeek Chat V3" :
                   "Qwen 3 Coder"}
                </h2>
                <div className="whitespace-pre-wrap space-y-2">
                  {responses.map((r, i) => (
                    <div key={i}>{r[model] || r.error}</div>
                  ))}
                  {loading && <div>Waiting...</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full px-4 flex justify-center z-50">
          <div className="w-full max-w-3xl bg-[#1E1E1E] rounded-xl flex items-center px-4 py-2 gap-2 shadow-lg border border-gray-700">
            <textarea
              autoFocus
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              rows={1}
              disabled={messageCount >= maxMessages}
              className="flex-1 bg-transparent resize-none outline-none text-white placeholder-gray-400 disabled:opacity-50"
            />
            <button
              onClick={sendMessage}
              disabled={loading || messageCount >= maxMessages}
              className="p-2 rounded-md bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
              title="Send"
            >
              ➤
            </button>
          </div>
        </div>
      </div>

      {showLimitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-lg p-6 max-w-sm text-center shadow-xl">
            <h2 className="text-lg font-semibold mb-2">Limit Reached</h2>
            <p className="text-sm">You've used all 3 of your message trials.</p>
            <button
              onClick={() => setShowLimitModal(false)}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}