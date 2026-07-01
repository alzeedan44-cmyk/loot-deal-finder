import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Mail, User, ShieldCheck, Lock, Sparkles, Fingerprint, Wallet, BadgeCheck, ChevronRight, Settings, LogOut } from "lucide-react";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Account & Security — NeoCart" },
      { name: "description", content: "Sign in or register with NeoCart to track NeoCoins and personalised deals." },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<{ email?: string; name?: string; avatar?: string } | null>(null);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      const u = data.session?.user;
      if (u) {
        setSession({
          email: u.email ?? undefined,
          name: (u.user_metadata?.full_name as string) ?? (u.user_metadata?.name as string) ?? undefined,
          avatar: (u.user_metadata?.avatar_url as string) ?? undefined,
        });
      }
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      const u = s?.user;
      setSession(u ? {
        email: u.email ?? undefined,
        name: (u.user_metadata?.full_name as string) ?? (u.user_metadata?.name as string) ?? undefined,
        avatar: (u.user_metadata?.avatar_url as string) ?? undefined,
      } : null);
    });
    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, []);

  async function handleGoogle() {
    setLoading(true);
    try {
      const res = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: typeof window !== "undefined" ? window.location.origin + "/account" : undefined,
      });
      if ((res as any)?.error) {
        toast.error("Sign-in failed", { description: String((res as any).error?.message ?? (res as any).error) });
      } else if (!(res as any)?.redirected) {
        toast.success("Signed in as " + (session?.email ?? "your Google account"));
        router.navigate({ to: "/wallet" });
      }
    } catch (e: any) {
      toast.error("Sign-in error", { description: e?.message ?? String(e) });
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    toast.success("Signed out");
    setSession(null);
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-[480px] flex-col bg-[oklch(0.18_0.04_270)] text-[oklch(0.98_0.005_270)]">
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between bg-[oklch(0.18_0.04_270)]/95 px-3 pb-3 pt-[max(env(safe-area-inset-top),12px)] backdrop-blur">
        <Link
          to="/"
          aria-label="Back"
          className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white active:scale-95"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="flex items-center gap-1.5 text-[12px] font-extrabold uppercase tracking-wider">
          <ShieldCheck className="h-3.5 w-3.5 text-[oklch(0.82_0.18_295)]" />
          Account & Security
        </p>
        <Link
          to="/admin"
          aria-label="Admin Control Panel"
          className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white/70 active:scale-95 hover:text-white"
        >
          <Settings className="h-5 w-5" />
        </Link>
      </header>

      <main className="relative flex-1 px-5 pb-12 pt-2">
        {/* Glow accents */}
        <div className="pointer-events-none absolute -right-16 top-10 h-56 w-56 rounded-full bg-[oklch(0.55_0.25_290)]/25 blur-3xl" />
        <div className="pointer-events-none absolute -left-10 top-60 h-48 w-48 rounded-full bg-[oklch(0.62_0.24_260)]/20 blur-3xl" />

        <section className="relative">
          {/* Brand stamp */}
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[image:linear-gradient(135deg,oklch(0.55_0.25_290),oklch(0.62_0.24_260))] font-display text-lg font-extrabold text-white shadow-[0_10px_24px_-8px_oklch(0.55_0.25_290/65%)]">
              N
            </span>
            <div>
              <h1 className="font-display text-2xl font-extrabold leading-tight tracking-tight">
                Welcome to NeoCart
              </h1>
              <p className="text-[12px] text-[oklch(0.78_0.02_270)]">
                Sign in to sync NeoCoins across devices
              </p>
            </div>
          </div>

          {/* Card */}
          {/* Member Status Dashboard Card (simulated signed-in) */}
          <div className="mt-5 relative overflow-hidden rounded-3xl border border-white/10 bg-[image:linear-gradient(135deg,oklch(0.30_0.10_285),oklch(0.24_0.08_265))] p-5 shadow-[0_20px_60px_-20px_oklch(0.55_0.25_290/60%)]">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[oklch(0.62_0.24_295)]/30 blur-3xl" />
            <div className="relative">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white backdrop-blur">
                  <BadgeCheck className="h-3 w-3 text-[oklch(0.85_0.20_150)]" />
                  Member Status
                </span>
                <span className="rounded-full bg-[oklch(0.85_0.20_150)]/20 px-2 py-1 text-[9px] font-extrabold uppercase tracking-wider text-[oklch(0.85_0.20_150)]">
                  ● Active
                </span>
              </div>

              <div className="mt-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                  Account Holder Status
                </p>
                <p className="mt-0.5 font-display text-lg font-extrabold text-white">
                  Verified Standard Member
                </p>
              </div>

              <div className="mt-3 flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-white/50">
                    Security ID
                  </p>
                  <p className="font-mono text-[13px] font-extrabold tracking-wide text-white">
                    NC-99824-IND
                  </p>
                </div>
                <ShieldCheck className="h-5 w-5 text-[oklch(0.82_0.18_295)]" />
              </div>

              <Link
                to="/wallet"
                className="mt-4 flex h-11 w-full items-center justify-between rounded-xl bg-white/10 px-4 text-[13px] font-extrabold text-white backdrop-blur transition-colors hover:bg-white/15 active:scale-[0.98]"
              >
                <span className="flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  Open My Wallet Ledger
                </span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Card */}
          <div className="mt-6 rounded-3xl border border-white/10 bg-[oklch(0.22_0.05_270)] p-5 shadow-[0_20px_60px_-20px_oklch(0_0_0/60%)]">
            <div className="flex items-center justify-between">
              <p className="text-[12px] font-extrabold uppercase tracking-wider text-white">
                Create your account
              </p>
              <span className="flex items-center gap-1 rounded-full bg-[oklch(0.62_0.24_295)]/20 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-[oklch(0.85_0.18_295)]">
                <Sparkles className="h-2.5 w-2.5" />
                New
              </span>
            </div>

            <form
              className="mt-4 space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <NeoField
                icon={User}
                label="Full Name"
                placeholder="e.g. Rohan Sharma"
                value={name}
                onChange={setName}
              />
              <NeoField
                icon={Mail}
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={setEmail}
              />

              <button
                type="button"
                onClick={handleGoogle}
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white text-[13px] font-extrabold text-[oklch(0.20_0.04_270)] shadow-[0_8px_20px_-6px_rgba(255,255,255,0.25)] transition-transform active:scale-[0.98] disabled:opacity-60"
              >
                <GoogleIcon className="h-4 w-4" />
                {session ? `Signed in as ${session.name ?? session.email}` : loading ? "Opening Google…" : "Sign In with Google Account"}
              </button>

              {session && (
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 text-[12px] font-bold text-white/80 active:scale-[0.98]"
                >
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              )}

              <div className="flex items-center gap-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[oklch(0.62_0.02_270)]">
                <span className="h-px flex-1 bg-white/10" />
                or
                <span className="h-px flex-1 bg-white/10" />
              </div>

              <button
                type="submit"
                className="h-12 w-full rounded-2xl bg-[image:linear-gradient(135deg,oklch(0.55_0.25_290),oklch(0.62_0.24_260))] text-[13px] font-extrabold text-white shadow-[0_10px_24px_-8px_oklch(0.55_0.25_290/60%)] transition-transform active:scale-[0.98]"
              >
                Continue with Email →
              </button>
            </form>

            <div className="mt-5 flex items-start gap-2 rounded-xl border border-white/8 bg-white/5 p-3 text-[11px] leading-snug text-[oklch(0.82_0.02_270)]">
              <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[oklch(0.82_0.18_295)]" />
              <p>
                <span className="font-bold text-white">End-to-end encrypted.</span>{" "}
                NeoCart never stores your payment credentials or shopping passwords.
              </p>
            </div>
          </div>

          {/* Biometric quick-in */}
          <button
            type="button"
            className="mt-4 flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-left active:scale-[0.99]"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[oklch(0.62_0.24_295)]/20 text-[oklch(0.85_0.18_295)]">
              <Fingerprint className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-extrabold text-white">Biometric Quick Sign-In</p>
              <p className="text-[11px] text-[oklch(0.78_0.02_270)]">
                Use Face ID / Touch ID after first login
              </p>
            </div>
          </button>

          <p className="mt-6 text-center text-[10px] text-[oklch(0.62_0.02_270)]">
            By continuing you agree to NeoCart's <span className="underline">Terms</span> &{" "}
            <span className="underline">Privacy Policy</span>
          </p>
        </section>
      </main>
    </div>
  );
}

function NeoField({
  icon: Icon,
  label,
  placeholder,
  type = "text",
  value,
  onChange,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-[10px] font-bold uppercase tracking-wider text-[oklch(0.72_0.02_270)]">
        {label}
      </span>
      <div className="mt-1.5 flex h-12 items-center gap-2 rounded-xl border border-white/10 bg-[oklch(0.26_0.04_270)] px-3 transition-colors focus-within:border-[oklch(0.62_0.24_295)] focus-within:bg-[oklch(0.28_0.05_275)] focus-within:shadow-[0_0_0_4px_oklch(0.62_0.24_295/15%)]">
        <Icon className="h-4 w-4 text-[oklch(0.62_0.02_270)]" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-full w-full bg-transparent text-[13px] font-medium text-white outline-none placeholder:text-[oklch(0.52_0.02_270)]"
        />
      </div>
    </label>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.66 4.1-5.5 4.1-3.32 0-6.02-2.75-6.02-6.15S8.68 5.9 12 5.9c1.88 0 3.15.8 3.88 1.5l2.64-2.55C16.84 3.32 14.62 2.4 12 2.4 6.85 2.4 2.7 6.55 2.7 11.7s4.15 9.3 9.3 9.3c5.36 0 8.93-3.77 8.93-9.07 0-.6-.07-1.07-.15-1.53H12z" />
      <path fill="#34A853" d="M3.95 7.55l3.2 2.35c.86-1.65 2.43-2.8 4.85-2.8 1.88 0 3.15.8 3.88 1.5l2.64-2.55C16.84 3.32 14.62 2.4 12 2.4 8.27 2.4 5.07 4.55 3.95 7.55z" opacity=".0" />
      <path fill="#FBBC05" d="M12 21c2.55 0 4.7-.84 6.27-2.3l-3-2.45c-.82.57-1.92.97-3.27.97-2.5 0-4.62-1.7-5.38-3.97l-3.13 2.4C5.05 19 8.27 21 12 21z" />
      <path fill="#4285F4" d="M21 11.93c0-.6-.07-1.07-.15-1.53H12v3.9h5.5c-.24 1.4-1.66 4.1-5.5 4.1v.05l3 2.45C17.43 19.18 21 16.4 21 11.93z" />
    </svg>
  );
}
