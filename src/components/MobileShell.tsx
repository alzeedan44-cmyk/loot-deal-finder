import { Link } from "@tanstack/react-router";
import { useRouter } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Search, Home, LayoutGrid, Wallet, Bell, MapPin } from "lucide-react";

const navItems = [
  { id: "home", label: "Home", icon: Home, to: "/" },
  { id: "search", label: "Search", icon: Search },
  { id: "categories", label: "Categories", icon: LayoutGrid },
  { id: "wallet", label: "My Wallet", icon: Wallet, to: "/wallet" },
];

function getActiveId(pathname: string) {
  if (pathname.startsWith("/wallet")) return "wallet";
  if (pathname.startsWith("/search")) return "search";
  if (pathname.startsWith("/categories")) return "categories";
  return "home";
}

export function MobileShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const activeId = getActiveId(router.state.location.pathname);

  return (
    <div className="mx-auto flex min-h-screen max-w-[480px] flex-col bg-background">
      {/* Sticky Top */}
      <header className="sticky top-0 z-30 bg-[image:var(--gradient-primary)] pb-3 pt-[max(env(safe-area-inset-top),12px)] text-primary-foreground">
        <div className="flex items-center justify-between px-4 pb-3">
          <div className="flex min-w-0 items-center gap-1.5 text-xs/none opacity-90">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">Deliver to <b className="font-semibold">Mumbai 400001</b></span>
          </div>
          <button
            type="button"
            aria-label="Notifications"
            className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/15"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[oklch(0.78_0.18_75)]" />
          </button>
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
                {it.to ? (
                  <Link to={it.to} className={className}>
                    {content}
                  </Link>
                ) : (
                  <button type="button" className={className}>
                    {content}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
