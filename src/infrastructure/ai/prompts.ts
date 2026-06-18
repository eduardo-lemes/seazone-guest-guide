import type { Property } from "@/types/property";

export function buildExperienceGuidePrompt(property: Property): string {
  const { name, propertyType, guestCapacity, address, amenities } = property;

  const amenityList = Object.entries(amenities)
    .filter(([, value]) => value === true)
    .map(([key]) => key)
    .join(", ");

  return `Você é um guia local especialista em hospitalidade. Crie um guia de experiências personalizado para hóspedes que se hospedarão em:

**Imóvel:** ${name}
**Tipo:** ${propertyType}
**Capacidade:** ${guestCapacity} hóspedes
**Bairro:** ${address.neighborhood}
**Cidade:** ${address.city} — ${address.state}
**Comodidades:** ${amenityList || "não informadas"}

Gere um guia com restaurantes reais (4 a 5 opções), atrações turísticas (3 a 4 opções), serviços essenciais (farmácias, supermercados, hospitais) e uma dica sazonal relevante para a época do ano atual — tudo próximo ao endereço acima. Responda em português do Brasil.`;
}
