from python_integration.client import get_client


def list_brains() -> None:
    client = get_client()
    response = client.brains.list(take=50)

    print(f"{len(response.brains)} of {response.total} brain(s):")
    for b in response.brains:
        preview = " ".join(b.instructions.split())[:60]
        ellipsis = "…" if len(b.instructions) > 60 else ""
        print(f"- {b.id} · {preview}{ellipsis}")


if __name__ == "__main__":
    list_brains()
