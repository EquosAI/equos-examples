import os
import time

from equos.models import CreateEquosConversationRequest, EquosParticipantIdentity

from python_integration.client import get_client


def run_conversation() -> None:
    client = get_client()

    character_id = os.getenv("EQUOS_CHARACTER_ID")
    if not character_id:
        raise RuntimeError("EQUOS_CHARACTER_ID is not set")

    response = client.conversations.start(
        CreateEquosConversationRequest(
            name="Demo conversation",
            character_id=character_id,
            consumer=EquosParticipantIdentity(name="Demo User", identity="demo-user"),
        )
    )

    print("Conversation:", response.conversation.id, response.conversation.status)
    print("Server URL:", response.conversation.server_url)
    print("Consumer token:", response.consumer_access_token)
    print("Sleeping 10s then stopping…")
    time.sleep(10)

    stopped = client.conversations.stop(response.conversation.id)
    if stopped:
        print("Stopped. Status:", stopped.status)


if __name__ == "__main__":
    run_conversation()
