"use client";

import { EquosBrowserEvent, initEquosBrowser } from "@equos/browser-sdk";
import {
  EquosBubbleTrigger,
  EquosPlaceholderTrigger,
  EquosPopup,
} from "@equos/browser-sdk/react";
import { useEffect, useRef, useState } from "react";

import "@equos/browser-sdk/styles.css";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from "lucide-react";
import { EQUOS_AGENT_ID, EQUOS_AVATAR_ID, EQUOS_PUBLIC_KEY } from "./env";
import { Switch } from "./components/ui/switch";
import { Slider } from "./components/ui/slider";
import { Button } from "./components/ui/button";

export default function App() {
  const agent = useRef({
    agentId: EQUOS_AGENT_ID,
    avatarId: EQUOS_AVATAR_ID,
    name: "Jeremy",
    description: "Equos Agent demonstrating react integration...",
    thumbnailUrl:
      "https://equos-media.s3.fr-par.scw.cloud/organizations/cmfh01k1t0000sc0j0a12ykxs/avatars/avatar-RoucuF.png",
    maxDuration: 120,
    allowAudio: true,
  });
  const equos = useRef(initEquosBrowser(EQUOS_PUBLIC_KEY));

  const [dark, setDark] = useState(false);
  const [modal, setModal] = useState(true);
  const [ghost, setGhost] = useState(false);

  const [alignX, setAlignX] = useState<"left" | "right">("right");
  const [alignY, setAlignY] = useState<"top" | "bottom">("bottom");

  const [windowSize, setWindowSize] = useState<number>(512);

  useEffect(() => {
    const onSessionStarted = (e: Event) => {
      console.log("Session started", e);
    };
    const onSessionEnded = (e: Event) => {
      console.log("Session ended", e);
    };

    const onError = (e: Event) => {
      console.error("Session error", e);
    };

    equos.current.on(EquosBrowserEvent.started, onSessionStarted);
    equos.current.on(EquosBrowserEvent.ended, onSessionEnded);
    equos.current.on(EquosBrowserEvent.error, onError);

    return () => {
      if (equos.current) {
        equos.current.off(EquosBrowserEvent.started, onSessionStarted);
        equos.current.off(EquosBrowserEvent.ended, onSessionEnded);
        equos.current.off(EquosBrowserEvent.error, onError);
      }
    };
  }, []);

  const onStartProgrammatically = () => {
    console.log(equos.current.triggers.keys().next().value);
    console.log(
      equos.current.start(equos.current.triggers.keys().next().value!)
    );
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center gap-2">
      <h1 className="text-2xl font-bold">Avatar Sessions</h1>
      <p className="text-muted-foreground mb-4">
        This page uses Equos react components to run sessions in react
        applications.
      </p>

      <div className="flex items-start gap-8 min-h-[512px]">
        <div className="flex-1">
          <div style={{ height: windowSize, width: windowSize }}>
            <EquosPlaceholderTrigger
              agent={agent.current}
              dark={dark}
              modal={modal}
              ghost={ghost}
              windowSizeInPixels={windowSize}
            />
          </div>
        </div>
        <div className="flex flex-col flex-1 w-full max-w-3xl mx-auto gap-4">
          <h2 className="text-2xl font-bold">Params</h2>
          <div className="flex w-full">
            <div className="flex flex-col w-full">
              <span className="font-bold">Window Size {windowSize}px.</span>
              <Slider
                defaultValue={[512]}
                max={512}
                min={256}
                step={1}
                onValueChange={(value) => setWindowSize(value[0])}
              />
            </div>
          </div>
          <div className="flex items-center mt-8 justify-around gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="modal"
                checked={modal}
                onCheckedChange={(checked) => setModal(checked)}
              />
              <label htmlFor="modal">Launch Session in modal</label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="dark"
                checked={dark}
                onCheckedChange={(dark) => setDark(dark)}
              />
              <label htmlFor="dark">Dark Mode</label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="ghost"
                checked={ghost}
                onCheckedChange={(ghost) => setGhost(ghost)}
              />
              <label htmlFor="ghost">
                Ghost Mode (No component, launch sessions programmatically)
              </label>
            </div>
          </div>

          <span className="font-bold">Change bubble position</span>
          <div className="flex flex-col items-center mt-8 center gap-4">
            <Button onClick={() => setAlignY("top")}>
              <ArrowUp />
            </Button>

            <div className="flex gap-16">
              <Button onClick={() => setAlignX("left")}>
                <ArrowLeft />
              </Button>
              <Button onClick={() => setAlignX("right")}>
                <ArrowRight />
              </Button>
            </div>

            <Button onClick={() => setAlignY("bottom")}>
              <ArrowDown />
            </Button>
          </div>
        </div>

        <div className="flex mt-8">
          {ghost && (
            <Button onClick={onStartProgrammatically}>
              Start Ghost session
            </Button>
          )}
        </div>
      </div>

      <EquosPopup alignX={alignX} alignY={alignY}>
        <EquosBubbleTrigger
          dark={dark}
          windowSize={windowSize}
          agent={agent.current}
        ></EquosBubbleTrigger>
      </EquosPopup>
    </div>
  );
}
