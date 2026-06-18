import { getProperty } from "@/lib/db/queries/properties";
import { GenerateExperienceGuide } from "@/application/use-cases/GenerateExperienceGuide";
import { VercelAIExperienceGuideGenerator } from "@/infrastructure/ai/VercelAIExperienceGuideGenerator";
import { PrismaExperienceGuideRepository } from "@/infrastructure/db/PrismaExperienceGuideRepository";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const property = await getProperty(code.toUpperCase());

  if (!property) {
    return Response.json({ error: "Property not found" }, { status: 404 });
  }

  try {
    const useCase = new GenerateExperienceGuide(
      new PrismaExperienceGuideRepository(),
      new VercelAIExperienceGuideGenerator()
    );
    const content = await useCase.execute(property);
    return Response.json(content);
  } catch (error) {
    console.error("[experiences] generation failed:", error);
    return Response.json({ error: "Failed to generate experience guide" }, { status: 500 });
  }
}
