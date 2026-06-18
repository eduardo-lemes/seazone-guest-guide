import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TabbedContent } from "./TabbedContent";
import type { Property } from "@/types/property";

vi.mock("next/dynamic", () => ({
  default: () => () => <div data-testid="map-view" />,
}));

const mockProperty: Property = {
  code: "FLN001",
  name: "Apartamento Teste",
  propertyType: "Apartamento",
  bedroomQuantity: 2,
  bathroomQuantity: 1,
  guestCapacity: 4,
  address: {
    street: "Rua Lauro Linhares",
    number: "589",
    complement: null,
    neighborhood: "Trindade",
    city: "Florianópolis",
    state: "SC",
    postalCode: "88036-001",
  },
  operational: {
    wifiNetwork: "SeaHome_FLN001",
    wifiPassword: "floripa2024",
    isSelfCheckin: true,
    propertyAccessType: "smart_lock",
    propertyAccessInstructions: "Use o código 4521",
    propertyPassword: "4521",
    hasParkingSpot: false,
  },
  rules: {
    checkInTime: "15:00",
    checkOutTime: "11:00",
    allowPet: false,
    smokingPermitted: false,
    suitableForChildren: true,
    suitableForBabies: false,
    eventsPermitted: false,
  },
  amenities: { wifi: true, tv: true },
  images: ["https://images.unsplash.com/photo-test"],
  hostName: "Ana Paula",
  hostPhone: "+55 48 99123-4567",
};

const defaultProps = {
  property: mockProperty,
  accessInfo: <div>access info</div>,
  stayRules: <div>stay rules</div>,
  contact: <div>contact</div>,
  amenities: <div>amenities</div>,
  experienceGuide: <div>experience guide</div>,
};

describe("TabbedContent", () => {
  it("renders Sobre o Imóvel tab as default", () => {
    render(<TabbedContent {...defaultProps} />);
    expect(screen.getByText("amenities")).toBeInTheDocument();
    expect(screen.getByText("access info")).toBeInTheDocument();
  });

  it("renders all tab buttons", () => {
    render(<TabbedContent {...defaultProps} />);
    expect(screen.getByRole("button", { name: "Sobre o Imóvel" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Experiências" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Mapa" })).toBeInTheDocument();
  });

  it("switches to Experiências tab", () => {
    render(<TabbedContent {...defaultProps} />);
    fireEvent.click(screen.getByRole("button", { name: "Experiências" }));
    expect(screen.getByText("experience guide")).toBeVisible();
    expect(screen.getByText("amenities")).not.toBeVisible();
  });

  it("switches to Mapa tab", () => {
    render(<TabbedContent {...defaultProps} />);
    fireEvent.click(screen.getByRole("button", { name: "Mapa" }));
    expect(screen.getByTestId("map-view")).toBeInTheDocument();
  });

  it("hides other content when Mapa tab is active", () => {
    render(<TabbedContent {...defaultProps} />);
    fireEvent.click(screen.getByRole("button", { name: "Mapa" }));
    expect(screen.getByText("amenities")).not.toBeVisible();
    expect(screen.getByText("experience guide")).not.toBeVisible();
  });
});
