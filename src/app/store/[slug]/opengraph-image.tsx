import { ImageResponse } from 'next/og'
import { createClient } from '@supabase/supabase-js'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: store } = await supabase
    .from('stores')
    .select('name, slogan, colors, lang')
    .eq('slug', slug)
    .single()

  const name = store?.name ?? 'Instok Store'
  const slogan = store?.slogan ?? ''
  const colors = Array.isArray(store?.colors) ? store.colors : ['#7c3aed', '#4f46e5']
  const c0 = colors[0] ?? '#7c3aed'
  const c1 = colors[1] ?? '#4f46e5'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(135deg, ${c0} 0%, ${c1} 100%)`,
        }}
      >
        {/* dark overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.40)',
            display: 'flex',
          }}
        />

        {/* content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 80px',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          <div
            style={{
              fontSize: name.length > 20 ? '64px' : name.length > 12 ? '80px' : '96px',
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: 1.05,
              marginBottom: '24px',
              display: 'flex',
              textAlign: 'center',
            }}
          >
            {name}
          </div>

          {slogan ? (
            <div
              style={{
                fontSize: '34px',
                color: 'rgba(255,255,255,0.7)',
                marginBottom: '48px',
                textAlign: 'center',
                display: 'flex',
              }}
            >
              {slogan}
            </div>
          ) : (
            <div style={{ marginBottom: '48px', display: 'flex' }} />
          )}

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(255,255,255,0.18)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '50px',
              padding: '12px 32px',
            }}
          >
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#ffffff', display: 'flex' }}>
              Instok.ai
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
