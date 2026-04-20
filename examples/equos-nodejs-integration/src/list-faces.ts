import { client } from "./client.js";

const { total, faces } = await client.faces.listFaces({ take: 50 });

console.log(`${faces.length} of ${total} face(s):`);
for (const f of faces) {
  console.log(`- ${f.id} · ${f.identity}`);
}
