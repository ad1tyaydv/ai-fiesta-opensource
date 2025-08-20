import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function fetchGemini(messages: any[]) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const lastMessage = messages[messages.length - 1].content;

    const result = await model.generateContent(lastMessage);

    return result.response.text();
  } catch (error: any) {
    console.error("Gemini error:", error.message || error);
    return "Gemini error: " + (error.message || "unknown error");
  }
}
