// scripts/test-search.ts
import { searchChunks } from "../lib/rag/search";

async function main() {
  const results = await searchChunks("Comment déclarer mes cotisations URSSAF ?");
  console.log(results);
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});