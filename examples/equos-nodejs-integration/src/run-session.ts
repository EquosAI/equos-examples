import "dotenv/config";

import {
  Equos,
  type CreateEquosSessionResponse,
  type EquosSession,
} from "@equos/node-sdk";

export const runSession = async () => {
  const client = Equos.client(process.env.EQUOS_API_KEY!);

  const session: CreateEquosSessionResponse = await client.sessions.create({
    name: "Translation session",
    client: "user...", // Optional: your end-user identifier, use full for resource segmentation.
    agent: { id: process.env.EQUOS_AGENT_ID! },
    avatar: { id: process.env.EQUOS_AVATAR_ID! },
    consumerIdentity: {
      name: "Your user name",
      identity: "your-user-id",
    },
  });

  console.log("Session ID:", session.session.id);
  console.log("Session Status:", session.session.status);
  console.log("Session Consumer AccessToken:", session.consumerAccessToken);

  await new Promise((resolve) => setTimeout(resolve, 10000));

  // Do not forget to stop the session when done.
  const ended: EquosSession = await client.sessions.stop(session.session.id);
  console.log("Ended Session Status:", ended.status);
};

runSession();
