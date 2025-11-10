"use client";

import { useState } from "react";
import { Loader2, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { toast } from "sonner";
import { LiveKitRoom } from "@livekit/components-react";

import "@livekit/components-styles";

import { CreateEquosSessionResponse } from "@equos/node-sdk/dist/types/session.type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AgentProvider,
  GeminiRealtimeModels,
  GeminiRealtimeVoices,
} from "@equos/node-sdk/dist/types/agent.type";
import { DEFAULT_AVATAR, DEFAULT_EQUOS_PROMPT } from "./constants";
import { createSessionAction, stopSessionAction } from "../actions/action";
import { RoomRenderer } from "./room-renderer";

export default function Page() {
  const [session, setSession] = useState<CreateEquosSessionResponse | null>(
    null
  );

  const [instructions, setInstructions] = useState(DEFAULT_EQUOS_PROMPT);
  const [model, setModel] = useState<GeminiRealtimeModels>(
    GeminiRealtimeModels.gemini_2_5_flash_native_audio_09_2025
  );
  const [voice, setVoice] = useState<GeminiRealtimeVoices>(
    GeminiRealtimeVoices.Fenrir
  );

  const [creating, setCreating] = useState(false);

  const onCreateSession = async () => {
    if (!creating) {
      setCreating(true);

      const res = await createSessionAction({
        name: `Chat with Jeremy`,
        client: "playground",
        consumerIdentity: {
          identity: "client-identity",
          name: "Client Name",
        },
        avatar: {
          refImage: DEFAULT_AVATAR,
          name: "Jeremy",
          identity: "jeremy",
        },
        agent: {
          provider: AgentProvider.gemini,
          model,
          voice,
          instructions,
        },
      }).catch((e) => {
        if (e.message.includes("FREEMIUM_LIMIT")) {
          toast.error("Freemium Limit", {
            description:
              "You have reached the freemium limit. Setup a payment method to continue using the service.",
          });
        }
        return null;
      });

      if (!res) {
        toast.error("An error occurred while creating the session.", {
          description: "Please refresh the page and try again.",
        });
      } else {
        setSession(res);
      }

      setCreating(false);
    }
  };

  const onHangUp = async () => {
    if (session) {
      const result = await stopSessionAction(session.session.id).catch(() => {
        toast.error("Error while stopping the session...", {
          description: "Sessions automatically end in the next 45 seconds.",
        });
      });
    }

    setSession(null);
  };

  return (
    <>
      <div className="flex gap-4">
        <div className="mx-auto flex flex-1 flex-col items-center gap-8 rounded-xl p-8">
          {
            <>
              <div className="relative flex aspect-video w-full items-center justify-center">
                <img
                  src={DEFAULT_AVATAR}
                  alt="Current Avatar"
                  className="absolute inset-0 -z-0 h-full w-full object-cover blur-lg"
                />

                <div className="z-10 flex flex-col items-center gap-8">
                  <span className="text-4xl font-bold">Talk to Jeremy</span>
                  <Button size="lg" onClick={onCreateSession}>
                    {creating ? <Loader2 className="animate-spin" /> : <Play />}
                    Start Conversation
                  </Button>
                </div>
              </div>
            </>
          }
        </div>

        <div className="flex w-1/3 flex-col gap-4">
          <div className="flex flex-col">
            <span className="flex items-center gap-2 text-lg font-bold">
              Agent Persona
            </span>
            <span className="text-sm text-muted-foreground">
              Build your agent&apos;s persona
            </span>
          </div>

          <span className="text-sm font-bold">Model</span>

          <Select
            onValueChange={(value) => setModel(value as GeminiRealtimeModels)}
            value={model}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a model." />
            </SelectTrigger>
            <SelectContent>
              {Object.values(GeminiRealtimeModels).map((model) => (
                <SelectItem key={model} value={model}>
                  <span className="capitalize">
                    {model.split("_").join(" ")}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <span className="text-sm font-bold">Voice</span>

          <Select
            onValueChange={(value) => setVoice(value as GeminiRealtimeVoices)}
            value={voice}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a voice." />
            </SelectTrigger>
            <SelectContent>
              {Object.values(GeminiRealtimeVoices).map((voice) => (
                <SelectItem key={voice} value={voice}>
                  <span className="capitalize">
                    {voice.split("_").join(" ")}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <span className="text-sm font-bold">Instructions</span>

          <Textarea
            className="h-full"
            value={instructions}
            rows={40}
            onChange={(e) => setInstructions(e.target.value)}
          />
        </div>
      </div>
      {session && (
        <aside className="fixed bottom-0 left-0 top-0 z-50 flex w-full items-center justify-center bg-black/75">
          <section className="max-w-screen aspect-square h-[512px] max-h-screen w-fit overflow-hidden rounded-xl bg-background">
            <LiveKitRoom
              serverUrl={session.session.host.serverUrl}
              token={session.consumerAccessToken}
              audio={true} // We want the user to be able to speak with the microphone.
              video={false} // We don't need the video of the user.
            >
              <RoomRenderer
                onStop={onHangUp}
                onClose={async () => setSession(null)}
                avatarIdentity={session.session.avatar.identity}
                avatarName={session.session.avatar.name}
              />
            </LiveKitRoom>
          </section>
        </aside>
      )}
    </>
  );
}
