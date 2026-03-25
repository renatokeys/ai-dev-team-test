import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders the heading", () => {
    render(<App />);
    expect(
      screen.getByText("Trello-Style TODO Board")
    ).toBeInTheDocument();
  });

  it("renders the tech stack description", () => {
    render(<App />);
    expect(
      screen.getByText("Vite + React + TypeScript + Tailwind CSS")
    ).toBeInTheDocument();
  });

  it("applies Tailwind utility classes", () => {
    render(<App />);
    const heading = screen.getByText("Trello-Style TODO Board");
    expect(heading.className).toContain("text-4xl");
    expect(heading.className).toContain("font-bold");
  });
});
