# Equos Vanilla Integration

Minimal integration of the [Equos Browser SDK](https://www.npmjs.com/package/@equos/browser-sdk) in a vanilla HTML / TypeScript app — no framework required. The same pattern works with Angular, Vue, Svelte, etc.

## What's inside

- [`src/main.ts`](./src/main.ts) — wires the UI to an `EquosConversation` instance: attaches the agent's video, toggles the microphone, sends text, injects context, switches modes, and renders utterances + connection / mode / error events into the transcript.
- [`vite.config.ts`](./vite.config.ts) — a Vite plugin that exposes `POST /api/start-conversation`. It uses [`@equos/node-sdk`](https://www.npmjs.com/package/@equos/node-sdk) to mint a conversation server-side so your API key never reaches the browser.
- [`index.html`](./index.html) — the demo page: a video stage, start/hang-up/mic controls, a Text/Audio/Video mode switcher, a message input, a context-injection input, and a transcript panel.

## Prerequisites

- Node.js 20+
- An [Equos](https://studio.equos.ai) API key and a character id (create one in Studio or with [`equos-nodejs-integration`](../equos-nodejs-integration/README.md))

## Setup

```bash
git clone https://github.com/EquosAI/equos-examples.git
cd equos-examples/examples/equos-vanilla-integration

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

1. Click **Start conversation**. The frontend posts to `/api/start-conversation`; the Vite middleware calls `client.conversations.startConversation(...)` and returns `{ conversation, consumerAccessToken }`.
2. `main.ts` constructs `new EquosConversation({ config: { wsUrl, token, agentIdentity } })`, wires up events (`AgentConnected`, `AgentDisconnected`, `Utterance`, `ModeChanged`, `Error`), and calls `connect()`. The character's video is attached to the `<video>` tag on `AgentConnected`.
3. Turn **Mic ON** to talk to the character, or type in the message input and press **Send** to drive the conversation via text.
4. Use the **Text / Audio / Video** buttons to switch the agent's mode at runtime via `conversation.setMode(...)`. The active button reflects the latest `ModeChanged` event.
5. Use the **Inject** input to push extra context into the agent's prompt with `conversation.sendContext(...)` — useful for feeding it page state, user info, or any side-channel signal mid-conversation.
6. Every utterance (yours and the agent's) streams into the transcript panel.
7. Click **Hang up** to `disconnect()` and detach the media.

### Build for production

```bash
npm run build    # outputs dist/
npm run preview  # serves dist/ locally
```

> The `/api/start-conversation` middleware only runs under `vite dev` / `vite preview`. For a real deployment, host the static `dist/` and re-implement the endpoint in whatever backend you use — any server that calls `@equos/node-sdk` will do.
