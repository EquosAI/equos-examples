import {
  EquosConversation,
  EquosEvent,
  EquosMode,
  type EquosModeType,
} from "@equos/browser-sdk";

const video = document.getElementById("character-video") as HTMLVideoElement;
const connectBtn = document.getElementById("connect") as HTMLButtonElement;
const disconnectBtn = document.getElementById("disconnect") as HTMLButtonElement;
const micBtn = document.getElementById("mic") as HTMLButtonElement;
const textForm = document.getElementById("text-form") as HTMLFormElement;
const textInput = document.getElementById("text-input") as HTMLInputElement;
const textSendBtn = textForm.querySelector("button") as HTMLButtonElement;
const contextForm = document.getElementById("context-form") as HTMLFormElement;
const contextInput = document.getElementById(
  "context-input"
) as HTMLInputElement;
const contextSendBtn = contextForm.querySelector("button") as HTMLButtonElement;
const transcript = document.getElementById("transcript") as HTMLDivElement;
const modeButtons: Record<EquosModeType, HTMLButtonElement> = {
  [EquosMode.Text]: document.getElementById("mode-text") as HTMLButtonElement,
  [EquosMode.Audio]: document.getElementById("mode-audio") as HTMLButtonElement,
  [EquosMode.Video]: document.getElementById("mode-video") as HTMLButtonElement,
};

let conversation: EquosConversation | null = null;
let micEnabled = false;

function log(text: string, cls: "agent" | "user" | "system" = "system") {
  const div = document.createElement("div");
  div.className = `msg ${cls}`;
  div.textContent = text;
  transcript.appendChild(div);
  transcript.scrollTop = transcript.scrollHeight;
}

function setConnectedUI(connected: boolean) {
  connectBtn.disabled = connected;
  disconnectBtn.disabled = !connected;
  micBtn.disabled = !connected;
  textInput.disabled = !connected;
  textSendBtn.disabled = !connected;
  contextInput.disabled = !connected;
  contextSendBtn.disabled = !connected;
  for (const btn of Object.values(modeButtons)) btn.disabled = !connected;
  if (!connected) {
    micEnabled = false;
    micBtn.textContent = "Mic: OFF";
    setActiveMode(EquosMode.Video);
  }
}

function setActiveMode(active: EquosModeType) {
  for (const [mode, btn] of Object.entries(modeButtons)) {
    btn.classList.toggle("active", mode === active);
  }
}

connectBtn.addEventListener("click", async () => {
  connectBtn.disabled = true;
  log("Starting conversation…");

  try {
    const res = await fetch("/api/start-conversation", { method: "POST" });
    const payload = await res.json();
    if (!res.ok) throw new Error(payload.error ?? "Failed to start conversation");

    const { conversation: conv, consumerAccessToken } = payload;
    if (!conv?.serverUrl || !consumerAccessToken) {
      throw new Error("Missing credentials in response");
    }

    conversation = new EquosConversation({
      config: {
        wsUrl: conv.serverUrl,
        token: consumerAccessToken,
        agentIdentity: conv.character.livekitIdentity,
      },
    });

    conversation.on(EquosEvent.AgentConnected, () => {
      log(`${conv.character.name ?? "Agent"} joined`);
      conversation?.attach(video);
    });
    conversation.on(EquosEvent.AgentDisconnected, () => log("Agent left"));
    conversation.on(EquosEvent.Utterance, ({ utterance }) => {
      log(`${utterance.author}: ${utterance.content}`, utterance.author);
    });
    conversation.on(EquosEvent.Error, ({ code }) => log(`Error: ${code}`));
    conversation.on(EquosEvent.ModeChanged, (mode) => {
      setActiveMode(mode);
      log(`Mode: ${mode}`);
    });

    await conversation.connect();
    setConnectedUI(true);
  } catch (err) {
    log(`Failed: ${(err as Error).message}`);
    connectBtn.disabled = false;
  }
});

disconnectBtn.addEventListener("click", async () => {
  if (!conversation) return;
  await conversation.disconnect();
  conversation.detach(video);
  conversation = null;
  setConnectedUI(false);
  log("Disconnected");
});

micBtn.addEventListener("click", async () => {
  if (!conversation) return;
  micEnabled = !micEnabled;
  await conversation.setMicrophoneEnabled(micEnabled);
  micBtn.textContent = `Mic: ${micEnabled ? "ON" : "OFF"}`;
});

textForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = textInput.value.trim();
  if (!text || !conversation) return;
  conversation.sendText(text);
  log(`user: ${text}`, "user");
  textInput.value = "";
});

contextForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const content = contextInput.value.trim();
  if (!content || !conversation) return;
  conversation.sendContext(content);
  log(`context: ${content}`);
  contextInput.value = "";
});

for (const [mode, btn] of Object.entries(modeButtons)) {
  btn.addEventListener("click", () => {
    if (!conversation) return;
    conversation.setMode(mode as EquosModeType);
    setActiveMode(mode as EquosModeType);
  });
}
