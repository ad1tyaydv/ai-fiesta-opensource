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

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ messages: [{ role: "user", content: message }] }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    setResponses(data);
    setLoading(false);
    setMessage("");
  };

  return (
    <div className="h-screen flex flex-col bg-black text-white">
      {/* Response Section */}
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

        {/* OpenRouter */}
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

      {/* Chat Input Section */}
      <div className="p-4 border-t border-gray-700 bg-gray-900 flex justify-center">
        <div className="w-full max-w-3xl flex items-center gap-2">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask me anything..."
            rows={1}
            className="flex-1 p-2 rounded bg-gray-800 resize-none text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white transition"
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
