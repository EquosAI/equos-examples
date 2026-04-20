from python_integration.client import get_client


def list_voices() -> None:
    client = get_client()
    response = client.voices.list(take=50)

    print(f"{len(response.voices)} of {response.total} voice(s):")
    for v in response.voices:
        print(f"- {v.id} · {v.identity.value}")


if __name__ == "__main__":
    list_voices()
