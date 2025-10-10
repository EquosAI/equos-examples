import {
  EquosBrowserEvent,
  EquosLocale,
  initEquosBrowser,
} from "@equos/browser-sdk";
import {
  EquosBubbleList,
  EquosPlaceholderTrigger,
  EquosPopup,
} from "@equos/browser-sdk/react";
import { useEffect, useRef } from "react";

import "@equos/browser-sdk/styles.css";

const equos = initEquosBrowser("");

equos.setPreferredLanguage(EquosLocale.EN);

function App() {
  useEffect(() => {
    equos.on(EquosBrowserEvent.started, (event: Event) => {
      console.log(event);
      console.log((event as CustomEvent).detail);
    });

    equos.on(EquosBrowserEvent.ended, (event: Event) => {
      console.log(event);
      console.log((event as CustomEvent).detail);
    });
  }, []);

  const agent = useRef({
    agentId: "",
    avatarId: "",
    name: "",
    thumbnailUrl: "", // Use url of avatar image (can be copied from equos studio).
  });
  const agents = useRef([agent.current, agent.current]);

  const dark = false;
  const modal = true;
  const ghost = false;
  const size = 512;

  const direction = "row";

  const overrideWidth = 1024;
  const overrideHeight = 600;

  const alignX = "right";
  const alignY = "bottom";

  return (
    <>
      <div
        style={{
          backgroundColor: "white",
          height: "100vh",
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            height: `${overrideHeight || size}px`,
            width: `${overrideWidth || size}px`,
          }}
        >
          <EquosPlaceholderTrigger
            agent={agent.current}
            dark={dark}
            modal={modal}
            ghost={ghost}
          />
        </div>
      </div>

      <EquosPopup alignX={alignX} alignY={alignY}>
        <EquosBubbleList
          agents={agents.current}
          alignX={alignX}
          windowSizeInPixels={size}
          direction={direction}
          dark={dark}
        />
      </EquosPopup>
    </>
  );
}

export default App;
