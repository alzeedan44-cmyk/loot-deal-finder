import { Link } from "@tanstack/react-router";
import { StoreLogo, type Store } from "./StoreLogo";

export type Offer = { store: Store; price: number };

export type Product = {
  id: string;
  title: string;
  emoji: string;
  bg: string;
  mrp: number;
  offers: Offer[];
};

const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

export function ProductCard({ product }: { product: Product }) {
  const best = product.offers.reduce((a, b) => (a.price < b.price ? a : b));
  const off = Math.round(((product.mrp - best.price) / product.mrp) * 100);

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
      <Link
        to="/product/$id"
        params={{ id: product.id }}
        className="flex gap-3 p-3 active:bg-muted/40"
      >
        <div
          className={`grid h-24 w-24 shrink-0 place-items-center rounded-xl text-4xl ${product.bg}`}
          aria-hidden
        >
          {product.emoji}
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">
            {product.title}
          </h3>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-lg font-extrabold text-foreground">{inr(best.price)}</span>
            <span className="text-xs text-muted-foreground line-through">{inr(product.mrp)}</span>
            <span className="rounded-md bg-success/10 px-1.5 py-0.5 text-[10px] font-bold text-success">
              {off}% OFF
            </span>
          </div>
          <p className="mt-auto pt-1 text-[11px] text-muted-foreground">
            Best on <span className="font-semibold capitalize text-foreground">{best.store}</span>
          </p>
        </div>
      </Link>

      <div className="grid grid-cols-3 gap-1 border-t border-border bg-muted/40 px-2 py-2">
        {product.offers.map((o) => {
          const isBest = o.store === best.store;
          return (
            <div
              key={o.store}
              className={`flex flex-col items-center gap-1 rounded-lg py-1.5 ${
                isBest ? "bg-primary/10 ring-1 ring-primary/30" : ""
              }`}
            >
              <StoreLogo store={o.store} />
              <span className={`text-sm font-bold ${isBest ? "text-primary" : "text-foreground"}`}>
                {inr(o.price)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="p-3 pt-2">
        <button
          type="button"
          className="group relative h-11 w-full overflow-hidden rounded-xl bg-[image:var(--gradient-primary)] text-sm font-bold text-primary-foreground shadow-[var(--shadow-pop)] transition-transform active:scale-[0.98]"
        >
          <span className="relative z-10">
            Buy Best Deal on {best.store[0].toUpperCase() + best.store.slice(1)} →
          </span>
        </button>
      </div>
    </article>
  );
}
