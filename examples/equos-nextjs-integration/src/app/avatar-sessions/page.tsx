import Component from "./component";
import { EQUOS_AGENT_ID, EQUOS_AVATAR_ID } from "./env";

export default async function Page() {
  return (
    <Component
      agent={{
        agentId: EQUOS_AGENT_ID,
        avatarId: EQUOS_AVATAR_ID,
        name: "Jeremy",
        description: "Equos Agent demonstrating react integration...",
        thumbnailUrl:
          "https://equos-media.s3.fr-par.scw.cloud/organizations/cmfh01k1t0000sc0j0a12ykxs/avatars/avatar-RoucuF.png",
        maxDuration: 120,
        allowAudio: true,
      }}
    />
  );
}
