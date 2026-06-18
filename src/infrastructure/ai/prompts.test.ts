import { describe, it, expect } from "vitest";
import { buildExperienceGuidePrompt } from "./prompts";
import type { Property } from "@/types/property";

const mockProperty: Property = {
  code: "FLN001",
  name: "Apartamento Beira-Mar",
  propertyType: "Apartamento",
  bedroomQuantity: 2,
  bathroomQuantity: 1,
  guestCapacity: 4,
  address: {
    street: "Rua das Ostras",
    number: "42",
    complement: null,
    neighborhood: "Agronômica",
    city: "Florianópolis",
    state: "SC",
    postalCode: "88025-000",
  },
  operational: {
    wifiNetwork: "net",
    wifiPassword: "pass",
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
  amenities: { wifi: true, airConditioning: true },
  images: [],
  hostName: "Ana",
  hostPhone: "+5548999999999",
};

describe("buildExperienceGuidePrompt", () => {
  it("includes the property name", () => {
    const prompt = buildExperienceGuidePrompt(mockProperty);
    expect(prompt).toContain("Apartamento Beira-Mar");
  });

  it("includes the city", () => {
    const prompt = buildExperienceGuidePrompt(mockProperty);
    expect(prompt).toContain("Florianópolis");
  });

  it("includes the neighborhood", () => {
    const prompt = buildExperienceGuidePrompt(mockProperty);
    expect(prompt).toContain("Agronômica");
  });

  it("includes the property type", () => {
    const prompt = buildExperienceGuidePrompt(mockProperty);
    expect(prompt).toContain("Apartamento");
  });

  it("includes guest capacity", () => {
    const prompt = buildExperienceGuidePrompt(mockProperty);
    expect(prompt).toContain("4");
  });
});
