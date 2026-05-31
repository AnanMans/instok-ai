import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const body = await request.json() as {
      storeId: string
      whatsappNumber: string
    }

    if (!body.storeId) return Response.json({ error: 'Missing storeId' }, { status: 400 })

    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key)

    const normalizedWa = body.whatsappNumber
      .replace(/\D/g, '')
      .replace(/^0/, '972')

    const { error } = await supabase
      .from('stores')
      .update({ whatsapp_number: normalizedWa })
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
