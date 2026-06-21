import { createFileRoute } from "@tanstack/react-router";
import { Flame, Shirt, Smartphone, Sparkles, Sofa, ChevronRight, Tag } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { ProductCard } from "@/components/ProductCard";
import { products as allProducts, type Product } from "@/data/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LootKart — Compare Prices & Daily Loot Deals" },
      {
        name: "description",
        content:
          "Compare prices instantly across Amazon, Flipkart and Myntra. Discover trending Loot Deals of the Day.",
      },
    ],
  }),
  component: Home,
});

const lootDeals = [
  {
    id: "l1",
    tag: "Loot ₹499",
    title: "boAt Airdopes 141",
    emoji: "🎧",
    bg: "from-[oklch(0.55_0.22_320)] to-[oklch(0.45_0.22_285)]",
    off: "78% OFF",
  },
  {
    id: "l2",
    tag: "Steal Deal",
    title: "Noise ColorFit Pro",
    emoji: "⌚",
    bg: "from-[oklch(0.55_0.20_15)] to-[oklch(0.50_0.22_340)]",
    off: "65% OFF",
  },
  {
    id: "l3",
    tag: "Hot Drop",
    title: "Mi Power Bank 20K",
    emoji: "🔋",
    bg: "from-[oklch(0.55_0.18_180)] to-[oklch(0.45_0.20_260)]",
    off: "52% OFF",
  },
];

const categories = [
  {
    id: "fashion",
    name: "Fashion",
    icon: Shirt,
    bg: "bg-[oklch(0.95_0.05_15)]",
    fg: "text-[oklch(0.50_0.20_15)]",
  },
  {
    id: "electronics",
    name: "Electronics",
    icon: Smartphone,
    bg: "bg-[oklch(0.95_0.05_260)]",
    fg: "text-[oklch(0.45_0.20_260)]",
  },
  {
    id: "beauty",
    name: "Beauty",
    icon: Sparkles,
    bg: "bg-[oklch(0.95_0.05_330)]",
    fg: "text-[oklch(0.50_0.22_330)]",
  },
  {
    id: "home",
    name: "Home",
    icon: Sofa,
    bg: "bg-[oklch(0.95_0.05_150)]",
    fg: "text-[oklch(0.45_0.15_150)]",
  },
];

const products: Product[] = [
  {
    id: "p1",
    title: "Apple iPhone 15 (128GB, Black) — Latest model",
    emoji: "📱",
    bg: "bg-gradient-to-br from-[oklch(0.92_0.02_270)] to-[oklch(0.85_0.03_280)]",
    mrp: 79900,
    offers: [
      { store: "amazon", price: 65999 },
      { store: "flipkart", price: 64499 },
      { store: "myntra", price: 67999 },
    ],
  },
  {
    id: "p2",
    title: "Nike Revolution 7 Running Shoes for Men",
    emoji: "👟",
    bg: "bg-gradient-to-br from-[oklch(0.92_0.04_15)] to-[oklch(0.88_0.06_30)]",
    mrp: 4995,
    offers: [
      { store: "amazon", price: 2799 },
      { store: "flipkart", price: 2899 },
      { store: "myntra", price: 2497 },
    ],
  },
  {
    id: "p3",
    title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    emoji: "🎧",
    bg: "bg-gradient-to-br from-[oklch(0.90_0.03_260)] to-[oklch(0.85_0.05_290)]",
    mrp: 34990,
    offers: [
      { store: "amazon", price: 24990 },
      { store: "flipkart", price: 26499 },
      { store: "myntra", price: 27999 },
    ],
  },
];

function Home() {
  return (
    <MobileShell>
      {/* Promo strip */}
      <div className="border-b border-border bg-card px-4 py-2.5">
        <div className="flex items-center gap-2 text-[12px] text-foreground">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-success/10 text-success">
            <Tag className="h-3.5 w-3.5" />
          </span>
          <span className="truncate">
            Earn <b className="text-success">upto 12% Cashback</b> on every order
          </span>
          <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {/* Loot Deals Carousel */}
      <section className="pt-4">
        <header className="flex items-end justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-[image:var(--gradient-loot)] text-white">
              <Flame className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-base font-extrabold leading-none">Loot Deals of the Day</h2>
              <p className="mt-0.5 text-[11px] text-muted-foreground">Ends in 08h : 42m : 17s</p>
            </div>
          </div>
          <button className="text-xs font-semibold text-primary">See all</button>
        </header>

        <div className="no-scrollbar mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1">
          {lootDeals.map((d) => (
            <article
              key={d.id}
              className={`relative flex h-40 w-64 shrink-0 snap-start flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br ${d.bg} p-4 text-white shadow-[var(--shadow-pop)]`}
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide backdrop-blur">
                  {d.tag}
                </span>
                <span className="text-3xl">{d.emoji}</span>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider opacity-80">Trending now</p>
                <h3 className="mt-0.5 text-lg font-extrabold leading-tight">{d.title}</h3>
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="rounded-md bg-white/15 px-2 py-0.5 text-xs font-bold">
                    {d.off}
                  </span>
                  <span className="text-xs font-semibold underline underline-offset-2">
                    Grab now →
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 pt-6">
        <header className="mb-3 flex items-end justify-between">
          <h2 className="text-base font-extrabold">Shop by Category</h2>
          <button className="text-xs font-semibold text-primary">View all</button>
        </header>
        <div className="grid grid-cols-4 gap-3">
          {categories.map((c) => {
            const Icon = c.icon;
            return (
              <button key={c.id} type="button" className="group flex flex-col items-center gap-1.5">
                <span
                  className={`grid h-16 w-16 place-items-center rounded-2xl ${c.bg} ${c.fg} transition-transform group-active:scale-95`}
                >
                  <Icon className="h-7 w-7" strokeWidth={2.2} />
                </span>
                <span className="text-[11px] font-semibold text-foreground">{c.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Price Comparison Feed */}
      <section className="px-4 pt-6">
        <header className="mb-3 flex items-end justify-between">
          <div>
            <h2 className="text-base font-extrabold">Compare & Save</h2>
            <p className="text-[11px] text-muted-foreground">Live prices from top stores</p>
          </div>
          <span className="rounded-full bg-success/10 px-2 py-1 text-[10px] font-bold text-success">
            ● LIVE
          </span>
        </header>

        <div className="flex flex-col gap-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </MobileShell>
  );
}
