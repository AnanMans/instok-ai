type Lang = 'ar' | 'he'

type BrandResult = {
  storeName: string
  slogan: string
  colors: string[]
  vibe: string
  direction: string
}

const FALLBACKS: Record<Lang, BrandResult> = {
  ar: {
    storeName: 'متجر الإبداع',
    slogan: 'كل ما تحتاج في مكان واحد',
    colors: ['#7c3aed', '#f59e0b', '#0f172a'],
    vibe: 'عصري وجذاب',
    direction: 'متجر متنوع يقدم أفضل المنتجات بأسعار منافسة وجودة عالية',
  },
  he: {
    storeName: 'חנות היצירה',
    slogan: 'הכל במקום אחד',
    colors: ['#7c3aed', '#f59e0b', '#0f172a'],
    vibe: 'מודרני ומושך',
    direction: 'חנות מגוונת המציעה את המוצרים הטובים ביותר במחירים תחרותיים',
  },
}

function extractHandle(url: string): string {
  if (!url) return ''
  // Strip protocol and www
  let s = url.replace(/^https?:\/\//, '').replace(/^www\./, '')
  // Remove domain prefix (instagram.com/, tiktok.com/, facebook.com/, etc.)
  s = s.replace(/^[^/]+\//, '')
  // Remove leading @ and trailing slashes/query strings
  s = s.replace(/^@/, '').split('?')[0].split('/')[0].trim()
  return s
}

function extractJson(text: string): BrandResult | null {
  let s = text.trim()
  if (s.startsWith('```')) {
    s = s.replace(/^```[^\n]*\n?/, '').replace(/\n?```$/, '').trim()
  }
  const start = s.indexOf('{')
  const end = s.lastIndexOf('}')
  if (start !== -1 && end !== -1) s = s.slice(start, end + 1)
  try {
    return JSON.parse(s) as BrandResult
  } catch {
    return null
  }
}

export async function POST(request: Request) {
  console.log('API KEY exists:', !!process.env.ANTHROPIC_API_KEY)

  let lang: Lang = 'ar'

  try {
    const body = await request.json() as { brandName: string; url: string; category: string; lang: Lang; description: string; vibe: string }
    console.log('[analyze-brand] request body:', JSON.stringify(body))

    lang = body.lang ?? 'ar'
    const { brandName, category, description, vibe } = body

    const prompt = `You are a store identity generator.

IMPORTANT RULES:
- The store name is: "${brandName}" — this is JUST A NAME, ignore what it means
- Base the identity ONLY on: category="${category || 'general'}", description="${description || 'not provided'}", vibe="${vibe || 'minimal'}"
- DO NOT use the store name meaning to decide the archetype or colors
- Example: if name is "جمال" (beauty) but category is "cars" — generate a CAR store identity, NOT beauty

Generate store identity in ${lang === 'ar' ? 'Arabic' : 'Hebrew'} language.

Return ONLY valid JSON, no other text:
{
  "storeName": "${brandName}",
  "slogan": "short catchy slogan based on category and description",
  "colors": ["#hexcolor1", "#hexcolor2", "#hexcolor3"],
  "vibe": "2-3 words describing the feel",
  "direction": "one sentence describing the store direction",
  "archetype": "one of: luxury, gaming, creator, beauty, streetwear, minimal, restaurant, tech"
}

Category: ${category || 'general'}
Description: ${description || 'not provided'}
Vibe: ${vibe || 'minimal'}
Language: ${lang === 'ar' ? 'Arabic' : 'Hebrew'}`
    console.log('[analyze-brand] prompt:', prompt)

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 500,
        system:
          'You are a creative brand identity AI for an Arabic/Hebrew RTL ecommerce platform. Always respond in JSON only, no markdown, no explanation.',
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    console.log('Anthropic status:', res.status)
    const rawText = await res.text()
    console.log('Anthropic raw response:', rawText)

    if (!res.ok) {
      console.error('[analyze-brand] Anthropic API error:', res.status, rawText)
      return Response.json({ ...FALLBACKS[lang], _fallback: true })
    }

    const data = JSON.parse(rawText)
    console.log('Content blocks:', JSON.stringify(data.content, null, 2))

    const lastText: string = data.content?.filter((b: { type: string }) => b.type === 'text').at(-1)?.text ?? ''
    console.log('Extracted text:', lastText)

    const parsed = extractJson(lastText)
    console.log('Final result:', parsed)

    if (!parsed || !parsed.slogan || !Array.isArray(parsed.colors) || parsed.colors.length < 3) {
      console.warn('[analyze-brand] validation failed, using fallback')
      return Response.json({ ...FALLBACKS[lang], storeName: brandName || FALLBACKS[lang].storeName, _fallback: true })
    }

    parsed.storeName = brandName || parsed.storeName
    return Response.json(parsed)
  } catch (err) {
    console.error('[analyze-brand] caught error:', err)
    return Response.json({ ...FALLBACKS[lang], _fallback: true })
  }
}
