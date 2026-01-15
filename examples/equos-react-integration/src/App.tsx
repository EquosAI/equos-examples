"use client";

import {
  EquosBrowserEvent,
  EquosLocale,
  initEquosBrowser,
} from "@equos/browser-sdk";
import {
  EquosBubbleTrigger,
  EquosPlaceholderTrigger,
  EquosPopup,
} from "@equos/browser-sdk/react";
import { useEffect, useRef } from "react";

import "@equos/browser-sdk/styles.css";
import logo from "./logo.svg";

export default function App() {
  document.documentElement.classList.add("dark");

  const agent_callum = useRef({
    agentId: "cmk568wdn00doh30j9aw6sv4c",
    avatarId: "cmgrwit4o0007ew0j8886xvha",
    name: "Callum",
    description: "Equos Video Game Character",
    thumbnailUrl:
      "https://equos-media.s3.fr-par.scw.cloud/organizations/cmgrvy8nm0015vx0jhpp0533q/avatars/avatar-jcb2hs.png",
    maxDuration: 300,
    allowAudio: true,
  });
  const agent_harper = useRef({
    agentId: "cmk565afa00cphm0j6iu9kq5c",
    avatarId: "cmgrwjd7f0009fa0jtnlu690o",
    name: "Harper",
    description: "Equos Sales Agent",
    thumbnailUrl:
      "https://equos-media.s3.fr-par.scw.cloud/organizations/cmgrvy8nm0015vx0jhpp0533q/avatars/avatar-zC1WV6.png",
    maxDuration: 300,
    allowAudio: true,
  });
  const agent_alexis = useRef({
    agentId: "cmk562m2200fdi90jed6got8w",
    avatarId: "cmgrwk0uk0007i00j600k52rr",
    name: "Alexis",
    description: "Equos Support Agent",
    thumbnailUrl:
      "https://equos-media.s3.fr-par.scw.cloud/organizations/cmgrvy8nm0015vx0jhpp0533q/avatars/avatar-MR5APr.png",
    maxDuration: 300,
    allowAudio: true,
  });
  const agent_joe = useRef({
    agentId: "cmk5674q800cthm0jmrlpfwe1",
    avatarId: "cmgrwkgdq000li20jgudphcaw",
    name: "Joe",
    description: "Equos Mindfulness Coach",
    thumbnailUrl:
      "https://equos-media.s3.fr-par.scw.cloud/organizations/cmgrvy8nm0015vx0jhpp0533q/avatars/avatar-FrCMJf.png",
    maxDuration: 300,
    allowAudio: true,
  });
  const equos = useRef(initEquosBrowser("pk_F7eTyD1h1i5xPn02utVSJY8zKzII5JZ"));

  equos.current.setPreferredLanguage(EquosLocale.EN);

  const dark = false;
  const modal = true;
  const ghost = false;
  const alignX: "left" | "right" = "right";
  const alignY: "top" | "bottom" = "bottom";
  const windowSize = 512;

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

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex justify-between items-center w-full py-2 px-8 border-b border-0.5">
        <img src={logo} alt="Logo" className="h-6" />
        <button className="bg-primary text-black px-2 py-1 rounded-full text-sm">
          Try our platform
        </button>
      </div>
      <div className="flex flex-col gap-4">
        <h1 className="md:text-6xl text-4xl font-bold text-center">
          The Fastest Way to <br /> Bring Real-Time AI Avatars <br /> into Your
          Product
        </h1>
        <p className="text-muted-foreground md:text-lg text-sm text-center">
          From a single photo to an audio-driven lifelike digital human, <br />{" "}
          ready to interact with your users — in real time.
        </p>
      </div>

      <div className="flex md:flex-row flex-col gap-8 mb-12 items-center">
        <div className="flex flex-col gap-4 items-center">
          <div style={{ height: 300, width: 300 }}>
            <EquosPlaceholderTrigger
              agent={agent_harper.current}
              dark={dark}
              modal={modal}
              ghost={ghost}
              windowSizeInPixels={windowSize}
            />
          </div>
          <div className="flex flex-col w-[300px]">
            <h2 className="text-md font-bold">Sales Tutor</h2>
            <p className="text-muted-foreground text-xs">
              Harper is a dynamic, upbeat sales consultant who passionately
              showcases Equos’ AI avatar solutions, turning complex tech into
              clear business value with charm and strategic insight.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4 items-center">
          <div style={{ height: 300, width: 300 }}>
            <EquosPlaceholderTrigger
              agent={agent_callum.current}
              dark={dark}
              modal={modal}
              ghost={ghost}
              windowSizeInPixels={windowSize}
            />
          </div>
          <div className="flex flex-col w-[300px]">
            <h2 className="text-md font-bold">Video Game Character</h2>
            <p className="text-muted-foreground text-xs">
              Callum is a witty and eccentric wizard from Quos who guides
              adventurers on their quest for the eight legendary gemstones with
              dramatic flair and magical wisdom.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4 items-center">
          <div style={{ height: 300, width: 300 }}>
            <EquosPlaceholderTrigger
              agent={agent_joe.current}
              dark={dark}
              modal={modal}
              ghost={ghost}
              windowSizeInPixels={windowSize}
            />
          </div>
          <div className="flex flex-col w-[300px]">
            <h2 className="text-md font-bold">English Coach</h2>
            <p className="text-muted-foreground text-xs">
              Joe is a gentle and intuitive mindfulness coach who helps people
              find calm, balance, and emotional clarity through compassionate,
              personalized guidance and mindful awareness.
            </p>
          </div>
        </div>
      </div>

      <EquosPopup alignX={alignX} alignY={alignY}>
        <EquosBubbleTrigger
          dark={dark}
          windowSizeInPixels={300}
          agent={agent_alexis.current}
        ></EquosBubbleTrigger>
      </EquosPopup>
    </div>
  );
}
