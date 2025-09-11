import { Button } from "@/components/ui/button";
import {
  ParticipantTile,
  RoomAudioRenderer,
  TrackLoop,
  useParticipants,
  useTracks,
  useTrackToggle,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { Loader2, Mic, MicOff, PhoneMissed, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export function RoomRenderer({
  onStop,
  onClose,
  avatarIdentity,
  avatarName,
}: {
  onStop: () => Promise<void>;
  onClose: () => Promise<void>;
  avatarIdentity: string;
  avatarName: string;
}) {
  const waitForAvatarToJoin = 20;

  const [avatarJoined, setAvatarJoined] = useState(false);
  const [avatarLeft, setAvatarLeft] = useState(false);

  const [tick, setTick] = useState(0);

  const [stopping, setStopping] = useState(false);

  const tracks = useTracks([
    { source: Track.Source.Camera, withPlaceholder: false },
  ]);

  const { toggle, enabled } = useTrackToggle({
    source: Track.Source.Microphone,
  });

  const avatarCouldNotJoin = useMemo(() => {
    return !avatarJoined && tick > waitForAvatarToJoin - 10;
  }, [avatarJoined, tick]);

  const participants = useParticipants();

  const onHangUp = async () => {
    if (stopping) {
      return;
    }

    setStopping(true);
    await onStop();
    setStopping(false);
  };

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (avatarCouldNotJoin && tick > waitForAvatarToJoin) {
      onStop();
    }
  }, [avatarCouldNotJoin, tick, onStop]);

  useEffect(() => {
    if (avatarJoined) {
      const avatar = participants.find((p) => p.identity === avatarIdentity);

      if (!avatar) {
        setAvatarLeft(true);
      }
    } else {
      const avatar = participants.find((p) => p.identity === avatarIdentity);
      if (avatar) {
        setAvatarJoined(true);
      }
    }
  }, [avatarIdentity, avatarJoined, participants, onStop]);

  return (
    <>
      {!avatarLeft && (
        <div className="relative flex h-full w-full justify-center">
          <TrackLoop tracks={tracks}>
            <div className="relative h-full">
              <ParticipantTile className="relative h-full"></ParticipantTile>
              <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-background/40 py-1 pl-1 pr-4">
                <span className="flex size-6 items-center justify-center rounded-full bg-background p-1 text-xs font-bold">
                  AI
                </span>
                <span className="text-xs">Avatar</span>
              </div>
            </div>
          </TrackLoop>

          <RoomAudioRenderer />

          <div className="absolute bottom-4 z-10 flex w-full items-center justify-center gap-2">
            <Button
              className="flex size-12 items-center justify-center rounded-full bg-background/40 text-white hover:bg-background/80"
              onClick={() => toggle(!enabled)}
            >
              {enabled ? (
                <Mic className="size-7" />
              ) : (
                <MicOff className="size-7" />
              )}
            </Button>

            <Button
              className="flex h-12 items-center justify-center rounded-full bg-red-500/80 px-9 text-white hover:bg-red-400/80"
              onClick={onHangUp}
            >
              {stopping ? (
                <Loader2 className="size-7 animate-spin" />
              ) : (
                <PhoneMissed className="size-7" />
              )}
            </Button>
          </div>

          {!avatarJoined && !avatarCouldNotJoin && (
            <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 flex-col items-center gap-2">
              <span className="animate-pulse text-xs">
                {avatarName} is joining...
              </span>
            </div>
          )}

          {avatarCouldNotJoin && (
            <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-xs">
              <span className="text-xs font-bold">
                Seems like {avatarName} has trouble joining
              </span>
              <span className="text-xs text-muted-foreground">
                Ending session in {Math.max(waitForAvatarToJoin - tick, 0)}s.
              </span>
            </div>
          )}
        </div>
      )}
      {avatarLeft && (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2">
          <PhoneMissed className="size-10" />

          <span className="text-3xl font-bold">
            {avatarName} left the room!
          </span>

          <div className="mt-4 flex items-center gap-1">
            <Button type="button" variant="ghost" onClick={onClose}>
              Close Session
              <X />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
