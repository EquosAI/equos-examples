import "dotenv/config";

import {
  Equos,
  AgentProvider,
  type EquosAgent,
  GeminiRealtimeModels,
  GeminiRealtimeVoices,
} from "@equos/node-sdk";

const client = Equos.client(process.env.EQUOS_API_KEY!);

export const createAgent = async () => {
  const agent: EquosAgent = await client.agents.create({
    name: "French Translator",
    provider: AgentProvider.gemini,
    instructions:
      "You are a helpful assistant that translates English to French.",
    model: GeminiRealtimeModels.gemini_2_5_flash_native_audio_09_2025,
    voice: GeminiRealtimeVoices.Charon,
  });

  console.log("Agent created:", agent.id);

  console.log("Agent details:");
  console.log(agent);
};

createAgent();
