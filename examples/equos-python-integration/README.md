# Equos Python Integration

Standalone scripts that walk through the full lifecycle of an Equos character using the [`equos`](https://pypi.org/project/equos/) Python SDK:

1. create a **brain** — the character's instructions and greeting
2. create a **face** — a visual identity from the Equos gallery
3. combine them into a **character**
4. start and stop a **conversation** (sync *and* async variants)

Each script is a single file and can be read top-to-bottom as a recipe.

## What's inside

| File | Purpose |
| --- | --- |
| [`src/python_integration/client.py`](./src/python_integration/client.py) | Loads `.env` and builds the shared `EquosClient` |
| [`src/python_integration/create_brain.py`](./src/python_integration/create_brain.py) | `client.brains.create(CreateEquosBrainRequest(...))` |
| [`src/python_integration/create_face.py`](./src/python_integration/create_face.py) | `client.faces.create(identity=TOMMY)` — 409-safe, prints the existing id to reuse |
| [`src/python_integration/create_voice.py`](./src/python_integration/create_voice.py) | `client.voices.create(identity=CHARON)` — 409-safe |
| [`src/python_integration/create_character.py`](./src/python_integration/create_character.py) | `client.characters.create(CreateEquosCharacterRequest(brain_id=..., face_id?, voice_id?))` |
| [`src/python_integration/list_brains.py`](./src/python_integration/list_brains.py) | `client.brains.list(take=50)` |
| [`src/python_integration/list_faces.py`](./src/python_integration/list_faces.py) | `client.faces.list(take=50)` |
| [`src/python_integration/list_voices.py`](./src/python_integration/list_voices.py) | `client.voices.list(take=50)` |
| [`src/python_integration/list_characters.py`](./src/python_integration/list_characters.py) | `client.characters.list(take=50)` |
| [`src/python_integration/run_conversation.py`](./src/python_integration/run_conversation.py) | Sync: `client.conversations.start(...)` → sleep 10s → `stop(...)` |
| [`src/python_integration/run_conversation_async.py`](./src/python_integration/run_conversation_async.py) | Same flow, but with `start_async` / `stop_async` |

## Prerequisites

- Python 3.11+
- [Poetry](https://python-poetry.org/) — quick install: `pipx install poetry`
- An [Equos](https://studio.equos.ai) API key

## Setup

```bash
git clone https://github.com/EquosAI/equos-examples.git
cd equos-examples/examples/equos-python-integration

poetry install
cp .env.template .env
```

Open `.env` and set `EQUOS_API_KEY`. Leave the other ids blank for now — you'll fill them in as you create resources.

## Run

Run the scripts in order, copying each new id back into `.env` before the next step:

```bash
# 1. Create a brain. Copy the printed id into EQUOS_BRAIN_ID.
poetry run python -m python_integration.create_brain

# 2. (Optional) Create a face. Copy the printed id into EQUOS_FACE_ID.
poetry run python -m python_integration.create_face

# 3. (Optional) Create a voice. Copy the printed id into EQUOS_VOICE_ID.
poetry run python -m python_integration.create_voice

# 4. Create a character that uses the brain (and face/voice, if set).
#    Copy the printed id into EQUOS_CHARACTER_ID.
poetry run python -m python_integration.create_character

# 5. Start a conversation. Prints the server URL and consumer access token,
#    then waits 10 seconds and stops the conversation.
poetry run python -m python_integration.run_conversation

# 5b. Same as above, using the async API.
poetry run python -m python_integration.run_conversation_async
```

List what's already in your organization at any time:

```bash
poetry run python -m python_integration.list_brains
poetry run python -m python_integration.list_faces
poetry run python -m python_integration.list_voices
poetry run python -m python_integration.list_characters
```

Once you have `EQUOS_CHARACTER_ID`, feed it into the browser or React examples to actually talk to the character:

- [`equos-vanilla-integration`](../equos-vanilla-integration/README.md)
- [`equos-react-integration`](../equos-react-integration/README.md)
- [`equos-nextjs-integration`](../equos-nextjs-integration/README.md)

## Notes

- The SDK ships a sync and async variant for every method — suffix the call with `_async` (e.g. `brains.list()` → `brains.list_async()`).
- `CreateEquosFaceRequest.identity` expects the `CreateEquosFaceRequestIdentity` enum (`TOMMY`, `DEBORAH`, …), not a raw string.
- Every model is a generated `attrs` class; optional fields default to `UNSET` — pass `None` to explicitly clear a value.
