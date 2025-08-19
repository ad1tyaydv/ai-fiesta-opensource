import { NextRequest, NextResponse } from "next/server";
import { fetchOpenRouter } from "@/lib/openrouter";
import { runGroqChat } from "@/lib/groq";

export async function POST(req: NextRequest) {
    try {
        const reqBody = await req.json();
        const {messages, model} = reqBody;

        if(model.startsWith('openrouter/')) {
            const openRouterModel = model.replace('openrouter/', '');
            const stream = await fetchOpenRouter(messages, openRouterModel);   
            return new Response(stream);
        }
        else if (model.startsWith('groq/')) {
            const groqModel = model.replace('groq/', '');
            const stream = await runGroqChat(messages, groqModel);
        }

    } catch (error: any) {
        console.log("Chat API error", error);
        return NextResponse.json(
            JSON.stringify(
                {error: "Internal server error"}
            ),
            {
                status: 500,
                headers: {'Content-Type': 'application/json'}
            }
        );
    }
}