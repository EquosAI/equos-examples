import "@equos/browser-sdk/web";

import { EquosBrowserEvent, initEquosBrowser } from "@equos/browser-sdk";

import { AGENT, PUBLIC_KEY } from "../env.ts";

const run = () => {
  const equos = initEquosBrowser(PUBLIC_KEY);

  equos.on(EquosBrowserEvent.started, console.log);
  equos.on(EquosBrowserEvent.ended, console.log);

  const el = document.querySelector("equos-bubble-list");
  (el as any).agents = [AGENT];

  const placeholder = document.querySelector("equos-placeholder-trigger");
  (placeholder as any).agent = AGENT;
};

run();
