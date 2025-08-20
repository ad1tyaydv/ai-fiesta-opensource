export async function fetchOpenRouter(messages: any[], model: string): Promise<string> {
  const apikey = process.env.OPENROUTER_API_KEY;
  if (!apikey) throw new Error("OPENROUTER API KEY IS NOT CONFIGURED");

  const payload = { model, messages, stream: false };

  try {
    const response: Response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apikey}`,
        "HTTP-Referer": process.env.DOMAIN! || "http://localhost:3000",
        "X-Title": "app-fiesta",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "No response from OpenRouter";
  } catch (error) {
    console.error("Network error fetching from OpenRouter:", error);
    return "Failed to connect to OpenRouter";
  }
}
