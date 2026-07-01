// NeoCart affiliate redirect + click-tracking helper.
// Wraps a raw merchant URL into an attributed affiliate URL and logs the click
// into public.clicks so CUE Links (or Amazon/Flipkart) postbacks can later
// match to conversions using the same sub_id.

import { supabase } from "@/integrations/supabase/client";

// Public config — safe to expose on the client.
// User can override these later inside src/config/affiliate.ts if desired.
const CUELINKS_CID = (import.meta.env.VITE_CUELINKS_CID as string) || "REPLACE_CUELINKS_CID";
const AMAZON_TAG = (import.meta.env.VITE_AMAZON_TAG as string) || "neocartapp-21";
const FLIPKART_AFFID = (import.meta.env.VITE_FLIPKART_AFFID as string) || "neocart";

function randomSubId() {
  // 12 char base36
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  ).toUpperCase();
}

export function wrapAffiliate(rawUrl: string, merchantSlug: string, subId: string): string {
  try {
    const u = new URL(rawUrl);
    switch (merchantSlug) {
      case "amazon": {
        u.searchParams.set("tag", AMAZON_TAG);
        u.searchParams.set("ascsubtag", subId);
        return u.toString();
      }
      case "flipkart": {
        u.searchParams.set("affid", FLIPKART_AFFID);
        u.searchParams.set("affExtParam1", subId);
        return u.toString();
      }
      default: {
        // CUE Links universal deep-link wrapper
        // Doc pattern: https://linksredirect.com/?cid=CID&source=linkkit&url=ENCODED&subid=SUBID
        const wrapped =
          `https://linksredirect.com/?cid=${encodeURIComponent(CUELINKS_CID)}` +
          `&source=linkkit&url=${encodeURIComponent(rawUrl)}` +
          `&subid=${encodeURIComponent(subId)}`;
        return wrapped;
      }
    }
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
