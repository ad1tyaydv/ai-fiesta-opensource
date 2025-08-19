import { Groq } from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function runGroqChat(userMessage: string, model: string) {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: userMessage,
      },
    ],
    model: "openai/gpt-oss-20b",
    temperature: 1,
    max_completion_tokens: 8192,
    top_p: 1,
    stream: true,
    reasoning_effort: "medium",
    stop: null,
  });

  for await (const chunk of chatCompletion) {
    process.stdout.write(chunk.choices[0]?.delta?.content || '');
  }
}