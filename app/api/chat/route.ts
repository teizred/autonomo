import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, streamText } from "ai";
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

  const modelMessages = await convertToModelMessages(messages); // <- await ici

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: `Tu es un assistant qui répond aux questions sur le statut auto-entrepreneur en te basant UNIQUEMENT sur le contexte fourni ci-dessous. Cite toujours la source (nom du document). Si le contexte ne contient pas la réponse, dis-le clairement plutôt que d'inventer.

Contexte:
${context}`,
    messages: modelMessages, // <- variable déjà résolue, plus de Promise
  });

  const sources = relevantChunks.map((c) => ({
    title: c.documentTitle,
    excerpt: c.content.slice(0, 150),
  }));

  return result.toUIMessageStreamResponse({
    messageMetadata: () => ({ sources }),
  });
}