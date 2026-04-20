import { client } from "./client.js";

const { total, characters } = await client.characters.listCharacters({
  take: 50,
});

console.log(`${characters.length} of ${total} character(s):`);
for (const c of characters) {
  console.log(`- ${c.id} · ${c.name}`);
}
