"use server";

import { equos } from "@/lib/equos";
import type { CreateEquosConversationResponse } from "@equos/node-sdk";

export async function startConversationAction(): Promise<CreateEquosConversationResponse> {
  const characterId = process.env.EQUOS_CHARACTER_ID;
  if (!characterId) throw new Error("EQUOS_CHARACTER_ID is not set");

  return equos.conversations.startConversation({
    createEquosConversationRequest: {
      name: `nextjs-demo-${Date.now()}`,
      characterId,
      consumer: { name: "Demo User", identity: "demo-user" },
    },
  });
}

export async function stopConversationAction(id: string): Promise<void> {
  await equos.conversations.stopConversation({ id });
}
