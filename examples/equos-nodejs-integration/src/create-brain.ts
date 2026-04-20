import { client } from "./client.js";

const brain = await client.brains.createBrain({
  createEquosBrainRequest: {
    instructions:
      "You are a helpful assistant that translates English to French.",
    greetingMessage: "Bonjour! What would you like me to translate?",
  },
});

console.log("Brain created:", brain.id);
console.log(brain);
