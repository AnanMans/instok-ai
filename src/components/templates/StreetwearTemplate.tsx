import { getTextColor, getDarkVariant } from '@/lib/storePreview'
import type { TemplateProps } from './types'

const FB = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop'

export default function StreetwearTemplate({ storeName, slogan, colors, lang, logoUrl, products }: TemplateProps) {
  const ar = lang === 'ar'
  const c0 = colors[0] ?? '#ef4444'
  const c1 = colors[1] ?? '#fbbf24'
  const c2 = colors[2] ?? '#111827'
  const navBg = getDarkVariant(c0)
  const navText = getTextColor(navBg)
  const ctaText = getTextColor(c0)
  const heroTextColor = getTextColor(c2)
  const ctaBtnBg = heroTextColor
  const ctaBtnText = getTextColor(heroTextColor)
  const nameSz = storeName.length > 10 ? '32px' : storeName.length > 6 ? '44px' : '56px'
  const prods = products.length > 0 ? products : [
    { name: ar ? 'قطعة جديدة' : 'פריט חדש', price: 149, image_url: FB },
    { name: ar ? 'منتج ثاني' : 'מוצר שני', price: 199, image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop' },
  ]

  return (
    <div dir="rtl" style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', display: 'flex', flexDirection: 'column' }}>
      {/* Status */}
      <div style={{ height: '24px', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', flexShrink: 0 }}>
        <span style={{ fontSize: '12px', color: '#fff', opacity: 0.4 }}>9:41</span>
        <span style={{ fontSize: '12px', color: '#fff', opacity: 0.4 }}>●●●</span>
      </div>

      {/* Nav */}
      <div style={{ height: '56px', background: navBg, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', flexShrink: 0 }}>
        <span style={{ fontSize: storeName.length > 10 ? '15px' : '18px', color: navText, fontWeight: 900, letterSpacing: '0.05em', textTransform: 'uppercase', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '65%' }}>{storeName}</span>
        <div style={{ width: '36px', height: '36px', borderRadius: '4px', background: `linear-gradient(135deg, ${c0}, ${c1})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
          {logoUrl ? <img src={logoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : <span style={{ fontSize: '15px', fontWeight: 800, color: ctaText }}>{(storeName[0] ?? '?').toUpperCase()}</span>}
        </div>
      </div>

      {/* Hero */}
      <div style={{ background: c2, padding: '28px 20px 24px', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
        <div style={{ position: 'absolute', top: '-16px', right: '-16px', width: '120px', height: '120px', background: c0, opacity: 0.15, borderRadius: '50%' }} />
        <div style={{ fontSize: '11px', color: heroTextColor, opacity: 0.55, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 600 }}>DROP 001</div>
        <div style={{ fontSize: nameSz, fontWeight: 900, color: heroTextColor, lineHeight: 1.0, letterSpacing: '-0.02em', textTransform: 'uppercase', marginBottom: '10px', wordBreak: 'break-word' }}>
          {storeName}
        </div>
        {slogan && <div style={{ fontSize: '12px', color: heroTextColor, opacity: 0.5, marginBottom: '16px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{slogan}</div>}
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: ctaBtnBg, padding: '10px 20px' }}>
          <span style={{ fontSize: '12px', fontWeight: 900, color: ctaBtnText, letterSpacing: '0.08em' }}>{ar ? 'تسوّق الجديد →' : 'קנה את החדש →'}</span>
        </div>
      </div>

      {/* Products */}
      <div style={{ flex: 1, minWidth: 0, background: '#111', padding: '8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
        {prods.map((p, i) => (
          <div key={i} style={{ background: '#111', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ overflow: 'hidden', position: 'relative', height: '160px' }}>
              <img src={p.image_url || FB} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} alt="" />
              <div style={{ position: 'absolute', inset: 0, background: `${[c0, c1][i]}20` }} />
            </div>
            <div style={{ padding: '8px 6px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#fff', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: [c0, c1][i] }}>₪{p.price}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Notification strip */}
      <div style={{ background: '#0a0a0a', borderTop: `1px solid ${c0}30`, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        <span style={{ fontSize: '16px' }}>🔔</span>
        <span style={{ flex: 1, fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{ar ? 'تنبيه الدروب القادم' : 'התראת דרופ הבא'}</span>
        <div style={{ background: c0, borderRadius: '4px', padding: '6px 14px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: ctaText }}>{ar ? 'سجّل' : 'הרשם'}</span>
        </div>
      </div>
    </div>
  )
}
