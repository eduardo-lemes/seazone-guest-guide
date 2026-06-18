import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ExperienceGuide } from "./ExperienceGuide";
import type { ExperienceGuideContent } from "@/types/property";

const mockContent: ExperienceGuideContent = {
  welcomeMessage: "Bem-vindo ao nosso apartamento à beira-mar!",
  restaurants: [
    { name: "Box 32", distance: "1,2 km", description: "Petiscos e frutos do mar" },
    { name: "Zé Mané", distance: "800m", description: "Culinária catarinense" },
  ],
  attractions: [
    { name: "Praia da Joaquina", distance: "18 km", description: "Famosa pelo surf" },
  ],
  essentials: [
    { name: "Farmácia Catarinense", type: "pharmacy", distance: "300m", description: "Aberta 24h" },
    { name: "Supermercado Giassi", type: "supermarket", distance: "600m", description: "Completo" },
  ],
  seasonalTip: "Em dezembro, aproveite o Festival de Tainha.",
};

describe("ExperienceGuide", () => {
  it("renders the welcome message", () => {
    render(<ExperienceGuide content={mockContent} />);
    expect(screen.getByText("Bem-vindo ao nosso apartamento à beira-mar!")).toBeInTheDocument();
  });

  it("renders all restaurant names", () => {
    render(<ExperienceGuide content={mockContent} />);
    expect(screen.getByText("Box 32")).toBeInTheDocument();
    expect(screen.getByText("Zé Mané")).toBeInTheDocument();
  });

  it("renders restaurant distance and description", () => {
    render(<ExperienceGuide content={mockContent} />);
    expect(screen.getByText("1,2 km")).toBeInTheDocument();
    expect(screen.getByText("Petiscos e frutos do mar")).toBeInTheDocument();
  });

  it("renders attraction name and description", () => {
    render(<ExperienceGuide content={mockContent} />);
    expect(screen.getByText("Praia da Joaquina")).toBeInTheDocument();
    expect(screen.getByText("Famosa pelo surf")).toBeInTheDocument();
  });

  it("renders essential services", () => {
    render(<ExperienceGuide content={mockContent} />);
    expect(screen.getByText("Farmácia Catarinense")).toBeInTheDocument();
    expect(screen.getByText("Supermercado Giassi")).toBeInTheDocument();
  });

  it("renders the seasonal tip", () => {
    render(<ExperienceGuide content={mockContent} />);
    expect(screen.getByText("Em dezembro, aproveite o Festival de Tainha.")).toBeInTheDocument();
  });
});
