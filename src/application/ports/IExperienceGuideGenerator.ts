import type { Property, ExperienceGuideContent } from "@/types/property";

export interface IExperienceGuideGenerator {
  generate(property: Property, lockedSeasonalTip?: string): Promise<ExperienceGuideContent>;
}
