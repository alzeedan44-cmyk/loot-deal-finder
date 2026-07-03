# 🚀 NeoCart — Path to a Real Earning Product

> Strategy for someone on a **5-credit/day** Lovable budget. Every phase ships something
> shippable and revenue-relevant. Phases are ordered so real money starts flowing by
> the end of Phase 4.

---

## ✅ Phase 0 — Foundation (DONE this turn)

- Lovable Cloud enabled (Supabase auth + Postgres + Edge Functions).
- Google OAuth provider configured.
- Full production schema created:
  - `profiles`, `user_roles` (secure admin roles via `has_role()`)
  - `merchants` (Amazon, Flipkart, Myntra, Ajio, Nykaa, Tata CLiQ — with commission rates + affiliate wrap type)
  - `products`, `offers`, `price_history`
  - `price_alerts`, `coupons`
  - `clicks` (attribution log with `sub_id` → passed to CUE Links)
  - `conversions` (commission ledger; user share is a variable slice of what
    we actually receive — default 40 %, controlled by `USER_SHARE_BPS` env.
    Never promise a fixed cashback % in the UI.)
  - `referrals`, `notifications`
- 12 real trending Indian SKUs + 6 hot coupons seeded.
- `src/lib/affiliate.ts` helper that wraps any merchant URL through
  CUE Links / Amazon `tag=` / Flipkart `affid=` and logs the click.

---

## 📦 Phase 1 — Live catalog & real Buy-buttons (next 1-2 days, ~5 credits)

- Replace hard-coded `src/data/products.ts` with a `useProducts()` hook that
  queries Supabase (`products` + `offers`).
- Wire `<ProductCard>` and `product.$id.tsx` to call
  `trackAndBuild()` in `src/lib/affiliate.ts` and open the returned
  affiliate URL in a new tab (or inside the existing WebView).
- Replace the fake login on `/account` with real Google sign-in via
  `lovable.auth.signInWithOAuth("google")` and load `profiles.neo_coins` into
  the wallet store.

**Result:** every "Buy Best Deal" click is now revenue-attributable to you.

---

## 💸 Phase 2 — CUE Links postback → automatic NeoCoin credit (~5 credits)

- Edge function `POST /functions/v1/cuelinks-postback` that:
  1. Verifies signature / shared secret.
  2. Matches `subid` → row in `clicks`.
  3. Inserts a `conversions` row with 70 % of commission as `user_share_coins`.
  4. On `status='approved'` increments `profiles.neo_coins`.
- Add the postback URL inside your CUE Links dashboard → "Postback".
- Same edge function handles Amazon PA-API report ingestion (weekly cron).

**Result:** commissions land in the correct user's wallet automatically.

---

## 🕷️ Phase 3 — Real price scraping + drop alerts (~5 credits)

- Scheduled edge function `refresh-prices` (runs every 6h) that:
  - Pulls current price for each `offer` via Amazon PA-API + a lightweight
    HTML scrape for Flipkart / Myntra / Ajio / Nykaa (using a rotating
    residential proxy secret).
  - Writes a new `price_history` row on any change.
  - For every matched `price_alerts.target_price` insert a `notifications` row
    and (Phase 5) fire a web-push.
- Chart component on the product page reading `price_history` (recharts is
  already in the bundle).

---

## 🎟️ Phase 4 — Coupons page + Deals feed refresh (~5 credits)

- New `/coupons` route with per-merchant tabs, one-tap "Copy & Open Store"
  (also runs through `trackAndBuild`).
- Automated import: nightly edge function pulls the CUE Links coupon feed
  and upserts into `coupons`.
- Homepage "Loot Deals of the Day" now reads from `offers` ranked by
  discount % vs `products.mrp`.

---

## 🔔 Phase 5 — Web Push + PWA install (~5 credits)

- `vite-plugin-pwa` (or manual manifest + SW) → installable "NeoCart" icon
  on Android homescreens.
- Web Push (VAPID keys stored as Cloud secrets) for price drops, coupon
  drops, "your cashback got approved".
- Local notification badge on the bottom nav (`notifications` table).

---

## 💰 Phase 6 — Real payouts (~5 credits)

- `/withdraw` edge function: validates ≥ 200 NeoCoins, decrements
  `profiles.neo_coins`, creates a payout row, sends UPI collect request via
  Razorpay Payouts API (secret `RAZORPAY_KEY`).
- Admin approval queue in `/admin`.

---

## 👥 Phase 7 — Viral referral engine (~5 credits)

- Deep link `neocart.app/?ref=NEOPROFIT50` → stored in localStorage,
  attached to `profiles.referred_by` on signup.
- Cron edge function watches first `conversions.status='approved'` per
  referee → auto-credit 50 NeoCoins to both users, inserts `notifications`.

---

## 🚀 Phase 8 — Launch polish (~5 credits)

- OG image + landing SEO, sitemap, robots.
- Analytics: Plausible or PostHog script.
- Legal: T&C, Privacy Policy, disclosure page (required for affiliate).
- App Store-style screenshots for Product Hunt / Reddit r/IndiaInvestments.

---

## 🎯 What actually earns you money

| Source              | Take                          | Trigger                             |
| ------------------- | ----------------------------- | ----------------------------------- |
| CUE Links (Myntra/Ajio/Nykaa/Tata CLiQ) | 6-10 % of order | Any `subid`-tagged sale |
| Amazon Associates   | 1-4 % (up to 10% on fashion)   | `tag=neocartapp-21` on the click     |
| Flipkart Affiliate  | 2-8 %                          | `affid=neocart`                      |
| Bank-card CPA (later)| ₹200-800 per approved credit card | Same click flow                  |

You keep 30 %, ship 70 % as NeoCoins to the user → **retention loop that
funds itself**.
