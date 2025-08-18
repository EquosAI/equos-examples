"use server";

import { equos } from "@/lib/equos";
import {
  CreateEquosSessionResponseData,
  EquosSessionData,
} from "@equos/node-sdk/dist/types/session.type";

export const createSessionAction = async (
  refImage: string,
  instructions: string
): Promise<CreateEquosSessionResponseData> => {
  return equos.sessions.create({
    name: "Equos Nextjs Integration Session",
    avatar: {
      refImage,
      name: "Equos Avatar Name",
      identity: "equos-avatar-identity",
    },
    agent: {
      instructions,
    },
    consumerIdentity: {
      name: "User Name",
      identity: "user-identity",
    },
  });
};

export const stopSessionAction = async (
  id: string
): Promise<EquosSessionData> => {
  return equos.sessions.stop(id);
};
