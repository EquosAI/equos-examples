import "dotenv/config";
import { EquosClient } from "@equos/node-sdk";

const apiKey = process.env.EQUOS_API_KEY;
if (!apiKey) throw new Error("EQUOS_API_KEY is not set");

const endpoint = process.env.EQUOS_ENDPOINT;

// Omit the options object entirely when no override is set so the SDK's
// default endpoint (https://api.equos.ai) is used.
export const client = EquosClient.create(
  apiKey,
  endpoint ? { endpoint } : undefined
);
