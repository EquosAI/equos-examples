"use server";

import { equos } from "@/lib/equos";
import {
  CreateEquosAgentRequest,
  EquosAgent,
} from "@equos/node-sdk/dist/types/agent.type";
import {
  CreateEquosAvatarRequest,
  EquosAvatar,
} from "@equos/node-sdk/dist/types/avatar.type";
import {
  CreateEquosSessionRequest,
  CreateEquosSessionResponse,
  EquosSession,
  ListEquosSessionsResponse,
} from "@equos/node-sdk/dist/types/session.type";

export const createSessionAction = async (
  data: CreateEquosSessionRequest
): Promise<CreateEquosSessionResponse> => {
  return equos.sessions.create(data);
};

export const stopSessionAction = async (id: string): Promise<EquosSession> => {
  return equos.sessions.stop(id);
};

export const listSessionsAction =
  async (): Promise<ListEquosSessionsResponse> => {
    return equos.sessions.list();
  };

export const createAgentAction = async (
  data: CreateEquosAgentRequest
): Promise<EquosAgent> => {
  return equos.agents.create(data);
};

export const createAvatarAction = async (
  data: CreateEquosAvatarRequest
): Promise<EquosAvatar> => {
  return equos.avatars.create(data);
};
