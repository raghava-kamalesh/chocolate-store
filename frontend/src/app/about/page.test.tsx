import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import AboutPage from "./page";

describe("About page", () => {
  it("introduces Churrito in the homepage voice", () => {
    render(<AboutPage />);

    expect(screen.getByRole("heading", { level: 1, name: "Meet Churrito" })).toBeInTheDocument();
    expect(screen.getAllByText(/founder and Chief Chocolatier/).length).toBeGreaterThan(0);
    expect(screen.getByText(/small-batch bars and truffles/i)).toBeInTheDocument();
    expect(
      screen.getByText(/ethically sourced from growers in Peru, Madagascar, and Ecuador/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Peru" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Madagascar" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Ecuador" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /shop the bars/i })).toHaveAttribute("href", "/shop");
    expect(
      screen.getByRole("img", { name: /churrito the pomeranian/i })
    ).toBeInTheDocument();
    expect(screen.queryByText(/nobel paws/i)).not.toBeInTheDocument();
  });
});
