import { Truck } from "lucide-react";
import Link from "next/link";

export function AnnouncementBar() {
  return (
    <div
      role="region"
      aria-label="Announcement"
      className="border-b border-primary/20 bg-primary/10 px-4 py-2 text-center text-sm text-primary dark:border-primary/30 dark:bg-primary/15"
    >
      <p className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-2 gap-y-1 font-medium">
        <Truck className="size-4 shrink-0" aria-hidden />
        <span>Free shipping on orders over $50</span>
        <span className="font-normal text-primary/40" aria-hidden>
          ·
        </span>
        <Link
          href="/shop"
          className="underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
        >
          Shop the case
        </Link>
      </p>
    </div>
  );
}
