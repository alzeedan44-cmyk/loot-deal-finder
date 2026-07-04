import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Use — NeoCart" },
      { name: "description", content: "The terms that govern your use of NeoCart." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <MobileShell>
      <article className="prose prose-invert max-w-none px-4 py-6 text-[13px] leading-relaxed text-foreground/90">
        <h1 className="font-display text-2xl font-extrabold">Terms of Use</h1>
        <p className="text-muted-foreground">Last updated: July 2026</p>

        <h2 className="mt-6 text-base font-bold">The service</h2>
        <p>
          NeoCart is a price-comparison and cashback tool. We surface offers from third-party
          merchants and earn a commission when you buy through our links. Product availability,
          prices and delivery terms are set by the merchant, not by us.
        </p>

        <h2 className="mt-4 text-base font-bold">NeoCoins</h2>
        <p>
          NeoCoins represent a portion of the affiliate commission we receive on your tracked
          orders. The exact share is variable and set by NeoCart from time to time. Coins are
          credited only after the merchant confirms the order and pays out the commission,
          which typically takes 30–90 days. Cancelled or returned orders reverse the credit.
        </p>

        <h2 className="mt-4 text-base font-bold">Withdrawals</h2>
        <p>
          Withdrawal thresholds, methods and fees are shown on the withdrawal screen. We may
          delay or refuse payouts we believe to be fraudulent or in breach of merchant terms.
        </p>

        <h2 className="mt-4 text-base font-bold">Acceptable use</h2>
        <p>
          You agree not to abuse affiliate links (self-referrals, botting, fake orders). Accounts
          that violate this may be suspended and unpaid balances forfeited.
        </p>

        <p className="mt-6">
          <Link to="/" className="text-primary">← Back to home</Link>
        </p>
      </article>
    </MobileShell>
  );
}
