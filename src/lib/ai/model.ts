import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";

export function createModel() {
  if (process.env.ANTHROPIC_API_KEY) {
    return anthropic("claude-sonnet-4-6");
  }
  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return google("gemini-2.5-flash");
  }
  throw new Error(
    "Nenhum provider configurado. Defina ANTHROPIC_API_KEY ou GOOGLE_GENERATIVE_AI_API_KEY no .env"
  );
}
