# Equos Node.js Integration

Standalone scripts that walk through the full lifecycle of an Equos character using [`@equos/node-sdk`](https://www.npmjs.com/package/@equos/node-sdk):

1. create a **brain** — the character's instructions and greeting
2. create a **face** — a visual identity from the Equos gallery
3. combine them into a **character**
4. start and stop a **conversation**

Each script is a single file and can be read top-to-bottom as a recipe.

## What's inside

| File | Purpose |
| --- | --- |
| [`src/client.ts`](./src/client.ts) | Creates the shared `EquosClient` from `EQUOS_API_KEY` |
| [`src/create-brain.ts`](./src/create-brain.ts) | `client.brains.createBrain({ ... })` → prints the new brain id |
| [`src/create-face.ts`](./src/create-face.ts) | `client.faces.createFace({ identity: Tommy })` — 409-safe, prints the existing id to reuse |
| [`src/create-voice.ts`](./src/create-voice.ts) | `client.voices.createVoice({ identity: Charon })` — 409-safe |
| [`src/create-character.ts`](./src/create-character.ts) | `client.characters.createCharacter({ brainId, faceId?, voiceId? })` |
| [`src/list-brains.ts`](./src/list-brains.ts) | `client.brains.listBrains({ take: 50 })` |
| [`src/list-faces.ts`](./src/list-faces.ts) | `client.faces.listFaces({ take: 50 })` |
| [`src/list-voices.ts`](./src/list-voices.ts) | `client.voices.listVoices({ take: 50 })` |
| [`src/list-characters.ts`](./src/list-characters.ts) | `client.characters.listCharacters({ take: 50 })` |
| [`src/run-conversation.ts`](./src/run-conversation.ts) | Starts a conversation, waits 5s, then stops it |

## Prerequisites

- Node.js 20+
- An [Equos](https://studio.equos.ai) API key

## Setup

```bash
git clone https://github.com/EquosAI/equos-examples.git
cd equos-examples/examples/equos-nodejs-integration

npm install
cp .env.template .env
```

Open `.env` and set `EQUOS_API_KEY`. Leave the other ids blank for now — you'll fill them in as you create resources.

## Run

List what's already in your organization at any time:

```bash
npm run list:brains
npm run list:faces
npm run list:voices
npm run list:characters
```

Run the scripts in order, copying each new id back into `.env` before the next step:

```bash
# 1. Create a brain. Copy the printed id into EQUOS_BRAIN_ID.
npm run create:brain

# 2. (Optional) Create a face. Copy the printed id into EQUOS_FACE_ID.
npm run create:face

# 3. (Optional) Create a voice. Copy the printed id into EQUOS_VOICE_ID.
npm run create:voice

# 4. Create a character that uses the brain (and face/voice, if set).
#    Copy the printed id into EQUOS_CHARACTER_ID.
npm run create:character

# 5. Start a conversation against the character. Prints the server URL and
#    consumer access token, then waits 5 seconds and stops the conversation.
npm run run:conversation
```

Once you have `EQUOS_CHARACTER_ID`, feed it into the browser or React examples to actually talk to the character:

- [`equos-vanilla-integration`](../equos-vanilla-integration/README.md)
- [`equos-react-integration`](../equos-react-integration/README.md)
- [`equos-nextjs-integration`](../equos-nextjs-integration/README.md) — pairs the Node SDK with `@equos/react` end-to-end

## Build

```bash
npm run build    # type-check + emit dist/
```

Scripts run directly via `tsx`, so `build` is only needed to ship compiled JS.
