type Store = "amazon" | "flipkart" | "myntra";

const labels: Record<Store, string> = {
  amazon: "amazon",
  flipkart: "Flipkart",
  myntra: "Myntra",
};

const bg: Record<Store, string> = {
  amazon: "bg-[oklch(0.98_0.01_80)] text-[oklch(0.40_0.10_60)]",
  flipkart: "bg-[oklch(0.96_0.04_250)] text-[oklch(0.40_0.18_250)]",
  myntra: "bg-[oklch(0.97_0.03_10)] text-[oklch(0.45_0.20_10)]",
};

export function StoreLogo({ store }: { store: Store }) {
  return (
    <span
      className={`inline-flex h-6 items-center rounded-md px-2 text-[11px] font-bold tracking-tight ${bg[store]}`}
    >
      {labels[store]}
      {store === "amazon" && <span className="ml-0.5 text-[oklch(0.72_0.15_60)]">.in</span>}
      {store === "flipkart" && <span className="ml-0.5 text-[oklch(0.78_0.16_85)]">★</span>}
    </span>
  );
}

export type { Store };
