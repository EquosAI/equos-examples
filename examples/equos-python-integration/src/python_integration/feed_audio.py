import argparse
import asyncio
import os
import subprocess
import wave
from pathlib import Path
from typing import Optional

from equos.models import CreateEquosConversationRequest, EquosParticipantIdentity

from livekit import rtc
from livekit.agents.voice.avatar import DataStreamAudioOutput

from python_integration.client import get_client


SEND_SAMPLE_RATE = 16000
SEND_CHANNELS = 1
SEND_FRAME_DURATION_MS = 40
SEND_SAMPLES_PER_FRAME = SEND_SAMPLE_RATE * SEND_FRAME_DURATION_MS // 1000  # 640
SEND_BYTES_PER_FRAME = SEND_SAMPLES_PER_FRAME * SEND_CHANNELS * 2  # 1280

RECORD_SAMPLE_RATE = 48000
RECORD_CHANNELS = 1

EXAMPLE_ROOT = Path(__file__).resolve().parents[2]
DEFAULT_TMP_DIR = EXAMPLE_ROOT / "tmp"


def open_audio_decoder(input_path: Path) -> subprocess.Popen[bytes]:
    """Decode any audio file to mono 16 kHz s16le PCM via ffmpeg."""
    return subprocess.Popen(
        [
            "ffmpeg",
            "-loglevel", "error",
            "-i", str(input_path),
            "-f", "s16le",
            "-acodec", "pcm_s16le",
            "-ac", str(SEND_CHANNELS),
            "-ar", str(SEND_SAMPLE_RATE),
            "-",
        ],
        stdout=subprocess.PIPE,
    )


def open_video_encoder(
    width: int, height: int, fps: float, output_path: Path
) -> subprocess.Popen[bytes]:
    """Encode raw I420 frames piped on stdin into a video-only mp4 at the given fps."""
    output_path.parent.mkdir(parents=True, exist_ok=True)
    return subprocess.Popen(
        [
            "ffmpeg",
            "-y",
            "-loglevel", "error",
            "-f", "rawvideo",
            "-pix_fmt", "yuv420p",
            "-s", f"{width}x{height}",
            "-r", f"{fps:.4f}",
            "-i", "-",
            "-c:v", "libx264",
            "-pix_fmt", "yuv420p",
            str(output_path),
        ],
        stdin=subprocess.PIPE,
    )


def mux(
    video_path: Path,
    audio_path: Path,
    output_path: Path,
    audio_offset_s: float,
) -> None:
    """Combine video + audio with an offset (positive = delay audio relative to video)."""
    cmd = ["ffmpeg", "-y", "-loglevel", "error"]
    if audio_offset_s >= 0:
        cmd += ["-i", str(video_path), "-itsoffset", f"{audio_offset_s:.3f}", "-i", str(audio_path)]
    else:
        # Audio started before video — delay video instead.
        cmd += ["-itsoffset", f"{-audio_offset_s:.3f}", "-i", str(video_path), "-i", str(audio_path)]
    cmd += [
        "-map", "0:v:0",
        "-map", "1:a:0",
        "-c:v", "copy",
        "-c:a", "aac",
        "-shortest",
        str(output_path),
    ]
    subprocess.run(cmd, check=True)


async def stream_audio_file(sender: DataStreamAudioOutput, input_path: Path) -> None:
    proc = open_audio_decoder(input_path)
    assert proc.stdout is not None
    loop = asyncio.get_running_loop()
    try:
        while True:
            data = await loop.run_in_executor(None, proc.stdout.read, SEND_BYTES_PER_FRAME)
            if not data:
                break
            if len(data) < SEND_BYTES_PER_FRAME:
                data = data + bytes(SEND_BYTES_PER_FRAME - len(data))
            await sender.capture_frame(
                rtc.AudioFrame(
                    data=data,
                    sample_rate=SEND_SAMPLE_RATE,
                    num_channels=SEND_CHANNELS,
                    samples_per_channel=SEND_SAMPLES_PER_FRAME,
                )
            )
            await asyncio.sleep(SEND_FRAME_DURATION_MS / 1000)
    finally:
        proc.stdout.close()
        proc.wait()


VIDEO_FPS = 25.0


class StreamTiming:
    """Tracks when each stream's first frame arrives (monotonic seconds)."""

    def __init__(self) -> None:
        self.video_start: Optional[float] = None
        self.audio_start: Optional[float] = None


async def record_video_stream(
    stream: rtc.VideoStream, output_path: Path, timing: StreamTiming
) -> None:
    proc: Optional[subprocess.Popen[bytes]] = None
    frame_count = 0
    loop = asyncio.get_running_loop()
    try:
        async for event in stream:
            frame = event.frame.convert(rtc.VideoBufferType.I420)
            if proc is None:
                timing.video_start = loop.time()
                proc = open_video_encoder(
                    frame.width, frame.height, VIDEO_FPS, output_path
                )
                print(
                    f"Recording video → {output_path} "
                    f"({frame.width}x{frame.height} @ {VIDEO_FPS:g}fps)"
                )
            assert proc.stdin is not None
            # Offload the blocking pipe write so we don't stall the event loop
            # and trigger native video stream queue overflows.
            await loop.run_in_executor(None, proc.stdin.write, bytes(frame.data))
            frame_count += 1
    finally:
        if proc is not None and proc.stdin is not None:
            proc.stdin.close()
            await loop.run_in_executor(None, proc.wait)
            print(f"Saved {frame_count} video frames to {output_path}")


async def record_audio_stream(
    stream: rtc.AudioStream, output_path: Path, timing: StreamTiming
) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    writer: Optional[wave.Wave_write] = None
    sample_count = 0
    loop = asyncio.get_running_loop()
    try:
        async for event in stream:
            frame = event.frame
            if writer is None:
                if timing.audio_start is None:
                    timing.audio_start = loop.time()
                writer = wave.open(str(output_path), "wb")
                writer.setnchannels(frame.num_channels)
                writer.setsampwidth(2)
                writer.setframerate(frame.sample_rate)
                print(
                    f"Recording audio → {output_path} "
                    f"({frame.sample_rate}Hz x{frame.num_channels})"
                )
            await loop.run_in_executor(None, writer.writeframes, bytes(frame.data))
            sample_count += frame.samples_per_channel
    finally:
        if writer is not None:
            writer.close()
            print(f"Saved {sample_count} audio samples to {output_path}")


async def stop_recording_task(task: Optional[asyncio.Task[None]]) -> None:
    if task is None:
        return
    try:
        await asyncio.wait_for(task, timeout=15)
    except asyncio.TimeoutError:
        task.cancel()
        try:
            await task
        except (asyncio.CancelledError, Exception):
            pass


async def feed_audio_and_save_av(input_path: Path, output_path: Path) -> None:
    if not input_path.is_file():
        raise FileNotFoundError(f"Input audio file not found: {input_path}")

    client = get_client()

    character_id = os.getenv("EQUOS_CHARACTER_ID")
    if not character_id:
        raise RuntimeError("EQUOS_CHARACTER_ID is not set")

    response = await client.conversations.start_async(
        CreateEquosConversationRequest(
            name="Feed audio demo",
            character_id=character_id,
            consumer=EquosParticipantIdentity(name="User", identity="user-id"),
            # Required so equos listens to data-channel audio from this identity.
            remote_agent=EquosParticipantIdentity(
                name="Remote Agent",
                identity="remote-agent-identity",
            ),
        )
    )
    if response is None:
        raise RuntimeError("Failed to start conversation")

    print("Conversation:", response.conversation.id, response.conversation.status)

    if not response.remote_agent_access_token:
        print("No remote agent access token provided.")
        return

    server_url = response.conversation.server_url
    if not server_url:
        print("No server URL on the conversation.")
        return

    avatar_identity = response.conversation.character.livekit_identity

    # Treat output as a directory when it has no file suffix or already exists as one.
    if output_path.suffix == "" or output_path.is_dir():
        output_path = output_path / f"{response.conversation.id}.mp4"
    output_path.parent.mkdir(parents=True, exist_ok=True)

    video_temp_path = output_path.with_suffix(".video.mp4")
    audio_temp_path = output_path.with_suffix(".audio.wav")

    video_stream: Optional[rtc.VideoStream] = None
    audio_stream: Optional[rtc.AudioStream] = None
    video_task: Optional[asyncio.Task[None]] = None
    audio_task: Optional[asyncio.Task[None]] = None
    video_ready = asyncio.Event()
    timing = StreamTiming()

    def on_track_subscribed(
        track: rtc.Track,
        publication: rtc.RemoteTrackPublication,
        participant: rtc.RemoteParticipant,
    ) -> None:
        nonlocal video_task, audio_task, video_stream, audio_stream
        print(
            f"Track subscribed: {track.sid} ({track.kind}), participant: {participant.identity}"
        )
        if participant.identity != avatar_identity:
            return
        if track.kind == rtc.TrackKind.KIND_VIDEO and video_task is None:
            video_stream = rtc.VideoStream(track=track)
            video_task = asyncio.ensure_future(
                record_video_stream(video_stream, video_temp_path, timing)
            )
            video_ready.set()
        elif track.kind == rtc.TrackKind.KIND_AUDIO and audio_task is None:
            audio_stream = rtc.AudioStream(
                track=track,
                sample_rate=RECORD_SAMPLE_RATE,
                num_channels=RECORD_CHANNELS,
            )
            audio_task = asyncio.ensure_future(
                record_audio_stream(audio_stream, audio_temp_path, timing)
            )

    room = rtc.Room()
    room.on("track_subscribed", on_track_subscribed)

    try:
        print("connecting to room...")
        await room.connect(server_url, response.remote_agent_access_token)

        print("waiting for avatar video track...")
        await asyncio.wait_for(video_ready.wait(), timeout=30)

        sender = DataStreamAudioOutput(
            room=room,
            destination_identity=avatar_identity,
            sample_rate=SEND_SAMPLE_RATE,
        )

        print(f"streaming audio from {input_path}...")
        await stream_audio_file(sender, input_path)

        # Give the avatar a moment to finish rendering the tail of the audio.
        print("draining...")
        await asyncio.sleep(2)
    finally:
        # Close streams first so the recording tasks exit and finalize their files
        # before we tear down the room.
        if video_stream is not None:
            await video_stream.aclose()
        if audio_stream is not None:
            await audio_stream.aclose()

        await stop_recording_task(video_task)
        await stop_recording_task(audio_task)

        print("disconnecting from room...")
        await room.disconnect()

        print("stopping conversation...")
        stopped = await client.conversations.stop_async(response.conversation.id)
        if stopped:
            print("Stopped. Status:", stopped.status)

    if video_temp_path.exists() and audio_temp_path.exists():
        # Audio offset = how much later audio started than video.
        # If positive, delay audio in the muxed output to keep them aligned.
        if timing.video_start is not None and timing.audio_start is not None:
            audio_offset_s = timing.audio_start - timing.video_start
        else:
            audio_offset_s = 0.0
        print(
            f"muxing → {output_path} "
            f"(audio offset {audio_offset_s * 1000:+.0f} ms)"
        )
        mux(video_temp_path, audio_temp_path, output_path, audio_offset_s)
        video_temp_path.unlink()
        audio_temp_path.unlink()
        print(f"done: {output_path}")
    else:
        print(
            f"missing recording artifact (video={video_temp_path.exists()}, "
            f"audio={audio_temp_path.exists()}); leaving temp files in place."
        )


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Feed an audio file to an Equos avatar and record its A/V tracks."
    )
    parser.add_argument(
        "input",
        type=Path,
        help="Path to an input audio file (any format ffmpeg can decode).",
    )
    parser.add_argument(
        "-o",
        "--output",
        type=Path,
        default=DEFAULT_TMP_DIR,
        help=(
            "Output mp4 path, or a directory (defaults to ./tmp/). "
            "If a directory is given, the file is named after the conversation id."
        ),
    )
    args = parser.parse_args()

    asyncio.run(feed_audio_and_save_av(args.input, args.output))


if __name__ == "__main__":
    main()
