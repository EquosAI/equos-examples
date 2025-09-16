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

load_dotenv()


EQUOS_AGENT_ID = "cmfkz7til0003n10jdgp5annq"
EQUOS_AVATAR_ID = "cmfkz80fl000do50jj2u2nim5"


async def run_session() -> None:
    client = Equos(api_key=os.getenv("EQUOS_API_KEY", ""))

    response: CreateEquosSessionResponse = await client.async_sessions.create(
        data=CreateEquosSessionRequest(
            name="Translation Session",
            client=None,  # Optional: specify a client ID if needed for resource segmentation.
            agent=EquosResourceId(id=EQUOS_AGENT_ID),
            avatar=EquosResourceId(id=EQUOS_AVATAR_ID),
            consumerIdentity=EquosParticipantIdentity(name="User", identity="user-id"),
        )
    )

    print("Session created:", response.session.id)
    print("Access token:", response.consumerAccessToken)

    session: Optional[EquosSession] = await client.async_sessions.stop(
        id=response.session.id
    )

    if session:
        print("Session status:", session.status)


if __name__ == "__main__":
    asyncio.run(run_session())
