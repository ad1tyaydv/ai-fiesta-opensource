"use client";

import { useState } from "react";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [responses, setResponses] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;
    setLoading(true);
    setResponses(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ messages: [{ role: "user", content: message }] }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to get response");

      const data = await res.json();
      setResponses(data);
    } catch (err) {
      setResponses({ error: "Something went wrong." });
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

  return (
    <div className="h-screen flex flex-col bg-black text-white overflow-hidden">
      {/* ⭐ Top Bar */}
      <div className="w-full px-4 py-3 bg-gray-900 border-b border-gray-800 flex justify-between items-center">
        <h1 className="text-xl font-bold">ai-fiesta-opensource</h1>
        <a
          href="https://github.com/ad1tyaydv/open-fiesta-opensource"
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
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 
            0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52
            -.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78
            -.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 
            2.2.82A7.65 7.65 0 0 1 8 4.83c.68.003 1.36.092 2 .27 1.53-1.04 2.2-.82 
            2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 
            3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 
            0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
          </svg>
          Star Project
        </a>
      </div>

      {/* AI Responses */}
      <div className="flex-1 overflow-x-auto sm:overflow-x-hidden">
        <div className="flex flex-nowrap sm:flex-wrap h-full min-w-[640px] sm:min-w-full divide-x divide-gray-800">
          {/* Gemini */}
          <div className="flex-1 min-w-[300px] p-4 overflow-y-auto">
            <h2 className="text-white font-semibold mb-2 text-lg">Gemini 1.5 Flash</h2>
            <div className="whitespace-pre-wrap">
              {responses?.gemini || (loading ? "Waiting..." : "")}
            </div>
          </div>

          {/* Groq */}
          <div className="flex-1 min-w-[300px] p-4 overflow-y-auto">
            <h2 className="text-white font-semibold mb-2 text-lg">Mixtral-8x7B</h2>
            <div className="whitespace-pre-wrap">
              {responses?.groq || (loading ? "Waiting..." : "")}
            </div>
          </div>

          {/* DeepSeek */}
          <div className="flex-1 min-w-[300px] p-4 overflow-y-auto">
            <h2 className="text-white font-semibold mb-2 text-lg">DeepSeek Chat V3</h2>
            <div className="whitespace-pre-wrap">
              {responses?.openrouter || (loading ? "Waiting..." : "")}
            </div>
          </div>

          {/* Qwen Coder */}
          <div className="flex-1 min-w-[300px] p-4 overflow-y-auto">
            <h2 className="text-white font-semibold mb-2 text-lg">Qwen 3 Coder</h2>
            <div className="whitespace-pre-wrap">
              {responses?.qwen || (loading ? "Waiting..." : "")}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Chat Input */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full px-4 flex justify-center z-50">
        <div className="w-full max-w-3xl bg-[#1E1E1E] rounded-xl flex items-center px-4 py-2 gap-2 shadow-lg border border-gray-700">
          <textarea
            autoFocus
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            rows={1}
            className="flex-1 bg-transparent resize-none outline-none text-white placeholder-gray-400"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="p-2 rounded-md bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
            title="Send"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}
