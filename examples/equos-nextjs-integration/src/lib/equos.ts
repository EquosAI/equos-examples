import { Equos } from "@equos/node-sdk";

// !!!!!!!!!! THIS IS A SERVER-SIDE-ONLY PRIVATE KEY !!!!!!!!!!!
// !!!!!!!!!! DO NOT SHARE THIS KEY !!!!!!!!!!!
const EQUOS_API_KEY: string = process.env.EQUOS_API_KEY ?? "";

export const equos = Equos.client(EQUOS_API_KEY);
