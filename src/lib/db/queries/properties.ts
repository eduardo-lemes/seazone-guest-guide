import { prisma } from "@/lib/db/client";
import type { Property } from "@/types/property";

export async function getProperty(code: string): Promise<Property | null> {
  const row = await prisma.property.findUnique({ where: { code } });
  if (!row) return null;

  return {
    code: row.code,
    name: row.name,
    propertyType: row.propertyType,
    bedroomQuantity: row.bedroomQuantity,
    bathroomQuantity: row.bathroomQuantity,
    guestCapacity: row.guestCapacity,
    address: row.address as Property["address"],
    operational: row.operational as Property["operational"],
    rules: row.rules as Property["rules"],
    amenities: row.amenities as Property["amenities"],
    images: row.images,
    hostName: row.hostName,
    hostPhone: row.hostPhone,
  };
}
