import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";

export const Route = createFileRoute("/disclosure")({
  head: () => ({
    meta: [
      { title: "Affiliate Disclosure — NeoCart" },
      { name: "description", content: "How NeoCart makes money and shares it back with you." },
    ],
  }),
  component: DisclosurePage,
});

function DisclosurePage() {
  return (
    <MobileShell>
      <article className="prose prose-invert max-w-none px-4 py-6 text-[13px] leading-relaxed text-foreground/90">
        <h1 className="font-display text-2xl font-extrabold">Affiliate Disclosure</h1>
        <p className="text-muted-foreground">Last updated: July 2026</p>

        <p className="mt-4">
          NeoCart is a participant in affiliate programs run by Amazon Associates, Flipkart
          Affiliate, and the CUE Links network (Myntra, Ajio, Nykaa, Tata CLiQ and others).
          When you tap a Buy button on NeoCart, we redirect you through an affiliate link and
          the merchant pays us a commission if you complete a purchase. This does not change
          the price you pay.
        </p>

        <p className="mt-4">
          We share a portion of the commission we actually receive back to you as NeoCoins.
          We do not promise a fixed cashback percentage because commission rates differ per
          store, per category and per campaign.
        </p>

        <p className="mt-4">
          If a merchant reverses the commission (returns, cancellations, non-eligible orders)
          the corresponding NeoCoins are also reversed.
        </p>

        <p className="mt-6">
          <Link to="/" className="text-primary">← Back to home</Link>
        </p>
      </article>
    </MobileShell>
  );
}
