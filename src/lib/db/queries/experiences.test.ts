import { describe, it, expect, vi, beforeEach } from "vitest";
import { getExperienceGuide, saveExperienceGuide } from "./experiences";
import type { ExperienceGuideContent } from "@/types/property";

vi.mock("@/lib/db/client", () => ({
  prisma: {
    experienceGuide: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/db/client";

const mockContent: ExperienceGuideContent = {
  welcomeMessage: "Bem-vindo!",
  restaurants: [{ name: "Box 32", distance: "1,2 km", description: "Petiscos" }],
  attractions: [{ name: "Praia da Joaquina", distance: "18 km", description: "Surf" }],
  essentials: [{ name: "Farmácia Catarinense", type: "pharmacy", distance: "300m", description: "24h" }],
  seasonalTip: "Leve um agasalho.",
};

describe("getExperienceGuide", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns null when guide does not exist", async () => {
    vi.mocked(prisma.experienceGuide.findUnique).mockResolvedValue(null);

    const result = await getExperienceGuide("FLN001");

    expect(result).toBeNull();
  });

  it("returns content and generatedAt when found", async () => {
    const generatedAt = new Date();
    vi.mocked(prisma.experienceGuide.findUnique).mockResolvedValue({
      id: "cuid",
      propertyCode: "FLN001",
      content: mockContent,
      generatedAt,
    });

    const result = await getExperienceGuide("FLN001");

    expect(result?.content.welcomeMessage).toBe("Bem-vindo!");
    expect(result?.generatedAt).toBe(generatedAt);
  });
});

describe("saveExperienceGuide", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calls upsert with correct propertyCode and content", async () => {
    vi.mocked(prisma.experienceGuide.upsert).mockResolvedValue({
      id: "cuid",
      propertyCode: "FLN001",
      content: mockContent,
      generatedAt: new Date(),
    });

    await saveExperienceGuide("FLN001", mockContent);

    expect(prisma.experienceGuide.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { propertyCode: "FLN001" },
        create: expect.objectContaining({ propertyCode: "FLN001", content: mockContent }),
      })
    );
  });
});
