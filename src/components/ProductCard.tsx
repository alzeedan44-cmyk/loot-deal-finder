import { Link } from "@tanstack/react-router";
import { Star, Truck } from "lucide-react";
import { StoreLogo, type Store } from "./StoreLogo";
import { useWebView } from "@/lib/webview-store";
import { PriceAlertBell } from "@/lib/price-alert-store";
import { extendedOffers } from "@/data/products";
import type { Product as DataProduct } from "@/data/products";
import type { LiveProduct } from "@/lib/products-live";
import { handleBuy } from "@/lib/buy-handler";

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

export function ProductCard({ product }: { product: DataProduct | LiveProduct }) {
  const rich = (product as LiveProduct).richOffers;
  const rows = (rich ?? extendedOffers(product)).slice().sort((a, b) => a.price - b.price);
  const best = rows[0];
  const off = Math.round(((product.mrp - best.price) / product.mrp) * 100);
  const { open } = useWebView();

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
          <div className="flex items-start gap-2">
            <h3 className="line-clamp-2 flex-1 text-sm font-semibold leading-snug text-foreground">
              {product.title}
            </h3>
            <div onClick={(e) => e.preventDefault()} className="-mr-1 -mt-1">
              <PriceAlertBell productId={product.id} productTitle={product.title} />
            </div>
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-lg font-extrabold text-foreground">{inr(best.price)}</span>
            <span className="text-xs text-muted-foreground line-through">{inr(product.mrp)}</span>
            <span className="rounded-md bg-success/10 px-1.5 py-0.5 text-[10px] font-bold text-success">
              {off}% OFF
            </span>
          </div>
          <p className="mt-auto pt-1 text-[11px] text-muted-foreground">
            Best on <span className="font-semibold capitalize text-foreground">{best.store}</span> · {rows.length} stores
          </p>
        </div>
      </Link>

      <div className="divide-y divide-border border-t border-border bg-muted/30">
        {rows.map((o, i) => {
          const isBest = i === 0;
          return (
            <div
              key={o.store}
              className={`flex items-center gap-2.5 px-3 py-2 ${
                isBest ? "bg-primary/5" : ""
              }`}
            >
              <div className="w-[72px] shrink-0">
                <StoreLogo store={o.store} />
              </div>
              <div className="min-w-0 flex-1 leading-tight">
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <span className="inline-flex items-center gap-0.5 rounded bg-[oklch(0.97_0.05_85)] px-1 py-px font-bold text-[oklch(0.45_0.15_75)]">
                    <Star className="h-2.5 w-2.5 fill-current" />
                    {o.rating}
                  </span>
                  <span className="tabular-nums">({o.ratings.toLocaleString("en-IN")})</span>
                </div>
                <p className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Truck className="h-2.5 w-2.5" />
                  {o.eta}
                </p>
              </div>
              <span
                className={`text-right text-sm font-extrabold tabular-nums ${
                  isBest ? "text-primary" : "text-foreground"
                }`}
              >
                {inr(o.price)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="p-3 pt-2">
        <button
          type="button"
          onClick={() =>
            handleBuy({ product, store: best.store, price: best.price, openWebView: open })
          }
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
