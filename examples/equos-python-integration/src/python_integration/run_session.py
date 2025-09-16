import os

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


EQUOS_AGENT_ID = os.getenv("EQUOS_AGENT_ID", "")
EQUOS_AVATAR_ID = os.getenv("EQUOS_AVATAR_ID", "")


def run_session() -> None:
    client = Equos(api_key=os.getenv("EQUOS_API_KEY", ""))

    response: CreateEquosSessionResponse = client.sessions.create(
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

    session: Optional[EquosSession] = client.sessions.stop(id=response.session.id)

    if session:
        print("Session status:", session.status)


if __name__ == "__main__":
    run_session()
