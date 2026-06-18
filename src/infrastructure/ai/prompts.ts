import type { Property } from "@/types/property";

export type RealPoi = { name: string; category: string };

type NominatimResult = { lat: string; lon: string };
type OverpassResult = {
  elements: Array<{
    tags?: { name?: string; amenity?: string; tourism?: string; shop?: string };
  }>;
};

// ---------- Geocoding + Overpass helpers ----------

async function geocodeProperty(property: Property): Promise<[number, number] | null> {
  const q = `${property.address.street}, ${property.address.neighborhood}, ${property.address.city}, Brasil`;
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`,
      { headers: { "User-Agent": "SeazoneGuestGuide/1.0" } }
    );
    const data = (await res.json()) as NominatimResult[];
    if (data[0]) return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    return null;
  } catch {
    return null;
  }
}

async function fetchOverpassPois(lat: number, lon: number): Promise<RealPoi[]> {
  const query = `
    [out:json][timeout:15];
    (
      node["amenity"="restaurant"]["name"](around:800,${lat},${lon});
      node["tourism"="attraction"]["name"](around:1200,${lat},${lon});
      node["amenity"="pharmacy"]["name"](around:800,${lat},${lon});
      node["shop"="supermarket"]["name"](around:800,${lat},${lon});
    );
    out body;
  `;
  try {
    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: query,
    });
    const data = (await res.json()) as OverpassResult;
    const counts: Record<string, number> = {};
    const pois: RealPoi[] = [];

    for (const el of data.elements) {
      const name = el.tags?.name;
      if (!name) continue;

      let category = "other";
      if (el.tags?.amenity === "restaurant") category = "restaurant";
      else if (el.tags?.tourism === "attraction") category = "attraction";
      else if (el.tags?.amenity === "pharmacy") category = "pharmacy";
      else if (el.tags?.shop === "supermarket") category = "supermarket";

      counts[category] = (counts[category] ?? 0) + 1;
      if (counts[category] <= 5) pois.push({ name, category });
    }
    return pois;
  } catch {
    return [];
  }
}

/**
 * Fetches real nearby POIs from OpenStreetMap for a property.
 * Used before AI generation so place names are verifiable and geocodable.
 */
export async function fetchRealPoisForProperty(property: Property): Promise<RealPoi[]> {
  const coords = await geocodeProperty(property);
  if (!coords) return [];
  return fetchOverpassPois(coords[0], coords[1]);
}

// ---------- Prompt builder ----------

export function buildExperienceGuidePrompt(
  property: Property,
  realPois: RealPoi[] = [],
  lockedSeasonalTip?: string
): string {
  const { name, propertyType, guestCapacity, address, amenities } = property;

  const amenityList = Object.entries(amenities)
    .filter(([, v]) => v === true)
    .map(([key]) => key)
    .join(", ");

  const realPoisSection =
    realPois.length > 0
      ? `\n\nLOCAIS REAIS PRÓXIMOS (use ESTES nomes exatos — são estabelecimentos verificados no OpenStreetMap):\n${realPois.map((p) => `- ${p.name} (${p.category})`).join("\n")}\nUse esses nomes nas categorias correspondentes. Escreva descrições atraentes para cada um. Não invente nomes de estabelecimentos.`
      : "";

  const lockedTipSection = lockedSeasonalTip
    ? `\n\nDICA DA TEMPORADA PERMANENTE (use EXATAMENTE este texto no campo seasonalTip, sem qualquer alteração):\n"${lockedSeasonalTip}"`
    : "";

  return `Você é um guia local especialista em hospitalidade. Crie um guia de experiências personalizado para hóspedes que se hospedarão em:

**Imóvel:** ${name}
**Tipo:** ${propertyType}
**Capacidade:** ${guestCapacity} hóspedes
**Bairro:** ${address.neighborhood}
**Cidade:** ${address.city} — ${address.state}
**Comodidades:** ${amenityList || "não informadas"}${realPoisSection}${lockedTipSection}

Gere um guia com restaurantes, atrações turísticas, serviços essenciais e dicas sazonais${realPois.length > 0 ? " usando os locais reais fornecidos" : " reais e próximos ao imóvel"}. Responda em português do Brasil.`;
}

