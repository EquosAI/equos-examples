# Equos Next.js Integration

End-to-end Next.js 15 app. A server action uses [`@equos/node-sdk`](https://www.npmjs.com/package/@equos/node-sdk) to start and stop conversations; the client uses [`@equos/react`](https://www.npmjs.com/package/@equos/react)'s `<EquosConversationRenderer>` to render the full conversation UI.

This is the canonical full-stack pattern: API key on the server, consumer access token over the wire to the browser, nothing sensitive in client code.

## What's inside

| File | Purpose |
| --- | --- |
| [`src/lib/equos.ts`](./src/lib/equos.ts) | Creates the `EquosClient` from `EQUOS_API_KEY`. Marked `server-only` so it can't leak into a client bundle |
| [`src/app/actions.ts`](./src/app/actions.ts) | `startConversationAction()` / `stopConversationAction(id)` — server actions invoked from the client |
| [`src/app/conversation-client.tsx`](./src/app/conversation-client.tsx) | `"use client"` component: calls the server actions and mounts `<EquosConversationRenderer>` |
| [`src/app/page.tsx`](./src/app/page.tsx) | Renders the client component |
| [`src/app/layout.tsx`](./src/app/layout.tsx) | Imports `@equos/react/dist/styles.css` |

## Prerequisites

- Node.js 20+
- An [Equos](https://studio.equos.ai) API key and a character id (create one in Studio or with [`equos-nodejs-integration`](../equos-nodejs-integration/README.md))

## Setup

```bash
git clone https://github.com/EquosAI/equos-examples.git
cd equos-examples/examples/equos-nextjs-integration

npm install
cp .env.template .env.local
```

Open `.env.local` and fill in:

```dotenv
EQUOS_API_KEY="sk_..."
EQUOS_CHARACTER_ID="cha_..."
```

`.env.local` is Next.js's convention for local, gitignored secrets.

## Run

```bash
npm run dev
# open http://localhost:3000
```

### Using the demo

1. Click **Start conversation**. `startConversationAction()` runs on the server, calls `equos.conversations.startConversation(...)`, and returns `{ conversation, consumerAccessToken }`.
2. The client component passes those directly into `<EquosConversationRenderer>`, which connects to LiveKit, plays the character's video, and renders the media toolbar.
3. Toggle mic / camera / screenshare, or click the red hang-up button. Hanging up calls `stopConversationAction(conversation.id)` server-side and returns to the landing page.

### Production build

```bash
npm run build
npm start
```

## Authors

- [Loïc Combis](https://www.linkedin.com/in/lo%C3%AFc-combis-a211a813a/)
