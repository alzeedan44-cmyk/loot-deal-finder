import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Wallet,
  ArrowUpRight,
  Gift,
  History,
  Coins,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  Award,
  Clock,
  CheckCircle2,
  Banknote,
  ShoppingBag,
  X,
  Copy,
  Check,
  Users,
  Share2,
  MoreHorizontal,
} from "lucide-react";
import { toast } from "sonner";

import { MobileShell } from "@/components/MobileShell";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useWallet, type Transaction } from "@/lib/wallet-store";

export const Route = createFileRoute("/wallet")({
  head: () => ({
    meta: [
      { title: "My Wallet — NeoCart Rewards" },
      {
        name: "description",
        content: "View your NeoCoins balance, redeem rewards, and track transactions on NeoCart.",
      },
    ],
  }),
  component: WalletPage,
});

const quickActions = [
  {
    id: "withdraw",
    label: "Withdraw to UPI",
    icon: ArrowUpRight,
    gradient: "bg-[image:var(--gradient-primary)] text-primary-foreground",
  },
  {
    id: "redeem",
    label: "Redeem Gift Cards",
    icon: Gift,
    gradient: "bg-[image:var(--gradient-loot)] text-primary-foreground",
  },
  {
    id: "history",
    label: "Transaction History",
    icon: History,
    gradient: "bg-secondary text-secondary-foreground",
  },
];

function storeBadge(store: Transaction["store"]) {
  switch (store) {
    case "myntra":
      return { label: "M", cls: "bg-[oklch(0.95_0.05_15)] text-[oklch(0.50_0.20_15)]" };
    case "amazon":
      return { label: "a", cls: "bg-[oklch(0.97_0.04_80)] text-[oklch(0.45_0.14_60)]" };
    case "flipkart":
      return { label: "F", cls: "bg-[oklch(0.95_0.04_250)] text-[oklch(0.40_0.18_250)]" };
    case "ajio":
      return { label: "AJ", cls: "bg-[oklch(0.95_0.02_30)] text-[oklch(0.30_0.04_30)]" };
    case "nykaa":
      return { label: "N", cls: "bg-[oklch(0.95_0.05_350)] text-[oklch(0.45_0.20_350)]" };
    case "tatacliq":
      return { label: "T", cls: "bg-[oklch(0.95_0.04_280)] text-[oklch(0.38_0.18_280)]" };
    case "upi":
      return { label: "₹", cls: "bg-muted text-muted-foreground" };
  }
}

function statusChip(status: Transaction["status"]) {
  if (status === "pending")
    return {
      label: "Pending Validation",
      cls: "bg-[oklch(0.97_0.05_70)] text-[oklch(0.50_0.15_60)]",
      icon: Clock,
    };
  if (status === "approved")
    return {
      label: "Approved",
      cls: "bg-success/10 text-success",
      icon: CheckCircle2,
    };
  return {
    label: "Withdrawal",
    cls: "bg-muted text-muted-foreground",
    icon: Banknote,
  };
}

function coinColor(tx: Transaction) {
  if (tx.status === "pending") return "text-[oklch(0.62_0.18_55)]";
  if (tx.status === "approved") return "text-success";
  return "text-muted-foreground";
}

function WalletPage() {
  const { balance, tier, nextTierAt, transactions, addWithdrawal } = useWallet();
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  const remaining = Math.max(0, nextTierAt - balance);
  const progress = Math.min(100, Math.round((balance / nextTierAt) * 100));

  return (
    <MobileShell>
      {/* Profile + Tier */}
      <section className="px-4 pt-4">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-[image:var(--gradient-primary)] font-display text-base font-extrabold text-primary-foreground shadow-[var(--shadow-pop)]">
            RS
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Welcome back
            </p>
            <p className="truncate text-base font-extrabold text-foreground">Rohan Sharma</p>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-[oklch(0.95_0.05_55)] px-2.5 py-1 text-[10px] font-bold text-[oklch(0.45_0.13_55)]">
            <Award className="h-3 w-3" />
            BRONZE
          </span>
        </div>

        {/* Tier progress */}
        <div className="mt-3 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between text-[11px] font-bold">
            <span className="flex items-center gap-1.5 text-[oklch(0.45_0.13_55)]">
              <span className="h-2 w-2 rounded-full bg-[oklch(0.65_0.15_55)]" />
              Bronze Saver
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              Silver Shopper
              <span className="h-2 w-2 rounded-full bg-[oklch(0.78_0.02_270)]" />
            </span>
          </div>

          <div className="relative mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-[image:var(--gradient-primary)] transition-[width] duration-500"
              style={{ width: `${progress}%` }}
            />
            <div
              className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-primary shadow-md"
              style={{ left: `${progress}%` }}
            />
          </div>

          <div className="mt-2 flex items-center justify-between text-[10px] font-semibold text-muted-foreground">
            <span>{balance} NC</span>
            <span>{nextTierAt} NC</span>
          </div>

          <p className="mt-3 rounded-xl bg-primary/5 px-3 py-2 text-[12px] leading-snug text-foreground">
            <Sparkles className="mr-1 inline h-3.5 w-3.5 align-[-2px] text-primary" />
            Earn <b className="text-primary">{remaining} more NeoCoins</b> to unlock{" "}
            <b>Silver Tier</b> and get <b className="text-primary">5% bonus cashback rates!</b>
          </p>
        </div>
      </section>

      {/* Balance card */}
      <section className="px-4 pt-4">
        <div className="relative overflow-hidden rounded-3xl bg-[image:var(--gradient-wallet)] p-5 text-primary-foreground shadow-[var(--shadow-pop)]">
          <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

          <div className="relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold opacity-90">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-white/15">
                  <Wallet className="h-4 w-4" />
                </span>
                NeoCoins Wallet
              </div>
              <span className="flex items-center gap-1 rounded-full bg-white/15 px-2 py-1 text-[10px] font-bold backdrop-blur">
                <ShieldCheck className="h-3 w-3" />
                SECURE
              </span>
            </div>

            <div className="mt-5">
              <p className="text-[13px] font-medium opacity-85">Available Balance</p>
              <p className="mt-1 text-4xl font-extrabold tracking-tight tabular-nums">
                {balance.toFixed(2)}{" "}
                <span className="text-2xl font-bold opacity-90">NeoCoins</span>
              </p>
            </div>

            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-sm font-semibold backdrop-blur">
              <Coins className="h-3.5 w-3.5" />
              <span>Estimated Cash Value:</span>
              <span className="tabular-nums">₹{balance.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick actions */}
      <section className="pt-6">
        <header className="mb-3 flex items-end justify-between px-4">
          <h2 className="text-base font-extrabold">Quick Actions</h2>
        </header>

        <div className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1">
          {quickActions.map((action) => {
            const Icon = action.icon;
            const onClick = action.id === "withdraw" ? () => setWithdrawOpen(true) : undefined;
            return (
              <button
                key={action.id}
                type="button"
                onClick={onClick}
                className="flex w-32 shrink-0 snap-start flex-col items-center gap-2.5 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)] transition-transform active:scale-95"
              >
                <span
                  className={cn(
                    "grid h-12 w-12 place-items-center rounded-xl",
                    action.gradient,
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-center text-xs font-semibold leading-tight text-foreground">
                  {action.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Earn more banner */}
      <section className="px-4 pt-5">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
          <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-primary/10 blur-2xl" />
          <div className="relative flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground">
              <TrendingUp className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-extrabold text-foreground">Earn more NeoCoins</h3>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                Shop via NeoCart and earn upto 12% cashback as NeoCoins.
              </p>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          </div>
        </div>
      </section>
      {/* Refer & Earn */}
      <ReferEarnCard />


      {/* Recent activity */}
      <section className="px-4 pt-5">
        <header className="mb-3 flex items-end justify-between">
          <h2 className="text-base font-extrabold">Recent Activity</h2>
          <button className="text-xs font-semibold text-primary">View all</button>
        </header>

        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
          {transactions.map((tx, i) => {
            const badge = storeBadge(tx.store);
            const chip = statusChip(tx.status);
            const ChipIcon = chip.icon;
            return (
              <div
                key={tx.id}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-3",
                  i !== transactions.length - 1 && "border-b border-border",
                )}
              >
                <span
                  className={cn(
                    "grid h-10 w-10 shrink-0 place-items-center rounded-xl font-display text-base font-extrabold",
                    badge.cls,
                  )}
                >
                  {badge.label}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-bold text-foreground">{tx.title}</p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold",
                        chip.cls,
                      )}
                    >
                      <ChipIcon className="h-2.5 w-2.5" />
                      {chip.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground">· {tx.timestamp}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn("text-sm font-extrabold tabular-nums", coinColor(tx))}>
                    {tx.coins > 0 ? "+" : ""}
                    {tx.coins} <span className="text-[10px] font-bold">NC</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {transactions.length === 0 && (
          <div className="mt-3 flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border bg-muted/40 p-5 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
              <ShoppingBag className="h-5 w-5" />
            </span>
            <p className="text-sm font-semibold text-foreground">No activity yet</p>
          </div>
        )}
      </section>

      <WithdrawSheet
        open={withdrawOpen}
        onOpenChange={setWithdrawOpen}
        balance={balance}
        onConfirm={addWithdrawal}
      />
    </MobileShell>
  );
}

function WithdrawSheet({
  open,
  onOpenChange,
  balance,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  balance: number;
  onConfirm: (amount: number, upi: string) => void;
}) {
  const [upi, setUpi] = useState("");
  const [amountStr, setAmountStr] = useState("");

  const amount = Number(amountStr);
  const upiValid = /^[\w.\-]{2,}@[a-zA-Z][\w.\-]{1,}$/.test(upi.trim());
  const amountValid = Number.isFinite(amount) && amount >= 200 && amount <= balance;
  const valid = upiValid && amountValid;

  const errorText = useMemo(() => {
    if (!amountStr && !upi) return null;
    if (amountStr && amount > balance) return "Amount exceeds your available balance.";
    if (amountStr && amount > 0 && amount < 200)
      return "Minimum withdrawal is 200 NeoCoins.";
    if (upi && !upiValid) return "Enter a valid UPI ID like username@upi.";
    return null;
  }, [upi, upiValid, amount, amountStr, balance]);

  const submit = () => {
    if (!valid) return;
    onConfirm(amount, upi.trim());
    setUpi("");
    setAmountStr("");
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="mx-auto max-w-[480px] rounded-t-3xl border-0 p-0 shadow-[var(--shadow-pop)]"
      >
        <div className="flex justify-center pt-3">
          <span className="h-1.5 w-10 rounded-full bg-muted" />
        </div>

        <div className="flex items-start justify-between px-5 pt-2">
          <div>
            <SheetTitle className="font-display text-lg font-extrabold">
              Withdraw to UPI
            </SheetTitle>
            <p className="mt-0.5 text-[12px] text-muted-foreground">
              Transfer your NeoCoins to any UPI account instantly.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="grid h-8 w-8 place-items-center rounded-full bg-muted text-muted-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5 pb-[max(env(safe-area-inset-bottom),20px)] pt-4">
          {/* Balance */}
          <div className="mb-4 flex items-center justify-between rounded-xl bg-primary/5 px-3.5 py-2.5">
            <span className="text-[11px] font-semibold text-muted-foreground">
              Available balance
            </span>
            <span className="text-sm font-extrabold tabular-nums text-primary">
              {balance.toFixed(2)} NC
            </span>
          </div>

          <label className="block">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              UPI ID (VPA)
            </span>
            <input
              type="text"
              inputMode="email"
              autoCapitalize="none"
              value={upi}
              onChange={(e) => setUpi(e.target.value)}
              placeholder="username@upi"
              className="mt-1.5 h-12 w-full rounded-xl border border-input bg-background px-3.5 text-sm font-medium outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>

          <label className="mt-4 block">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Withdrawal Amount
            </span>
            <div className="relative mt-1.5">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
                NC
              </span>
              <input
                type="number"
                inputMode="numeric"
                min={200}
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                placeholder="200"
                className="h-12 w-full rounded-xl border border-input bg-background pl-10 pr-3.5 text-sm font-medium outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </label>

          <p className="mt-2 text-[11px] text-muted-foreground">
            <ShieldCheck className="mr-1 inline h-3 w-3 align-[-2px] text-primary" />
            Minimum withdrawal threshold is <b>200 NeoCoins (₹200)</b>.
          </p>

          {errorText && (
            <p className="mt-2 text-[11px] font-semibold text-destructive">{errorText}</p>
          )}

          <button
            type="button"
            disabled={!valid}
            onClick={submit}
            className={cn(
              "mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-extrabold transition-all",
              valid
                ? "bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-pop)] active:scale-[0.98]"
                : "cursor-not-allowed bg-muted text-muted-foreground",
            )}
          >
            <ArrowUpRight className="h-4 w-4" />
            Confirm Transfer
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function ReferEarnCard() {
  const code = "NEOPROFIT50";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // ignore
    }
    setCopied(true);
    toast.success("Referral code copied!", {
      description: `Share ${code} — you'll both earn NeoCoins on their first tracked order.`,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async (channel: "whatsapp" | "telegram" | "more") => {
    const text = `Join me on NeoCart! Use code ${code} on your first Amazon/Myntra purchase — we both get 50 free NeoCoins (₹50). Download: https://neocart.app`;
    if (channel === "more" && typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await (navigator as Navigator & { share: (d: ShareData) => Promise<void> }).share({
          title: "NeoCart Referral",
          text,
          url: "https://neocart.app",
        });
        return;
      } catch {
        // fall through to toast
      }
    }
    if (channel === "whatsapp") {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener");
    } else if (channel === "telegram") {
      window.open(
        `https://t.me/share/url?url=${encodeURIComponent("https://neocart.app")}&text=${encodeURIComponent(text)}`,
        "_blank",
        "noopener",
      );
    }
    toast("Generating your unique NeoCart download link...", {
      description: "We'll personalise the invite to track your bonus.",
    });
  };

  return (
    <section className="px-4 pt-5">
      <div className="relative overflow-hidden rounded-3xl border border-[oklch(0.55_0.25_290)]/30 bg-[image:linear-gradient(140deg,oklch(0.22_0.08_280),oklch(0.18_0.06_265))] p-5 text-white shadow-[var(--shadow-pop)]">
        <div className="pointer-events-none absolute -right-10 -top-12 h-44 w-44 rounded-full bg-[oklch(0.62_0.24_295)]/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-[oklch(0.55_0.25_260)]/25 blur-3xl" />

        <div className="relative">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-[oklch(0.85_0.18_295)] backdrop-blur">
              <Users className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-base font-extrabold leading-tight">
                Invite Friends, Double Your Bachat!
              </h3>
            </div>
            <span className="rounded-full bg-[oklch(0.85_0.20_150)]/20 px-2 py-1 text-[9px] font-extrabold uppercase tracking-wider text-[oklch(0.85_0.20_150)]">
              +50 NC
            </span>
          </div>

          <p className="mt-2.5 text-[12px] leading-relaxed text-white/75">
            Share your unique NeoCart referral code with friends. When they complete their
            first purchase from <b className="text-white">Amazon</b> or{" "}
            <b className="text-white">Myntra</b> through NeoCart, you both instantly receive{" "}
            <b className="text-[oklch(0.88_0.18_150)]">50 free NeoCoins (₹50)</b> directly into
            your available balance!
          </p>

          {/* Code + Copy */}
          <div className="mt-4 flex items-stretch gap-2">
            <div className="flex flex-1 items-center justify-between rounded-xl border-2 border-dashed border-white/25 bg-black/25 px-3.5 py-3">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/50">
                  Your Code
                </p>
                <p className="font-mono text-base font-extrabold tracking-[0.18em] text-white">
                  {code}
                </p>
              </div>
              <Sparkles className="h-4 w-4 text-[oklch(0.85_0.18_295)]" />
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-xl px-4 text-[12px] font-extrabold transition-all active:scale-95",
                copied
                  ? "bg-[oklch(0.65_0.18_150)] text-white"
                  : "bg-white text-[oklch(0.20_0.06_270)] hover:bg-white/90",
              )}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>

          {/* Share row */}
          <div className="mt-4 flex items-center justify-around gap-2">
            <ShareBtn label="WhatsApp" onClick={() => handleShare("whatsapp")} tint="oklch(0.70_0.18_150)">
              <WhatsAppIcon />
            </ShareBtn>
            <ShareBtn label="Telegram" onClick={() => handleShare("telegram")} tint="oklch(0.65_0.18_240)">
              <TelegramIcon />
            </ShareBtn>
            <ShareBtn label="More" onClick={() => handleShare("more")} tint="oklch(0.62_0.24_295)">
              <MoreHorizontal className="h-5 w-5" />
            </ShareBtn>
          </div>
        </div>
      </div>
    </section>
  );
}

function ShareBtn({
  children,
  label,
  onClick,
  tint,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  tint: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-1 flex-col items-center gap-1.5 active:scale-95"
    >
      <span
        className="grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-white/5 text-white shadow-inner transition-colors group-hover:bg-white/10"
        style={{ boxShadow: `0 8px 24px -10px ${tint}` }}
      >
        {children}
      </span>
      <span className="text-[10px] font-bold text-white/70">{label}</span>
    </button>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M19.05 4.93A10 10 0 0 0 2.1 16.55L1 22l5.6-1.46A10 10 0 1 0 19.05 4.93Zm-7.04 15.4a8.3 8.3 0 0 1-4.23-1.16l-.3-.18-3.32.87.88-3.24-.2-.32a8.32 8.32 0 1 1 7.17 4.03Zm4.58-6.23c-.25-.13-1.48-.73-1.7-.81-.23-.08-.4-.13-.56.13-.17.25-.65.81-.8.98-.14.17-.3.18-.55.06-.25-.13-1.05-.39-2-1.23a7.5 7.5 0 0 1-1.4-1.73c-.14-.25 0-.38.11-.5.11-.11.25-.3.37-.44.13-.14.17-.25.25-.42.08-.16.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.48-.4-.42-.56-.42h-.48a.92.92 0 0 0-.67.31c-.23.25-.88.86-.88 2.1 0 1.24.9 2.43 1.03 2.6.13.16 1.78 2.7 4.31 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.48-.6 1.69-1.19.2-.59.2-1.09.14-1.19-.06-.1-.22-.16-.47-.29Z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M9.78 15.27 9.6 19a.65.65 0 0 0 1.04.42l2.34-2.13 4.86 3.56c.9.5 1.54.24 1.76-.83l3.2-15.04c.3-1.34-.49-1.86-1.36-1.54L1.74 9.74c-1.31.5-1.29 1.23-.22 1.56l5.06 1.58 11.74-7.4c.55-.32 1.05-.14.64.21L9.78 15.27Z" />
    </svg>
  );
}
