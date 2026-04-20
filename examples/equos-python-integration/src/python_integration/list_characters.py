from python_integration.client import get_client


def list_characters() -> None:
    client = get_client()
    response = client.characters.list(take=50)

    print(f"{len(response.characters)} of {response.total} character(s):")
    for c in response.characters:
        print(f"- {c.id} · {c.name}")


if __name__ == "__main__":
    list_characters()
