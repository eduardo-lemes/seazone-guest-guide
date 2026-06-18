import type { IExperienceGuideGenerator } from "@/application/ports/IExperienceGuideGenerator";
import type { IExperienceGuideRepository } from "@/application/ports/IExperienceGuideRepository";
import type { Property, ExperienceGuideContent } from "@/types/property";

export class GenerateExperienceGuide {
  constructor(
    private readonly repository: IExperienceGuideRepository,
    private readonly generator: IExperienceGuideGenerator
  ) {}

  async execute(property: Property): Promise<ExperienceGuideContent> {
    // Retorna do cache se já existir
    const cached = await this.repository.find(property.code);
    if (cached) return cached.content;

    // Recupera o seasonal tip travado (nunca muda) se já existir
    const lockedTip = await this.repository.findSeasonalTip(property.code);

    // Gera o guia (passando o tip travado para o generator preservá-lo)
    const content = await this.generator.generate(property, lockedTip ?? undefined);

    // Persiste o guia completo
    await this.repository.save(property.code, content);

    // Persiste o seasonal tip permanentemente (noop se já existir)
    await this.repository.saveSeasonalTip(property.code, content.seasonalTip);

    return content;
  }
}
