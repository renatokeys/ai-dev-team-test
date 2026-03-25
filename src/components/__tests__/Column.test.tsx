import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Column } from "../Column";
import type { Card } from "../../types";

const makeCard = (overrides: Partial<Card> = {}): Card => ({
  id: crypto.randomUUID(),
  title: "Test card",
  description: "",
  columnId: "backlog",
  position: 0,
  createdAt: new Date().toISOString(),
  ...overrides,
});

describe("Column", () => {
  it("renders the column title", () => {
    render(<Column title="Backlog" cards={[]} />);
    expect(screen.getByText("Backlog")).toBeInTheDocument();
  });

  it("shows card count badge", () => {
    const cards = [makeCard(), makeCard()];
    render(<Column title="Backlog" cards={cards} />);
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("shows zero count when empty", () => {
    render(<Column title="Backlog" cards={[]} />);
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("renders empty state message when no cards", () => {
    render(<Column title="Backlog" cards={[]} />);
    expect(screen.getByText("No cards")).toBeInTheDocument();
  });

  it("renders card titles", () => {
    const cards = [
      makeCard({ title: "First task" }),
      makeCard({ title: "Second task" }),
    ];
    render(<Column title="Backlog" cards={cards} />);
    expect(screen.getByText("First task")).toBeInTheDocument();
    expect(screen.getByText("Second task")).toBeInTheDocument();
  });

  it("has a scrollable card area", () => {
    render(<Column title="Backlog" cards={[]} />);
    const emptyMsg = screen.getByText("No cards");
    const scrollContainer = emptyMsg.parentElement!;
    expect(scrollContainer.className).toContain("overflow-y-auto");
  });
});
