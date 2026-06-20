import { Link } from "@tanstack/react-router";
import { useRouter } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Search, Home, LayoutGrid, Wallet, Bell, MapPin, UserCircle2, X, Flame, TrendingDown, Tag } from "lucide-react";

const navItems = [
  { id: "home", label: "Home", icon: Home, to: "/" as const },
  { id: "search", label: "Search", icon: Search, to: "/search" as const },
  { id: "categories", label: "Categories", icon: LayoutGrid, to: "/categories" as const },
  { id: "wallet", label: "My Wallet", icon: Wallet, to: "/wallet" as const },
];

function getActiveId(pathname: string) {
  if (pathname.startsWith("/wallet")) return "wallet";
  if (pathname.startsWith("/search")) return "search";
  if (pathname.startsWith("/categories")) return "categories";
  return "home";
}

const dealAlerts = [
  {
    id: "a1",
    emoji: "🔥",
    title: "Price Drop Alert",
    body: "OnePlus Nord CE4 just dropped by ₹1,500 on Flipkart! Click to buy now.",
    store: "flipkart",
    time: "2m ago",
    icon: TrendingDown,
    tone: "text-[oklch(0.78_0.20_15)]",
  },
  {
    id: "a2",
    emoji: "⚡",
    title: "Lightning Loot",
    body: "Boat Airdopes 141 hit an all-time low of ₹999 on Amazon.in.",
    store: "amazon",
    time: "12m ago",
    icon: Flame,
    tone: "text-[oklch(0.78_0.18_75)]",
  },
  {
    id: "a3",
    emoji: "👟",
    title: "Coupon Stack Live",
    body: "Extra 20% off on Nike Revolution 7 via Myntra app — code NEO20.",
    store: "myntra",
    time: "38m ago",
    icon: Tag,
    tone: "text-[oklch(0.78_0.18_330)]",
  },
];

export function MobileShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const activeId = getActiveId(router.state.location.pathname);
  const [feedOpen, setFeedOpen] = useState(false);
  const trayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!feedOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!trayRef.current?.contains(e.target as Node)) setFeedOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setFeedOpen(false);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [feedOpen]);

  return (
    <div className="mx-auto flex min-h-screen max-w-[480px] flex-col bg-background">
      {/* Sticky Top */}
      <header className="sticky top-0 z-30 bg-[image:var(--gradient-primary)] pb-3 pt-[max(env(safe-area-inset-top),12px)] text-primary-foreground">
        <div className="flex items-center justify-between gap-2 px-4 pb-2">
          <Link to="/" className="flex min-w-0 items-center gap-2">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/15 font-display text-base font-extrabold tracking-tighter">
              N
            </span>
            <span className="flex min-w-0 items-center gap-1.5">
              <span className="font-display text-[19px] font-extrabold leading-none tracking-tight">
                NeoCart
              </span>
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inset-0 animate-ping rounded-full bg-[oklch(0.85_0.25_145)] opacity-75" />
                <span className="relative h-2 w-2 rounded-full bg-[oklch(0.78_0.25_145)] shadow-[0_0_8px_oklch(0.78_0.25_145)]" />
              </span>
              <span className="hidden truncate text-[9px] font-bold uppercase tracking-wider opacity-80 xs:inline sm:inline">
                Live
              </span>
            </span>
          </Link>
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              aria-label="Deal alerts"
              aria-expanded={feedOpen}
              onClick={(e) => {
                e.stopPropagation();
                setFeedOpen((o) => !o);
              }}
              className="relative grid h-9 w-9 place-items-center rounded-full bg-white/15 transition-colors active:scale-95"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[oklch(0.78_0.18_75)] shadow-[0_0_6px_oklch(0.78_0.18_75)]" />
            </button>
            <Link
              to="/account"
              aria-label="Account & Security"
              className="grid h-9 w-9 place-items-center rounded-full bg-white/15 transition-colors active:scale-95"
            >
              <UserCircle2 className="h-5 w-5" />
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-4 pb-2 text-[11px] opacity-90">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate">
            Deliver to <b className="font-semibold">Mumbai 400001</b>
          </span>
        </div>

        <div className="px-4">
          <label className="flex h-11 items-center gap-2 rounded-xl bg-white px-3 shadow-[var(--shadow-card)]">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search iPhone 15, Nike shoes, kurta…"
              className="h-full w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">
              AI
            </span>
          </label>
        </div>

        {/* Notification tray */}
        {feedOpen && (
          <div
            ref={trayRef}
            role="dialog"
            aria-label="Deal alerts"
            className="absolute right-3 top-[calc(100%-2px)] z-40 w-[92vw] max-w-[360px] overflow-hidden rounded-2xl border border-white/10 bg-[oklch(0.18_0.04_270)] text-[oklch(0.98_0.005_270)] shadow-[0_24px_60px_-16px_oklch(0_0_0/55%)]"
            style={{ animation: "neoTrayIn 220ms cubic-bezier(0.22,1,0.36,1)" }}
          >
            <div className="flex items-center justify-between border-b border-white/8 bg-[oklch(0.22_0.05_270)] px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-[image:linear-gradient(135deg,oklch(0.55_0.25_290),oklch(0.62_0.24_260))]">
                  <Bell className="h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="text-[12px] font-extrabold leading-tight">Deal Alerts</p>
                  <p className="text-[10px] uppercase tracking-wider text-[oklch(0.72_0.02_270)]">
                    Indian market · live
                  </p>
                </div>
              </div>
              <button
                onClick={() => setFeedOpen(false)}
                aria-label="Close alerts"
                className="grid h-7 w-7 place-items-center rounded-full bg-white/10 text-white/80 hover:bg-white/15"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <ul className="max-h-[60vh] divide-y divide-white/5 overflow-y-auto">
              {dealAlerts.map((d) => {
                const Icon = d.icon;
                return (
                  <li key={d.id}>
                    <button
                      type="button"
                      onClick={() => setFeedOpen(false)}
                      className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-white/5 active:bg-white/10"
                    >
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/8 text-lg">
                        {d.emoji}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className={`flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider ${d.tone}`}>
                          <Icon className="h-3 w-3" />
                          {d.title}
                        </p>
                        <p className="mt-0.5 text-[12px] leading-snug text-white">
                          {d.body}
                        </p>
                        <p className="mt-1 text-[10px] uppercase tracking-wider text-[oklch(0.62_0.02_270)]">
                          {d.time} · {d.store}
                        </p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="border-t border-white/8 bg-[oklch(0.22_0.05_270)] px-4 py-2.5 text-center">
              <button
                onClick={() => setFeedOpen(false)}
                className="text-[11px] font-bold uppercase tracking-wider text-[oklch(0.85_0.18_295)]"
              >
                View all alerts →
              </button>
            </div>
            <style>{`
              @keyframes neoTrayIn {
                from { opacity: 0; transform: translateY(-8px) scale(0.98); }
                to { opacity: 1; transform: translateY(0) scale(1); }
              }
            `}</style>
          </div>
        )}
      </header>

      <main className="flex-1 pb-28">{children}</main>

      {/* Bottom Nav */}
      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-[480px] border-t border-border bg-card/95 px-2 pb-[max(env(safe-area-inset-bottom),8px)] pt-2 backdrop-blur"
      >
        <ul className="grid grid-cols-4">
          {navItems.map((it) => {
            const Icon = it.icon;
            const isActive = it.id === activeId;
            const className = `flex w-full flex-col items-center gap-1 rounded-xl py-1.5 text-[11px] font-medium transition-colors ${
              isActive ? "text-primary" : "text-muted-foreground"
            }`;
            const content = (
              <>
                <span
                  className={`grid h-9 w-9 place-items-center rounded-xl ${
                    isActive ? "bg-primary/10" : ""
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={isActive ? 2.4 : 2} />
                </span>
                {it.label}
              </>
            );

            return (
              <li key={it.id}>
                <Link to={it.to} className={className}>
                  {content}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
