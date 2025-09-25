import os

from typing import Optional

from equos import (
    Equos,
    EquosSession,
)

from dotenv import load_dotenv

load_dotenv()


def stop_session() -> None:
    client = Equos(api_key=os.getenv("EQUOS_API_KEY", ""))

    EQUOS_SESSION_ID = os.getenv("EQUOS_SESSION_ID", "")

    session: Optional[EquosSession] = client.sessions.stop(id=EQUOS_SESSION_ID)

    if session:
        print("Session status:", session.status)


if __name__ == "__main__":
    stop_session()
