"use client";

import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import { CreateEquosSessionResponseData } from "@equos/node-sdk/dist/types/session.type";
import { createSessionAction, stopSessionAction } from "./actions/action";
import { Button } from "@/components/ui/button";
import { EquosError } from "@equos/node-sdk";
import "@livekit/components-styles";

export default function Home() {
  const [refImg, setRefImg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [instructions, setInstructions] =
    useState<string>(`You are a friendly, enthusiastic Korean language teacher. Your role is to help the student practice Korean through natural, real-life conversations. Adapt to the student’s level:

If the student is a beginner, speak slowly, clearly, and use simple Korean phrases with English support when needed. Explain vocabulary and grammar in a natural, encouraging way.

If the student is intermediate or advanced, use more Korean, correct mistakes gently, and introduce new vocabulary, cultural nuances, and natural expressions.

Your teaching style:

Conversational: Prioritize dialogue over lectures. Use real-life topics like greetings, ordering food, shopping, hobbies, or traveling in Korea.

Interactive: Ask the student questions, encourage them to answer, and give feedback.

Supportive: Be patient, cheerful, and motivating. Praise progress and gently correct errors.

Cultural: Occasionally add small cultural insights (e.g., polite vs casual speech, common expressions, gestures, or traditions).

Adaptive: If the student struggles, simplify your language. If they are comfortable, gradually increase difficulty.

Tone:

Warm, energetic, encouraging — like a tutor who makes learning fun and confidence-building.

Mix Korean and English depending on the student’s ability.

Goal:
Help the student build confidence in speaking Korean through engaging, realistic conversations, while steadily improving their vocabulary, pronunciation, grammar, and cultural understanding.
    `);

  const [session, setSession] = useState<CreateEquosSessionResponseData | null>(
    null
  );

  const onDropFile = async (acceptedFiles: FileWithPath[]) => {
    const file = acceptedFiles[0];
    if (!file) {
      toast.error("File is too large.");
      return;
    }

    console.log(URL.createObjectURL(file));
    console.log("File dropped:", file);

    const reader = new FileReader();

    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setRefImg(dataUrl);
    };

    reader.readAsDataURL(file);
  };

  const onChangeInstructions = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInstructions(e.target.value);
  };

  const fileDropzone = useDropzone({
    onDrop: onDropFile,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpeg", ".jpg"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10 MB
  });

  const onStartSession = async () => {
    if (!refImg || !instructions) {
      toast.error("Please select a reference image and define instructions.");
      return;
    }

    if (loading) {
      return;
    }

    if (session) {
      toast.error("Please end the current session before starting a new one.");
      return;
    }

    setLoading(true);

    const sessionData = await createSessionAction(refImg, instructions).catch(
      (error: EquosError) => {
        toast.error(`Error: ${error.message}`);

        return null;
      }
    );
    setSession(sessionData);
    setLoading(false);
  };

  const onStopSession = async () => {
    if (!session) {
      toast.error("No active session to stop.");
      return;
    }

    setLoading(true);

    try {
      await stopSessionAction(session.session.id);
      setSession(null);
      toast.success("Session stopped successfully.");
    } catch (error) {
      toast.error("Failed to stop session. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-col flex-1 bg-muted rounded-lg p-4 min-h-[90vh]">
        <h1 className="text-2xl font-bold">Session Playground</h1>
        <span className="text-sm text-muted-foreground">
          This playground showases how can simply integrate equos avatars in
          their nextjs applications.
        </span>

        <Separator className="my-8" />

        {(!refImg || !instructions) && (
          <div>
            <h2 className="font-bold">Get started with integration:</h2>
            <ol className="list-decimal ml-4 pl-4 space-y-2 mt-4">
              <li>
                Copy <code className="text-blue-500">.env.template</code> into a
                new <code className="text-blue-500">.env</code> file (in the
                same directory).
              </li>
              <li>
                Add your <code className="text-blue-500">EQUOS_API_KEY</code> to
                the <code className="text-blue-500">.env</code> file.
              </li>

              <li>Select avatar reference image in the right panel.</li>
              <li>Define avatar persona in the right panel.</li>
              <li>Click start session.</li>
            </ol>
          </div>
        )}

        {!!refImg && !!instructions && !session && (
          <div>
            <Button onClick={onStartSession}>Start Session</Button>
          </div>
        )}

        {session && (
          <div>
            <LiveKitRoom
              serverUrl={session.session.host.serverUrl}
              token={session.consumerAccessToken}
              audio={true}
              video={true}
              onDisconnected={onStopSession}
              data-lk-theme="default"
              className="lk-room-container"
            >
              <VideoConference></VideoConference>
            </LiveKitRoom>
          </div>
        )}
      </div>
      <div className="flex flex-col w-64 rounded-lg p-4 min-h-[90vh] space-y-8">
        <div className="flex flex-col gap-4">
          <span className="text-sm font-bold">Reference Image</span>
          <div
            {...fileDropzone.getRootProps()}
            className={`h-56 w-full cursor-pointer rounded-md border border-dashed transition-colors hover:ring-primary`}
          >
            {!!refImg && (
              <img
                src={refImg}
                alt="Test Ref Image"
                className="rounded-md object-contain"
              />
            )}
            {!refImg && (
              <div className="size-full rounded-md flex items-center justify-center">
                <Plus />
              </div>
            )}
            <input {...fileDropzone.getInputProps()} />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <span className="text-sm font-bold">Agent Personna</span>
          <Textarea
            placeholder="Enter instructions to define the agent behaviour."
            rows={16}
            className="min-h-56 max-h-[60vh]"
            onChange={onChangeInstructions}
            value={instructions}
          />
        </div>
      </div>
    </div>
  );
}
