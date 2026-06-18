import type { IExperienceGuideGenerator } from "@/application/ports/IExperienceGuideGenerator";
import type { IExperienceGuideRepository } from "@/application/ports/IExperienceGuideRepository";
import type { Property, ExperienceGuideContent } from "@/types/property";

export class GenerateExperienceGuide {
  constructor(
    private readonly repository: IExperienceGuideRepository,
    private readonly generator: IExperienceGuideGenerator
  ) {}

  async execute(property: Property): Promise<ExperienceGuideContent> {
    const cached = await this.repository.find(property.code);
    if (cached) return cached.content;

    const content = await this.generator.generate(property);
    await this.repository.save(property.code, content);
    return content;
  }
}
