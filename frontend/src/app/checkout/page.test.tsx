import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import CheckoutPage from "@/app/checkout/page";
import { ShopProvider } from "@/context/shop-state";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

vi.mock("sonner", () => ({
  toast: { error: vi.fn() },
}));

vi.mock("@/lib/api", () => ({
  fetchChocolates: vi.fn(async () => [
    {
      id: "c1",
      name: "Test Bar",
      slug: "test-bar",
      description: "desc",
      origin: null,
      cacao_percentage: 70,
      price_cents: 1000,
      image_url: "/x.png",
      tags: ["dark"],
      in_stock: true,
      created_at: "2024-01-01T00:00:00Z",
      churrito_quote: null,
    },
  ]),
  postCheckout: vi.fn(async () => ({
    order_id: "order-1",
    total_cents: 1499,
    gift_wrap: true,
    gift_message: "For you!",
  })),
}));

function renderCheckout() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <ShopProvider>
        <CheckoutPage />
      </ShopProvider>
    </QueryClientProvider>
  );
}

describe("CheckoutPage gift wrap", () => {
  beforeEach(() => {
    push.mockReset();
    localStorage.clear();
    localStorage.setItem(
      "cs.cart.v1",
      JSON.stringify([{ chocolateId: "c1", quantity: 1 }])
    );
  });

  it("reveals gift message field and includes wrap in checkout payload", async () => {
    const user = userEvent.setup();
    const { postCheckout } = await import("@/lib/api");

    renderCheckout();

    await waitFor(() => {
      expect(screen.getByLabelText(/gift wrap/i)).toBeInTheDocument();
    });

    expect(screen.queryByLabelText(/gift message/i)).not.toBeInTheDocument();

    await user.click(screen.getByLabelText(/gift wrap/i));
    expect(screen.getByLabelText(/gift message/i)).toBeInTheDocument();

    await user.type(screen.getByLabelText(/^name$/i), "Raghava");
    await user.type(screen.getByLabelText(/^email$/i), "r@example.com");
    await user.type(screen.getByLabelText(/gift message/i), "For you!");
    await user.click(screen.getByRole("button", { name: /place order/i }));

    await waitFor(() => {
      expect(vi.mocked(postCheckout).mock.calls[0]?.[0]).toEqual(
        expect.objectContaining({
          customer_name: "Raghava",
          customer_email: "r@example.com",
          gift_wrap: true,
          gift_message: "For you!",
        })
      );
    });

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith(
        expect.stringContaining("gift_wrap=1")
      );
    });
  });
});
