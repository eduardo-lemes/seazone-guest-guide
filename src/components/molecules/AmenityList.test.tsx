import { render, screen } from "@testing-library/react";
import { AmenityList } from "./AmenityList";
import type { Amenities } from "@/types/property";

describe("AmenityList", () => {
  it("renders active amenities", () => {
    const amenities: Amenities = { wifi: true, tv: true, airConditioning: false };
    render(<AmenityList amenities={amenities} />);
    expect(screen.getByText("Wi-Fi")).toBeInTheDocument();
    expect(screen.getByText("TV")).toBeInTheDocument();
  });

  it("does not render inactive amenities", () => {
    const amenities: Amenities = { wifi: true, airConditioning: false };
    render(<AmenityList amenities={amenities} />);
    expect(screen.queryByText("Ar-condicionado")).not.toBeInTheDocument();
  });

  it("renders empty state when no amenities are active", () => {
    render(<AmenityList amenities={{}} />);
    expect(screen.getByText("Nenhuma amenidade informada.")).toBeInTheDocument();
  });

  it("uses the key as label for unknown amenity keys", () => {
    const amenities: Amenities = { rooftopPool: true };
    render(<AmenityList amenities={amenities} />);
    expect(screen.getByText("rooftopPool")).toBeInTheDocument();
  });
});
