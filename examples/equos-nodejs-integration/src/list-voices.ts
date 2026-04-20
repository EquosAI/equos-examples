import { client } from "./client.js";

const { total, voices } = await client.voices.listVoices({ take: 50 });

console.log(`${voices.length} of ${total} voice(s):`);
for (const v of voices) {
  console.log(`- ${v.id} · ${v.identity}`);
}
