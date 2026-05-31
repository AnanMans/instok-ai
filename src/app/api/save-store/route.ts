import { createClient } from '@supabase/supabase-js'

function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/-+/g, '-')
    .slice(0, 30) || 'store'
  const suffix = Math.random().toString(36).slice(2, 6)
  return `${base}-${suffix}`
}

export async function POST(request: Request) {
  const slug = generateSlug('store')
  try {
    const body = await request.json() as {
      brandName: string; slogan: string; colors: string[]; archetype: string
      vibe: string; category: string; description: string; whatsappNumber: string
      delivery: string; deliveryAreas: string; payments: string; lang: string
      userId?: string
    }

    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key)

    const computedSlug = generateSlug(body.brandName)

    const storePayload: Record<string, unknown> = {
      slug: computedSlug,
      name: body.brandName,
      slogan: body.slogan,
      colors: body.colors,
      archetype: body.archetype,
      vibe: body.vibe,
      category: body.category,
      description: body.description,
      whatsapp_number: body.whatsappNumber,
      delivery_type: body.delivery,
      delivery_areas: body.deliveryAreas,
      payment_methods: body.payments,
      lang: body.lang,
    }
    if (body.userId) storePayload.owner_id = body.userId

    const { data: store, error } = await supabase
      .from('stores')
      .insert(storePayload)
      .select()
      .single()

    if (error) {
      console.error('[save-store] ERROR:', JSON.stringify(error))
      return Response.json({ error: error.message, slug: computedSlug }, { status: 500 })
    }

    return Response.json({ storeId: store.id, slug: store.slug })
  } catch (err) {
    console.error('[save-store] caught:', err)
    return Response.json({ error: String(err), slug }, { status: 500 })
  }
}
