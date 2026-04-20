import os

from equos.models import CreateEquosCharacterRequest

from python_integration.client import get_client


def create_character() -> None:
    client = get_client()

    brain_id = os.getenv("EQUOS_BRAIN_ID")
    if not brain_id:
        raise RuntimeError("EQUOS_BRAIN_ID is not set")

    character = client.characters.create(
        CreateEquosCharacterRequest(
            name="French Translator",
            livekit_identity=f"french-translator-{os.getpid()}",
            brain_id=brain_id,
            face_id=os.getenv("EQUOS_FACE_ID"),
            voice_id=os.getenv("EQUOS_VOICE_ID"),
            search=False,
        )
    )
    print("Character created:", character.id)


if __name__ == "__main__":
    create_character()
