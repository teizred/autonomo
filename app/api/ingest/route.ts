// app/api/ingest/route.ts
import { db } from "@/lib/db";
import { documents, chunks } from "@/lib/db/schema";
import { chunkText } from "@/lib/rag/chunk";
import { generateEmbeddings } from "@/lib/rag/embed"; // <- corrigé

export async function POST(req: Request) {
  const { title, source, text } = await req.json();

  const [doc] = await db.insert(documents).values({ title, source }).returning();

  const textChunks = chunkText(text);
  const embeddings = await generateEmbeddings(textChunks); // <- corrigé

  await db.insert(chunks).values(
    textChunks.map((content, i) => ({
      documentId: doc.id,
      content,
      embedding: embeddings[i],
      chunkIndex: i,
    }))
  );

  return Response.json({ documentId: doc.id, chunksCreated: textChunks.length });
}