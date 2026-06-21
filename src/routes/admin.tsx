import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  Activity,
  Users,
  IndianRupee,
  Server,
  Cpu,
  Database,
  ShieldAlert,
  TrendingUp,
  Terminal,
  Megaphone,
  Send,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Control Panel — NeoCart" },
      { name: "description", content: "Internal NeoCart operations dashboard." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPanel,
});

const metrics = [
  {
    label: "Total Platform Users",
    value: "1,28,492",
    delta: "+4.2% WoW",
    icon: Users,
    accent: "oklch(0.65_0.18_240)",
  },
  {
    label: "Active App Traffic Today",
    value: "37,221",
    delta: "Live sessions",
    icon: Activity,
    accent: "oklch(0.70_0.18_150)",
  },
  {
    label: "Gross Network Revenue Accumulated",
    value: "₹2,84,17,950",
    delta: "+₹3.2L (24h)",
    icon: IndianRupee,
    accent: "oklch(0.78_0.16_85)",
  },
];

const systemRows = [
  { label: "API Gateway", status: "Operational", color: "oklch(0.70_0.18_150)" },
  { label: "Affiliate Sync (Amazon)", status: "Operational", color: "oklch(0.70_0.18_150)" },
  { label: "Affiliate Sync (Flipkart)", status: "Degraded", color: "oklch(0.78_0.16_85)" },
  { label: "UPI Payout Worker", status: "Operational", color: "oklch(0.70_0.18_150)" },
  { label: "Price Engine (v3.1)", status: "Operational", color: "oklch(0.70_0.18_150)" },
];

function AdminPanel() {
  return (
    <div className="mx-auto flex min-h-screen max-w-[480px] flex-col bg-[oklch(0.22_0.01_250)] font-mono text-[oklch(0.92_0.005_250)]">
      {/* Top engineering bar */}
      <header className="sticky top-0 z-30 border-b border-[oklch(0.32_0.01_250)] bg-[oklch(0.18_0.01_250)]/95 px-4 pb-3 pt-[max(env(safe-area-inset-top),12px)] backdrop-blur">
        <div className="flex items-center justify-between">
          <Link
            to="/account"
            aria-label="Back"
            className="grid h-9 w-9 place-items-center rounded-md border border-[oklch(0.32_0.01_250)] bg-[oklch(0.25_0.01_250)] active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="text-center">
            <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[oklch(0.65_0.01_250)]">
              NeoCart // Internal
            </p>
            <p className="text-[13px] font-extrabold uppercase tracking-wider text-white">
              Admin Control Panel
            </p>
          </div>
          <span className="flex items-center gap-1 rounded-md border border-[oklch(0.70_0.18_150)]/40 bg-[oklch(0.70_0.18_150)]/10 px-2 py-1 text-[9px] font-extrabold uppercase tracking-wider text-[oklch(0.80_0.18_150)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.78_0.20_150)] shadow-[0_0_8px_oklch(0.78_0.20_150)]" />
            Live
          </span>
        </div>
      </header>

      <main className="flex-1 px-4 pb-12 pt-4">
        {/* Operator banner */}
        <div className="flex items-center justify-between rounded-md border border-[oklch(0.32_0.01_250)] bg-[oklch(0.25_0.01_250)] px-3 py-2 text-[10px] uppercase tracking-wider">
          <span className="flex items-center gap-2 text-[oklch(0.78_0.01_250)]">
            <Terminal className="h-3.5 w-3.5" />
            session: ops-admin@neocart
          </span>
          <span className="text-[oklch(0.65_0.01_250)]">build 24.06.21</span>
        </div>

        <h2 className="mt-5 text-[10px] font-extrabold uppercase tracking-[0.25em] text-[oklch(0.65_0.01_250)]">
          // Network Metrics
        </h2>

        <div className="mt-2 space-y-2.5">
          {metrics.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.label}
                className="relative overflow-hidden rounded-md border border-[oklch(0.32_0.01_250)] bg-[oklch(0.25_0.01_250)] p-4"
              >
                <span
                  className="absolute left-0 top-0 h-full w-[3px]"
                  style={{ background: m.accent }}
                />
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[oklch(0.70_0.01_250)]">
                      {m.label}
                    </p>
                    <p className="mt-1 font-display text-2xl font-extrabold tracking-tight text-white tabular-nums">
                      {m.value}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider" style={{ color: m.accent }}>
                      <TrendingUp className="h-3 w-3" />
                      {m.delta}
                    </p>
                  </div>
                  <span
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-[oklch(0.32_0.01_250)]"
                    style={{ color: m.accent }}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <h2 className="mt-6 text-[10px] font-extrabold uppercase tracking-[0.25em] text-[oklch(0.65_0.01_250)]">
          // System Health
        </h2>
        <div className="mt-2 overflow-hidden rounded-md border border-[oklch(0.32_0.01_250)] bg-[oklch(0.25_0.01_250)]">
          {systemRows.map((r, i) => (
            <div
              key={r.label}
              className={`flex items-center justify-between px-3.5 py-3 ${
                i !== systemRows.length - 1 ? "border-b border-[oklch(0.32_0.01_250)]" : ""
              }`}
            >
              <span className="flex items-center gap-2 text-[12px] font-semibold text-white">
                <Server className="h-3.5 w-3.5 text-[oklch(0.70_0.01_250)]" />
                {r.label}
              </span>
              <span
                className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider"
                style={{ color: r.color }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: r.color }}
                />
                {r.status}
              </span>
            </div>
          ))}
        </div>

        <h2 className="mt-6 text-[10px] font-extrabold uppercase tracking-[0.25em] text-[oklch(0.65_0.01_250)]">
          // Infrastructure
        </h2>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {[
            { icon: Cpu, label: "CPU", val: "42%" },
            { icon: Database, label: "DB", val: "1.8 TB" },
            { icon: ShieldAlert, label: "Threats", val: "0" },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="rounded-md border border-[oklch(0.32_0.01_250)] bg-[oklch(0.25_0.01_250)] p-3"
              >
                <Icon className="h-3.5 w-3.5 text-[oklch(0.70_0.01_250)]" />
                <p className="mt-1.5 text-[9px] font-bold uppercase tracking-wider text-[oklch(0.65_0.01_250)]">
                  {s.label}
                </p>
                <p className="font-display text-base font-extrabold text-white tabular-nums">
                  {s.val}
                </p>
              </div>
            );
          })}
        </div>

        <BroadcastForm />


        <p className="mt-8 text-center text-[9px] uppercase tracking-[0.25em] text-[oklch(0.50_0.01_250)]">
          Restricted — Authorized Personnel Only
        </p>
      </main>
    </div>
  );
}

function BroadcastForm() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [sending, setSending] = useState(false);
  const valid = name.trim().length > 1 && Number(price) > 0;

  const send = () => {
    if (!valid || sending) return;
    setSending(true);
    setTimeout(() => {
      toast.success(
        "System Alert pushed live to all verified user notifications feeds successfully!",
        {
          description: `${name.trim()} · New price ₹${Number(price).toLocaleString("en-IN")}`,
        },
      );
      setSending(false);
      setName("");
      setPrice("");
    }, 700);
  };

  return (
    <>
      <h2 className="mt-6 text-[10px] font-extrabold uppercase tracking-[0.25em] text-[oklch(0.65_0.01_250)]">
        // Broadcast Price Drop Alert Notifications
      </h2>
      <div className="mt-2 rounded-md border border-[oklch(0.32_0.01_250)] bg-[oklch(0.25_0.01_250)] p-4">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-md border border-[oklch(0.32_0.01_250)] bg-[oklch(0.18_0.01_250)] text-[oklch(0.75_0.18_85)]">
            <Megaphone className="h-3.5 w-3.5" />
          </span>
          <div>
            <p className="text-[12px] font-extrabold text-white">Push Live Alert</p>
            <p className="text-[10px] text-[oklch(0.65_0.01_250)]">
              Delivered to all verified subscriber feeds
            </p>
          </div>
        </div>

        <div className="mt-3 space-y-2.5">
          <label className="block">
            <span className="text-[9px] font-bold uppercase tracking-wider text-[oklch(0.65_0.01_250)]">
              Product Name
            </span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. OnePlus Nord CE4 5G"
              className="mt-1 h-10 w-full rounded-md border border-[oklch(0.32_0.01_250)] bg-[oklch(0.18_0.01_250)] px-3 text-[12px] font-semibold text-white outline-none placeholder:text-[oklch(0.50_0.01_250)] focus:border-[oklch(0.65_0.18_240)]"
            />
          </label>
          <label className="block">
            <span className="text-[9px] font-bold uppercase tracking-wider text-[oklch(0.65_0.01_250)]">
              Discount Dropped Price (₹)
            </span>
            <div className="mt-1 flex h-10 items-center rounded-md border border-[oklch(0.32_0.01_250)] bg-[oklch(0.18_0.01_250)] focus-within:border-[oklch(0.65_0.18_240)]">
              <span className="grid h-full w-9 place-items-center text-[oklch(0.65_0.01_250)]">
                <IndianRupee className="h-3.5 w-3.5" />
              </span>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="14999"
                className="h-full flex-1 bg-transparent pr-3 text-[12px] font-semibold tabular-nums text-white outline-none placeholder:text-[oklch(0.50_0.01_250)]"
              />
            </div>
          </label>
        </div>

        <button
          type="button"
          onClick={send}
          disabled={!valid || sending}
          className={`mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-md text-[12px] font-extrabold uppercase tracking-wider transition-colors active:scale-[0.99] ${
            valid && !sending
              ? "bg-[oklch(0.65_0.18_240)] text-white shadow-[0_8px_20px_-8px_oklch(0.65_0.18_240/60%)] hover:bg-[oklch(0.70_0.18_240)]"
              : "cursor-not-allowed bg-[oklch(0.30_0.01_250)] text-[oklch(0.55_0.01_250)]"
          }`}
        >
          <Send className="h-3.5 w-3.5" />
          {sending ? "Pushing to feeds…" : "Send Push Notification"}
        </button>
        <p className="mt-2 text-center text-[9px] uppercase tracking-wider text-[oklch(0.55_0.01_250)]">
          Broadcast reaches ~1,28,492 verified users
        </p>
      </div>
    </>
  );
}
