"use client";

import { EquosConversationRenderer } from "@equos/react";
import type { CreateEquosConversationResponse } from "@equos/node-sdk";
import { useCallback, useState, useTransition } from "react";

import { startConversationAction, stopConversationAction } from "./actions";

export function ConversationClient() {
  const [response, setResponse] =
    useState<CreateEquosConversationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

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

  if (response) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="max-w-[1080px] aspect-video w-full rounded-xl overflow-hidden">
          <EquosConversationRenderer
            conversation={response.conversation}
            accessToken={response.consumerAccessToken}
            allowMic
            allowCamera
            allowScreenshare
            allowHangUp
            onHangUp={stop}
          />
        </div>
      </div>
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
