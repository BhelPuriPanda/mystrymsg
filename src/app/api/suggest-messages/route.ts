import { OpenRouter } from "@openrouter/sdk";

export const runtime = "edge";

const openRouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!,
});

function contentToText(content: any): string {
  if (!content) return "";
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content.map((c) => c.text ?? "").join("");
  }
  return "";
}

export async function POST(request:Request) {
  await request.json();

  const prompt =
    "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'.";

  try {
    const response = await openRouter.chat.send({
      model: "openai/gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      stream: false,
    });

    const text = contentToText(response.choices[0].message.content);

    // 🔴 VERY IMPORTANT: never return empty text
    if (!text) {
      return new Response("Fallback question||Another one||Third one");
    }

    return new Response(text, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response("Error", { status: 500 });
  }
}
