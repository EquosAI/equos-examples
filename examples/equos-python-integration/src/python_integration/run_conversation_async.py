import asyncio
import os

from equos.models import CreateEquosConversationRequest, EquosParticipantIdentity

from python_integration.client import get_client


async def run_conversation_async() -> None:
    client = get_client()

    character_id = os.getenv("EQUOS_CHARACTER_ID")
    if not character_id:
        raise RuntimeError("EQUOS_CHARACTER_ID is not set")

    response = await client.conversations.start_async(
        CreateEquosConversationRequest(
            name="Demo conversation",
            character_id=character_id,
            consumer=EquosParticipantIdentity(name="Demo User", identity="demo-user"),
        )
    )

    print("Conversation:", response.conversation.id, response.conversation.status)
    print("Consumer token:", response.consumer_access_token)

    await asyncio.sleep(10)

    stopped = await client.conversations.stop_async(response.conversation.id)
    if stopped:
        print("Stopped. Status:", stopped.status)


if __name__ == "__main__":
    asyncio.run(run_conversation_async())
