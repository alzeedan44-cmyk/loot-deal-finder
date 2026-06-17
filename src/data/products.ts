import type { Product } from "@/components/ProductCard";

export const products: Product[] = [
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

export const getProduct = (id: string) => products.find((p) => p.id === id);
