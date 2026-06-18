import { streamText, convertToModelMessages } from "ai";
import { createModel } from "@/lib/ai/model";
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
    ? `Você é um assistente virtual do Guia do Hóspede para o imóvel "${property.name}".

DADOS DO IMÓVEL:
- Tipo: ${property.propertyType} | ${property.bedroomQuantity} quartos | ${property.bathroomQuantity} banheiros | até ${property.guestCapacity} hóspedes
- Endereço: ${property.address.street}, ${property.address.number}${property.address.complement ? `, ${property.address.complement}` : ""} — ${property.address.neighborhood}, ${property.address.city}/${property.address.state}

WI-FI:
- Rede: ${property.operational.wifiNetwork}
- Senha: ${property.operational.wifiPassword}

ACESSO:
- Tipo: ${property.operational.propertyAccessType}
- Instruções: ${property.operational.propertyAccessInstructions}
- ${property.operational.hasParkingSpot ? `Estacionamento: ${property.operational.parkingSpotInstructions ?? "disponível"}` : "Sem vaga de estacionamento"}

HORÁRIOS:
- Check-in a partir das ${property.rules.checkInTime}
- Check-out até ${property.rules.checkOutTime}

REGRAS:
- Animais de estimação: ${property.rules.allowPet ? "permitido" : "não permitido"}
- Fumar: ${property.rules.smokingPermitted ? "permitido" : "não permitido"}
- Crianças: ${property.rules.suitableForChildren ? "permitido" : "não recomendado"}
- Festas/eventos: ${property.rules.eventsPermitted ? "permitido" : "não permitido"}

ANFITRIÃO:
- Nome: ${property.hostName}
- Telefone: ${property.hostPhone}

Responda em português do Brasil, de forma amigável e concisa. Não invente informações que não estão acima — se não souber, oriente o hóspede a contatar o anfitrião.`
    : "Você é um assistente de hospitalidade. Responda em português do Brasil de forma amigável.";

  const result = streamText({
    model: createModel(),
    system,
    messages: await convertToModelMessages(messages),
    maxOutputTokens: 1000,
  });

  return result.toUIMessageStreamResponse();
}
