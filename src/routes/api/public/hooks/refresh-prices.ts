// Daily maintenance cron: snapshots current offer prices into price_history
// and fires notifications when active price_alerts are hit.
//
// Wired via pg_cron — see the accompanying insert migration. This endpoint
// is auth-free (public) so pg_cron / an external scheduler can call it, so
// it only performs safe idempotent maintenance work.

import { createFileRoute } from '@tanstack/react-router'

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

export const Route = createFileRoute('/api/public/hooks/refresh-prices')({
  server: {
    handlers: {
      POST: async () => {
        const { supabaseAdmin } = await import('@/integrations/supabase/client.server')

        // 1. Snapshot every current offer price into price_history.
        const { data: offers, error: offersErr } = await supabaseAdmin
          .from('offers')
          .select('product_id,merchant_slug,price,in_stock')
        if (offersErr) return json({ error: offersErr.message }, 500)

        const snapshots = (offers ?? [])
          .filter((o) => o.in_stock && o.price != null)
          .map((o) => ({
            product_id: o.product_id,
            merchant_slug: o.merchant_slug,
            price: o.price,
          }))
        if (snapshots.length) {
          await supabaseAdmin.from('price_history').insert(snapshots)
        }

        // 2. Check active price alerts. For each product, find the current
        //    minimum in-stock price; if <= target and not notified in last
        //    24h, insert a notification and stamp last_notified_at.
        const { data: alerts, error: alertsErr } = await supabaseAdmin
          .from('price_alerts')
          .select('id,user_id,product_id,target_price,last_notified_at')
          .eq('active', true)
        if (alertsErr) return json({ error: alertsErr.message }, 500)

        let notified = 0
        const now = Date.now()
        const cooldownMs = 24 * 60 * 60 * 1000

        // Group offers by product for cheap lookup
        const minByProduct = new Map<string, number>()
        for (const o of offers ?? []) {
          if (!o.in_stock || o.price == null) continue
          const prev = minByProduct.get(o.product_id)
          if (prev == null || o.price < prev) minByProduct.set(o.product_id, o.price)
        }

        for (const alert of alerts ?? []) {
          const current = minByProduct.get(alert.product_id)
          if (current == null || current > alert.target_price) continue
          if (
            alert.last_notified_at &&
            now - new Date(alert.last_notified_at).getTime() < cooldownMs
          )
            continue

          const { data: product } = await supabaseAdmin
            .from('products')
            .select('title')
            .eq('id', alert.product_id)
            .maybeSingle()

          await supabaseAdmin.from('notifications').insert({
            user_id: alert.user_id,
            kind: 'price_drop',
            product_id: alert.product_id,
            title: 'Price drop alert',
            body: `${product?.title ?? 'Your tracked item'} is now ₹${current.toLocaleString('en-IN')} — below your target of ₹${alert.target_price.toLocaleString('en-IN')}.`,
          })
          await supabaseAdmin
            .from('price_alerts')
            .update({ last_notified_at: new Date().toISOString() })
            .eq('id', alert.id)
          notified += 1
        }

        return json({ ok: true, snapshots: snapshots.length, notified })
      },
    },
  },
})
