'use server';

import { equos } from "@/lib/equos";
import { EquosAvatarData } from "@equos/node-sdk/dist/types/avatar.type";


export const createAvatarAction = async (name: string, dataUrl: string): Promise<EquosAvatarData> => {
    return equos.avatars.create(name, dataUrl);
}


