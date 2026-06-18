import {
  getExperienceGuide,
  saveExperienceGuide,
  getPropertyInsight,
  savePropertyInsight,
} from "@/lib/db/queries/experiences";
import type { IExperienceGuideRepository } from "@/application/ports/IExperienceGuideRepository";
import type { ExperienceGuideContent } from "@/types/property";

export class PrismaExperienceGuideRepository implements IExperienceGuideRepository {
  async find(propertyCode: string) {
    return getExperienceGuide(propertyCode);
  }

  async save(propertyCode: string, content: ExperienceGuideContent): Promise<void> {
    await saveExperienceGuide(propertyCode, content);
  }

  /** Retorna o seasonal tip permanente (ou null se nunca gerado). */
  async findSeasonalTip(propertyCode: string): Promise<string | null> {
    return getPropertyInsight(propertyCode);
  }

  /** Salva o seasonal tip de forma permanente. Nunca sobrescreve. */
  async saveSeasonalTip(propertyCode: string, tip: string): Promise<void> {
    await savePropertyInsight(propertyCode, tip);
  }
}
