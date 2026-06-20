import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { BellRing } from "lucide-react";

type PriceAlertState = {
  active: Set<string>;
  toggle: (productId: string, productTitle?: string) => boolean; // returns new state
  isActive: (productId: string) => boolean;
};

const PriceAlertContext = createContext<PriceAlertState | null>(null);

export function PriceAlertProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<Set<string>>(new Set());

  const toggle = useCallback((productId: string, productTitle?: string) => {
    let nowActive = false;
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
        nowActive = false;
      } else {
        next.add(productId);
        nowActive = true;
      }
      return next;
    });
    if (!active.has(productId)) {
      // activating
      toast.custom(
        () => (
          <div className="flex w-full items-start gap-3 rounded-2xl border border-[oklch(0.62_0.24_295)]/40 bg-[oklch(0.22_0.05_270)] p-4 text-[oklch(0.98_0.005_270)] shadow-[0_12px_30px_-8px_oklch(0.55_0.25_290/45%)]">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[image:linear-gradient(135deg,oklch(0.55_0.25_290),oklch(0.62_0.24_260))] text-white shadow-[0_0_18px_oklch(0.62_0.24_295/55%)]">
              <BellRing className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-[13px] font-extrabold leading-tight">
                Price Tracker Activated!
              </p>
              <p className="mt-1 text-[11px] leading-snug text-[oklch(0.82_0.02_270)]">
                {productTitle ? <span className="font-semibold text-white">{productTitle}: </span> : null}
                NeoCart will send you an automated alert the exact second this item drops in price on Amazon, Flipkart, or Myntra.
              </p>
            </div>
          </div>
        ),
        { duration: 3500 },
      );
    }
    return nowActive;
  }, [active]);

  const isActive = useCallback((id: string) => active.has(id), [active]);

  const value = useMemo<PriceAlertState>(() => ({ active, toggle, isActive }), [active, toggle, isActive]);

  return <PriceAlertContext.Provider value={value}>{children}</PriceAlertContext.Provider>;
}

export function usePriceAlert() {
  const ctx = useContext(PriceAlertContext);
  if (!ctx) throw new Error("usePriceAlert must be used inside <PriceAlertProvider>");
  return ctx;
}

export function PriceAlertBell({
  productId,
  productTitle,
  className,
}: {
  productId: string;
  productTitle?: string;
  className?: string;
}) {
  const { toggle, isActive } = usePriceAlert();
  const on = isActive(productId);
  return (
    <button
      type="button"
      aria-label={on ? "Price alert active" : "Activate price alert"}
      aria-pressed={on}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(productId, productTitle);
      }}
      className={
        "grid h-9 w-9 shrink-0 place-items-center rounded-full transition-all active:scale-90 " +
        (on
          ? "bg-[image:linear-gradient(135deg,oklch(0.55_0.25_290),oklch(0.62_0.24_260))] text-white shadow-[0_0_14px_oklch(0.62_0.24_295/65%)] ring-2 ring-[oklch(0.62_0.24_295)]/40"
          : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary") +
        (className ? " " + className : "")
      }
    >
      <BellIcon on={on} />
    </button>
  );
}

function BellIcon({ on }: { on: boolean }) {
  if (on) {
    // Solid bell
    return (
      <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" aria-hidden fill="currentColor">
        <path d="M12 2a1.5 1.5 0 0 0-1.5 1.5v.7C7.6 5 5.5 7.7 5.5 11v3.2L4 17h16l-1.5-2.8V11c0-3.3-2.1-6-5-6.8v-.7A1.5 1.5 0 0 0 12 2zm0 20a2.5 2.5 0 0 0 2.45-2H9.55A2.5 2.5 0 0 0 12 22z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" aria-hidden fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}
