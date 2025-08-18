"use server";

import { equos } from "@/lib/equos";
import { EquosError } from "@equos/node-sdk";
import { EquosAvatarData } from "@equos/node-sdk/dist/types/avatar.type";
import {
  CreateEquosSessionResponseData,
  EquosSessionData,
} from "@equos/node-sdk/dist/types/session.type";

export const createAvatarAction = async (
  name: string,
  dataUrl: string
): Promise<EquosAvatarData> => {
  return equos.avatars.create(name, dataUrl);
};

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
