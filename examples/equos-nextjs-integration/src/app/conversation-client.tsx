"use client";

import { EquosMode, type EquosModeType } from "@equos/browser-sdk";
import type { CreateEquosConversationResponse } from "@equos/node-sdk";
import {
  EquosConversationProvider,
  EquosConversationRenderer,
  useEquosConversation,
} from "@equos/react";
import { useCallback, useState, useTransition } from "react";

import { startConversationAction, stopConversationAction } from "./actions";

const MODES: EquosModeType[] = [EquosMode.Text, EquosMode.Audio, EquosMode.Video];

export function ConversationClient() {
  const [response, setResponse] =
    useState<CreateEquosConversationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [mode, setMode] = useState<EquosModeType>(EquosMode.Video);

  const start = useCallback(() => {
    setError(null);
    startTransition(async () => {
      try {
        setResponse(await startConversationAction());
      } catch (err) {
        setError((err as Error).message);
      }
    });
  }, []);

  const stop = useCallback(async () => {
    if (!response) return;
    const id = response.conversation.id;
    setResponse(null);
    try {
      await stopConversationAction(id);
    } catch (err) {
      console.error("Failed to stop conversation:", err);
    }
  }, [response]);

  if (response?.consumerAccessToken) {
    return (
      <EquosConversationProvider
        conversation={response.conversation}
        accessToken={response.consumerAccessToken}
        autoPublishMic
        mode={mode}
      >
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="max-w-[1080px] aspect-video w-full rounded-xl overflow-hidden">
            <EquosConversationRenderer
              allowMic
              allowCamera
              allowScreenshare
              allowHangUp
              onHangUp={stop}
            />
          </div>
        </div>
        <ModeSelector mode={mode} onChange={setMode} />
        <ConversationControls />
      </EquosConversationProvider>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-3xl font-semibold">Equos Next.js Integration</h1>
      <p className="text-neutral-400">
        Start a conversation with your Equos character.
      </p>
      <button
        onClick={start}
        disabled={pending}
        className="rounded-lg bg-blue-500 px-5 py-3 font-medium text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Starting…" : "Start conversation"}
      </button>
      {error && <p className="text-red-400">{error}</p>}
    </div>
  );
}

function ModeSelector({
  mode,
  onChange,
}: {
  mode: EquosModeType;
  onChange: (mode: EquosModeType) => void;
}) {
  return (
    <div className="fixed top-4 right-4 z-[60] flex gap-2 rounded-lg bg-neutral-900/80 p-2 shadow-lg backdrop-blur">
      {MODES.map((m) => (
        <button
          key={m}
          onClick={() => onChange(m)}
          className={`rounded px-3 py-1 text-sm capitalize transition ${
            mode === m
              ? "bg-blue-500 text-white"
              : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
          }`}
        >
          {m}
        </button>
      ))}
    </div>
  );
}

function ConversationControls() {
  const { sendText, sendContext } = useEquosConversation();
  const [textValue, setTextValue] = useState("");
  const [contextValue, setContextValue] = useState("");

  const onSendText = () => {
    const trimmed = textValue.trim();
    if (!trimmed) return;
    sendText(trimmed);
    setTextValue("");
  };

  const onSendContext = () => {
    const trimmed = contextValue.trim();
    if (!trimmed) return;
    sendContext(trimmed);
    setContextValue("");
  };

  return (
    <div className="fixed top-4 left-4 z-[60] flex w-80 flex-col gap-2 rounded-lg bg-neutral-900/80 p-3 shadow-lg backdrop-blur">
      <div className="flex gap-2">
        <input
          type="text"
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSendText()}
          placeholder="Send a message…"
          className="flex-1 rounded border border-neutral-700 bg-neutral-800 px-2 py-1 text-sm text-white placeholder:text-neutral-500"
        />
        <button
          onClick={onSendText}
          className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
        >
          Send
        </button>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={contextValue}
          onChange={(e) => setContextValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSendContext()}
          placeholder="Inject context…"
          className="flex-1 rounded border border-neutral-700 bg-neutral-800 px-2 py-1 text-sm text-white placeholder:text-neutral-500"
        />
        <button
          onClick={onSendContext}
          className="rounded bg-purple-500 px-3 py-1 text-sm text-white hover:bg-purple-600"
        >
          Inject
        </button>
      </div>
    </div>
  );
}
