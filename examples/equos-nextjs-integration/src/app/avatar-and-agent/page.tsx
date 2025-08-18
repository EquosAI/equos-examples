"use client";

import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { LiveKitRoom } from "@livekit/components-react";
import { CreateEquosSessionResponseData } from "@equos/node-sdk/dist/types/session.type";
import { Button } from "@/components/ui/button";
import { EquosError } from "@equos/node-sdk";
import "@livekit/components-styles";
import { createSessionAction, stopSessionAction } from "../actions/action";
import { EQUOS_SALES_ENGINEER_PROMPT } from "@/lib/prompts";
import { LiveKitAvatarRenderer } from "@/components/livekit-avatar-renderer";

export default function Page() {
  const [refImg, setRefImg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [instructions, setInstructions] = useState<string>(
    EQUOS_SALES_ENGINEER_PROMPT
  );

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

    if (loading) {
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
        <h1 className="text-2xl font-bold">Avatar & Agent Managed Session</h1>
        <span className="text-sm text-muted-foreground">
          We manage almost everything. We run the session (livekit) on our
          servers, as well as the avatar and agent. <br />
          You only need to create the session using our apis/sdks, and then
          build UI to display the avatar and agent in your application.
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
            <Button onClick={onStartSession}>
              {loading && <Loader2 className="animate-spin" />}
              Start Session
            </Button>
          </div>
        )}

        {session && (
          <div>
            <LiveKitRoom
              serverUrl={session.session.host.serverUrl}
              token={session.consumerAccessToken}
              audio={true} // We want the user to be able to speak with the microphone.
              video={false} // We don't need the video of the user.
              onDisconnected={onStopSession}
            >
              <LiveKitAvatarRenderer />
            </LiveKitRoom>
            <Button onClick={onStopSession}>
              {loading && <Loader2 className="animate-spin" />}
              Stop
            </Button>
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
                className="rounded-md object-cover w-full h-full"
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
