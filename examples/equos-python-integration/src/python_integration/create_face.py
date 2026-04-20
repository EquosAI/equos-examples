import sys

from equos.client.errors import UnexpectedStatus
from equos.models import CreateEquosFaceRequest, CreateEquosFaceRequestIdentity

from python_integration.client import get_client


def create_face() -> None:
    client = get_client()
    identity = CreateEquosFaceRequestIdentity.TOMMY

    try:
        face = client.faces.create(CreateEquosFaceRequest(identity=identity))
        print("Face created:", face.id)
    except UnexpectedStatus as err:
        if err.status_code != 409:
            raise
        existing = client.faces.list(take=50)
        match = next(
            (f for f in existing.faces if f.identity.value == identity.value),
            None,
        )
        print(
            f'A face with identity "{identity.value}" already exists for this organization.',
            file=sys.stderr,
        )
        if match is not None:
            print(f"→ Reuse id: {match.id}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    create_face()
