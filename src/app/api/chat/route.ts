import { NextRequest, NextResponse } from "next/server";
import { fetchOpenRouter } from "@/lib/openrouter";
import { runGroqChat } from "@/lib/groq";
import { fetchGemini } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const [openrouterRes, groqRes, geminiRes, qwenRes] = await Promise.all([
      fetchOpenRouter(messages, "meta-llama/llama-3.3-70b-instruct:free"),
      runGroqChat(messages, "openai/gpt-oss-20b"),
      fetchGemini(messages),
      fetchOpenRouter(messages, "qwen/qwen3-coder:free")
    ]);

    return NextResponse.json({
      openrouter: openrouterRes,
      groq: groqRes,
      gemini: geminiRes,
      qwen: qwenRes,
    });
  } catch (error) {
    console.error("Chat API error", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
