// Live product catalog — reads from Supabase (products + offers) and shapes
// rows into the same `Product` type the UI already understands. Falls back
// to the static seed in @/data/products on error or empty result so the app
// keeps working during migrations.

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Store } from "@/components/StoreLogo";
import {
  products as staticProducts,
  type Product,
  type CategoryId,
  type ExtendedOffer,
} from "@/data/products";

// Extra fields we attach on live products. UI code can read these when
// present and fall back to derived data otherwise.
export type LiveProduct = Product & {
  richOffers?: ExtendedOffer[];
  rawUrls?: Partial<Record<Store, string>>;
};

const VALID_STORES: Store[] = ["amazon", "flipkart", "myntra", "ajio", "nykaa", "tatacliq"];
const VALID_CATEGORIES: CategoryId[] = ["fashion", "electronics", "beauty", "home"];

const bgByCategory: Record<CategoryId, string> = {
  electronics: "bg-gradient-to-br from-[oklch(0.92_0.03_260)] to-[oklch(0.85_0.05_285)]",
  fashion: "bg-gradient-to-br from-[oklch(0.94_0.04_15)] to-[oklch(0.88_0.06_345)]",
  beauty: "bg-gradient-to-br from-[oklch(0.95_0.05_340)] to-[oklch(0.90_0.07_20)]",
  home: "bg-gradient-to-br from-[oklch(0.93_0.04_150)] to-[oklch(0.86_0.06_170)]",
};

function normalizeCategory(c: string | null | undefined): CategoryId {
  const v = (c ?? "").toLowerCase();
  return (VALID_CATEGORIES as string[]).includes(v) ? (v as CategoryId) : "electronics";
}

type OfferRow = {
  product_id: string;
  merchant_slug: string;
  price: number;
  rating: number | null;
  ratings_count: number | null;
  eta: string | null;
  raw_url: string | null;
  in_stock: boolean | null;
};

type ProductRow = {
  id: string;
  title: string;
  category: string | null;
  emoji: string | null;
  mrp: number;
  active: boolean | null;
};

async function fetchLiveProducts(): Promise<LiveProduct[]> {
  const [{ data: prodRows, error: pErr }, { data: offerRows, error: oErr }] = await Promise.all([
    supabase.from("products").select("id,title,category,emoji,mrp,active").eq("active", true),
    supabase
      .from("offers")
      .select("product_id,merchant_slug,price,rating,ratings_count,eta,raw_url,in_stock"),
  ]);

  if (pErr || oErr) {
    console.warn("[NeoCart] live catalog fetch failed:", pErr?.message, oErr?.message);
    return staticProducts;
  }
  if (!prodRows || prodRows.length === 0) return staticProducts;

  const offersByProduct = new Map<string, OfferRow[]>();
  for (const o of (offerRows ?? []) as OfferRow[]) {
    if (!VALID_STORES.includes(o.merchant_slug as Store)) continue;
    const list = offersByProduct.get(o.product_id) ?? [];
    list.push(o);
    offersByProduct.set(o.product_id, list);
  }

  const live: LiveProduct[] = (prodRows as ProductRow[])
    .map((p) => {
      const rows = (offersByProduct.get(p.id) ?? []).filter((r) => r.in_stock !== false);
      if (rows.length === 0) return null;
      const category = normalizeCategory(p.category);
      const rawUrls: Partial<Record<Store, string>> = {};
      const richOffers: ExtendedOffer[] = rows.map((r) => {
        const store = r.merchant_slug as Store;
        if (r.raw_url) rawUrls[store] = r.raw_url;
        return {
          store,
          price: r.price,
          rating: r.rating ?? 4.2,
          ratings: r.ratings_count ?? 1200,
          eta: r.eta ?? "Delivery in 3 days",
        };
      });
      return {
        id: p.id,
        title: p.title,
        emoji: p.emoji ?? "🛍️",
        bg: bgByCategory[category],
        mrp: p.mrp,
        category,
        offers: richOffers.map(({ store, price }) => ({ store, price })),
        richOffers,
        rawUrls,
      } satisfies LiveProduct;
    })
    .filter((x): x is LiveProduct => x !== null);

  return live.length > 0 ? live : staticProducts;
}

export function useProducts() {
  return useQuery({
    queryKey: ["products", "live"],
    queryFn: fetchLiveProducts,
    staleTime: 60_000,
    placeholderData: staticProducts,
  });
}

export function useProduct(id: string | undefined) {
  const { data, isLoading } = useProducts();
  const product = data?.find((p) => p.id === id);
  return { product, isLoading };
}
