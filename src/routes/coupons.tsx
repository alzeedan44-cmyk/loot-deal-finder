import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Copy, Check, ExternalLink, Ticket, ShieldCheck, Search } from "lucide-react";
import { toast } from "sonner";

import { MobileShell } from "@/components/MobileShell";
import { StoreLogo, type Store } from "@/components/StoreLogo";
import { supabase } from "@/integrations/supabase/client";
import { trackAndBuild } from "@/lib/affiliate";

type Coupon = {
  id: string;
  merchant_slug: string;
  code: string;
  title: string;
  description: string | null;
  discount_text: string | null;
  category: string | null;
  verified: boolean;
  expires_at: string | null;
};

const MERCHANT_HOMEPAGES: Record<string, string> = {
  amazon: "https://www.amazon.in/",
  flipkart: "https://www.flipkart.com/",
  myntra: "https://www.myntra.com/",
  ajio: "https://www.ajio.com/",
  nykaa: "https://www.nykaa.com/",
  tatacliq: "https://www.tatacliq.com/",
};

async function fetchCoupons(): Promise<Coupon[]> {
  const { data, error } = await supabase
    .from("coupons")
    .select("id,merchant_slug,code,title,description,discount_text,category,verified,expires_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Coupon[];
}

function daysLeft(iso: string | null): string | null {
  if (!iso) return null;
  const ms = new Date(iso).getTime() - Date.now();
  if (ms <= 0) return "Expired";
  const days = Math.ceil(ms / (1000 * 60 * 60 * 24));
  return days === 1 ? "Ends today" : `${days} days left`;
}

export const Route = createFileRoute("/coupons")({
  component: CouponsPage,
});

function CouponsPage() {
  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ["coupons"],
    queryFn: fetchCoupons,
  });
  const [activeMerchant, setActiveMerchant] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const merchants = useMemo(() => {
    const set = new Set<string>();
    coupons.forEach((c) => set.add(c.merchant_slug));
    return ["all", ...Array.from(set)];
  }, [coupons]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return coupons.filter((c) => {
      if (activeMerchant !== "all" && c.merchant_slug !== activeMerchant) return false;
      if (!q) return true;
      return (
        c.title.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        (c.description ?? "").toLowerCase().includes(q)
      );
    });
  }, [coupons, activeMerchant, query]);

  const handleCopyAndOpen = async (c: Coupon) => {
    try {
      await navigator.clipboard.writeText(c.code);
      setCopiedId(c.id);
      setTimeout(() => setCopiedId((v) => (v === c.id ? null : v)), 1800);
    } catch {
      // Clipboard may be blocked — carry on with the store handoff
    }
    toast.success(`Code ${c.code} copied · opening ${c.merchant_slug}`);
    const rawUrl = MERCHANT_HOMEPAGES[c.merchant_slug] ?? "https://www.google.com/";
    const tab = window.open("about:blank", "_blank", "noopener");
    try {
      const { affiliateUrl } = await trackAndBuild({
        productId: null,
        merchantSlug: c.merchant_slug,
        rawUrl,
      });
      if (tab) tab.location.href = affiliateUrl;
      else window.location.href = affiliateUrl;
    } catch {
      if (tab) tab.location.href = rawUrl;
    }
  };

  return (
    <MobileShell>
      <div className="bg-[oklch(0.18_0.04_270)] pb-8 pt-4 text-[oklch(0.98_0.005_270)]">
        <div className="px-4">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[image:linear-gradient(135deg,oklch(0.55_0.25_290),oklch(0.62_0.24_260))]">
              <Ticket className="h-4 w-4" />
            </span>
            <div>
              <h1 className="font-display text-[20px] font-extrabold leading-none tracking-tight">
                Loot Coupons
              </h1>
              <p className="text-[11px] uppercase tracking-wider text-[oklch(0.72_0.02_270)]">
                Fresh codes · verified daily
              </p>
            </div>
          </div>

          <label className="mt-4 flex h-11 items-center gap-2 rounded-xl bg-white/10 px-3">
            <Search className="h-4 w-4 text-white/60" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search brand, code, category…"
              className="h-full w-full bg-transparent text-[13px] font-medium text-white outline-none placeholder:text-white/40"
            />
          </label>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto px-4 pb-1">
          {merchants.map((m) => {
            const active = m === activeMerchant;
            return (
              <button
                key={m}
                onClick={() => setActiveMerchant(m)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors ${
                  active
                    ? "bg-white text-[oklch(0.20_0.06_270)]"
                    : "border border-white/10 bg-white/5 text-white/80"
                }`}
              >
                {m === "all" ? "All Stores" : m}
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-background px-4 pb-24 pt-4">
        {isLoading ? (
          <div className="grid gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-16 text-center">
            <p className="text-sm text-muted-foreground">
              No coupons match your filters. Check back tomorrow — new codes drop daily.
            </p>
          </div>
        ) : (
          <ul className="grid gap-3">
            {filtered.map((c) => {
              const copied = copiedId === c.id;
              const expiry = daysLeft(c.expires_at);
              return (
                <li
                  key={c.id}
                  className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]"
                >
                  <div className="flex items-start gap-3 p-4">
                    <StoreLogo store={c.merchant_slug as Store} size="md" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate text-[13px] font-extrabold text-foreground">
                          {c.title}
                        </p>
                        {c.verified && (
                          <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-[oklch(0.94_0.08_150)] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[oklch(0.35_0.15_150)]">
                            <ShieldCheck className="h-2.5 w-2.5" />
                            Verified
                          </span>
                        )}
                      </div>
                      {c.description && (
                        <p className="mt-0.5 line-clamp-2 text-[11px] text-muted-foreground">
                          {c.description}
                        </p>
                      )}
                      <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider">
                        {c.discount_text && (
                          <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-primary">
                            {c.discount_text}
                          </span>
                        )}
                        {c.category && (
                          <span className="rounded-md bg-muted px-1.5 py-0.5 text-muted-foreground">
                            {c.category}
                          </span>
                        )}
                        {expiry && (
                          <span
                            className={`rounded-md px-1.5 py-0.5 ${
                              expiry === "Expired"
                                ? "bg-red-100 text-red-600"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {expiry}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopyAndOpen(c)}
                    className="flex w-full items-center justify-between gap-3 border-t border-dashed border-border bg-muted/40 px-4 py-3 text-left transition-colors active:bg-muted"
                  >
                    <div className="flex items-center gap-2">
                      {copied ? (
                        <Check className="h-4 w-4 text-[oklch(0.55_0.18_150)]" />
                      ) : (
                        <Copy className="h-4 w-4 text-primary" />
                      )}
                      <span className="font-mono text-[13px] font-extrabold tracking-wide text-foreground">
                        {c.code}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-lg bg-primary px-2.5 py-1 text-[11px] font-bold text-primary-foreground">
                      {copied ? "Copied" : "Copy & Open"}
                      <ExternalLink className="h-3 w-3" />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </MobileShell>
  );
}
