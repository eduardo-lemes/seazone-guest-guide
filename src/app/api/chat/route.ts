import { streamText, convertToModelMessages } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { getProperty } from "@/lib/db/queries/properties";
import type { UIMessage } from "ai";

export const maxDuration = 60;

type ChatRequestBody = {
  messages: UIMessage[];
  propertyCode: string;
};

export async function POST(request: Request) {
  const { messages, propertyCode } = (await request.json()) as ChatRequestBody;

  const property = await getProperty(propertyCode?.toUpperCase());

  const system = property
    ? `Você é um assistente de hospitalidade para hóspedes do imóvel "${property.name}", localizado em ${property.address.neighborhood}, ${property.address.city} (${property.address.state}). Responda em português do Brasil, de forma amigável e concisa. Ajude com dúvidas sobre o imóvel, a região, restaurantes, atrações e serviços próximos.`
    : "Você é um assistente de hospitalidade. Responda em português do Brasil de forma amigável.";

  const result = streamText({
    model: anthropic("claude-sonnet-4-6"),
    system,
    messages: await convertToModelMessages(messages),
    maxOutputTokens: 1000,
  });

  return result.toUIMessageStreamResponse();
}
