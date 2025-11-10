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
  GeminiRealtimeModels,
  GeminiRealtimeVoices,
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

  const schema = z.object({
    name: z.string().min(3).max(100).optional(),
    instructions: z.string().min(3).max(10000),
    model: z.enum(GeminiRealtimeModels),
    voice: z.enum(GeminiRealtimeVoices),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "My Agent",
      model: GeminiRealtimeModels.gemini_2_5_flash_native_audio_09_2025,
      voice: GeminiRealtimeVoices.Fenrir,
      instructions: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    if (!isCreating) {
      const { name, model, instructions, voice } = data;
      setIsCreating(true);
      const res = await createAgentAction({
        client: "example-client",
        name,
        provider: AgentProvider.gemini,
        model,
        voice,
        instructions,
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
              <code>
                {createdAgent.model} - {createdAgent.voice}
              </code>
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
              name="model"
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
                      {Object.values(GeminiRealtimeModels).map((model) => (
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
              name="voice"
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
                      {Object.values(GeminiRealtimeVoices).map((voice) => (
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
              name="instructions"
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
