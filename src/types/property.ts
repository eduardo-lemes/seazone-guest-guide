export type Address = {
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  postalCode: string;
};

export type Operational = {
  wifiNetwork: string;
  wifiPassword: string;
  isSelfCheckin: boolean;
  propertyAccessType: "smart_lock" | "keybox" | "key" | "other";
  propertyAccessInstructions: string;
  propertyPassword: string;
  hasParkingSpot: boolean;
  parkingSpotIdentifier?: string;
  parkingSpotInstructions?: string;
};

export type Rules = {
  checkInTime: string;
  checkOutTime: string;
  allowPet: boolean;
  smokingPermitted: boolean;
  suitableForChildren: boolean;
  suitableForBabies: boolean;
  eventsPermitted: boolean;
};

export type Amenities = {
  wifi?: boolean;
  tv?: boolean;
  airConditioning?: boolean;
  kitchen?: boolean;
  washingMachine?: boolean;
  elevator?: boolean;
  balcony?: boolean;
  bbqGrill?: boolean;
  dishwasher?: boolean;
  [key: string]: boolean | undefined;
};

export type Property = {
  code: string;
  name: string;
  propertyType: string;
  bedroomQuantity: number;
  bathroomQuantity: number;
  guestCapacity: number;
  address: Address;
  operational: Operational;
  rules: Rules;
  amenities: Amenities;
  images: string[];
  hostName: string;
  hostPhone: string;
};

export type ExperienceGuideContent = {
  welcomeMessage: string;
  restaurants: {
    name: string;
    distance: string;
    description: string;
  }[];
  attractions: {
    name: string;
    distance: string;
    description: string;
  }[];
  essentials: {
    name: string;
    type: "pharmacy" | "supermarket" | "hospital" | "other";
    distance: string;
    description: string;
  }[];
  seasonalTip: string;
};

export type PropertyWithGuide = Property & {
  experienceGuide: {
    content: ExperienceGuideContent;
    generatedAt: Date;
  } | null;
};
