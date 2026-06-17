import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Bell, BellRing, Share2, Shield, Truck, RotateCcw, Trophy, Info } from "lucide-react";
import { StoreLogo } from "@/components/StoreLogo";
import { getProduct } from "@/data/products";

export const Route = createFileRoute("/product/$id")({
  head: ({ params }) => {
    const p = getProduct(params.id);
    return {
      meta: [
        { title: p ? `${p.title} — Compare prices | LootKart` : "Product | LootKart" },
        { name: "description", content: p ? `Compare ${p.title} across Amazon, Flipkart and Myntra.` : "Compare prices across top stores." },
      ],
    };
  },
  loader: ({ params }) => {
    const product = getProduct(params.id);
    if (!product) throw notFound();
    return { product };
  },
  component: ProductView,
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center p-6 text-center">
      <div>
        <h1 className="text-xl font-bold">Product not found</h1>
        <Link to="/" className="mt-3 inline-block text-primary underline">Back to home</Link>
      </div>
    </div>
  ),
});

const inr = (n: number) => "₹" + n.toLocaleString("en-IN");
const rankSuffix = ["Lowest", "Mid", "Highest"];
const rankTone = [
  "bg-success/10 text-success ring-success/30",
  "bg-warning/15 text-warning-foreground ring-warning/40",
  "bg-destructive/10 text-destructive ring-destructive/30",
];

function ProductView() {
  const { product } = Route.useLoaderData();
  const [alert, setAlert] = useState(false);
  const [active, setActive] = useState(0);

  const ranked = [...product.offers].sort((a, b) => a.price - b.price);
  const best = ranked[0];
  const off = Math.round(((product.mrp - best.price) / product.mrp) * 100);

  return (
    <div className="mx-auto flex min-h-screen max-w-[480px] flex-col bg-background pb-32">
      {/* Top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between bg-card/95 px-3 py-3 pt-[max(env(safe-area-inset-top),12px)] backdrop-blur">
        <Link
          to="/"
          aria-label="Back"
          className="grid h-10 w-10 place-items-center rounded-full bg-muted text-foreground active:scale-95"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Share"
            className="grid h-10 w-10 place-items-center rounded-full bg-muted text-foreground active:scale-95"
          >
            <Share2 className="h-4.5 w-4.5" />
          </button>
          <button
            type="button"
            aria-pressed={alert}
            aria-label={alert ? "Price alert on" : "Set price alert"}
            onClick={() => setAlert((v) => !v)}
            className={`relative grid h-10 w-10 place-items-center rounded-full transition-colors active:scale-95 ${
              alert
                ? "bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-pop)]"
                : "bg-muted text-foreground"
            }`}
          >
            {alert ? <BellRing className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
            {alert && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-success text-[9px] font-bold text-success-foreground">
                ✓
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Gallery */}
      <section className="px-4">
        <div
          className={`relative grid h-64 w-full place-items-center overflow-hidden rounded-3xl text-[120px] ${product.bg}`}
          aria-hidden
        >
          {product.emoji}
          <span className="absolute left-3 top-3 rounded-full bg-card/90 px-2.5 py-1 text-[11px] font-bold text-foreground backdrop-blur">
            {off}% OFF
          </span>
          <span className="absolute right-3 top-3 rounded-full bg-card/90 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground backdrop-blur">
            {active + 1} / 4
          </span>
        </div>
        <div className="mt-3 flex gap-2">
          {[0, 1, 2, 3].map((i) => (
            <button
              key={i}
              type="button"
              aria-label={`Image ${i + 1}`}
              onClick={() => setActive(i)}
              className={`grid h-14 flex-1 place-items-center rounded-xl text-2xl ${product.bg} ${
                active === i ? "ring-2 ring-primary" : "opacity-70"
              }`}
            >
              {product.emoji}
            </button>
          ))}
        </div>
      </section>

      {/* Title & price */}
      <section className="px-4 pt-5">
        <h1 className="text-xl font-extrabold leading-tight">{product.title}</h1>
        <div className="mt-2 flex items-center gap-2 text-xs">
          <span className="rounded-md bg-warning/15 px-1.5 py-0.5 font-bold text-[oklch(0.45_0.15_75)]">
            ★ 4.5
          </span>
          <span className="text-muted-foreground">12,480 ratings</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-success font-semibold">In stock</span>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold">{inr(best.price)}</span>
          <span className="text-sm text-muted-foreground line-through">{inr(product.mrp)}</span>
          <span className="rounded-md bg-success/10 px-1.5 py-0.5 text-xs font-bold text-success">
            Save {inr(product.mrp - best.price)}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setAlert((v) => !v)}
          className={`mt-3 flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition-colors ${
            alert
              ? "border-primary/30 bg-primary/5 text-primary"
              : "border-border bg-card text-foreground"
          }`}
        >
          {alert ? <BellRing className="h-5 w-5 shrink-0" /> : <Bell className="h-5 w-5 shrink-0" />}
          <span className="min-w-0 flex-1">
            <span className="block font-semibold">
              {alert ? "Price alert is ON" : "Set Price Alert"}
            </span>
            <span className="block text-[11px] text-muted-foreground">
              {alert
                ? `We'll ping you when it drops below ${inr(best.price)}`
                : "Get notified when price drops"}
            </span>
          </span>
          <span
            className={`grid h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors ${
              alert ? "bg-primary" : "bg-muted"
            }`}
          >
            <span
              className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${
                alert ? "translate-x-5" : ""
              }`}
            />
          </span>
        </button>
      </section>

      {/* Store Comparison Matrix */}
      <section className="px-4 pt-6">
        <header className="mb-3 flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-[image:var(--gradient-primary)] text-primary-foreground">
            <Trophy className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-base font-extrabold leading-none">Store Comparison Matrix</h2>
            <p className="mt-0.5 text-[11px] text-muted-foreground">Ranked lowest to highest · live</p>
          </div>
        </header>

        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="grid grid-cols-[28px_1fr_auto_auto] gap-x-3 border-b border-border bg-muted/40 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            <span>#</span>
            <span>Store</span>
            <span className="text-right">Price</span>
            <span className="text-right">Action</span>
          </div>
          {ranked.map((o, i) => {
            const diff = o.price - best.price;
            return (
              <div
                key={o.store}
                className={`grid grid-cols-[28px_1fr_auto_auto] items-center gap-x-3 px-3 py-3 ${
                  i === 0 ? "bg-success/5" : ""
                } ${i < ranked.length - 1 ? "border-b border-border" : ""}`}
              >
                <span
                  className={`grid h-6 w-6 place-items-center rounded-full text-[11px] font-extrabold ring-1 ${rankTone[i]}`}
                >
                  {i + 1}
                </span>
                <div className="flex min-w-0 flex-col gap-1">
                  <StoreLogo store={o.store} />
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {rankSuffix[i]}
                    {i === 0 && " · Best deal"}
                    {i > 0 && ` · +${inr(diff)}`}
                  </span>
                </div>
                <span
                  className={`text-right text-base font-extrabold tabular-nums ${
                    i === 0 ? "text-success" : "text-foreground"
                  }`}
                >
                  {inr(o.price)}
                </span>
                <button
                  type="button"
                  className={`rounded-lg px-3 py-1.5 text-[11px] font-bold active:scale-95 ${
                    i === 0
                      ? "bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-pop)]"
                      : "bg-muted text-foreground"
                  }`}
                >
                  Buy
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Trust strip */}
      <section className="grid grid-cols-3 gap-2 px-4 pt-4 text-center">
        {[
          { icon: Truck, label: "Free delivery" },
          { icon: RotateCcw, label: "7-day return" },
          { icon: Shield, label: "Verified seller" },
        ].map((t) => (
          <div key={t.label} className="rounded-xl border border-border bg-card p-2.5">
            <t.icon className="mx-auto h-4 w-4 text-primary" />
            <p className="mt-1 text-[10px] font-semibold text-foreground">{t.label}</p>
          </div>
        ))}
      </section>

      {/* Disclaimer banner */}
      <section className="px-4 pt-4">
        <div className="flex items-start gap-2 rounded-xl border border-dashed border-border bg-muted/40 p-3 text-[11px] leading-snug text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p>
            <span className="font-bold text-foreground">Standard Disclaimer:</span> We may earn a
            small partner commission at no extra cost to you.
          </p>
        </div>
      </section>

      {/* Sticky bottom CTA */}
      <div className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-[480px] border-t border-border bg-card/95 px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Best price
            </p>
            <p className="truncate text-lg font-extrabold leading-none">{inr(best.price)}</p>
            <p className="mt-0.5 text-[10px] text-success font-semibold">
              on {best.store[0].toUpperCase() + best.store.slice(1)}
            </p>
          </div>
          <button
            type="button"
            className="ml-auto h-12 flex-1 rounded-xl bg-[image:var(--gradient-primary)] text-sm font-bold text-primary-foreground shadow-[var(--shadow-pop)] active:scale-[0.98]"
          >
            Buy Best Deal →
          </button>
        </div>
      </div>
    </div>
  );
}
