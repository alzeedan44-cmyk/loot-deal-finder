// Captures a referral code from the URL (?ref=CODE) once per browser and
// attaches it to the user's profile after they sign in. Kept intentionally
// lightweight — no bonus is promised in the UI. Actual bonus credit lives in
// the (later) referral-credit cron; this file only records who referred whom.

import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const STORAGE_KEY = "neocart_ref_code";
const MAX_CODE_LEN = 32;

function sanitize(code: string): string | null {
  const cleaned = code.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "");
  if (!cleaned || cleaned.length > MAX_CODE_LEN) return null;
  return cleaned;
}

export function useReferralCapture() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1) Capture ?ref=CODE from URL and persist it (first-touch wins).
    try {
      const params = new URLSearchParams(window.location.search);
      const raw = params.get("ref");
      if (raw) {
        const code = sanitize(raw);
        if (code && !localStorage.getItem(STORAGE_KEY)) {
          localStorage.setItem(STORAGE_KEY, code);
        }
        // Clean the URL so the ref param doesn't stick to shares.
        params.delete("ref");
        const qs = params.toString();
        const clean = window.location.pathname + (qs ? `?${qs}` : "") + window.location.hash;
        window.history.replaceState({}, "", clean);
      }
    } catch {
      /* ignore */
    }

    // 2) On sign-in, write the code to profiles.referred_by if empty.
    const { data: sub } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event !== "SIGNED_IN" || !session?.user?.id) return;
      const code = localStorage.getItem(STORAGE_KEY);
      if (!code) return;
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("referred_by")
          .eq("id", session.user.id)
          .maybeSingle();
        if (profile && !profile.referred_by) {
          await supabase
            .from("profiles")
            .update({ referred_by: code })
            .eq("id", session.user.id);
        }
        // Clear so we don't retry on every sign-in.
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* soft-fail — referral is best-effort */
      }
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);
}
