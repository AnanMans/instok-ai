import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

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
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    const body = await request.json() as {
      brandName: string; slogan: string; colors: string[]; archetype: string
      vibe: string; category: string; description: string; whatsappNumber: string
      delivery: string; deliveryAreas: string; payments: string
    }

    const slug = generateSlug(body.brandName)

    if (user) {
      await supabase.from('profiles').upsert({
        id: user.id,
        whatsapp_number: body.whatsappNumber,
        updated_at: new Date().toISOString(),
      })
    }

    const storePayload: Record<string, unknown> = {
      slug,
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
    }
    if (user) storePayload.owner_id = user.id

    const { data: store } = await supabase
      .from('stores')
      .insert(storePayload)
      .select()
      .single()

    return Response.json({ storeId: store?.id, slug: store?.slug ?? slug })
  } catch (err) {
    console.error('[save-store] error:', err)
    return Response.json({ slug: generateSlug('store') })
  }
}
