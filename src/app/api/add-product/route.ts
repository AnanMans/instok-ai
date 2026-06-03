import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const body = await request.json() as {
      store_id: string
      name: string
      price: number
      description?: string
      image_url?: string
    }

    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key)

    // Enforce 10-product limit for free stores
    const { data: store } = await supabase.from('stores').select('is_pro').eq('id', body.store_id).single()
    if (!store?.is_pro) {
      const { count } = await supabase.from('products').select('id', { count: 'exact', head: true }).eq('store_id', body.store_id)
      if ((count ?? 0) >= 10) {
        return Response.json({ error: 'limit_reached' }, { status: 402 })
      }
    }

    const { data: product, error } = await supabase
      .from('products')
      .insert({
        store_id: body.store_id,
        title: body.name,
        name: body.name,
        price: body.price,
        description: body.description || null,
        image_url: body.image_url || null,
      })
      .select()
      .single()

    if (error) {
      console.error('[add-product] ERROR:', JSON.stringify(error))
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ product })
  } catch (err) {
    console.error('[add-product] caught:', err)
    return Response.json({ error: String(err) }, { status: 500 })
  }
}
