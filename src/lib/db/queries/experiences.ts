import { prisma } from "@/lib/db/client";
import type { ExperienceGuideContent } from "@/types/property";

export async function getExperienceGuide(propertyCode: string) {
  const row = await prisma.experienceGuide.findUnique({
    where: { propertyCode },
  });
  if (!row) return null;

  return {
    content: row.content as ExperienceGuideContent,
    generatedAt: row.generatedAt,
  };
}

export async function saveExperienceGuide(
  propertyCode: string,
  content: ExperienceGuideContent
) {
  return prisma.experienceGuide.upsert({
    where: { propertyCode },
    update: { content, generatedAt: new Date() },
    create: { propertyCode, content },
  });
}

// ---------- PropertyInsight — seasonal tip permanente ----------

/**
 * Retorna o seasonal tip travado para o imóvel, ou null se ainda não existir.
 */
export async function getPropertyInsight(propertyCode: string): Promise<string | null> {
  const row = await prisma.propertyInsight.findUnique({ where: { propertyCode } });
  return row?.seasonalTip ?? null;
}

/**
 * Salva o seasonal tip APENAS se ainda não existir (nunca sobrescreve).
 */
export async function savePropertyInsight(
  propertyCode: string,
  seasonalTip: string
): Promise<void> {
  await prisma.propertyInsight.upsert({
    where: { propertyCode },
    update: {}, // ← intencionalmente vazio: nunca sobrescreve
    create: { propertyCode, seasonalTip },
  });
}
