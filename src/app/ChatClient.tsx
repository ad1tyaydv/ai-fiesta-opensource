"use client";

import { useState, useEffect } from "react";
import { useUser, SignedIn, UserButton } from "@clerk/nextjs";

interface Chat {
  id: number;
  title: string;
  responses: any[];
}

export default function ChatClient() {
  const { user } = useUser();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);

  const maxMessages = 3;

  useEffect(() => {
    const initialChat: Chat = { id: 1, title: "New Chat", responses: [] };
    setChatHistory([initialChat]);
    setCurrentChatId(1);
  }, []);

  const currentChat = chatHistory.find((chat) => chat.id === currentChatId);
  const responses = currentChat ? currentChat.responses : [];

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

      const data = await res.json();

      setChatHistory((prev) =>
        prev.map((chat) =>
          chat.id === currentChatId
            ? { ...chat, responses: [...chat.responses, data] }
            : chat
        )
      );

      setMessage("");
      setMessageCount((prev) => prev + 1);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startNewChat = () => {
    const newChat: Chat = {
      id: Date.now(),
      title: "New Chat",
      responses: [],
    };
    setChatHistory((prev) => [...prev, newChat]);
    setCurrentChatId(newChat.id);
  };

  const switchChat = (id: number) => {
    setCurrentChatId(id);
  };

  const deleteChat = (id: number) => {
    const filtered = chatHistory.filter((chat) => chat.id !== id);
    setChatHistory(filtered);
    if (currentChatId === id && filtered.length > 0) {
      setCurrentChatId(filtered[0].id);
    }
  };

  return (
    <div className="h-screen flex flex-col md:flex-row bg-black text-white">
      {/* Sidebar */}
      <div
        className={`fixed md:relative z-40 bg-[#121212] md:w-64 w-3/4 sm:w-64 h-full transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-4 space-y-4">
          <h2 className="text-xl font-bold">AI Fiesta</h2>
          <button
            onClick={startNewChat}
            className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
          >
            + New Chat
          </button>
          <div>
            <h3 className="text-sm text-gray-400 mb-2">Chats</h3>
            <ul className="space-y-2">
              {chatHistory.map((chat) => (
                <li
                  key={chat.id}
                  className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer ${
                    currentChatId === chat.id
                      ? "bg-gray-700 text-white"
                      : "bg-gray-800 text-gray-300"
                  }`}
                  onClick={() => switchChat(chat.id)}
                >
                  <span className="truncate">{chat.title}</span>
                  {chatHistory.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChat(chat.id);
                      }}
                      className="ml-2 text-red-400 hover:text-red-500"
                    >
                      ×
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* User info */}
          {user && (
            <div className="mt-6 p-3 rounded-md bg-gray-900">
              <div className="flex items-center gap-3">
                <img
                  src={user.imageUrl}
                  alt={user.fullName || "User"}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p className="text-sm font-medium">{user.fullName}</p>
                  <p className="text-xs text-gray-400">
                    {user.primaryEmailAddress?.emailAddress}
                  </p>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-400">
                {messageCount}/{maxMessages} messages used
              </div>
              <div className="w-full h-2 mt-1 bg-gray-700 rounded-full">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${(messageCount / maxMessages) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen((prev) => !prev)}
              className="md:hidden text-white text-xl"
            >
              ☰
            </button>
            <h1 className="text-lg font-bold">ai-fiesta-opensource</h1>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/ad1tyaydv/ai-fiesta-opensource"
              target="_blank"
              className="text-sm border border-gray-400 rounded-full px-3 py-1 hover:bg-white hover:text-black"
            >
              Star Project
            </a>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>

        {/* AI Responses */}
        <div className="flex-1 overflow-x-auto bg-black">
          <div className="flex h-full min-w-max divide-x divide-gray-800">
            {["gemini", "groq", "openrouter", "qwen"].map((model) => (
              <div
                key={model}
                className="min-w-[300px] max-w-[300px] p-4 h-full"
              >
                <h2 className="inline-block mb-4 px-3 py-1 text-sm font-medium text-gray-100 bg-gray-800 rounded-md border border-gray-700 shadow-sm">
                  {model === "gemini"
                    ? "Gemini 1.5 Flash"
                    : model === "groq"
                    ? "Mixtral-8x7B"
                    : model === "openrouter"
                    ? "DeepSeek Chat V3"
                    : "Qwen 3 Coder"}
                </h2>
                <div className="whitespace-pre-wrap space-y-2 text-sm">
                  {responses.map((r, i) => (
                    <div key={i}>{r[model] || r.error}</div>
                  ))}
                  {loading && <div className="text-gray-400">Loading...</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Input Box */}
        <div className="w-full px-4 py-3 bg-black border-t border-gray-900">
          <div className="max-w-3xl mx-auto flex items-center gap-2">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="Ask me anything..."
              className="flex-1 bg-black text-white placeholder-gray-500 p-2 rounded-md border border-gray-700 resize-none focus:outline-none"
            />
            <button
              onClick={sendMessage}
              disabled={loading || messageCount >= maxMessages}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md disabled:opacity-50"
            >
              ➤
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showLimitModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-white text-black p-6 rounded-md shadow-lg text-center max-w-sm">
            <h2 className="text-lg font-semibold mb-2">Limit Reached</h2>
            <p className="text-sm">You've used all 3 trial messages.</p>
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
