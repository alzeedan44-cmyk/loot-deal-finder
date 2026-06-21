import type { Product as BaseProduct } from "@/components/ProductCard";

export type CategoryId = "fashion" | "electronics" | "beauty" | "home";

export type Product = BaseProduct & { category: CategoryId };

export const categoryMeta: Record<
  CategoryId,
  { label: string; cashback: string; emoji: string }
> = {
  fashion: { label: "Fashion & Clothing", cashback: "10–12% Cashback", emoji: "👗" },
  electronics: { label: "Electronics & Gadgets", cashback: "2.5% Cashback", emoji: "📱" },
  beauty: { label: "Beauty & Cosmetics", cashback: "8% Cashback", emoji: "💄" },
  home: { label: "Home & Kitchen", cashback: "7% Cashback", emoji: "🍳" },
};

export const products: Product[] = [
  {
    id: "p1",
    category: "electronics",
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
    category: "fashion",
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
    category: "electronics",
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
  {
    id: "p4",
    category: "electronics",
    title: "Apple AirPods 4 with Active Noise Cancellation",
    emoji: "🎧",
    bg: "bg-gradient-to-br from-[oklch(0.95_0.01_270)] to-[oklch(0.88_0.02_280)]",
    mrp: 17900,
    offers: [
      { store: "amazon", price: 15499 },
      { store: "flipkart", price: 14999 },
      { store: "myntra", price: 16299 },
    ],
  },
  {
    id: "p5",
    category: "electronics",
    title: "Samsung Galaxy S24 5G (256GB, Onyx Black)",
    emoji: "📱",
    bg: "bg-gradient-to-br from-[oklch(0.90_0.03_260)] to-[oklch(0.82_0.04_250)]",
    mrp: 79999,
    offers: [
      { store: "amazon", price: 57999 },
      { store:"flipkart", price: 56490 },
      { store: "myntra", price: 59999 },
    ],
  },
  {
    id: "p6",
    category: "electronics",
    title: "boAt Wave Call 2 Smartwatch with BT Calling",
    emoji: "⌚",
    bg: "bg-gradient-to-br from-[oklch(0.92_0.03_320)] to-[oklch(0.86_0.05_300)]",
    mrp: 7990,
    offers: [
      { store: "amazon", price: 1799 },
      { store: "flipkart", price: 1699 },
      { store: "myntra", price: 1899 },
    ],
  },
  {
    id: "p7",
    category: "fashion",
    title: "Levi's 511 Slim Fit Stretch Jeans for Men",
    emoji: "👖",
    bg: "bg-gradient-to-br from-[oklch(0.88_0.05_245)] to-[oklch(0.78_0.08_255)]",
    mrp: 3999,
    offers: [
      { store: "amazon", price: 2199 },
      { store: "flipkart", price: 2299 },
      { store: "myntra", price: 1999 },
    ],
  },
  {
    id: "p8",
    category: "beauty",
    title: "Lakmé 9to5 Primer + Matte Lipstick",
    emoji: "💄",
    bg: "bg-gradient-to-br from-[oklch(0.94_0.05_15)] to-[oklch(0.88_0.08_350)]",
    mrp: 850,
    offers: [
      { store: "amazon", price: 599 },
      { store: "flipkart", price: 619 },
      { store: "myntra", price: 549 },
    ],
  },
  {
    id: "p9",
    category: "beauty",
    title: "Mamaearth Vitamin C Face Wash (150ml)",
    emoji: "🧴",
    bg: "bg-gradient-to-br from-[oklch(0.94_0.06_85)] to-[oklch(0.88_0.09_70)]",
    mrp: 499,
    offers: [
      { store: "amazon", price: 279 },
      { store: "flipkart", price: 299 },
      { store: "myntra", price: 249 },
    ],
  },
  {
    id: "p10",
    category: "home",
    title: "Prestige Deluxe Alpha 5L Pressure Cooker",
    emoji: "🍳",
    bg: "bg-gradient-to-br from-[oklch(0.92_0.04_150)] to-[oklch(0.84_0.07_165)]",
    mrp: 3495,
    offers: [
      { store: "amazon", price: 2199 },
      { store: "flipkart", price: 2099 },
      { store: "myntra", price: 2349 },
    ],
  },
  {
    id: "p11",
    category: "home",
    title: "Milton Thermosteel Flip Lid Flask 1000ml",
    emoji: "🍶",
    bg: "bg-gradient-to-br from-[oklch(0.92_0.03_200)] to-[oklch(0.84_0.05_220)]",
    mrp: 1495,
    offers: [
      { store: "amazon", price: 899 },
      { store: "flipkart", price: 849 },
      { store: "myntra", price: 949 },
    ],
  },
];

export const getProduct = (id: string) => products.find((p) => p.id === id);

import type { Store } from "@/components/StoreLogo";

export type ExtendedOffer = {
  store: Store;
  price: number;
  rating: number;
  ratings: number;
  eta: string;
};

// Deterministic pseudo-random from string seed
function seed(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return ((h >>> 0) % 10000) / 10000;
  };
}

const extraByCategory: Record<CategoryId, Store[]> = {
  fashion: ["ajio", "tatacliq"],
  beauty: ["nykaa", "tatacliq"],
  electronics: ["tatacliq"],
  home: ["tatacliq"],
};

const etaPool = [
  "Delivery in 2 days",
  "Delivery by tomorrow",
  "Delivery in 3–4 days",
  "Same day delivery",
  "Delivery in 5 days",
];

export function extendedOffers(product: Product): ExtendedOffer[] {
  const rng = seed(product.id);
  const baseStores = product.offers.map((o) => o.store);
  const extras = extraByCategory[product.category].filter(
    (s) => !baseStores.includes(s),
  );
  const all: { store: Store; price: number }[] = [
    ...product.offers,
    ...extras.map((store) => {
      // generate a price near average of existing offers
      const avg =
        product.offers.reduce((s, o) => s + o.price, 0) / product.offers.length;
      const delta = (rng() - 0.4) * 0.08 * avg; // ±~8%
      return { store, price: Math.round((avg + delta) / 10) * 10 };
    }),
  ];
  return all.map((o) => ({
    ...o,
    rating: Math.round((3.9 + rng() * 0.9) * 10) / 10, // 3.9 – 4.8
    ratings: Math.round(800 + rng() * 28000),
    eta: etaPool[Math.floor(rng() * etaPool.length)],
  }));
}

