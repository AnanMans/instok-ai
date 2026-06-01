import { createClient } from '@supabase/supabase-js'

const normalizePhone = (p: string | null | undefined) =>
  (p ?? '').replace(/\D/g, '').replace(/^0/, '972')

export async function POST(request: Request) {
  try {
    const body = await request.json() as {
      storeId: string
      businessPhone?: string
      bitPhoneOverride?: string   // empty string = clear override (use business phone)
      description?: string
    }

    if (!body.storeId) return Response.json({ error: 'Missing storeId' }, { status: 400 })

    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key)

    const updates: Record<string, unknown> = {}

    if (body.businessPhone !== undefined) {
      const phone = normalizePhone(body.businessPhone)
      updates.business_phone = phone
      updates.whatsapp_number = phone   // keep in sync for backward compat
    }

    if (body.bitPhoneOverride !== undefined) {
      updates.bit_phone_override = body.bitPhoneOverride
        ? normalizePhone(body.bitPhoneOverride)
        : null   // empty string clears override
    }

    if (body.description !== undefined) {
      updates.description = body.description
    }

    if (Object.keys(updates).length === 0) {
      return Response.json({ ok: true })
    }

    const { error } = await supabase
      .from('stores')
      .update(updates)
      .eq('id', body.storeId)

    if (error) {
      console.error('[update-store] ERROR:', JSON.stringify(error))
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ ok: true })
  } catch (err) {
    console.error('[update-store] caught:', err)
    return Response.json({ error: String(err) }, { status: 500 })
  }
}
