// Shared "Buy" click handler used by product cards and the product detail page.
// - Looks up the real merchant URL when we have one (live catalog).
// - Logs an attributed click and generates the affiliate URL via trackAndBuild.
// - Opens the affiliate URL in a new tab so the merchant sees the real referral.
// - Falls back to the in-app WebView mock when we don't have a real URL yet.

import type { Store } from "@/components/StoreLogo";
import { trackAndBuild } from "@/lib/affiliate";
import type { LiveProduct } from "@/lib/products-live";
import type { Product } from "@/data/products";

type OpenWebView = (state: { store: Store; title: string; price?: number }) => void;

export async function handleBuy(params: {
  product: Product | LiveProduct;
  store: Store;
  price: number;
  openWebView: OpenWebView;
}) {
  const { product, store, price, openWebView } = params;
  const rawUrl = (product as LiveProduct).rawUrls?.[store];

  if (rawUrl) {
    // Open a placeholder tab synchronously so mobile popup blockers don't kill it,
    // then redirect once the affiliate wrap resolves.
    const tab = window.open("about:blank", "_blank", "noopener");
    try {
      const { affiliateUrl } = await trackAndBuild({
        productId: product.id,
        merchantSlug: store,
        rawUrl,
      });
      if (tab) tab.location.href = affiliateUrl;
      else window.location.href = affiliateUrl;
    } catch (e) {
      console.warn("[NeoCart] buy handoff failed:", (e as Error).message);
      if (tab) tab.close();
      openWebView({ store, title: product.title, price });
    }
    return;
  }

  openWebView({ store, title: product.title, price });
}
