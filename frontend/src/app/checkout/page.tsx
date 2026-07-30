"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Gift } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { fetchChocolates, postCheckout } from "@/lib/api";
import { buttonVariants, Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useShop } from "@/context/shop-state";
import { formatPrice } from "@/lib/format";
import { GIFT_WRAP_FEE_CENTS } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart, isReady } = useShop();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [giftWrap, setGiftWrap] = useState(false);
  const [giftMessage, setGiftMessage] = useState("");

  const { data: products, isLoading } = useQuery({
    queryKey: ["chocolates", "all"],
    queryFn: () => fetchChocolates(),
    enabled: cart.length > 0,
  });
  const byId = new Map(products?.map((p) => [p.id, p]) ?? []);
  const itemsSubtotal = cart.reduce((sum, l) => {
    const p = byId.get(l.chocolateId);
    return p ? sum + p.price_cents * l.quantity : sum;
  }, 0);
  const subtotal = itemsSubtotal + (giftWrap ? GIFT_WRAP_FEE_CENTS : 0);

  const m = useMutation({
    mutationFn: postCheckout,
    onSuccess: (res) => {
      clearCart();
      const params = new URLSearchParams({
        order_id: res.order_id,
        total: String(res.total_cents),
      });
      if (res.gift_wrap) {
        params.set("gift_wrap", "1");
        if (res.gift_message) params.set("gift_message", res.gift_message);
      }
      router.push(`/checkout/success?${params.toString()}`);
    },
    onError: (e: Error) => {
      toast.error("Checkout failed", { description: e.message });
    },
  });

  if (!isReady) {
    return <p className="text-sm text-muted-foreground">Preparing…</p>;
  }

  if (cart.length === 0) {
    return (
      <div className="rounded-2xl border border-border/70 bg-card/50 p-8 shadow-sm ring-1 ring-black/[0.03] dark:ring-white/[0.05] sm:p-10">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Checkout</h1>
        <p className="mt-3 text-sm text-muted-foreground">Your cart is empty.</p>
        <Link
          href="/shop"
          className={buttonVariants({ className: "mt-6" })}
        >
          Back to shop
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">Checkout</h1>
      <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-sm dark:bg-muted/25">
        <span className="text-muted-foreground">Subtotal</span>
        <span className="font-heading font-semibold tabular-nums text-foreground">
          {isLoading ? "…" : formatPrice(subtotal)}
        </span>
      </p>
      <form
        className="mt-8 max-w-md space-y-5 rounded-xl border border-border/70 bg-card/60 p-6 shadow-sm ring-1 ring-black/[0.04] dark:bg-card/40 dark:ring-white/[0.06] sm:p-8"
        onSubmit={(e) => {
          e.preventDefault();
          m.mutate({
            customer_name: name.trim(),
            customer_email: email.trim(),
            items: cart.map((l) => ({
              chocolate_id: l.chocolateId,
              quantity: l.quantity,
            })),
            gift_wrap: giftWrap,
            gift_message: giftWrap ? giftMessage.trim() || null : null,
          });
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>

        <div
          className={cn(
            "space-y-3 rounded-lg border border-border/70 bg-muted/25 p-4 transition-colors dark:bg-muted/15",
            giftWrap && "border-primary/40 bg-primary/[0.06] dark:bg-primary/10"
          )}
        >
          <label
            htmlFor="gift-wrap"
            className="flex cursor-pointer items-start gap-3"
          >
            <input
              id="gift-wrap"
              type="checkbox"
              className="mt-1 size-4 shrink-0 rounded border border-input accent-primary"
              checked={giftWrap}
              onChange={(e) => setGiftWrap(e.target.checked)}
            />
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2 font-medium text-foreground">
                <Gift className="size-4 text-primary" aria-hidden />
                Gift wrap
              </span>
              <span className="mt-0.5 block text-sm text-muted-foreground">
                Ribbon and kraft paper — {formatPrice(GIFT_WRAP_FEE_CENTS)}
              </span>
            </span>
          </label>
          {giftWrap ? (
            <div className="space-y-2 pl-7">
              <Label htmlFor="gift-message">Gift message (optional)</Label>
              <textarea
                id="gift-message"
                rows={3}
                maxLength={280}
                value={giftMessage}
                onChange={(e) => setGiftMessage(e.target.value)}
                placeholder="A note for the recipient…"
                className="flex min-h-[80px] w-full rounded-lg border border-input bg-card/50 px-3 py-2 text-sm shadow-sm outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40 dark:bg-input/20"
              />
              <p className="text-xs text-muted-foreground">
                {giftMessage.length}/280
              </p>
            </div>
          ) : null}
        </div>

        <Button type="submit" disabled={m.isPending}>
          {m.isPending ? "Placing order…" : "Place order"}
        </Button>
      </form>
    </div>
  );
}
