import { NextRequest, NextResponse } from "next/server";
import { fetchOpenRouter } from "@/lib/openrouter";

export async function POST(req: NextRequest) {
    try {
        const reqBody = await req.json();
        const {messages, model} = reqBody;

        if(model.startsWith('openrouter/')) {
            const openRouterModel = model.replace('openrouter/', '');
            const stream = await fetchOpenRouter(messages, openRouterModel);
            
            return new Response(stream);
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