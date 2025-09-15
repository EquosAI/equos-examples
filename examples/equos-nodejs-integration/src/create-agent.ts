import "dotenv/config";

import {
  Equos,
  AgentProvider,
  GoogleRealtimeModels,
  GoogleRealtimeVoices,
  type EquosAgent,
} from "@equos/node-sdk";

const client = Equos.client(process.env.EQUOS_API_KEY!);

export const createAgent = async () => {
  const agent: EquosAgent = await client.agents.create({
    provider: AgentProvider.gemini,
    config: {
      model: GoogleRealtimeModels.gemini_2_5_flash_exp,
      voice: GoogleRealtimeVoices.Charon,
    },
    instructions:
      "You are a helpful assistant that translates English to French.",
  });

  console.log("Agent created:", agent.id);

  console.log("Agent details:");
  console.log(agent);
};

createAgent();
