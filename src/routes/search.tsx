import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search as SearchIcon,
  Smartphone,
  Shirt,
  Footprints,
  Headphones,
  Sparkles,
  TrendingUp,
  X,
  SlidersHorizontal,
  ChevronDown,
  Check,
  IndianRupee,
} from "lucide-react";

import { MobileShell } from "@/components/MobileShell";
import { StoreLogo, type Store } from "@/components/StoreLogo";
import { categoryMeta, type CategoryId } from "@/data/products";
import { useProducts } from "@/lib/products-live";
import { cn } from "@/lib/utils";
import { PriceAlertBell } from "@/lib/price-alert-store";

type SearchParams = {
  q?: string;
  category?: CategoryId;
};

const VALID_CATEGORIES: CategoryId[] = ["fashion", "electronics", "beauty", "home"];

export const Route = createFileRoute("/search")({
  validateSearch: (raw: Record<string, unknown>): SearchParams => {
    const q = typeof raw.q === "string" ? raw.q : undefined;
    const cat = typeof raw.category === "string" ? (raw.category as CategoryId) : undefined;
    return {
      q,
      category: cat && VALID_CATEGORIES.includes(cat) ? cat : undefined,
    };
  },
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
  { id: "smartphones", label: "Smartphones", icon: Smartphone, q: "phone" },
  { id: "tshirts", label: "T-Shirts", icon: Shirt, q: "jeans" },
  { id: "sneakers", label: "Sneakers", icon: Footprints, q: "shoes" },
  { id: "headphones", label: "Headphones", icon: Headphones, q: "headphone" },
];

const PRICE_MIN = 500;
const PRICE_MAX = 50000;
const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

const STORES: { id: Store; label: string }[] = [
  { id: "amazon", label: "Amazon" },
  { id: "flipkart", label: "Flipkart" },
  { id: "myntra", label: "Myntra" },
];

function SearchPage() {
  const search = Route.useSearch() as SearchParams;
  const navigate = Route.useNavigate();

  const [query, setQuery] = useState(search.q ?? "");
  const [activePill, setActivePill] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [maxBudget, setMaxBudget] = useState(PRICE_MAX);
  const [selectedStores, setSelectedStores] = useState<Store[]>(["amazon", "flipkart", "myntra"]);

  const effectiveQuery = query.trim().toLowerCase();
  const activeCategory = search.category;

  const results = useMemo(() => {
    return products.filter((p) => {
      if (activeCategory && p.category !== activeCategory) return false;
      if (effectiveQuery && !p.title.toLowerCase().includes(effectiveQuery)) return false;
      const visibleOffers = p.offers.filter((o) => selectedStores.includes(o.store));
      if (visibleOffers.length === 0) return false;
      const best = Math.min(...visibleOffers.map((o) => o.price));
      if (best > maxBudget) return false;
      return true;
    });
  }, [effectiveQuery, activeCategory, selectedStores, maxBudget]);

  const toggleStore = (s: Store) => {
    setSelectedStores((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );
  };

  const clearCategory = () =>
    navigate({ search: (prev: SearchParams) => ({ ...prev, category: undefined }), replace: true });

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

          {/* Advanced Filters expandable panel */}
          <div className="mt-3 overflow-hidden rounded-2xl border border-[oklch(1_0_0/8%)] bg-[oklch(0.24_0.04_270)]">
            <button
              type="button"
              onClick={() => setFiltersOpen((o) => !o)}
              aria-expanded={filtersOpen}
              className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left"
            >
              <span className="flex items-center gap-2 text-[13px] font-bold text-[oklch(0.98_0.005_270)]">
                <SlidersHorizontal className="h-4 w-4 text-[oklch(0.82_0.18_295)]" />
                Advanced Filters
                <span className="rounded-full bg-[oklch(0.62_0.24_295)]/25 px-2 py-0.5 text-[10px] font-bold text-[oklch(0.85_0.18_295)]">
                  Max {inr(maxBudget)}
                </span>
              </span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-[oklch(0.78_0.02_270)] transition-transform",
                  filtersOpen && "rotate-180",
                )}
              />
            </button>

            {filtersOpen && (
              <div className="space-y-4 border-t border-[oklch(1_0_0/8%)] px-3.5 pb-4 pt-3">
                {/* Price slider */}
                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="budget"
                      className="flex items-center gap-1 text-[12px] font-semibold text-[oklch(0.88_0.01_270)]"
                    >
                      <IndianRupee className="h-3 w-3" />
                      Max Budget
                    </label>
                    <span className="rounded-md bg-[oklch(0.62_0.24_295)]/20 px-2 py-0.5 text-[12px] font-extrabold tabular-nums text-[oklch(0.92_0.10_295)]">
                      {inr(maxBudget)}
                    </span>
                  </div>
                  <input
                    id="budget"
                    type="range"
                    min={PRICE_MIN}
                    max={PRICE_MAX}
                    step={500}
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(Number(e.target.value))}
                    className="neo-range mt-3 h-8 w-full appearance-none bg-transparent"
                    style={{
                      // visual track gradient based on current value
                      background: `linear-gradient(to right, oklch(0.62 0.24 295) 0%, oklch(0.55 0.25 290) ${((maxBudget - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100}%, oklch(1 0 0 / 12%) ${((maxBudget - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100}%, oklch(1 0 0 / 12%) 100%)`,
                      borderRadius: "9999px",
                      height: 8,
                      padding: 0,
                    }}
                  />
                  <div className="mt-1.5 flex justify-between text-[10px] font-semibold uppercase tracking-wider text-[oklch(0.65_0.02_270)]">
                    <span>{inr(PRICE_MIN)}</span>
                    <span>{inr(PRICE_MAX)}</span>
                  </div>
                </div>

                {/* Store badges */}
                <div>
                  <p className="text-[12px] font-semibold text-[oklch(0.88_0.01_270)]">
                    Compare from
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {STORES.map((s) => {
                      const active = selectedStores.includes(s.id);
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => toggleStore(s.id)}
                          aria-pressed={active}
                          className={cn(
                            "inline-flex h-9 items-center gap-2 rounded-full border px-3.5 text-[12px] font-bold transition-all active:scale-95",
                            active
                              ? "border-[oklch(0.62_0.24_295)]/60 bg-[oklch(0.62_0.24_295)]/15 text-[oklch(0.98_0.005_270)]"
                              : "border-[oklch(1_0_0/10%)] bg-[oklch(0.26_0.04_270)] text-[oklch(0.72_0.02_270)]",
                          )}
                        >
                          <span
                            className={cn(
                              "grid h-4 w-4 place-items-center rounded-[5px] border transition-colors",
                              active
                                ? "border-[oklch(0.62_0.24_295)] bg-[oklch(0.62_0.24_295)] text-white"
                                : "border-[oklch(1_0_0/25%)] bg-transparent",
                            )}
                            aria-hidden
                          >
                            {active && <Check className="h-3 w-3" strokeWidth={3} />}
                          </span>
                          {s.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Filter pills */}
          <div className="no-scrollbar -mx-4 mt-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4">
            {filterPills.map((p) => {
              const Icon = p.icon;
              const active = activePill === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    const next = active ? null : p.id;
                    setActivePill(next);
                    setQuery(next ? p.q : "");
                  }}
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

      {/* Active category chip */}
      {activeCategory && (
        <div className="border-b border-border bg-card px-4 py-2.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[12px] text-muted-foreground">
              Filtered by category
            </span>
            <button
              type="button"
              onClick={clearCategory}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[12px] font-bold text-primary"
            >
              {categoryMeta[activeCategory].emoji} {categoryMeta[activeCategory].label}
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}

      {/* Search Results */}
      <section className="px-4 pb-6 pt-4">
        <header className="mb-3 flex items-end justify-between">
          <div>
            <h2 className="flex items-center gap-1.5 text-[14px] font-extrabold text-foreground">
              <TrendingUp className="h-4 w-4 text-primary" />
              Search Results
            </h2>
            <p className="text-[11px] text-muted-foreground">
              {results.length} {results.length === 1 ? "product" : "products"} matched
            </p>
          </div>
          <span className="rounded-full bg-success/10 px-2 py-1 text-[10px] font-bold text-success">
            ● LIVE
          </span>
        </header>

        {results.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
            <p className="text-sm font-semibold text-foreground">No products match your filters</p>
            <p className="mt-1 text-[12px] text-muted-foreground">
              Try widening the budget or selecting more stores.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {results.map((p) => {
              const visible = p.offers.filter((o) => selectedStores.includes(o.store));
              const best = visible.reduce((a, b) => (a.price < b.price ? a : b));
              const off = Math.round(((p.mrp - best.price) / p.mrp) * 100);
              return (
                <article
                  key={p.id}
                  className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]"
                >
                  <div className="absolute right-2 top-2 z-10">
                    <PriceAlertBell productId={p.id} productTitle={p.title} />
                  </div>
                  <Link
                    to="/product/$id"
                    params={{ id: p.id }}
                    className="block active:bg-muted/40"
                  >
                    <div
                      className={cn(
                        "grid h-32 w-full place-items-center text-5xl",
                        p.bg,
                      )}
                      aria-hidden
                    >
                      {p.emoji}
                    </div>
                    <div className="px-3 pb-2 pt-2.5">
                      <h3 className="line-clamp-2 min-h-[34px] pr-8 text-[13px] font-bold leading-snug text-foreground">
                        {p.title}
                      </h3>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {categoryMeta[p.category].label}
                      </p>
                      <div className="mt-1.5 flex items-baseline gap-2">
                        <span className="text-base font-extrabold text-foreground">
                          {inr(best.price)}
                        </span>
                        <span className="text-[11px] text-muted-foreground line-through">
                          {inr(p.mrp)}
                        </span>
                        <span className="ml-auto rounded-md bg-success/10 px-1.5 py-0.5 text-[10px] font-bold text-success">
                          {off}% OFF
                        </span>
                      </div>
                    </div>
                  </Link>

                  <div className="grid grid-cols-3 gap-1 border-t border-border bg-muted/40 px-2 py-2">
                    {visible.map((o) => {
                      const isBest = o.store === best.store;
                      return (
                        <div
                          key={o.store}
                          className={cn(
                            "flex flex-col items-center gap-1 rounded-lg py-1.5",
                            isBest && "bg-primary/10 ring-1 ring-primary/30",
                          )}
                        >
                          <StoreLogo store={o.store} />
                          <span
                            className={cn(
                              "text-[12px] font-bold",
                              isBest ? "text-primary" : "text-foreground",
                            )}
                          >
                            {inr(o.price)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </MobileShell>
  );
}
