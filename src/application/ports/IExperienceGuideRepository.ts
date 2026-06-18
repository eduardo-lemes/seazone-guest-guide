import type { ExperienceGuideContent } from "@/types/property";

export interface IExperienceGuideRepository {
  find(propertyCode: string): Promise<{ content: ExperienceGuideContent; generatedAt: Date } | null>;
  save(propertyCode: string, content: ExperienceGuideContent): Promise<void>;
  /** Retorna o seasonal tip permanente travado para o imóvel (ou null). */
  findSeasonalTip(propertyCode: string): Promise<string | null>;
  /** Salva o seasonal tip de forma permanente — nunca sobrescreve. */
  saveSeasonalTip(propertyCode: string, tip: string): Promise<void>;
}
