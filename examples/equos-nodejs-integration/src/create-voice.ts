import {
  CreateEquosVoiceRequestIdentityEnum,
  ResponseError,
} from "@equos/node-sdk";
import { client } from "./client.js";

// `identity` picks a voice from the Equos catalog. Full list in the SDK enum.
try {
  const voice = await client.voices.createVoice({
    createEquosVoiceRequest: {
      identity: CreateEquosVoiceRequestIdentityEnum.Charon,
      instructions: "Warm, friendly, conversational tone.",
    },
  });
  console.log("Voice created:", voice.id);
  console.log(voice);
} catch (err) {
  if (err instanceof ResponseError && err.response.status === 409) {
    const existing = await client.voices.listVoices({ take: 50 });
    const match = existing.voices.find(
      (v) => v.identity === CreateEquosVoiceRequestIdentityEnum.Charon
    );
    console.error(
      `A voice with identity "${CreateEquosVoiceRequestIdentityEnum.Charon}" already exists for this organization.`
    );
    if (match) console.error(`→ Reuse id: ${match.id}`);
    process.exit(1);
  }
  throw err;
}
