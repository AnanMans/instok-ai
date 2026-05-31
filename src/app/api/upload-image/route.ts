import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const storeId = formData.get('storeId') as string | null

    if (!file) return Response.json({ error: 'No file provided' }, { status: 400 })
    if (!storeId) return Response.json({ error: 'No storeId provided' }, { status: 400 })

    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key)

    const ext = file.name.split('.').pop()
    const path = `${storeId}/${Date.now()}.${ext}`

    const buffer = Buffer.from(await file.arrayBuffer())
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(path, buffer, { contentType: file.type, upsert: true })

    if (error) {
      console.error('[upload-image] ERROR:', JSON.stringify(error))
      return Response.json({ error: error.message }, { status: 500 })
    }

    const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(data.path)
    return Response.json({ url: publicUrl })
  } catch (err) {
    console.error('[upload-image] caught:', err)
    return Response.json({ error: String(err) }, { status: 500 })
  }
}
