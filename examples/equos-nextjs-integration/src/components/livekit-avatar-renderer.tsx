import {
  ParticipantTile,
  RoomAudioRenderer,
  TrackLoop,
  useTracks,
} from "@livekit/components-react";
import { Track } from "livekit-client";

export function LiveKitAvatarRenderer() {
  const tracks = useTracks([
    { source: Track.Source.Camera, withPlaceholder: false },
  ]);

  return (
    <div className="max-w-md">
      <TrackLoop tracks={tracks}>
        <div className="max-w-sm">
          <ParticipantTile></ParticipantTile>
        </div>
      </TrackLoop>
      <RoomAudioRenderer />
    </div>
  );
}
