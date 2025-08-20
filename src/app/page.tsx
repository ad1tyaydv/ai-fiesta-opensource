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
    <div className="h-screen flex flex-col bg-black text-white">
      {/* AI Response Columns */}
      <div className="flex flex-1 overflow-hidden divide-x divide-gray-800">
        {/* Gemini */}
        <div className="flex-1 overflow-y-auto p-4">
          <h2 className="text-green-400 font-semibold mb-2 text-lg">🌟 Gemini</h2>
          <div className="whitespace-pre-wrap">
            {responses?.gemini || (loading ? "Waiting..." : "Ask me anything!")}
          </div>
        </div>

        {/* Groq */}
        <div className="flex-1 overflow-y-auto p-4">
          <h2 className="text-yellow-400 font-semibold mb-2 text-lg">⚡ Groq</h2>
          <div className="whitespace-pre-wrap">
            {responses?.groq || (loading ? "Waiting..." : "Ask me anything!")}
          </div>
        </div>

        {/* DeepSeek (OpenRouter) */}
        <div className="flex-1 overflow-y-auto p-4">
          <h2 className="text-pink-400 font-semibold mb-2 text-lg">🧠 DeepSeek</h2>
          <div className="whitespace-pre-wrap">
            {responses?.openrouter || (loading ? "Waiting..." : "Ask me anything!")}
          </div>
        </div>

        {/* Qwen */}
        <div className="flex-1 overflow-y-auto p-4">
          <h2 className="text-cyan-400 font-semibold mb-2 text-lg">💻 Qwen Coder</h2>
          <div className="whitespace-pre-wrap">
            {responses?.qwen || (loading ? "Waiting..." : "Ask me anything!")}
          </div>
        </div>
      </div>

      {/* Bottom Chat Input */}
      <div className="p-4 border-t border-gray-700 bg-gray-900 flex justify-center">
        <div className="w-full max-w-3xl bg-[#1E1E1E] rounded-xl flex items-center px-4 py-2 gap-2">
          <textarea
            autoFocus
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            rows={1}
            className="flex-1 bg-transparent resize-none outline-none text-white placeholder-gray-400"
          />

          {/* Optional Icons (Replace with React Icons if needed) */}
          <button
            type="button"
            className="p-2 rounded-md bg-[#2A2A2A] hover:bg-[#3A3A3A] text-white"
            title="Mic"
          >
            🎤
          </button>

          <button
            type="button"
            className="p-2 rounded-md bg-[#2A2A2A] hover:bg-[#3A3A3A] text-white"
            title="Settings"
          >
            ⚙️
          </button>

          <button
            type="button"
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
