import { pgTable, uuid, text, timestamp, vector, integer } from "drizzle-orm/pg-core";

export const documents = pgTable("documents", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  source: text("source"), // ex: "URSSAF - Guide auto-entrepreneur"
  createdAt: timestamp("created_at").defaultNow(),
});

export const chunks = pgTable("chunks", {
  id: uuid("id").defaultRandom().primaryKey(),
  documentId: uuid("document_id").references(() => documents.id),
  content: text("content").notNull(),
  embedding: vector("embedding", { dimensions: 1536 }), // dimension selon le modèle d'embedding
  chunkIndex: integer("chunk_index"),
});