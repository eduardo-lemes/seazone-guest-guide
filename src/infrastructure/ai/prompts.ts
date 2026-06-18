import type { Property } from "@/types/property";

export function buildExperienceGuidePrompt(property: Property): string {
  const { name, propertyType, guestCapacity, address, amenities } = property;

  const amenityList = Object.entries(amenities)
    .filter(([, v]) => v === true)
    .map(([key]) => key)
    .join(", ");

  return `Você é um guia local especialista em hospitalidade. Crie um guia de experiências personalizado para hóspedes que se hospedarão em:

**Imóvel:** ${name}
**Tipo:** ${propertyType}
**Capacidade:** ${guestCapacity} hóspedes
**Bairro:** ${address.neighborhood}
**Cidade:** ${address.city} — ${address.state}
**Comodidades:** ${amenityList || "não informadas"}

Gere um guia com restaurantes, atrações turísticas, serviços essenciais e dicas sazonais reais e próximos ao imóvel. Responda em português do Brasil.`;
}
