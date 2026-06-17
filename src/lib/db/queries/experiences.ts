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
