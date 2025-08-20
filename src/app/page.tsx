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
          href="https://github.com/ad1tyaydv/open-fiesta"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white text-black px-4 py-1.5 rounded font-medium transition"
        >
          ⭐ Star this project
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
