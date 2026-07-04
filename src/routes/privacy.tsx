import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — NeoCart" },
      { name: "description", content: "How NeoCart collects, uses, and protects your data." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <MobileShell>
      <article className="prose prose-invert max-w-none px-4 py-6 text-[13px] leading-relaxed text-foreground/90">
        <h1 className="font-display text-2xl font-extrabold">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: July 2026</p>

        <h2 className="mt-6 text-base font-bold">What we collect</h2>
        <p>
          When you use NeoCart we store the minimum needed to run the service: your email and
          display name (if you sign in with Google), the products you view or add to alerts, the
          affiliate clicks you initiate, and the commissions attributed to those clicks.
        </p>

        <h2 className="mt-4 text-base font-bold">How we use it</h2>
        <p>
          Your data is used to show your NeoCoins balance, notify you of price drops on items you
          track, and credit cashback when a merchant confirms your order. We never sell your
          personal data.
        </p>

        <h2 className="mt-4 text-base font-bold">Third parties</h2>
        <p>
          When you tap "Buy" we redirect you through CUE Links, Amazon Associates or Flipkart
          Affiliate so the merchant can attribute the sale. The merchant's own privacy policy
          applies to the shopping session on their site.
        </p>

        <h2 className="mt-4 text-base font-bold">Your controls</h2>
        <p>
          You can delete your account and all associated data by writing to
          <a href="mailto:support@neocart.app" className="text-primary"> support@neocart.app</a>.
        </p>

        <p className="mt-6">
          <Link to="/" className="text-primary">← Back to home</Link>
        </p>
      </article>
    </MobileShell>
  );
}
