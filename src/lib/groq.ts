import { Groq } from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function runGroqChat(messages: any[], model: string) {
  const chatCompletion = await groq.chat.completions.create({
    messages,
    model,
    temperature: 1,
    max_tokens: 1024,
    top_p: 1,
  });

  return chatCompletion.choices?.[0]?.message?.content || "No response from Groq";
}
