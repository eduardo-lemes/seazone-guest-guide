import { describe, it, expect, vi, beforeEach } from "vitest";
import { getProperty } from "./properties";

vi.mock("@/lib/db/client", () => ({
  prisma: {
    property: {
      findUnique: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/db/client";

const mockRow = {
  code: "FLN001",
  name: "Apartamento Beira-Mar Florianópolis",
  propertyType: "Apartamento",
  bedroomQuantity: 2,
  bathroomQuantity: 1,
  guestCapacity: 4,
  address: { city: "Florianópolis", state: "SC" },
  operational: { wifiNetwork: "SeaHome_FLN001", wifiPassword: "floripa2024" },
  rules: { checkInTime: "15:00", checkOutTime: "11:00", allowPet: false },
  amenities: { wifi: true },
  images: ["https://example.com/image.jpg"],
  hostName: "Ana Paula",
  hostPhone: "+5548991234567",
};

describe("getProperty", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns null when property does not exist", async () => {
    vi.mocked(prisma.property.findUnique).mockResolvedValue(null);

    const result = await getProperty("INVALID");

    expect(result).toBeNull();
  });

  it("returns a typed property when found", async () => {
    vi.mocked(prisma.property.findUnique).mockResolvedValue(mockRow);

    const result = await getProperty("FLN001");

    expect(result).not.toBeNull();
    expect(result?.code).toBe("FLN001");
    expect(result?.hostName).toBe("Ana Paula");
  });

  it("queries by the correct code", async () => {
    vi.mocked(prisma.property.findUnique).mockResolvedValue(null);

    await getProperty("GRM001");

    expect(prisma.property.findUnique).toHaveBeenCalledWith({
      where: { code: "GRM001" },
    });
  });
});
