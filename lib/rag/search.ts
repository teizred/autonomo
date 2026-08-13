// lib/rag/search.ts
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { chunks, documents } from "@/lib/db/schema";
import { generateEmbedding } from "@/lib/rag/embed"; // <- corrigé

export async function searchChunks(query: string, limit = 5) {
  const queryEmbedding = await generateEmbedding(query); // <- corrigé, renvoie déjà un seul vecteur

  const results = await db
    .select({
      content: chunks.content,
      documentTitle: documents.title,
      similarity: sql<number>`1 - (${chunks.embedding} <=> ${JSON.stringify(queryEmbedding)}::vector)`,
    })
    .from(chunks)
    .innerJoin(documents, sql`${chunks.documentId} = ${documents.id}`)
    .orderBy(sql`${chunks.embedding} <=> ${JSON.stringify(queryEmbedding)}::vector`)
    .limit(limit);

  return results;
}