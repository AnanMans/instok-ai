import { getTextColor, getDarkVariant } from '@/lib/storePreview'
import type { TemplateProps } from './types'

const FB = 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&h=400&fit=crop'

export default function GamingTemplate({ storeName, slogan, colors, lang, logoUrl, products }: TemplateProps) {
  const ar = lang === 'ar'
  const c0 = colors[0] ?? '#7c3aed'
  const c1 = colors[1] ?? '#f59e0b'
  const c2 = colors[2] ?? '#0f172a'
  const navBg = getDarkVariant(c0)
  const navText = getTextColor(navBg)
  const heroText = getTextColor(c0)
  const ctaText = getTextColor(c0)
  const darkCard = getDarkVariant(c0)
  const darkCardText = getTextColor(darkCard)
  const nameSz = storeName.length > 12 ? '20px' : storeName.length > 8 ? '26px' : '32px'
  const prods = products.length > 0 ? products : [
    { name: ar ? 'منتج رائج' : 'מוצר חם', price: 199, image_url: FB },
    { name: ar ? 'منتج ثاني' : 'מוצר שני', price: 299, image_url: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop' },
  ]

  return (
    <div dir="rtl" style={{ minHeight: '100vh', background: '#050510', color: '#fff', display: 'flex', flexDirection: 'column' }}>
      {/* Status */}
      <div style={{ height: '24px', background: '#050510', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', flexShrink: 0 }}>
        <span style={{ fontSize: '12px', color: navText, opacity: 0.7 }}>9:41</span>
        <span style={{ fontSize: '12px', color: navText, opacity: 0.7 }}>●●●</span>
      </div>

      {/* Nav */}
      <div style={{ height: '56px', background: navBg, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', borderBottom: `1px solid ${c0}60`, flexShrink: 0 }}>
        <span style={{ fontSize: '12px', color: '#0f0', background: 'rgba(0,255,0,0.1)', padding: '4px 10px', borderRadius: '4px', fontWeight: 700 }}>🔴 LIVE</span>
        <span style={{ fontSize: nameSz, fontWeight: 800, color: navText, textShadow: `0 0 10px ${c0}`, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '60%' }}>{storeName}</span>
      </div>

      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, #0d0020, ${c2}, ${c0}40)`, padding: '32px 16px 28px', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
        <div style={{ position: 'absolute', inset: 0, background: `repeating-linear-gradient(0deg,transparent,transparent 14px,${c0}08 14px,${c0}08 15px)` }} />
        <div style={{ fontSize: '12px', color: c0, letterSpacing: '0.15em', marginBottom: '8px', textTransform: 'uppercase', fontWeight: 700, position: 'relative', zIndex: 1 }}>
          {ar ? 'ارتقِ بمستواك' : 'עלה רמה'}
        </div>
        <div style={{ fontSize: nameSz, fontWeight: 900, color: heroText, marginBottom: '6px', textShadow: `0 0 20px ${c0}`, position: 'relative', zIndex: 1, wordBreak: 'break-word' }}>{storeName}</div>
        {slogan && <div style={{ fontSize: '13px', color: heroText, opacity: 0.5, marginBottom: '16px', position: 'relative', zIndex: 1 }}>{slogan}</div>}
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: c0, borderRadius: '6px', padding: '10px 20px', boxShadow: `0 0 16px ${c0}80`, position: 'relative', zIndex: 1 }}>
          <span style={{ fontSize: '13px', fontWeight: 800, color: ctaText }}>{ar ? 'العب الآن ▶' : 'שחק עכשיו ▶'}</span>
        </div>
      </div>

      {/* Products */}
      <div style={{ flex: 1, background: darkCard, padding: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {prods.map((p, i) => (
          <div key={i} style={{ background: `${c0}18`, borderRadius: '10px', overflow: 'hidden', border: `1px solid ${c0}30`, display: 'flex', flexDirection: 'column' }}>
            <div style={{ overflow: 'hidden', position: 'relative', height: '140px' }}>
              <img src={p.image_url || FB} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} alt="" />
              {i === 0 && (
                <div style={{ position: 'absolute', top: '6px', right: '6px', background: 'rgba(239,68,68,0.92)', borderRadius: '4px', padding: '2px 6px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#fff' }}>{ar ? '🔥 رائج' : '🔥 חם'}</span>
                </div>
              )}
            </div>
            <div style={{ padding: '8px 10px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: darkCardText, marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: c0, textShadow: `0 0 8px ${c0}80` }}>₪{p.price}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom nav */}
      <div style={{ background: darkCard, borderTop: `1px solid ${c0}25`, display: 'flex', flexShrink: 0 }}>
        {(['🏠', '🎮', '📦', '👤'] as const).map((icon, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 4px', borderRight: i < 3 ? `1px solid ${c0}15` : 'none' }}>
            <span style={{ fontSize: '20px' }}>{icon}</span>
            <div style={{ width: i === 0 ? '20px' : '0', height: '2px', background: c0, borderRadius: '1px', marginTop: '4px', boxShadow: i === 0 ? `0 0 6px ${c0}` : 'none' }} />
          </div>
        ))}
      </div>
    </div>
  )
}
