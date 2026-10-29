import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About — Churrito's Chocolates",
  description:
    "Meet Churrito the Pomeranian, founder and Chief Chocolatier of Churrito's Chocolates. Small-batch bars, ethically sourced from Peru, Madagascar, and Ecuador.",
};

const origins = [
  {
    place: "Peru",
    detail:
      "Cocoa nibs with snap and a slow bloom. This is the cacao in our crunch bars, kept single-origin.",
  },
  {
    place: "Madagascar",
    detail:
      "Sambirano beans, bright and intense: red fruit, a touch of smoke, and a long finish.",
  },
  {
    place: "Ecuador",
    detail:
      "High-elevation Nacional cacao. Fig, black tea, and toasted almond in the 70% bar.",
  },
] as const;

const batches = [
  {
    title: "Sniff the sack",
    detail:
      "Churrito approves every shipment. If it does not smell like the origin on the label, it does not enter the kitchen.",
  },
  {
    title: "Roast a small lot",
    detail:
      "Bars and truffles are made in batches small enough to watch. A mistake stays a small mistake.",
  },
  {
    title: "Temper, wrap, ship",
    detail:
      "Finished chocolate leaves the kitchen within 48 hours. Nothing waits on a shelf for a quieter week.",
  },
] as const;

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-12">
      <section className="relative overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br from-card via-card to-accent/30 p-8 shadow-md ring-1 ring-black/[0.04] dark:from-card dark:via-card dark:to-primary/10 dark:ring-white/[0.06] sm:p-10">
        <div
          className="pointer-events-none absolute -right-16 -top-24 size-72 rounded-full bg-primary/10 blur-3xl dark:bg-primary/20"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-20 -left-12 size-56 rounded-full bg-secondary/60 blur-2xl dark:bg-secondary/30"
          aria-hidden
        />
        <div className="relative flex flex-col items-center gap-8 md:flex-row md:items-center md:justify-between">
          <div className="order-2 max-w-2xl md:order-1">
            <p className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary dark:border-primary/30 dark:bg-primary/15">
              Founder &amp; Chief Chocolatier
            </p>
            <h1 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-[2.35rem] md:leading-tight">
              Meet Churrito
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Churrito the Pomeranian is our founder and Chief Chocolatier. He built
              Churrito&apos;s Chocolates around small-batch bars and truffles, ethically sourced
              from growers in Peru, Madagascar, and Ecuador, and finished under his nose before
              they leave the kitchen.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                className={buttonVariants({ size: "lg", className: "min-h-10 px-5" })}
                href="/shop"
              >
                Shop the bars <ArrowRight className="ml-1 size-4" />
              </Link>
            </div>
          </div>
          <Image
            src="/churrito-hero.png"
            alt="Churrito the Pomeranian wearing a chocolatier's hat and apron, holding a chocolate bar and truffle"
            width={320}
            height={320}
            priority
            className="order-1 w-48 shrink-0 drop-shadow-xl sm:w-60 md:order-2 md:w-72"
          />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-heading text-2xl font-semibold tracking-tight">The kitchen</h2>
        <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">
          Churrito&apos;s Chocolates started because nearby chocolate was sweet enough, and sweet
          enough was not the standard. He wanted a bar with a place attached to it, roasted in a
          batch small enough to stand over. The kitchen is still that: one Pomeranian in a
          chef&apos;s hat, a tempering table, and a rule that every sack gets a sniff before it is
          opened.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <div>
          <h2 className="font-heading text-2xl font-semibold tracking-tight">Where the beans come from</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Ethically sourced from three growing regions. Each stays single-origin.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {origins.map((origin) => (
            <Card key={origin.place}>
              <CardHeader>
                <CardTitle>
                  <h3 className="font-heading text-lg font-semibold tracking-tight">
                    {origin.place}
                  </h3>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {origin.detail}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div>
          <h2 className="font-heading text-2xl font-semibold tracking-tight">Small batches, on purpose</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Hand-overseen from the sack to the wrapper.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {batches.map((step) => (
            <Card key={step.title}>
              <CardHeader>
                <CardTitle>
                  <h3 className="font-heading text-lg font-semibold tracking-tight">
                    {step.title}
                  </h3>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {step.detail}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-muted/30 p-8 dark:bg-muted/15">
        <h2 className="font-heading text-2xl font-semibold tracking-tight">Churrito&apos;s standard</h2>
        <blockquote className="max-w-3xl border-l-2 border-primary/40 pl-4 text-lg italic leading-relaxed text-foreground">
          &quot;Make every bar like someone you love is about to taste it.&quot;
        </blockquote>
        <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">
          That is still the rule. Churrito naps beside the tempering table, and the next batch
          does not start until he is satisfied.
        </p>
      </section>
    </div>
  );
}
