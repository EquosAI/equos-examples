# Equos React Integration

React app that drops in the full Equos conversation UI in a single component: [`<EquosConversationRenderer>`](https://www.npmjs.com/package/@equos/react). No custom media plumbing required.

## What's inside

- [`src/App.tsx`](./src/App.tsx) — landing page with a **Start conversation** button; on click it fetches `/api/start-conversation` and mounts `<EquosConversationRenderer>` with the returned credentials.
- [`vite.config.ts`](./vite.config.ts) — a Vite plugin that exposes `POST /api/start-conversation`. It uses [`@equos/node-sdk`](https://www.npmjs.com/package/@equos/node-sdk) to mint a conversation server-side so the API key never reaches the browser.
- [`src/main.tsx`](./src/main.tsx) — imports `@equos/react/dist/styles.css`.

`<EquosConversationRenderer>` provides:

- the character's video tile
- mic / camera / screenshare toggles
- draggable preview tiles for the user's camera and screenshare
- a red hang-up button

If you need a custom layout, swap it for the composable parts (`EquosConversationProvider`, `EquosCharacterTile`, `EquosMicToggle`, `EquosHangupButton`, …) — see the [`@equos/react` README](https://www.npmjs.com/package/@equos/react).

## Prerequisites

- Node.js 20+
- An [Equos](https://studio.equos.ai) API key and a character id (create one in Studio or with [`equos-nodejs-integration`](../equos-nodejs-integration/README.md))

## Setup

```bash
git clone https://github.com/EquosAI/equos-examples.git
cd equos-examples/examples/equos-react-integration

npm install
cp .env.example .env
```

Then open `.env` and fill in:

```dotenv
EQUOS_API_KEY="sk_..."
EQUOS_CHARACTER_ID="cha_..."
```

## Run

```bash
npm run dev
# open http://localhost:5173
```

### Using the demo

1. Click **Start conversation**. The browser POSTs to `/api/start-conversation`, the Vite middleware calls `client.conversations.startConversation(...)`, and returns the full `CreateEquosConversationResponse`.
2. `App.tsx` passes `response.conversation` and `response.consumerAccessToken` straight into `<EquosConversationRenderer>`, which handles connect, media, and teardown.
3. Use the toolbar at the bottom to toggle mic / camera / screenshare or hang up. Hanging up calls `onHangUp`, which clears the response and returns to the landing page.

### Build for production

```bash
npm run build    # outputs dist/
npm run preview  # serves dist/ locally
```

> The `/api/start-conversation` middleware only runs under `vite dev` / `vite preview`. For a real deployment, serve the static `dist/` and re-implement the endpoint on your own backend — any server that calls `@equos/node-sdk` will do.

## Authors

- [Loïc Combis](https://www.linkedin.com/in/lo%C3%AFc-combis-a211a813a/)
