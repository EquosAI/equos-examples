import os

from equos import (
    Equos,
    EquosAgent,
    CreateEquosAgentRequest,
    AgentProvider,
    GeminiAgentConfig,
    GeminiRealtimeVoices,
    GeminiRealtimeModels,
)

from dotenv import load_dotenv

load_dotenv()


def create_agent() -> None:
    client = Equos(api_key=os.getenv("EQUOS_API_KEY", ""))

    agent: EquosAgent = client.agents.create(
        data=CreateEquosAgentRequest(
            provider=AgentProvider.gemini,
            config=GeminiAgentConfig(
                model=GeminiRealtimeModels.gemini_2_5_flash_exp,
                voice=GeminiRealtimeVoices.Fenrir,
            ),
            instructions="You are a helpful assistant that translates English to French.",
            client=None,  # Optional: specify a client ID if needed for resource segmentation.
        )
    )

    print("Agent created:", agent.id)


if __name__ == "__main__":
    create_agent()
