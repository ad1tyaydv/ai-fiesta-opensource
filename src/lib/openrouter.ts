

export async function fetchOpenRouter(
    messages: any[],
    model: string,
): Promise<ReadableStream> {
    
    const apikey = process.env.OPENROUTER_API_KEY;
    
    if(!apikey) {
        throw new Error("OPENROUTER API KEY IS NOT CONFIGURED");
    }

    const payload = {
        model,
        messages,
        stream: true    // Tells the api to return data token by token 
    }

    try {
        const response: Response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "HTTP-Referer": process.env.DOMAIN! || "http://localhost:3000",
                "X-Title": "app-fiesta",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`OpenRouter API error: ${response.status} ${errorText}`);
        }

        if (!response.body) {
            throw new Error("OpenRouter response body is null");
        }

        return response.body;
    } catch (error) {
        console.error("Network error fetching from OpenRouter:", error);
        throw new Error("Failed to connect to OpenRouter API")
    }
}