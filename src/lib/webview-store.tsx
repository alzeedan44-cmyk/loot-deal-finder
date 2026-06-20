import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { Lock, X, ShieldCheck, ArrowLeft, RotateCw, Loader2, CheckCircle2, MapPin, User, Phone, Coins, Sparkles } from "lucide-react";
import type { Store } from "@/components/StoreLogo";
import { useWallet } from "@/lib/wallet-store";

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
const REWARD_COINS = 45;

type Phase = "loading" | "checkout" | "paying" | "success";

export function WebViewProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WebViewState | null>(null);
  const [phase, setPhase] = useState<Phase>("loading");
  const { credit } = useWallet();

  const open = useCallback((next: WebViewState) => {
    setState(next);
    setPhase("loading");
  }, []);
  const close = useCallback(() => setState(null), []);

  // Initial fake-handshake load
  useEffect(() => {
    if (!state || phase !== "loading") return;
    const t = setTimeout(() => setPhase("checkout"), 1100);
    return () => clearTimeout(t);
  }, [state, phase]);

  // Lock body scroll & support ESC
  useEffect(() => {
    if (!state) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && phase !== "paying") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [state, close, phase]);

  const startPayment = useCallback(() => {
    setPhase("paying");
    setTimeout(() => setPhase("success"), 2000);
  }, []);

  const claimAndClose = useCallback(() => {
    if (state) {
      credit(REWARD_COINS, `Purchase at ${storeLabel[state.store]}`, state.store);
    }
    setState(null);
  }, [state, credit]);

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
            onClick={() => phase !== "paying" && close()}
            className="absolute inset-0 bg-black/55 backdrop-blur-sm animate-fade-in"
          />

          {/* Sheet — visually framed inside NeoCart */}
          <div
            className="relative ml-auto mr-auto flex h-full w-full max-w-[480px] flex-col overflow-hidden rounded-t-3xl bg-background shadow-[0_-20px_60px_-20px_oklch(0_0_0/40%)] ring-1 ring-[oklch(0.62_0.24_295)]/25"
            style={{ animation: "neoSlideUp 320ms cubic-bezier(0.22,1,0.36,1)" }}
          >
            {/* NeoCart frame strip */}
            <div className="flex items-center justify-between bg-[oklch(0.21_0.04_270)] px-3 pb-1 pt-[max(env(safe-area-inset-top),10px)] text-[oklch(0.98_0.005_270)]">
              <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider opacity-90">
                <Sparkles className="h-3 w-3 text-[oklch(0.82_0.18_295)]" />
                NeoCart Secure Layer
              </span>
              <span className="flex items-center gap-1 text-[10px] font-semibold opacity-75">
                <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.78_0.25_145)] shadow-[0_0_6px_oklch(0.78_0.25_145)]" />
                Encrypted
              </span>
            </div>

            {/* Secure header */}
            <header
              className={`flex items-center gap-2 px-3 py-3 ${storeTheme[state.store].bar}`}
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
                    https://{storeHost[state.store]}/checkout
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => phase !== "paying" && close()}
                disabled={phase === "paying"}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/12 text-white transition-colors hover:bg-white/20 active:scale-95 disabled:opacity-40"
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
                <span className="truncate">{storeHost[state.store]}/checkout</span>
              </div>
              <button className="grid h-7 w-7 place-items-center rounded-md bg-white/10 opacity-70" aria-label="Reload">
                <RotateCw className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Body */}
            <div className="relative flex-1 overflow-y-auto bg-card">
              {phase === "loading" && (
                <>
                  <div className="absolute inset-x-0 top-0 h-0.5 overflow-hidden bg-primary/15">
                    <div className="h-full w-1/3 animate-[neoLoader_1.1s_ease-in-out_infinite] bg-[image:var(--gradient-primary)]" />
                  </div>
                  <div className="grid place-items-center gap-2 p-10 text-center">
                    <Loader2 className="h-7 w-7 animate-spin text-primary" />
                    <p className="text-[12px] font-semibold text-foreground">
                      Establishing secure handshake…
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Verifying cashback tracking link with {storeLabel[state.store]}
                    </p>
                  </div>
                </>
              )}

              {phase === "checkout" && (
                <CheckoutBody state={state} onPay={startPayment} />
              )}

              {phase === "paying" && (
                <div className="grid min-h-[60vh] place-items-center gap-3 p-6 text-center animate-fade-in">
                  <div className="relative grid h-20 w-20 place-items-center">
                    <span className="absolute inset-0 rounded-full bg-[image:var(--gradient-primary)] opacity-20 blur-xl" />
                    <Loader2 className="relative h-14 w-14 animate-spin text-primary" strokeWidth={2.2} />
                  </div>
                  <p className="text-[15px] font-extrabold text-foreground">Processing UPI Payment…</p>
                  <p className="max-w-[260px] text-[12px] leading-snug text-muted-foreground">
                    Securely authorising your transaction with {storeLabel[state.store]}. Please don't close this window.
                  </p>
                  <div className="mt-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    <Lock className="h-3 w-3 text-primary" />
                    256-bit encrypted
                  </div>
                </div>
              )}

              {phase === "success" && (
                <SuccessBody
                  state={state}
                  onClaim={claimAndClose}
                />
              )}
            </div>

            {/* Footer security strip (hidden during paying) */}
            {phase !== "paying" && (
              <div className="border-t border-border bg-card px-4 pb-[max(env(safe-area-inset-bottom),10px)] pt-2.5">
                <p className="text-center text-[10px] text-muted-foreground">
                  <Lock className="mr-1 inline h-2.5 w-2.5" />
                  256-bit encrypted partner session · powered by NeoCart
                </p>
              </div>
            )}
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

function CheckoutBody({ state, onPay }: { state: WebViewState; onPay: () => void }) {
  const price = state.price ?? 0;
  const tax = Math.round(price * 0.05);
  const total = price + tax;

  return (
    <div className="space-y-4 p-4 animate-fade-in">
      {/* Item summary */}
      <div className="rounded-2xl border border-border bg-muted/40 p-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Order Summary · {storeLabel[state.store]}
        </p>
        <div className="mt-2 flex gap-3">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-card text-2xl ring-1 ring-border">
            🛍️
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 text-[14px] font-extrabold text-foreground">
              {state.title}
            </h3>
            <p className="mt-0.5 text-[11px] text-muted-foreground">Qty 1 · Sold by {storeLabel[state.store]}</p>
          </div>
        </div>
        <div className="mt-3 space-y-1 border-t border-border pt-3 text-[12px]">
          <div className="flex justify-between text-muted-foreground">
            <span>Item price</span>
            <span className="tabular-nums">{inr(price)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>GST & fees</span>
            <span className="tabular-nums">{inr(tax)}</span>
          </div>
          <div className="flex justify-between text-success">
            <span>Delivery</span>
            <span className="font-bold">FREE</span>
          </div>
          <div className="mt-1.5 flex justify-between border-t border-border pt-2 text-[14px]">
            <span className="font-extrabold text-foreground">Total payable</span>
            <span className="font-extrabold tabular-nums text-primary">{inr(total)}</span>
          </div>
        </div>
      </div>

      {/* Delivery address */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-[12px] font-extrabold text-foreground">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            Delivery Address
          </p>
          <span className="rounded-full bg-muted px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
            Mock Data
          </span>
        </div>
        <div className="mt-3 space-y-2.5">
          <Field icon={User} label="Full name" defaultValue="Rohan Sharma" />
          <Field icon={MapPin} label="Address" defaultValue="402, Marine Heights, Marine Drive, Mumbai 400001" />
          <div className="grid grid-cols-2 gap-2">
            <Field icon={Phone} label="Phone" defaultValue="+91 98200 12345" />
            <Field label="Pincode" defaultValue="400001" />
          </div>
        </div>
      </div>

      {/* NeoCoins reward strip */}
      <div className="flex items-center gap-2 rounded-xl border border-[oklch(0.62_0.24_295)]/30 bg-[oklch(0.62_0.24_295)]/10 px-3 py-2.5 text-[12px]">
        <Coins className="h-4 w-4 text-primary" />
        <span className="font-semibold text-foreground">
          You'll earn <b className="text-primary">{REWARD_COINS} NeoCoins</b> on this purchase
        </span>
      </div>

      {/* UPI quick pay */}
      <button
        type="button"
        onClick={onPay}
        className="group relative flex h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-[image:var(--gradient-primary)] text-[15px] font-extrabold text-primary-foreground shadow-[var(--shadow-pop)] transition-transform active:scale-[0.98]"
      >
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-white/15 text-[11px] font-extrabold">
          UPI
        </span>
        Quick Pay via UPI · {inr(total)}
      </button>
      <p className="text-center text-[10px] text-muted-foreground">
        By paying, you agree to {storeLabel[state.store]} Terms · Mock simulation
      </p>
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  defaultValue,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  defaultValue: string;
}) {
  return (
    <label className="block">
      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div className="mt-1 flex h-10 items-center gap-2 rounded-lg border border-border bg-background px-2.5">
        {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground" />}
        <input
          defaultValue={defaultValue}
          className="h-full w-full bg-transparent text-[12px] font-medium text-foreground outline-none"
        />
      </div>
    </label>
  );
}

function SuccessBody({ state, onClaim }: { state: WebViewState; onClaim: () => void }) {
  return (
    <div className="grid min-h-[60vh] place-items-center p-6 text-center animate-fade-in">
      <div className="flex flex-col items-center gap-4">
        <div className="relative grid h-24 w-24 place-items-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-success/30" />
          <span className="absolute inset-2 rounded-full bg-success/20" />
          <span className="relative grid h-20 w-20 place-items-center rounded-full bg-success text-white shadow-[0_10px_30px_-8px_oklch(0.65_0.18_145/55%)]">
            <CheckCircle2 className="h-10 w-10" strokeWidth={2.4} />
          </span>
        </div>
        <h2 className="text-xl font-extrabold tracking-tight text-foreground">
          Payment Successful!
        </h2>
        <p className="max-w-[280px] text-[13px] leading-snug text-muted-foreground">
          Your order has been placed with our partner store <b className="text-foreground">{storeLabel[state.store]}</b>.
        </p>

        <div className="mt-2 rounded-2xl border border-[oklch(0.62_0.24_295)]/30 bg-[image:linear-gradient(135deg,oklch(0.55_0.25_290)/12%,oklch(0.62_0.24_260)/12%)] px-4 py-3 text-center">
          <p className="flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-primary">
            <Coins className="h-3.5 w-3.5" />
            Reward Pending Credit
          </p>
          <p className="mt-1 font-display text-2xl font-extrabold text-primary">
            +{REWARD_COINS} NeoCoins
          </p>
        </div>

        <button
          type="button"
          onClick={onClaim}
          className="mt-3 h-13 w-full max-w-[320px] rounded-2xl bg-[image:var(--gradient-primary)] px-5 py-3.5 text-[14px] font-extrabold text-primary-foreground shadow-[var(--shadow-pop)] transition-transform active:scale-[0.98]"
        >
          Return to NeoCart & Claim {REWARD_COINS} NeoCoins →
        </button>
        <p className="text-[10px] text-muted-foreground">
          Order ID: NC-{Date.now().toString().slice(-8)}
        </p>
      </div>
    </div>
  );
}

export function useWebView() {
  const ctx = useContext(WebViewContext);
  if (!ctx) throw new Error("useWebView must be used inside <WebViewProvider>");
  return ctx;
}
