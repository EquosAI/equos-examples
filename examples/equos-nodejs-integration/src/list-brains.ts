import { client } from "./client.js";

const { total, brains } = await client.brains.listBrains({ take: 50 });

console.log(`${brains.length} of ${total} brain(s):`);
for (const b of brains) {
  const preview = b.instructions.slice(0, 60).replace(/\s+/g, " ");
  console.log(`- ${b.id} · ${preview}${b.instructions.length > 60 ? "…" : ""}`);
}
