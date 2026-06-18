import { streamText, convertToModelMessages } from "ai";
import { createModel } from "@/lib/ai/model";
import { getProperty } from "@/lib/db/queries/properties";
import { getExperienceGuide } from "@/lib/db/queries/experiences";
import type { UIMessage } from "ai";

export const maxDuration = 60;

type ChatRequestBody = {
  messages: UIMessage[];
  propertyCode: string;
};

export async function POST(request: Request) {
  const { messages, propertyCode } = (await request.json()) as ChatRequestBody;

  const code = propertyCode?.toUpperCase();
  const [property, guide] = await Promise.all([
    getProperty(code),
    getExperienceGuide(code),
  ]);

  const guideSection = guide
    ? `
GUIA DE EXPERIÊNCIAS:
${guide.content.restaurants.length > 0 ? `Restaurantes próximos:\n${guide.content.restaurants.map((r) => `- ${r.name} (${r.distance}): ${r.description}`).join("\n")}` : ""}
${guide.content.attractions.length > 0 ? `\nAtrações próximas:\n${guide.content.attractions.map((a) => `- ${a.name} (${a.distance}): ${a.description}`).join("\n")}` : ""}
${guide.content.essentials.length > 0 ? `\nServiços essenciais:\n${guide.content.essentials.map((e) => `- ${e.name} (${e.distance}): ${e.description}`).join("\n")}` : ""}
${guide.content.seasonalTip ? `\nDica da temporada: ${guide.content.seasonalTip}` : ""}`
    : "";

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

AMENIDADES DO IMÓVEL:
${(() => {
  const labels: Record<string, string> = {
    wifi: "Wi-Fi",
    tv: "TV",
    airConditioning: "Ar-condicionado",
    kitchen: "Cozinha equipada",
    washingMachine: "Lavanderia / máquina de lavar",
    elevator: "Elevador",
    balcony: "Varanda",
    bbqGrill: "Churrasqueira",
    dishwasher: "Lava-louças",
  };
  const present = Object.entries(property.amenities)
    .filter(([, v]) => v === true)
    .map(([k]) => `- ${labels[k] ?? k}`);
  return present.length > 0
    ? present.join("\n")
    : "- Nenhuma amenidade cadastrada";
})()
}

ANFITRIÃO:
- Nome: ${property.hostName}
- Telefone: ${property.hostPhone}
${guideSection}
RESPOSTAS ESTRUTURADAS:
Para as perguntas abaixo, escreva UMA frase curta e amigável (máximo 12 palavras), depois pule uma linha e escreva SOMENTE o JSON indicado — sem mais nada depois do JSON:
- Wi-Fi, rede, internet, senha: {"type":"wifi","network":"REDE","password":"SENHA"}
- Check-in, horário de entrada: {"type":"checkin","time":"HORARIO"}
- Check-out, horário de saída: {"type":"checkout","time":"HORARIO"}
- Acesso, como entrar, chave, fechadura, código: {"type":"access","accessType":"TIPO","instructions":"INSTRUCOES","code":"CODIGO_NUMERICO_SE_HOUVER"}
- Contato, anfitrião, telefone: {"type":"contact","name":"NOME","phone":"TELEFONE"}
- Estacionamento, vaga, garagem, carro: {"type":"parking","available":BOOLEANO,"instructions":"INSTRUCOES_OU_VAZIO"}
- Quando o hóspede pedir UMA recomendação específica (ex: "qual farmácia?", "me indica um restaurante?", "tem mercado perto?"): {"type":"place","name":"NOME_EXATO","description":"DESCRICAO_CURTA_COM_DISTANCIA","category":"restaurant|pharmacy|supermarket|attraction|other"}
- Quando o hóspede pedir VÁRIAS recomendações do mesmo tipo (ex: "quais restaurantes tem?", "me indica opções de farmácia", "o que tem perto para comer?"): {"type":"places_list","category":"restaurant|pharmacy|supermarket|attraction|other","items":[{"name":"NOME","description":"DESCRICAO_CURTA_COM_DISTANCIA"},{"name":"NOME2","description":"..."}]}

INSTRUÇÕES PARA TODAS AS OUTRAS RESPOSTAS:
- Texto simples, sem Markdown, sem asteriscos, sem #.
- Quando listar múltiplos itens (ex: vários restaurantes), separe cada item com \n e comece cada linha com "- ".
- Máximo 4 frases ou 5 itens de lista. Tom amigável e direto, como um concierge.
- Não invente informações — oriente o hóspede a contatar o anfitrião se necessário.`
    : "Você é um assistente de hospitalidade. Responda em português do Brasil de forma amigável.";

  const result = streamText({
    model: createModel(),
    system,
    messages: await convertToModelMessages(messages),
    maxOutputTokens: 1000,
  });

  return result.toUIMessageStreamResponse();
}
