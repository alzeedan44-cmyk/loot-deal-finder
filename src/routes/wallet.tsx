import { createFileRoute } from "@tanstack/react-router";
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
  Receipt,
} from "lucide-react";

import { MobileShell } from "@/components/MobileShell";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/wallet")({
  head: () => ({
    meta: [
      { title: "My Wallet — LootKart Rewards" },
      {
        name: "description",
        content: "View your NeoCoins balance, redeem rewards, and track transactions.",
      },
    ],
  }),
  component: WalletPage,
});

const quickActions = [
  { id: "withdraw", label: "Withdraw to UPI", icon: ArrowUpRight, gradient: "bg-[image:var(--gradient-primary)]" },
  { id: "redeem", label: "Redeem Gift Cards", icon: Gift, gradient: "bg-[image:var(--gradient-loot)]" },
  { id: "history", label: "Transaction History", icon: History, gradient: "bg-secondary text-secondary-foreground" },
];

const recentActivity = [
  { id: "a1", title: "Cashback from iPhone 15 deal", coins: 0, rupees: 0, date: "Today", status: "pending" },
  { id: "a2", title: "Welcome bonus credited", coins: 0, rupees: 0, date: "Yesterday", status: "completed" },
];

function WalletPage() {
  return (
    <MobileShell>
      {/* Balance card */}
      <section className="px-4 pt-4">
        <div className="relative overflow-hidden rounded-3xl bg-[image:var(--gradient-wallet)] p-5 text-primary-foreground shadow-[var(--shadow-pop)]">
          <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-indigo-400/20 blur-3xl" />

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
              <p className="mt-1 text-4xl font-extrabold tracking-tight">0.00 NeoCoins</p>
            </div>

            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-sm font-semibold backdrop-blur">
              <Coins className="h-3.5 w-3.5" />
              <span>Estimated Cash Value:</span>
              <span className="tabular-nums">₹0.00</span>
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
            return (
              <button
                key={action.id}
                type="button"
                className="flex w-32 shrink-0 snap-start flex-col items-center gap-2.5 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)] transition-transform active:scale-95"
              >
                <span
                  className={cn(
                    "grid h-12 w-12 place-items-center rounded-xl text-primary-foreground",
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
                Shop via LootKart and earn upto 12% cashback as NeoCoins.
              </p>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          </div>
        </div>
      </section>

      {/* Recent activity */}
      <section className="px-4 pt-5">
        <header className="mb-3 flex items-end justify-between">
          <h2 className="text-base font-extrabold">Recent Activity</h2>
          <button className="text-xs font-semibold text-primary">View all</button>
        </header>

        <div className="flex flex-col gap-2.5">
          {recentActivity.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-card)]"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-muted text-muted-foreground">
                <Receipt className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">{item.title}</p>
                <p className="text-[11px] text-muted-foreground">{item.date}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-extrabold text-foreground">+0.00</p>
                <p className="text-[11px] text-muted-foreground">₹0.00</p>
              </div>
            </div>
          ))}

          <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border bg-muted/40 p-5 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" />
            </span>
            <p className="text-sm font-semibold text-foreground">Start earning today</p>
            <p className="text-[11px] text-muted-foreground">
              Your NeoCoins will appear here once you shop through LootKart.
            </p>
          </div>
        </div>
      </section>
    </MobileShell>
  );
}
