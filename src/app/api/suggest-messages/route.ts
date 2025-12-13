import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

export async function POST(request: Request) {
    try{
        const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

        const response = await openai.responses.stream({
            model: "gpt-4.1-mini",
            input: prompt,
        });

        const stream = new ReadableStream({
            async start(controller) {
            try{
                for await (const event of response) {
                    if(event.type === "response.output_text.delta"){
                        controller.enqueue(event.delta)
                    }
                    if(event.type === "response.completed"){
                        controller.close();
                    }
                }
            }catch(error){
                console.error("Error in streaming response:", error);
                controller.error(error);
            }
        }
        })

        return new Response(stream, {headers: {"Content-Type": "text/plain; charset=utf-8"}});

    }catch(error){
        console.error("Error in POST request:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Internal server error"
            }),
            { status: 500 }
        );
    }
}