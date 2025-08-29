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
  const [messageCount, setMessageCount] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("messageCount");
      return stored ? parseInt(stored, 10) : 0;
    }
    return 0;
  });

  const [showLimitModal, setShowLimitModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatHistory, setChatHistory] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);

  const maxMessages = 3;

  // Load chatHistory, currentChatId and messageCount on mount
  useEffect(() => {
    const storedChats = localStorage.getItem("chatHistory");
    const storedChatId = localStorage.getItem("currentChatId");

    if (storedChats) {
      setChatHistory(JSON.parse(storedChats));
      setCurrentChatId(storedChatId ? parseInt(storedChatId) : null);
    } else {
      const initialChat: Chat = { id: 1, title: "New Chat", responses: [] };
      setChatHistory([initialChat]);
      setCurrentChatId(1);
    }
  }, []);

  // Save chatHistory to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
  }, [chatHistory]);

  // Save currentChatId when changed
  useEffect(() => {
    if (currentChatId !== null) {
      localStorage.setItem("currentChatId", currentChatId.toString());
    }
  }, [currentChatId]);

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
      setMessageCount((prev) => {
        const newCount = prev + 1;
        localStorage.setItem("messageCount", newCount.toString());
        return newCount;
      });
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

  const switchChat = (id: number) => setCurrentChatId(id);

  const deleteChat = (id: number) => {
    const updated = chatHistory.filter((chat) => chat.id !== id);
    setChatHistory(updated);
    if (currentChatId === id && updated.length > 0) {
      setCurrentChatId(updated[0].id);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-black text-white relative">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-40 bg-[#121212] w-64 h-full transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 space-y-4 flex flex-col h-full">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">AI Fiesta</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-white text-xl"
            >
              ×
            </button>
          </div>
          <button
            onClick={startNewChat}
            className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
          >
            + New Chat
          </button>
          <div className="flex-grow overflow-y-auto">
            {chatHistory.map((chat) => (
              <div
                key={chat.id}
                onClick={() => switchChat(chat.id)}
                className={`px-3 py-2 rounded-md cursor-pointer ${
                  currentChatId === chat.id
                    ? "bg-gray-700 text-white"
                    : "bg-gray-800 text-gray-300"
                } flex justify-between items-center`}
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
              </div>
            ))}
          </div>
          {user && (
            <div className="mt-4 p-3 rounded-md bg-gray-900">
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

      {/* Open Sidebar Button */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-50 bg-gray-800 text-white p-2 rounded-md"
        >
          ☰
        </button>
      )}

      {/* Main Content */}
      <div
        className={`h-full flex flex-col transition-all duration-300 ease-in-out ${
          sidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800">
          <h1 className="text-lg font-bold ml-2">ai-fiesta-opensource</h1>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/ad1tyaydv/ai-fiesta-opensource"
              target="_blank"
              className="text-sm border border-gray-400 rounded-full px-3 py-1 hover:bg-white hover:text-black"
            >
              Star Project
            </a>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>

        {/* AI Panels */}
        <div className="flex-1 overflow-hidden h-[calc(100vh-122px)]">
          <div className="overflow-x-auto h-full">
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
                      ? "Mixtral‑8x7B"
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
        </div>

        {/* Input Box */}
        <div className="px-4 py-3 bg-black border-t border-gray-900">
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
