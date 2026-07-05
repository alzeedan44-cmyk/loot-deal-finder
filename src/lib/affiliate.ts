// NeoCart affiliate redirect + click-tracking helper.
// Wraps a raw merchant URL into an attributed affiliate URL and logs the click
// into public.clicks so CUE Links (or Amazon/Flipkart) postbacks can later
// match to conversions using the same sub_id.

import { supabase } from "@/integrations/supabase/client";

// Public config — safe to expose on the client.
// User can override these later inside src/config/affiliate.ts if desired.
// CueLinks Campaign ID is a public identifier (shipped inside their JS snippet) — safe in client code.
const CUELINKS_CID = (import.meta.env.VITE_CUELINKS_CID as string) || "299746";
const AMAZON_TAG = (import.meta.env.VITE_AMAZON_TAG as string) || "";
const FLIPKART_AFFID = (import.meta.env.VITE_FLIPKART_AFFID as string) || "";

function randomSubId() {
  // 12 char base36
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  ).toUpperCase();
}

function cueWrap(rawUrl: string, subId: string): string {
  return (
    `https://linksredirect.com/?cid=${encodeURIComponent(CUELINKS_CID)}` +
    `&source=linkkit&url=${encodeURIComponent(rawUrl)}` +
    `&subid=${encodeURIComponent(subId)}`
  );
}

export function wrapAffiliate(rawUrl: string, merchantSlug: string, subId: string): string {
  try {
    const u = new URL(rawUrl);
    // Prefer direct affiliate tags when configured; otherwise route via CueLinks
    // (CueLinks covers Amazon India, Flipkart, Myntra, Ajio and 21k+ merchants).
    if (merchantSlug === "amazon" && AMAZON_TAG) {
      u.searchParams.set("tag", AMAZON_TAG);
      u.searchParams.set("ascsubtag", subId);
      return u.toString();
    }
    if (merchantSlug === "flipkart" && FLIPKART_AFFID) {
      u.searchParams.set("affid", FLIPKART_AFFID);
      u.searchParams.set("affExtParam1", subId);
      return u.toString();
    }
    return cueWrap(rawUrl, subId);
  } catch {
    return rawUrl;
  }
}

/** Log the outbound click (best-effort) and return the affiliate URL. */
export async function trackAndBuild(params: {
  productId?: string | null;
  merchantSlug: string;
  rawUrl: string;
}): Promise<{ affiliateUrl: string; subId: string }> {
  const subId = randomSubId();
  const affiliateUrl = wrapAffiliate(params.rawUrl, params.merchantSlug, subId);

  // Fire-and-forget insert. We do not await so slow networks don't block redirect.
  const { data: userRes } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }));
  supabase
    .from("clicks")
    .insert({
      user_id: userRes?.user?.id ?? null,
      product_id: params.productId ?? null,
      merchant_slug: params.merchantSlug,
      affiliate_url: affiliateUrl,
      sub_id: subId,
    })
    .then(({ error }) => {
      if (error) console.warn("[NeoCart] click log failed:", error.message);
    });

  return { affiliateUrl, subId };
}
