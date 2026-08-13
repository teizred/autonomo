// app/api/chat/route.ts
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { searchChunks } from "@/lib/rag/search";

export async function POST(req: Request) {
  const { messages } = await req.json();
  const lastMessage = messages[messages.length - 1];
  const lastMessageText = lastMessage.parts
    ? lastMessage.parts.find((p: any) => p.type === "text")?.text
    : lastMessage.content;

  if (!lastMessageText) {
    return Response.json({ error: "Message vide ou format invalide" }, { status: 400 });
  }

  const relevantChunks = await searchChunks(lastMessageText);

  const context = relevantChunks
    .map((c) => `Source: ${c.documentTitle}\n${c.content}`)
    .join("\n\n---\n\n");

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: `Tu es un assistant qui répond aux questions sur le statut auto-entrepreneur en te basant UNIQUEMENT sur le contexte fourni ci-dessous. Cite toujours la source (nom du document). Si le contexte ne contient pas la réponse, dis-le clairement plutôt que d'inventer.

Contexte:
${context}`,
    messages,
  });

  return result.toUIMessageStreamResponse();
}