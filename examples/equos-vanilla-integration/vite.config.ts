import { defineConfig, loadEnv } from "vite";
import { EquosClient, ResponseError } from "@equos/node-sdk";

// Tiny dev-only middleware that mints a conversation using the Node SDK and
// returns the credentials the browser SDK needs. Keeps the API key server-side.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiKey = env.EQUOS_API_KEY;
  const characterId = env.EQUOS_CHARACTER_ID;
  const endpoint = env.EQUOS_ENDPOINT;

  return {
    server: {
      port: 5173,
    },
    plugins: [
      {
        name: "equos-api",
        configureServer(server) {
          server.middlewares.use("/api/start-conversation", async (req, res) => {
            if (req.method !== "POST") {
              res.statusCode = 405;
              return res.end();
            }
            if (!apiKey || !characterId) {
              res.statusCode = 500;
              res.setHeader("content-type", "application/json");
              return res.end(
                JSON.stringify({
                  error: "Missing EQUOS_API_KEY or EQUOS_CHARACTER_ID in .env",
                })
              );
            }
            try {
              const client = EquosClient.create(
                apiKey,
                endpoint ? { endpoint } : undefined
              );
              const { conversation, consumerAccessToken } =
                await client.conversations.startConversation({
                  createEquosConversationRequest: {
                    name: `vanilla-demo-${Date.now()}`,
                    characterId,
                    consumer: { name: "Demo User", identity: "demo-user" },
                  },
                });
              res.setHeader("content-type", "application/json");
              res.end(JSON.stringify({ conversation, consumerAccessToken }));
            } catch (err) {
              let status = 500;
              let message = (err as Error).message;
              if (err instanceof ResponseError) {
                status = err.response.status;
                const body = await err.response.text().catch(() => "");
                message = `${err.response.status} ${err.response.statusText} — ${body || err.message}`;
              }
              console.error("[equos-api] startConversation failed:", message);
              res.statusCode = status;
              res.setHeader("content-type", "application/json");
              res.end(JSON.stringify({ error: message }));
            }
          });
        },
      },
    ],
  };
});
