import { getExperienceGuide, saveExperienceGuide } from "@/lib/db/queries/experiences";
import type { IExperienceGuideRepository } from "@/application/ports/IExperienceGuideRepository";
import type { ExperienceGuideContent } from "@/types/property";

export class PrismaExperienceGuideRepository implements IExperienceGuideRepository {
  async find(propertyCode: string) {
    return getExperienceGuide(propertyCode);
  }

  async save(propertyCode: string, content: ExperienceGuideContent): Promise<void> {
    await saveExperienceGuide(propertyCode, content);
  }
}
