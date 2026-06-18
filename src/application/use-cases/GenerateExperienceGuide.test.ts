import { describe, it, expect, vi, beforeEach } from "vitest";
import { GenerateExperienceGuide } from "./GenerateExperienceGuide";
import type { IExperienceGuideGenerator } from "@/application/ports/IExperienceGuideGenerator";
import type { IExperienceGuideRepository } from "@/application/ports/IExperienceGuideRepository";
import type { Property, ExperienceGuideContent } from "@/types/property";

const mockContent: ExperienceGuideContent = {
  welcomeMessage: "Bem-vindo ao paraíso!",
  restaurants: [{ name: "Box 32", distance: "1,2 km", description: "Petiscos" }],
  attractions: [{ name: "Praia da Joaquina", distance: "18 km", description: "Surf" }],
  essentials: [{ name: "Farmácia Catarinense", type: "pharmacy", distance: "300m", description: "24h" }],
  seasonalTip: "Leve um agasalho.",
};

const mockProperty: Property = {
  code: "FLN001",
  name: "Apartamento Beira-Mar",
  propertyType: "Apartamento",
  bedroomQuantity: 2,
  bathroomQuantity: 1,
  guestCapacity: 4,
  address: {
    street: "Rua A",
    number: "1",
    complement: null,
    neighborhood: "Agronômica",
    city: "Florianópolis",
    state: "SC",
    postalCode: "88025-000",
  },
  operational: {
    wifiNetwork: "SeaHome_FLN001",
    wifiPassword: "floripa2024",
    isSelfCheckin: true,
    propertyAccessType: "smart_lock",
    propertyAccessInstructions: "Use o app",
    propertyPassword: "1234",
    hasParkingSpot: false,
  },
  rules: {
    checkInTime: "15:00",
    checkOutTime: "11:00",
    allowPet: false,
    smokingPermitted: false,
    suitableForChildren: true,
    suitableForBabies: true,
    eventsPermitted: false,
  },
  amenities: { wifi: true },
  images: [],
  hostName: "Ana",
  hostPhone: "+5548999999999",
};

describe("GenerateExperienceGuide", () => {
  let generator: IExperienceGuideGenerator;
  let repository: IExperienceGuideRepository;
  let useCase: GenerateExperienceGuide;

  beforeEach(() => {
    generator = { generate: vi.fn() };
    repository = {
      find: vi.fn(),
      save: vi.fn(),
    };
    useCase = new GenerateExperienceGuide(repository, generator);
  });

  it("returns cached content without calling generator when cache exists", async () => {
    vi.mocked(repository.find).mockResolvedValue({
      content: mockContent,
      generatedAt: new Date(),
    });

    const result = await useCase.execute(mockProperty);

    expect(result).toBe(mockContent);
    expect(generator.generate).not.toHaveBeenCalled();
  });

  it("calls generator when no cached guide exists", async () => {
    vi.mocked(repository.find).mockResolvedValue(null);
    vi.mocked(generator.generate).mockResolvedValue(mockContent);
    vi.mocked(repository.save).mockResolvedValue(undefined);

    await useCase.execute(mockProperty);

    expect(generator.generate).toHaveBeenCalledWith(mockProperty);
  });

  it("saves generated content to repository", async () => {
    vi.mocked(repository.find).mockResolvedValue(null);
    vi.mocked(generator.generate).mockResolvedValue(mockContent);
    vi.mocked(repository.save).mockResolvedValue(undefined);

    await useCase.execute(mockProperty);

    expect(repository.save).toHaveBeenCalledWith("FLN001", mockContent);
  });

  it("returns generated content after saving", async () => {
    vi.mocked(repository.find).mockResolvedValue(null);
    vi.mocked(generator.generate).mockResolvedValue(mockContent);
    vi.mocked(repository.save).mockResolvedValue(undefined);

    const result = await useCase.execute(mockProperty);

    expect(result).toBe(mockContent);
  });
});
