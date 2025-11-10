import os
import asyncio

from equos import (
    Equos,
    EquosAgent,
    CreateEquosAgentRequest,
    AgentProvider,
    GeminiRealtimeVoices,
    GeminiRealtimeModels,
)

from dotenv import load_dotenv

load_dotenv()


async def create_agent() -> None:
    client = Equos(api_key=os.getenv("EQUOS_API_KEY", ""))

    agent: EquosAgent = await client.async_agents.create(
        data=CreateEquosAgentRequest(
            provider=AgentProvider.gemini,
            name="English Translator",
            instructions="You are a helpful assistant that translates English to French.",
            model=GeminiRealtimeModels.gemini_2_5_flash_native_audio_09_2025,
            voice=GeminiRealtimeVoices.Fenrir,
            search=True,
            emotions=True,
            client=None,  # Optional: specify a client ID if needed for resource segmentation.
        )
    )

    print("Agent created:", agent.id)


if __name__ == "__main__":
    asyncio.run(create_agent())
