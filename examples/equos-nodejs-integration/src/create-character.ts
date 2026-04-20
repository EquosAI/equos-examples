import { client } from "./client.js";

// Combine a brain (required) and an optional face/voice into a character.
// IDs come from the corresponding `create-*` scripts or from Equos Studio.
const brainId = process.env.EQUOS_BRAIN_ID;
if (!brainId) throw new Error("EQUOS_BRAIN_ID is not set");

const character = await client.characters.createCharacter({
  createEquosCharacterRequest: {
    name: "French Translator",
    livekitIdentity: `french-translator-${Date.now()}`,
    brainId,
    faceId: process.env.EQUOS_FACE_ID,
    voiceId: process.env.EQUOS_VOICE_ID,
    search: false,
  },
});

console.log("Character created:", character.id);
console.log(character);
