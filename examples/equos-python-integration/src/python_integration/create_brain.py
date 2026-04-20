from equos.models import CreateEquosBrainRequest

from python_integration.client import get_client


def create_brain() -> None:
    client = get_client()

    brain = client.brains.create(
        CreateEquosBrainRequest(
            instructions="You are a helpful assistant that translates English to French.",
            greeting_message="Bonjour! What would you like me to translate?",
        )
    )
    print("Brain created:", brain.id)


if __name__ == "__main__":
    create_brain()
