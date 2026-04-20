import sys

from equos.client.errors import UnexpectedStatus
from equos.models import CreateEquosVoiceRequest, CreateEquosVoiceRequestIdentity

from python_integration.client import get_client


def create_voice() -> None:
    client = get_client()
    identity = CreateEquosVoiceRequestIdentity.CHARON

    try:
        voice = client.voices.create(
            CreateEquosVoiceRequest(
                identity=identity,
                instructions="Warm, friendly, conversational tone.",
            )
        )
        print("Voice created:", voice.id)
    except UnexpectedStatus as err:
        if err.status_code != 409:
            raise
        existing = client.voices.list(take=50)
        match = next(
            (v for v in existing.voices if v.identity.value == identity.value),
            None,
        )
        print(
            f'A voice with identity "{identity.value}" already exists for this organization.',
            file=sys.stderr,
        )
        if match is not None:
            print(f"→ Reuse id: {match.id}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    create_voice()
