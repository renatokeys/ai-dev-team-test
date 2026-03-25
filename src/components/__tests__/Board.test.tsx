import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Board } from "../Board";
import type { Card, ColumnId } from "../../types";

describe("Board", () => {
  const emptyGetColumnCards = () => [] as Card[];
  const noop = vi.fn();

  it("renders all 5 column titles", () => {
    render(<Board getColumnCards={emptyGetColumnCards} onDeleteCard={noop} />);
    expect(screen.getByText("Backlog")).toBeInTheDocument();
    expect(screen.getByText("To Do")).toBeInTheDocument();
    expect(screen.getByText("In Progress")).toBeInTheDocument();
    expect(screen.getByText("Review")).toBeInTheDocument();
    expect(screen.getByText("Done")).toBeInTheDocument();
  });

  it("renders columns in a flex row", () => {
    const { container } = render(
      <Board getColumnCards={emptyGetColumnCards} onDeleteCard={noop} />
    );
    const boardEl = container.firstElementChild!;
    expect(boardEl.className).toContain("flex");
  });

  it("passes cards from getColumnCards to each column", () => {
    const mockCards: Record<ColumnId, Card[]> = {
      backlog: [
        {
          id: "1",
          title: "Backlog task",
          description: "",
          columnId: "backlog",
          position: 0,
          createdAt: new Date().toISOString(),
        },
      ],
      todo: [],
      "in-progress": [],
      review: [],
      done: [],
    };

    render(
      <Board
        getColumnCards={(colId: ColumnId) => mockCards[colId]}
        onDeleteCard={noop}
      />
    );
    expect(screen.getByText("Backlog task")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("shows empty state in columns with no cards", () => {
    render(<Board getColumnCards={emptyGetColumnCards} onDeleteCard={noop} />);
    const emptyMessages = screen.getAllByText("No cards");
    expect(emptyMessages).toHaveLength(5);
  });
});
