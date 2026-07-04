import { createFileRoute, Link } from "@tanstack/react-router";
import { Shirt, Smartphone, Sparkles, Sofa, ChevronRight, BadgePercent } from "lucide-react";

import { MobileShell } from "@/components/MobileShell";
import type { CategoryId } from "@/data/products";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Categories — NeoCart" },
      {
        name: "description",
        content:
          "Browse high-cashback shopping categories on NeoCart: Fashion, Electronics, Beauty, and Home & Kitchen.",
      },
    ],
  }),
  component: CategoriesPage,
});

type Tile = {
  id: CategoryId;
  title: string;
  cashback: string;
  icon: typeof Shirt;
  // Tailwind gradient + sizing for masonry feel
  span: string;
  bg: string;
  accent: string;
  ring: string;
};

const tiles: Tile[] = [
  {
    id: "fashion",
    title: "Fashion & Clothing",
    cashback: "Extra NeoCoins",
    icon: Shirt,
    span: "row-span-2",
    bg: "bg-[image:linear-gradient(155deg,oklch(0.55_0.22_15)_0%,oklch(0.42_0.20_350)_100%)]",
    accent: "bg-[oklch(0.95_0.07_15)] text-[oklch(0.40_0.18_15)]",
    ring: "ring-[oklch(0.85_0.12_15)]",
  },
  {
    id: "electronics",
    title: "Electronics & Gadgets",
    cashback: "NeoCoins on order",
    icon: Smartphone,
    span: "",
    bg: "bg-[image:linear-gradient(155deg,oklch(0.48_0.22_265)_0%,oklch(0.38_0.18_240)_100%)]",
    accent: "bg-[oklch(0.95_0.05_260)] text-[oklch(0.40_0.18_260)]",
    ring: "ring-[oklch(0.85_0.10_260)]",
  },
  {
    id: "beauty",
    title: "Beauty & Cosmetics",
    cashback: "Extra NeoCoins",
    icon: Sparkles,
    span: "",
    bg: "bg-[image:linear-gradient(155deg,oklch(0.55_0.22_330)_0%,oklch(0.45_0.22_300)_100%)]",
    accent: "bg-[oklch(0.96_0.05_330)] text-[oklch(0.45_0.20_330)]",
    ring: "ring-[oklch(0.85_0.10_330)]",
  },
  {
    id: "home",
    title: "Home & Kitchen",
    cashback: "NeoCoins on order",
    icon: Sofa,
    span: "row-span-2",
    bg: "bg-[image:linear-gradient(155deg,oklch(0.50_0.15_165)_0%,oklch(0.38_0.13_180)_100%)]",
    accent: "bg-[oklch(0.95_0.06_160)] text-[oklch(0.40_0.13_160)]",
    ring: "ring-[oklch(0.85_0.10_160)]",
  },
];

function CategoriesPage() {
  return (
    <MobileShell>
      <section className="px-4 pt-4">
        <header className="mb-3">
          <h1 className="font-display text-xl font-extrabold tracking-tight text-foreground">
            Shop by Category
          </h1>
          <p className="mt-0.5 text-[12px] text-muted-foreground">
            Earn NeoCoins on every eligible order — we share a slice of what we actually receive.
          </p>
        </header>

        {/* Masonry: two cols, two rows. Fashion & Home span 2 rows. */}
        <div className="grid auto-rows-[112px] grid-cols-2 gap-3">
          {tiles.map((t) => {
            const Icon = t.icon;
            return (
              <Link
                key={t.id}
                to="/search"
                search={{ category: t.id }}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl p-4 text-white shadow-[var(--shadow-pop)] ring-1 ring-white/10 transition-transform duration-200 active:scale-[0.97] ${t.span} ${t.bg}`}
              >
                {/* Decorative glow */}
                <span className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/20 blur-2xl" />
                <span className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-black/10 blur-2xl" />

                <div className="relative flex items-start justify-between">
                  <span
                    className={`grid h-11 w-11 place-items-center rounded-2xl ring-2 ${t.accent} ${t.ring} transition-transform duration-200 group-active:scale-90`}
                  >
                    <Icon className="h-5 w-5" strokeWidth={2.4} />
                  </span>
                  <ChevronRight className="h-4 w-4 opacity-70 transition-transform group-active:translate-x-1" />
                </div>

                <div className="relative">
                  <h2 className="font-display text-[15px] font-extrabold leading-tight">
                    {t.title}
                  </h2>
                  <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide backdrop-blur">
                    <BadgePercent className="h-3 w-3" />
                    {t.cashback}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-5 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
          <p className="text-[12px] text-muted-foreground">
            Tip — Cashback is auto-tracked. Tap any category to see live price comparisons across
            Amazon, Flipkart & Myntra.
          </p>
        </div>
      </section>
    </MobileShell>
  );
}
