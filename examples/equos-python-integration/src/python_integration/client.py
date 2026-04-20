import os

from dotenv import load_dotenv
from equos import EquosClient, EquosOptions

load_dotenv()


def get_client() -> EquosClient:
    api_key = os.getenv("EQUOS_API_KEY")
    if not api_key:
        raise RuntimeError("EQUOS_API_KEY is not set")

    endpoint = os.getenv("EQUOS_ENDPOINT")
    # Omit EquosOptions entirely when no override is set so the SDK's default
    # endpoint (https://api.equos.ai) is used.
    options = EquosOptions(endpoint=endpoint) if endpoint else None

    client = EquosClient(api_key=api_key, options=options)
    # Without this, the SDK silently returns `None` on any non-2xx response.
    client._client.raise_on_unexpected_status = True  # pyright: ignore[reportPrivateUsage]
    return client
