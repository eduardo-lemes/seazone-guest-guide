import { generateObject } from "ai";
import { z } from "zod";
import { createModel } from "@/lib/ai/model";
import { buildExperienceGuidePrompt } from "./prompts";
import type { IExperienceGuideGenerator } from "@/application/ports/IExperienceGuideGenerator";
import type { Property, ExperienceGuideContent } from "@/types/property";

const ExperienceGuideSchema = z.object({
  welcomeMessage: z.string(),
  restaurants: z.array(
    z.object({
      name: z.string(),
      distance: z.string(),
      description: z.string(),
    })
  ),
  attractions: z.array(
    z.object({
      name: z.string(),
      distance: z.string(),
      description: z.string(),
    })
  ),
  essentials: z.array(
    z.object({
      name: z.string(),
      type: z.enum(["pharmacy", "supermarket", "hospital", "other"]),
      distance: z.string(),
      description: z.string(),
    })
  ),
  seasonalTip: z.string(),
});

export class VercelAIExperienceGuideGenerator implements IExperienceGuideGenerator {
  async generate(property: Property): Promise<ExperienceGuideContent> {
    const { object } = await generateObject({
      model: createModel(),
      schema: ExperienceGuideSchema,
      prompt: buildExperienceGuidePrompt(property),
    });
    return object;
  }
}
