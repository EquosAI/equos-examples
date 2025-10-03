import os
import asyncio

from typing import Optional

from equos import (
    Equos,
    EquosResourceId,
    CreateEquosSessionRequest,
    CreateEquosSessionResponse,
    EquosParticipantIdentity,
    EquosSession,
)

from dotenv import load_dotenv

from livekit.agents.voice.avatar import DataStreamAudioOutput
from livekit import rtc

load_dotenv()


EQUOS_AVATAR_ID = os.getenv("EQUOS_AVATAR_ID", "")


async def feed_audio_and_get_video_back() -> None:
    client = Equos(
        api_key=os.getenv("EQUOS_API_KEY", ""),
    )

    response: CreateEquosSessionResponse = await client.async_sessions.create(
        data=CreateEquosSessionRequest(
            name="Translation Session",
            client=None,  # Optional: specify a client ID if needed for resource segmentation.
            agent=None,  # No agent, will use own agent.
            avatar=EquosResourceId(id=EQUOS_AVATAR_ID),
            consumerIdentity=EquosParticipantIdentity(name="User", identity="user-id"),
            remoteAgentConnectingIdentity=EquosParticipantIdentity(
                name="Remote Agent",
                identity="remote-agent-identity",  # Required for equos to listen to the data channel audio.
            ),
        )
    )

    print("Session created:", response.session.id)
    print("Consumer token:", response.consumerAccessToken)
    print("Agent token:", response.remoteAgentAccessToken)

    if not response.remoteAgentAccessToken:
        print("No remote agent access token provided.")
        return

    async def receive_frames(stream: rtc.VideoStream) -> None:
        async for event in stream:
            frame = event.frame.data
            print("Received video frame:", len(frame))

    def on_track_subscribed(
        track: rtc.Track,
        publication: rtc.RemoteTrackPublication,
        participant: rtc.RemoteParticipant,
    ) -> None:
        print(
            f"Track subscribed: {track.sid} ({track.kind}), participant: {participant.identity}"
        )

        # Make sure it's the avatar's video track.
        if participant.identity == response.session.avatar.identity:
            if track.kind == rtc.TrackKind.KIND_VIDEO:
                v_stream = rtc.VideoStream(track=track)
                asyncio.ensure_future(receive_frames(v_stream))

    # Connect to room as remote agent.
    room = rtc.Room()

    # Subscribe to the track that contains the avatar output video.
    room.on("track_subscribed", on_track_subscribed)

    try:
        print("connecting to room...")
        await room.connect(
            response.session.host.serverUrl, response.remoteAgentAccessToken
        )
    except Exception as e:
        print(f"Failed to connect to room: {e}")
        return

    # send  audio to data channel with DataStreamAudioSender
    sender = DataStreamAudioOutput(
        room=room,
        destination_identity=response.session.avatar.identity,
        sample_rate=16000,
    )

    for _ in range(250):
        print("Sending audio frame...")
        await sender.capture_frame(
            rtc.AudioFrame(
                data=bytearray(640),
                sample_rate=16000,
                num_channels=1,
                samples_per_channel=640,
            )
        )
        await asyncio.sleep(0.04)

    print("disconnecting from room...")
    await room.disconnect()

    print("stopping session...")
    session: Optional[EquosSession] = await client.async_sessions.stop(
        id=response.session.id
    )

    if session:
        print("Session status:", session.status)


if __name__ == "__main__":
    asyncio.run(feed_audio_and_get_video_back())
