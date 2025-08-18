"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import "@livekit/components-styles";
import Link from "next/link";
import { useMemo } from "react";

type Example = {
  name: string;
  description: string;
  link: string;
};

export default function Home() {
  const examples: Example[] = useMemo(
    () => [
      {
        name: "Avatar + Agent (Livekit)",
        description:
          "Start sessions with visual avatar and configurable agent hosted by equos using livekit.",
        link: "/avatar-and-agent",
      },
    ],
    []
  );
  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-col flex-1 bg-muted rounded-lg p-4 min-h-[90vh]">
        <h1 className="text-2xl font-bold">
          Equos NextJS Integration Examples
        </h1>
        <span className="text-sm text-muted-foreground">
          See different examples of how to integrate Equos avatars in your
          NextJS applications.
        </span>

        <Separator className="my-8" />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {examples.map((ex) => (
            <Card key={ex.link}>
              <CardHeader>
                <CardTitle className="text-lg font-bold">{ex.name}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  {ex.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href={ex.link}>View</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
