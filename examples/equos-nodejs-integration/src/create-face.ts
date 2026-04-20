import {
  CreateEquosFaceRequestIdentityEnum,
  ResponseError,
} from "@equos/node-sdk";
import { client } from "./client.js";

// `identity` picks a face from the Equos Gallery.
try {
  const face = await client.faces.createFace({
    createEquosFaceRequest: {
      identity: CreateEquosFaceRequestIdentityEnum.Tommy,
    },
  });
  console.log("Face created:", face.id);
  console.log(face);
} catch (err) {
  if (err instanceof ResponseError && err.response.status === 409) {
    const existing = await client.faces.listFaces({ take: 50 });
    const match = existing.faces.find(
      (f) => f.identity === CreateEquosFaceRequestIdentityEnum.Tommy
    );
    console.error(
      `A face with identity "${CreateEquosFaceRequestIdentityEnum.Tommy}" already exists for this organization.`
    );
    if (match) console.error(`→ Reuse id: ${match.id}`);
    process.exit(1);
  }
  throw err;
}
