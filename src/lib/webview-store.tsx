import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { Lock, X, ShieldCheck, ArrowLeft, RotateCw, Loader2 } from "lucide-react";
import type { Store } from "@/components/StoreLogo";

type WebViewState = {
  store: Store;
  title: string;
  price?: number;
};

type WebViewContextValue = {
  open: (state: WebViewState) => void;
  close: () => void;
};

const WebViewContext = createContext<WebViewContextValue | null>(null);

const storeLabel: Record<Store, string> = {
  amazon: "Amazon",
  flipkart: "Flipkart",
  myntra: "Myntra",
};

const storeHost: Record<Store, string> = {
  amazon: "amazon.in",
  flipkart: "flipkart.com",
  myntra: "myntra.com",
};

const storeTheme: Record<Store, { bar: string; accent: string }> = {
  amazon: {
    bar: "bg-[oklch(0.18_0.02_60)] text-[oklch(0.98_0.005_60)]",
    accent: "text-[oklch(0.78_0.16_75)]",
  },
  flipkart: {
    bar: "bg-[oklch(0.30_0.14_255)] text-white",
    accent: "text-[oklch(0.85_0.16_85)]",
  },
  myntra: {
    bar: "bg-[oklch(0.28_0.10_15)] text-white",
    accent: "text-[oklch(0.78_0.18_15)]",
  },
};

const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

export function WebViewProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WebViewState | null>(null);
  const [loading, setLoading] = useState(false);

  const open = useCallback((next: WebViewState) => {
    setState(next);
    setLoading(true);
  }, []);
  const close = useCallback(() => setState(null), []);

  // Lock body scroll & support ESC
  useEffect(() => {
    if (!state) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    const t = setTimeout(() => setLoading(false), 1100);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [state, close]);

  const value = useMemo<WebViewContextValue>(() => ({ open, close }), [open, close]);

  return (
    <WebViewContext.Provider value={value}>
      {children}
      {state && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Secure Partner Connection ${storeLabel[state.store]}`}
          className="fixed inset-0 z-[60] flex justify-center"
        >
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close partner browser"
            onClick={close}
            className="absolute inset-0 bg-black/55 backdrop-blur-sm animate-fade-in"
          />

          {/* Sheet */}
          <div
            className="relative ml-auto mr-auto flex h-full w-full max-w-[480px] flex-col overflow-hidden rounded-t-3xl bg-background shadow-[0_-20px_60px_-20px_oklch(0_0_0/40%)]"
            style={{ animation: "neoSlideUp 320ms cubic-bezier(0.22,1,0.36,1)" }}
          >
            {/* Secure header */}
            <header
              className={`flex items-center gap-2 px-3 pb-3 pt-[max(env(safe-area-inset-top),12px)] ${storeTheme[state.store].bar}`}
            >
              <div className="flex min-w-0 flex-1 items-center gap-2.5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 ring-1 ring-white/15">
                  <Lock className="h-4 w-4" />
                </span>
                <div className="min-w-0 leading-tight">
                  <p className="flex items-center gap-1 text-[12px] font-extrabold">
                    <ShieldCheck className={`h-3.5 w-3.5 ${storeTheme[state.store].accent}`} />
                    <span className="truncate">
                      Secure Partner Connection ({storeLabel[state.store]})
                    </span>
                  </p>
                  <p className="truncate text-[10px] font-medium uppercase tracking-wider text-white/70">
                    https://{storeHost[state.store]}
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={close}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/12 text-white transition-colors hover:bg-white/20 active:scale-95"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </header>

            {/* Faux browser controls */}
            <div className={`flex items-center gap-2 border-b border-white/10 px-3 py-2 ${storeTheme[state.store].bar}`}>
              <button className="grid h-7 w-7 place-items-center rounded-md bg-white/10 opacity-70" aria-label="Back">
                <ArrowLeft className="h-3.5 w-3.5" />
              </button>
              <div className="flex min-w-0 flex-1 items-center gap-1.5 truncate rounded-md bg-white/10 px-2 py-1 text-[11px] font-semibold">
                <Lock className="h-3 w-3 shrink-0 opacity-80" />
                <span className="truncate">{storeHost[state.store]}/product</span>
              </div>
              <button
                className="grid h-7 w-7 place-items-center rounded-md bg-white/10 opacity-70"
                aria-label="Reload"
              >
                <RotateCw className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* WebView body */}
            <div className="relative flex-1 overflow-y-auto bg-card">
              {loading && (
                <div className="absolute inset-x-0 top-0 h-0.5 overflow-hidden bg-primary/15">
                  <div className="h-full w-1/3 animate-[neoLoader_1.1s_ease-in-out_infinite] bg-[image:var(--gradient-primary)]" />
                </div>
              )}

              <div className="space-y-4 p-4 animate-fade-in">
                <div className="rounded-2xl border border-border bg-muted/40 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Redirecting to {storeLabel[state.store]}
                  </p>
                  <h3 className="mt-1 line-clamp-2 text-[15px] font-extrabold text-foreground">
                    {state.title}
                  </h3>
                  {state.price !== undefined && (
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-2xl font-extrabold text-primary">
                        {inr(state.price)}
                      </span>
                      <span className="text-[11px] font-semibold text-success">
                        Lowest verified price
                      </span>
                    </div>
                  )}
                </div>

                {loading ? (
                  <div className="grid place-items-center gap-2 rounded-2xl border border-dashed border-border bg-card p-8 text-center">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <p className="text-[12px] font-semibold text-foreground">
                      Establishing secure handshake…
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Verifying cashback tracking link
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <div className="h-32 animate-pulse rounded-xl bg-muted" />
                      <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
                      <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="h-20 animate-pulse rounded-xl bg-muted" />
                      <div className="h-20 animate-pulse rounded-xl bg-muted" />
                    </div>
                    <div className="rounded-xl border border-border bg-muted/40 p-3 text-[11px] leading-snug text-muted-foreground">
                      <span className="font-bold text-foreground">Simulation:</span> This is an
                      in-app preview of the partner store. Real cashback is tracked when this
                      session completes a purchase.
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Footer CTA */}
            <div className="border-t border-border bg-card px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-3">
              <button
                type="button"
                onClick={close}
                className="h-11 w-full rounded-xl bg-[image:var(--gradient-primary)] text-sm font-bold text-primary-foreground shadow-[var(--shadow-pop)] active:scale-[0.98]"
              >
                Continue on {storeLabel[state.store]} →
              </button>
              <p className="mt-2 text-center text-[10px] text-muted-foreground">
                <Lock className="mr-1 inline h-2.5 w-2.5" />
                256-bit encrypted partner session
              </p>
            </div>
          </div>

          <style>{`
            @keyframes neoSlideUp {
              from { transform: translateY(100%); }
              to { transform: translateY(0); }
            }
            @keyframes neoLoader {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(400%); }
            }
          `}</style>
        </div>
      )}
    </WebViewContext.Provider>
  );
}

export function useWebView() {
  const ctx = useContext(WebViewContext);
  if (!ctx) throw new Error("useWebView must be used inside <WebViewProvider>");
  return ctx;
}
