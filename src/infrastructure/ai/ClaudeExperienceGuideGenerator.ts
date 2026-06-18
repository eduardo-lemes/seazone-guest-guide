import Anthropic from "@anthropic-ai/sdk";
import type { AutoParseableOutputFormat } from "@anthropic-ai/sdk";
import type { IExperienceGuideGenerator } from "@/application/ports/IExperienceGuideGenerator";
import type { Property, ExperienceGuideContent } from "@/types/property";
import { buildExperienceGuidePrompt, fetchRealPoisForProperty } from "./prompts";

const SCHEMA = {
  type: "object",
  required: ["welcomeMessage", "restaurants", "attractions", "essentials", "seasonalTip"],
  additionalProperties: false,
  properties: {
    welcomeMessage: { type: "string" },
    restaurants: {
      type: "array",
      items: {
        type: "object",
        required: ["name", "distance", "description"],
        additionalProperties: false,
        properties: {
          name: { type: "string" },
          distance: { type: "string" },
          description: { type: "string" },
        },
      },
    },
    attractions: {
      type: "array",
      items: {
        type: "object",
        required: ["name", "distance", "description"],
        additionalProperties: false,
        properties: {
          name: { type: "string" },
          distance: { type: "string" },
          description: { type: "string" },
        },
      },
    },
    essentials: {
      type: "array",
      items: {
        type: "object",
        required: ["name", "type", "distance", "description"],
        additionalProperties: false,
        properties: {
          name: { type: "string" },
          type: { type: "string", enum: ["pharmacy", "supermarket", "hospital", "other"] },
          distance: { type: "string" },
          description: { type: "string" },
        },
      },
    },
    seasonalTip: { type: "string" },
  },
};

const outputFormat: AutoParseableOutputFormat<ExperienceGuideContent> = {
  type: "json_schema",
  schema: SCHEMA,
  parse: (content: string) => JSON.parse(content) as ExperienceGuideContent,
};

export class ClaudeExperienceGuideGenerator implements IExperienceGuideGenerator {
  private readonly client: Anthropic;

  constructor() {
    this.client = new Anthropic();
  }

  async generate(property: Property, lockedSeasonalTip?: string): Promise<ExperienceGuideContent> {
    const realPois = await fetchRealPoisForProperty(property);
    const prompt = buildExperienceGuidePrompt(property, realPois, lockedSeasonalTip);

    const response = await this.client.messages.parse({
      model: "claude-sonnet-4-6",
      max_tokens: 8000,
      thinking: { type: "adaptive" },
      output_config: { format: outputFormat },
      messages: [{ role: "user", content: prompt }],
    });

    if (!response.parsed_output) {
      throw new Error("Claude returned no structured output");
    }

    const result = response.parsed_output;
    // Garante que o tip travado seja preservado mesmo se o modelo divergir
    if (lockedSeasonalTip) result.seasonalTip = lockedSeasonalTip;
    return result;
  }
}
