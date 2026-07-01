# NeoCart → Real Earning Product: Phased Build Plan

Right now NeoCart is a beautiful **simulation** — mock products, mock prices, mock checkout. To actually earn money you need three real things wired up:

1. **Real product data** (prices, images, URLs from Amazon/Flipkart/Myntra/Ajio/etc.)
2. **Real affiliate links** (your CUE Links / Amazon Associates / Flipkart Affiliate / Cuelinks tags injected into every outbound click)
3. **Real users + retention loop** (auth, price alerts that actually fire, notifications, referrals)

Below is a realistic, phase-by-phase plan. I'll execute one phase per turn so we don't burn your 5 daily credits in one shot. You approve → I build → we test → next phase.

---

## Phase 0 — Foundation (Lovable Cloud + Auth) — 1 turn
**Goal:** Real backend so data + users persist.

- Enable **Lovable Cloud** (Postgres + Auth + Storage + Edge functions).
- Real email/Google sign-in replacing the mock account form.
- DB schema: `profiles`, `user_roles`, `products`, `offers`, `merchants`, `coupons`, `price_history`, `price_alerts`, `clicks`, `conversions`, `referrals`.
- Row-Level Security on every table.

## Phase 1 — Real Affiliate Link Engine — 1 turn
**Goal:** Every "Buy Best Deal" click is a monetized click.

- Add secrets: `CUELINKS_CID`, `AMAZON_ASSOC_TAG`, `FLIPKART_AFFILIATE_ID`, `EKAM_TOKEN` (optional).
- Server function `buildAffiliateUrl(merchant, rawUrl, userId)`:
  - Wrap through **CUE Links** (`https://linksredirect.com/?cid=XXX&source=linkkit&url=<enc>`) — works for 500+ Indian merchants incl. Myntra, Ajio, Nykaa, Tata CLiQ.
  - For Amazon → append `?tag=AMAZON_ASSOC_TAG`.
  - For Flipkart → Flipkart Affiliate deep link.
- Log every click to `clicks` table (user_id, product_id, merchant, timestamp) → this is your attribution source of truth.
- Update WebView + ProductCard buttons to call this.

## Phase 2 — Real Product & Price Data — 2 turns
**Goal:** Kill the hardcoded `products.ts`. Show live prices.

Two-track ingestion (both cheap, both legal):
- **Track A — Merchant feeds (primary):**
  - Amazon PA-API 5.0 (via Associates)
  - Flipkart Affiliate Product Feed API
  - CUE Links Product Feed (covers Myntra, Ajio, Nykaa, Tata CLiQ, 1mg, etc.)
- **Track B — Scraper fallback (secondary):** an edge function using `fetch` + cheerio for public product pages when a merchant has no feed, cached 6–12h in Postgres. (No Puppeteer — Cloudflare Workers can't run it. We use plain HTTP + HTML parse.)
- Cron (pg_cron) refreshes prices for tracked products every 3h.
- Every price write → append to `price_history` (this powers the "Price Tracker" chart + alerts).

## Phase 3 — Real Price-Drop Alerts + Push — 1 turn
**Goal:** Retention. Users come back when prices drop.

- Edge function `checkAlerts` runs every 30 min: compares latest price vs alert threshold.
- Delivery channels:
  - **Web Push** (VAPID keys, works on Android Chrome — huge in India)
  - **Email** via Resend
  - **WhatsApp** (optional, via MSG91/Gupshup later)
- Real notification tray (replace mock dropdown) reading from `notifications` table.

## Phase 4 — Real Coupons — 1 turn
**Goal:** "Coupons that actually work" = trust = shares.

- Ingest coupons from **CUE Links coupon feed** (auto-updated daily, includes expiry + verified status).
- Store in `coupons` table, filter by merchant on product page.
- "Copy & Apply" button copies code + opens affiliate link in one tap.

## Phase 5 — Real Cashback Ledger — 1 turn
**Goal:** NeoCoins backed by real commissions, not fake +45.

- Edge function polls CUE Links **postback/conversion API** hourly → writes to `conversions` table.
- Wallet balance = SUM(approved conversions × your share, e.g. 70% to user, 30% to you).
- Withdrawal request → admin approves → UPI payout (manual via Razorpay Payouts in Phase 7).

## Phase 6 — Growth Loop — 1 turn
**Goal:** Referrals that actually work + SEO.

- Real referral codes stored in `referrals` table, `+₹50` credited on referee's first approved conversion.
- SEO landing pages per category & per product (`/deals/iphone-15-price-in-india`) — server-rendered by TanStack Start = free organic traffic.
- WhatsApp share deep links with referral code baked in.

## Phase 7 — Payout + Admin Ops — 1 turn
- Razorpay Payouts (or manual UPI CSV export) for withdrawals.
- Admin panel real data: signups, DAU, clicks, GMV attributed, commission earned, pending payouts.
- Broadcast form → real Web Push send.

## Phase 8 — Launch polish — 1 turn
- PWA install (already TanStack Start — just add manifest + service worker for push).
- Onboarding, empty states, share sheet, App Store listing copy.
- Publish + custom domain.

---

## Technical stack decisions
- **Backend:** Lovable Cloud (Supabase under the hood) — Postgres, Auth, Edge Functions, Storage, pg_cron.
- **Affiliate aggregator:** CUE Links (you already have) covers 500+ IN merchants with one integration; Amazon + Flipkart added directly for better rates.
- **Scraping runtime:** edge functions with `fetch` + `cheerio`. **Not** Puppeteer/Playwright (unsupported on Workers).
- **Push:** Web Push (free) + Resend (free tier) for email.
- **Payouts:** Razorpay Payouts API (₹0 setup).

## Secrets we'll add along the way
`CUELINKS_CID`, `CUELINKS_API_KEY`, `AMAZON_ASSOC_TAG`, `AMAZON_PAAPI_KEY`, `AMAZON_PAAPI_SECRET`, `FLIPKART_AFFILIATE_ID`, `FLIPKART_AFFILIATE_TOKEN`, `RESEND_API_KEY`, `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`.

## What I need from you before Phase 0
1. Confirm you want me to **enable Lovable Cloud** (this replaces all mock state — the current fake products/wallet will reset once we go real).
2. Your **CUE Links CID** (from cuelinks.com dashboard → Tools → LinkKit). We'll add other affiliate keys as we hit each phase.

Reply **"go phase 0"** and I'll start. One phase per message keeps your daily 5 credits stretched across a week and gets you a launchable earning app.
