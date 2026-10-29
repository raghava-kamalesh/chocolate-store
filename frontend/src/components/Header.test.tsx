import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Header } from "@/components/Header";
import { ShopProvider } from "@/context/shop-state";

function renderHeader() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <ShopProvider>
        <Header />
      </ShopProvider>
    </QueryClientProvider>
  );
}

describe("Header", () => {
  it("opens Shop, About, Saved, and Cart from the phone menu", async () => {
    const user = userEvent.setup();
    renderHeader();

    const menu = screen.getByRole("button", { name: "Menu" });
    expect(menu).toHaveAttribute("aria-expanded", "false");

    await user.click(menu);

    const panel = document.getElementById("mobile-nav");
    expect(panel).not.toBeNull();
    const nav = within(panel as HTMLElement);
    expect(nav.getByRole("link", { name: "Shop" })).toHaveAttribute("href", "/shop");
    expect(nav.getByRole("link", { name: "About" })).toHaveAttribute("href", "/about");
    expect(nav.getByRole("link", { name: "Saved" })).toHaveAttribute("href", "/saved");
    expect(nav.getByRole("link", { name: "Cart" })).toHaveAttribute("href", "/cart");
    expect(menu).toHaveAttribute("aria-expanded", "true");
  });
});
