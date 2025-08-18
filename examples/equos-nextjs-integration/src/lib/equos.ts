import { Equos } from "@equos/node-sdk";


// Make sure the key is not exposed in the client-side code.
const EQUOS_API_KEY: string = process.env.EQUOS_API_KEY ?? ''; 

export const equos = Equos.client('local', EQUOS_API_KEY)