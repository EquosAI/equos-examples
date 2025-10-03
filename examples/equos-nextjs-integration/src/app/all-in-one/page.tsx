"use client";

import { useMemo, useState } from "react";
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
  GeminiAgentConfig,
  GeminiRealtimeModels,
  GeminiRealtimeVoices,
  OpenaiAgentConfig,
  OpenaiRealtimeModels,
  OpenaiRealtimeVoices,
} from "@equos/node-sdk/dist/types/agent.type";
import { DEFAULT_AVATAR, DEFAULT_EQUOS_PROMPT } from "./constants";
import { createSessionAction, stopSessionAction } from "../actions/action";
import { RoomRenderer } from "./room-renderer";

export default function Page() {
  const [session, setSession] = useState<CreateEquosSessionResponse | null>(
    null
  );

  const modelsMap: Record<
    AgentProvider,
    OpenaiRealtimeModels[] | GeminiRealtimeModels[]
  > = useMemo(
    () => ({
      [AgentProvider.openai]: Object.values(OpenaiRealtimeModels),
      [AgentProvider.gemini]: Object.values(GeminiRealtimeModels),
      [AgentProvider.elevenlabs]: [],
    }),
    []
  );

  const voicesMap: Record<
    AgentProvider,
    OpenaiRealtimeVoices[] | GeminiRealtimeVoices[]
  > = useMemo(
    () => ({
      [AgentProvider.openai]: Object.values(OpenaiRealtimeVoices),
      [AgentProvider.gemini]: Object.values(GeminiRealtimeVoices),
      [AgentProvider.elevenlabs]: [],
    }),
    []
  );

  const [instructions, setInstructions] = useState(DEFAULT_EQUOS_PROMPT);
  const [provider, setProvider] = useState<AgentProvider>(AgentProvider.openai);
  const [model, setModel] = useState<
    OpenaiRealtimeModels | GeminiRealtimeModels
  >(modelsMap[provider][0]);
  const [voice, setVoice] = useState<
    OpenaiRealtimeVoices | GeminiRealtimeVoices
  >(voicesMap[provider][0]);

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
          provider,
          config: {
            instructions,
            model,
            voice,
          } as OpenaiAgentConfig | GeminiAgentConfig,
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

  const onProviderChange = (value: AgentProvider) => {
    setProvider(value);

    setTimeout(() => {
      setModel(
        modelsMap[value][0] as OpenaiRealtimeModels | GeminiRealtimeModels
      );
      setVoice(
        voicesMap[value][0] as OpenaiRealtimeVoices | GeminiRealtimeVoices
      );
    }, 50);
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

          <span className="text-sm font-bold">Provider</span>

          <Select
            onValueChange={(value) => onProviderChange(value as AgentProvider)}
            value={provider}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a provider." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                key={AgentProvider.openai}
                value={AgentProvider.openai}
              >
                OpenAI
              </SelectItem>
              <SelectItem
                key={AgentProvider.gemini}
                value={AgentProvider.gemini}
              >
                Gemini
              </SelectItem>
            </SelectContent>
          </Select>

          <span className="text-sm font-bold">Model</span>

          <Select
            onValueChange={(value) =>
              setModel(value as GeminiRealtimeModels | OpenaiRealtimeModels)
            }
            value={model}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a model." />
            </SelectTrigger>
            <SelectContent>
              {modelsMap[provider].map((model) => (
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
            onValueChange={(value) =>
              setVoice(value as GeminiRealtimeVoices | OpenaiRealtimeVoices)
            }
            value={voice}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a voice." />
            </SelectTrigger>
            <SelectContent>
              {voicesMap[provider].map((voice) => (
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
