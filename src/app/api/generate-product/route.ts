import Anthropic from '@anthropic-ai/sdk'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    if (!file) return Response.json({ error: 'No file provided' }, { status: 400 })

    const buffer = Buffer.from(await file.arrayBuffer())
    const base64 = buffer.toString('base64')
    const mediaType = file.type as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 500,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: mediaType, data: base64 },
          },
          {
            type: 'text',
            text: `You are a product listing assistant for an Arabic/Hebrew e-commerce store in Israel. Analyze this product image and return ONLY valid JSON with these fields:
{
  name_ar: product name in Arabic (2-4 words),
  name_he: product name in Hebrew (2-4 words),
  description_ar: compelling product description in Arabic (1-2 sentences),
  description_he: same in Hebrew,
  price_min: suggested minimum price in Israeli shekels (number only),
  price_max: suggested maximum price in Israeli shekels (number only),
  category: one word category in English
}
Be specific and realistic about pricing for the Israeli market.`,
          },
        ],
      }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return Response.json({ error: 'No JSON in response' }, { status: 500 })

    const parsed = JSON.parse(jsonMatch[0])
    return Response.json(parsed)
  } catch (err) {
    console.error('[generate-product]', err)
    return Response.json({ error: String(err) }, { status: 500 })
  }
}
