import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const body = await request.json() as {
      storeId: string
      name: string
      price: number
      description?: string
      imageUrl?: string
    }

    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key)

    const { data: product, error } = await supabase
      .from('products')
      .insert({
        store_id: body.storeId,
        name: body.name,
        price: body.price,
        description: body.description || null,
        image_url: body.imageUrl || null,
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
