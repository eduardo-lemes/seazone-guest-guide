import type { ExperienceGuideContent } from "@/types/property";

export interface IExperienceGuideRepository {
  find(propertyCode: string): Promise<{ content: ExperienceGuideContent; generatedAt: Date } | null>;
  save(propertyCode: string, content: ExperienceGuideContent): Promise<void>;
}
