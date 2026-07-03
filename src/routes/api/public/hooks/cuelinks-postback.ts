// CUE Links postback receiver.
// Configure this URL inside CUE Links dashboard → Postback:
//   https://<your-domain>/api/public/hooks/cuelinks-postback
//
// Security: CUE Links can sign the payload with a shared secret (HMAC-SHA256
// over the raw body, hex, in header `x-cuelinks-signature`). If the secret
// env var is missing we reject every call — never accept unsigned money.
//
// Expected JSON body (fields we care about):
// {
//   "subid":       "ABCXYZ12",         // matches clicks.sub_id
//   "sale_amount": 1499.00,             // INR
//   "commission":  74.95,               // INR we (publisher) get
//   "status":      "confirmed" | "pending" | "approved" | "rejected",
//   "click_id":    "cue_internal_id",   // optional, stored as external_ref
//   "merchant":    "myntra"             // optional
// }
//
// User share defaults to 40% of commission (USER_SHARE_BPS=4000). NEVER
// promise a fixed rate in the UI; we only share what we actually receive.

import { createFileRoute } from '@tanstack/react-router'
import { createHmac, timingSafeEqual } from 'node:crypto'

type Payload = {
  subid?: string
  sub_id?: string
  sale_amount?: number | string
  commission?: number | string
  status?: string
  click_id?: string
  merchant?: string
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

function verifySignature(raw: string, header: string | null, secret: string): boolean {
  if (!header) return false
  const expected = createHmac('sha256', secret).update(raw).digest('hex')
  const a = Buffer.from(header)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return false
  try {
    return timingSafeEqual(a, b)
  } catch {
    return false
  }
}

export const Route = createFileRoute('/api/public/hooks/cuelinks-postback')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.CUELINKS_POSTBACK_SECRET
        if (!secret) {
          return json({ error: 'Postback secret not configured' }, 500)
        }

        const raw = await request.text()
        const sig = request.headers.get('x-cuelinks-signature')
        if (!verifySignature(raw, sig, secret)) {
          return json({ error: 'Invalid signature' }, 401)
        }

        let payload: Payload
        try {
          payload = JSON.parse(raw)
        } catch {
          return json({ error: 'Invalid JSON' }, 400)
        }

        const subId = payload.subid ?? payload.sub_id
        if (!subId) return json({ error: 'Missing subid' }, 400)

        const sale = Math.round(Number(payload.sale_amount ?? 0) * 100) / 100
        const commission = Math.round(Number(payload.commission ?? 0) * 100) / 100
        const rawStatus = (payload.status ?? 'pending').toLowerCase()
        const status =
          rawStatus === 'approved' || rawStatus === 'confirmed'
            ? 'approved'
            : rawStatus === 'rejected' || rawStatus === 'cancelled'
              ? 'rejected'
              : 'pending'

        const shareBps = Number(process.env.USER_SHARE_BPS ?? '4000') // 40% default
        const userShareCoins = Math.max(0, Math.round(commission * (shareBps / 10000)))

        const { supabaseAdmin } = await import('@/integrations/supabase/client.server')

        // Look up the originating click (best effort — CUE may fire before we saved it)
        const { data: click } = await supabaseAdmin
          .from('clicks')
          .select('id,user_id,merchant_slug')
          .eq('sub_id', subId)
          .maybeSingle()

        // Idempotency: same subid + external_ref should not double-credit
        const externalRef = payload.click_id ?? subId
        const { data: existing } = await supabaseAdmin
          .from('conversions')
          .select('id,status')
          .eq('sub_id', subId)
          .eq('external_ref', externalRef)
          .maybeSingle()

        let conversionId = existing?.id
        const previousStatus = existing?.status

        if (!existing) {
          const { data: inserted, error: insertErr } = await supabaseAdmin
            .from('conversions')
            .insert({
              user_id: click?.user_id ?? null,
              click_id: click?.id ?? null,
              merchant_slug: click?.merchant_slug ?? payload.merchant ?? 'unknown',
              sub_id: subId,
              order_amount: Math.round(sale * 100),
              commission_amount: Math.round(commission * 100),
              user_share_coins: userShareCoins,
              status,
              external_ref: externalRef,
            })
            .select('id')
            .single()
          if (insertErr) return json({ error: insertErr.message }, 500)
          conversionId = inserted.id
        } else if (previousStatus !== status) {
          await supabaseAdmin
            .from('conversions')
            .update({
              status,
              order_amount: Math.round(sale * 100),
              commission_amount: Math.round(commission * 100),
              user_share_coins: userShareCoins,
            })
            .eq('id', existing.id)
        }

        // Credit NeoCoins only on the pending→approved transition
        const becameApproved =
          status === 'approved' && previousStatus !== 'approved' && click?.user_id
        if (becameApproved && userShareCoins > 0) {
          const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('neo_coins')
            .eq('id', click!.user_id!)
            .maybeSingle()
          if (profile) {
            await supabaseAdmin
              .from('profiles')
              .update({ neo_coins: (profile.neo_coins ?? 0) + userShareCoins })
              .eq('id', click!.user_id!)
            await supabaseAdmin.from('notifications').insert({
              user_id: click!.user_id!,
              kind: 'cashback_approved',
              title: 'Cashback approved',
              body: `You earned ${userShareCoins} NeoCoins from your recent order.`,
            })
          }
        }

        return json({ ok: true, conversionId, status, credited: becameApproved })
      },
    },
  },
})
