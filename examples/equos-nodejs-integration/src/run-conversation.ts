import { client } from "./client.js";

const characterId = process.env.EQUOS_CHARACTER_ID;
if (!characterId) throw new Error("EQUOS_CHARACTER_ID is not set");

const { conversation, consumerAccessToken } =
  await client.conversations.startConversation({
    createEquosConversationRequest: {
      name: "Demo conversation",
      characterId,
      consumer: { name: "Demo User", identity: "demo-user" },
    },
  });

console.log("Conversation:", conversation.id, conversation.status);
console.log("Server URL:", conversation.serverUrl);
console.log("Consumer access token:", consumerAccessToken);
console.log(
  "Hand these to the browser / React SDK to connect. Sleeping 5s then stopping…",
);

await new Promise((resolve) => setTimeout(resolve, 5_000));

const stopped = await client.conversations.stopConversation({
  id: conversation.id,
});
console.log("Stopped. Status:", stopped.status);
