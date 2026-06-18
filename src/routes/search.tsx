import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Search as SearchIcon,
  Smartphone,
  Shirt,
  Footprints,
  Headphones,
  Sparkles,
  TrendingUp,
  Clock,
  X,
  ArrowUpRight,
} from "lucide-react";

import { MobileShell } from "@/components/MobileShell";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Search — NeoCart Price Engine" },
      {
        name: "description",
        content:
          "Search products across Amazon, Flipkart and Myntra and instantly compare prices on NeoCart.",
      },
    ],
  }),
  component: SearchPage,
});

const filterPills = [
  { id: "smartphones", label: "Smartphones", icon: Smartphone },
  { id: "tshirts", label: "T-Shirts", icon: Shirt },
  { id: "sneakers", label: "Sneakers", icon: Footprints },
  { id: "headphones", label: "Headphones", icon: Headphones },
];

const trending = [
  "iPhone 15 Pro Max",
  "Nike Air Force 1",
  "Sony WH-1000XM5",
  "Allen Solly Polo",
  "OnePlus 12R",
  "Boat Airdopes",
];

const recent = ["Nothing Phone 2a", "Puma sneakers", "Lakme kajal"];

function SearchPage() {
  const [query, setQuery] = useState("");
  const [activePill, setActivePill] = useState<string | null>(null);

  return (
    <MobileShell>
      {/* Dark slate hero search panel */}
      <section className="relative overflow-hidden bg-[oklch(0.21_0.04_270)] px-4 pb-5 pt-5 text-[oklch(0.98_0.005_270)]">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[oklch(0.55_0.25_290)]/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-[oklch(0.62_0.24_260)]/25 blur-3xl" />

        <div className="relative">
          <div className="flex items-center justify-between">
            <h1 className="font-display text-xl font-extrabold tracking-tight">
              Find the best price.
            </h1>
            <span className="flex items-center gap-1 rounded-full bg-[oklch(0.62_0.24_295)]/20 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[oklch(0.82_0.18_295)]">
              <Sparkles className="h-3 w-3" />
              AI
            </span>
          </div>
          <p className="mt-1 text-[12px] text-[oklch(0.78_0.02_270)]">
            One search. Three stores. Lowest price wins.
          </p>

          {/* Search input */}
          <label
            className={cn(
              "mt-4 flex h-13 items-center gap-2.5 rounded-2xl border bg-[oklch(0.26_0.04_270)] px-3.5 py-3 transition-all",
              "border-[oklch(1_0_0/8%)] focus-within:border-[oklch(0.62_0.24_295)] focus-within:bg-[oklch(0.28_0.05_275)] focus-within:shadow-[0_0_0_4px_oklch(0.62_0.24_295/15%)]",
            )}
          >
            <SearchIcon className="h-5 w-5 shrink-0 text-[oklch(0.62_0.24_295)]" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search across Amazon, Flipkart, & Myntra..."
              className="h-full w-full bg-transparent text-[14px] font-medium text-[oklch(0.98_0.005_270)] outline-none placeholder:text-[oklch(0.62_0.02_270)]"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear"
                className="grid h-6 w-6 place-items-center rounded-full bg-[oklch(1_0_0/8%)] text-[oklch(0.78_0.02_270)]"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </label>

          {/* Filter pills */}
          <div className="no-scrollbar -mx-4 mt-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4">
            {filterPills.map((p) => {
              const Icon = p.icon;
              const active = activePill === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActivePill(active ? null : p.id)}
                  className={cn(
                    "inline-flex shrink-0 snap-start items-center gap-1.5 rounded-full border px-3.5 py-2 text-[12px] font-bold transition-all active:scale-95",
                    active
                      ? "border-transparent bg-[image:linear-gradient(135deg,oklch(0.55_0.25_290),oklch(0.62_0.24_260))] text-[oklch(0.99_0_0)] shadow-[0_4px_16px_-4px_oklch(0.55_0.25_290/55%)]"
                      : "border-[oklch(1_0_0/10%)] bg-[oklch(0.26_0.04_270)] text-[oklch(0.88_0.01_270)] hover:bg-[oklch(0.30_0.05_275)]",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recent searches */}
      {recent.length > 0 && (
        <section className="px-4 pt-5">
          <header className="mb-2.5 flex items-center justify-between">
            <h2 className="flex items-center gap-1.5 text-[13px] font-extrabold text-foreground">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              Recent searches
            </h2>
            <button className="text-[11px] font-semibold text-primary">Clear</button>
          </header>
          <div className="flex flex-wrap gap-2">
            {recent.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setQuery(r)}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-[12px] font-semibold text-foreground shadow-[var(--shadow-card)] active:scale-95"
              >
                {r}
                <X className="h-3 w-3 text-muted-foreground" />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Trending searches */}
      <section className="px-4 pb-6 pt-5">
        <header className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-1.5 text-[13px] font-extrabold text-foreground">
            <TrendingUp className="h-3.5 w-3.5 text-primary" />
            Trending in India
          </h2>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Live
          </span>
        </header>
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
          {trending.map((t, i) => (
            <button
              key={t}
              type="button"
              onClick={() => setQuery(t)}
              className={cn(
                "flex w-full items-center gap-3 px-3.5 py-3 text-left active:bg-muted/40",
                i !== trending.length - 1 && "border-b border-border",
              )}
            >
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-primary/10 text-[11px] font-extrabold text-primary">
                {i + 1}
              </span>
              <span className="flex-1 truncate text-[13px] font-semibold text-foreground">
                {t}
              </span>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            </button>
          ))}
        </div>
      </section>
    </MobileShell>
  );
}
