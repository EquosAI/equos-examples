"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Check, Copy, Loader2 } from "lucide-react";

import {
  AgentProvider,
  EquosAgent,
  GeminiAgentConfig,
  GeminiRealtimeModels,
  GeminiRealtimeVoices,
  OpenaiAgentConfig,
  OpenaiRealtimeModels,
  OpenaiRealtimeVoices,
} from "@equos/node-sdk/dist/types/agent.type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

import { toast } from "sonner";
import { createAgentAction } from "../actions/action";

export default function Page() {
  const [isCreating, setIsCreating] = useState(false);
  const [createdAgent, setCreatedAgent] = useState<EquosAgent | null>(null);

  const [copying, setCopying] = useState<Record<string, boolean>>({});

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

  const [provider, setProvider] = useState<AgentProvider>(AgentProvider.openai);

  const schema = z
    .object({
      provider: z.enum(AgentProvider),
      name: z.string().min(3).max(100).optional(),
      config: z.union([
        z.object({
          instructions: z.string().min(3).max(10000),
          model: z.enum(OpenaiRealtimeModels),
          voice: z.enum(OpenaiRealtimeVoices),
        }),
        z.object({
          instructions: z.string().min(3).max(10000),
          model: z.enum(GeminiRealtimeModels),
          voice: z.enum(GeminiRealtimeVoices),
        }),
      ]),
    })
    .refine(
      (data) => {
        if (data.provider === AgentProvider.openai) {
          return (
            Object.values(OpenaiRealtimeModels).includes(
              data.config.model as OpenaiRealtimeModels
            ) &&
            Object.values(OpenaiRealtimeVoices).includes(
              data.config.voice as OpenaiRealtimeVoices
            )
          );
        } else if (data.provider === AgentProvider.gemini) {
          return (
            Object.values(GeminiRealtimeModels).includes(
              data.config.model as GeminiRealtimeModels
            ) &&
            Object.values(GeminiRealtimeVoices).includes(
              data.config.voice as GeminiRealtimeVoices
            )
          );
        }

        return false;
      },
      { message: "Must use model and voice of the selected provider." }
    );

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "My Agent",
      provider: provider,
      config: {
        instructions: "",
        model: modelsMap[provider][0],
        voice: voicesMap[provider][0],
      } as OpenaiAgentConfig | GeminiAgentConfig,
    },
  });

  const onProviderChange = (value: AgentProvider) => {
    setProvider(value);
    form.setValue("provider", value);

    setTimeout(() => {
      form.setValue(
        "config.model",
        modelsMap[value][0] as OpenaiRealtimeModels | GeminiRealtimeModels
      );
      form.setValue(
        "config.voice",
        voicesMap[value][0] as OpenaiRealtimeVoices | GeminiRealtimeVoices
      );
    }, 50);
  };

  const onSubmit = async (data: z.infer<typeof schema>) => {
    if (!isCreating) {
      const { name, provider, config } = data;
      setIsCreating(true);
      const res = await createAgentAction({
        client: "example-client",
        name,
        provider,
        config,
      }).catch(() => null);

      if (res) {
        setCreatedAgent(res);
        form.reset();
      } else {
        toast.error("Failed to create the agent.", {
          description: "Please try again later.",
        });
      }

      setIsCreating(false);
    }
  };

  return (
    <section className="w-full max-w-xl mx-auto mt-16">
      <h1 className="text-4xl mb-8">Create Equos Agent</h1>
      {createdAgent && (
        <div className="w-full border rounded-lg p-4 flex items-center gap-2">
          <div className="flex flex-col flex-1">
            <span className="text-md font-bold capitalize">
              {createdAgent.name}
            </span>
            <span className="text-md text-muted-foreground">
              {createdAgent.provider}
              <code>{JSON.stringify(createdAgent.config)}</code>
            </span>

            <div className="mt-4">
              <Button
                size="sm"
                onClick={() => {
                  setCopying({ ...copying, [createdAgent.id]: true });
                  navigator.clipboard.writeText(createdAgent.id);
                  setTimeout(
                    () => setCopying({ ...copying, [createdAgent.id]: false }),
                    3000
                  );
                }}
              >
                <code className="max-w-[80px] overflow-hidden text-ellipsis">
                  {createdAgent.id}
                </code>
                {copying[createdAgent.id] ? (
                  <Check className="size-4" />
                ) : (
                  <Copy className="size-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8">
          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="provider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Realtime Provider</FormLabel>
                  <Select onValueChange={onProviderChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an agent provider." />
                      </SelectTrigger>
                    </FormControl>
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="config.model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Model</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a model." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {modelsMap[form.getValues().provider].map((model) => (
                        <SelectItem key={model} value={model}>
                          <span className="capitalize">
                            {model.split("_").join(" ")}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="config.voice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Voice</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a voice." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {voicesMap[form.getValues().provider].map((voice) => (
                        <SelectItem key={voice} value={voice}>
                          <span className="capitalize">
                            {voice.split("_").join(" ")}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="config.instructions"
              render={({ field }) => (
                <div className="grid gap-2">
                  <FormLabel className="font-bold">Instructions</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Describe the personality of your agent."
                      rows={12}
                    />
                  </FormControl>
                  <FormDescription>
                    Need help with your prompt?{" "}
                    <Link
                      href="https://cookbook.openai.com/examples/realtime_prompting_guide"
                      target="_blank"
                      className="underline"
                    >
                      Follow this guide.
                    </Link>
                  </FormDescription>
                  <FormMessage />
                </div>
              )}
            />
          </div>

          <div className="flex items-center justify-end gap-4">
            <Button type="submit">
              {isCreating && <Loader2 className="animate-spin" />}
              Create Agent
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
}
