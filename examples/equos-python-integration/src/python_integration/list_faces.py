from python_integration.client import get_client


def list_faces() -> None:
    client = get_client()
    response = client.faces.list(take=50)

    print(f"{len(response.faces)} of {response.total} face(s):")
    for f in response.faces:
        print(f"- {f.id} · {f.identity.value}")


if __name__ == "__main__":
    list_faces()
