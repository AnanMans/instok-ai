import { getTextColor, getDarkVariant } from '@/lib/storePreview'
import type { TemplateProps } from './types'

const FB = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop'

export default function LuxuryTemplate({ storeName, slogan, colors, lang, logoUrl, products }: TemplateProps) {
  const ar = lang === 'ar'
  const c0 = colors[0] ?? '#c9a96e'
  const navText = getTextColor(getDarkVariant(c0))
  const darkCard = getDarkVariant(c0)
  const darkCardText = getTextColor(darkCard)
  const nameSz = storeName.length > 14 ? '18px' : storeName.length > 10 ? '24px' : '32px'
  const prods = products.length > 0 ? products : [
    { name: ar ? 'منتج مميز' : 'מוצר בלעדי', price: 299, image_url: FB },
    { name: ar ? 'منتج ثاني' : 'מוצר שני', price: 499, image_url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop' },
  ]

  return (
    <div dir="rtl" style={{ height: 'auto', background: '#050505', color: c0, display: 'flex', flexDirection: 'column' }}>
      {/* Status */}
      <div style={{ height: '24px', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', flexShrink: 0 }}>
        <span style={{ fontSize: '12px', color: c0, opacity: 0.4 }}>9:41</span>
        <span style={{ fontSize: '12px', color: c0, opacity: 0.4 }}>●●●</span>
      </div>

      {/* Nav */}
      <div style={{ height: '56px', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: `1px solid ${c0}18`, flexShrink: 0 }}>
        <span style={{ fontSize: storeName.length > 12 ? '13px' : '16px', fontWeight: 300, color: c0, letterSpacing: '4px', textTransform: 'uppercase', opacity: 0.85, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80%' }}>
          {storeName}
        </span>
      </div>

      {/* Hero */}
      <div style={{ background: `linear-gradient(160deg, #0d0d0d, ${getDarkVariant(c0)})`, padding: '40px 24px 28px', textAlign: 'center', flexShrink: 0 }}>
        <div style={{ width: '40px', height: '1px', background: c0, margin: '0 auto 20px', opacity: 0.45 }} />
        <div style={{ fontSize: nameSz, fontWeight: 200, color: c0, letterSpacing: '0.06em', lineHeight: 1.3, textTransform: 'uppercase', marginBottom: '16px', wordBreak: 'break-word' }}>
          {storeName}
        </div>
        <div style={{ width: '60px', height: '1px', background: c0, margin: '0 auto 16px', opacity: 0.35 }} />
        {slogan && (
          <div style={{ fontSize: '13px', color: c0, fontStyle: 'italic', fontWeight: 300, opacity: 0.45, letterSpacing: '0.04em' }}>{slogan}</div>
        )}
      </div>

      {/* Products — 2-column grid */}
      <div style={{ flex: 1, minWidth: 0, background: '#0a0a0a', padding: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', alignContent: 'start' }}>
        {prods.map((p, i) => (
          <div key={i} style={{ background: `${c0}08`, border: `1px solid ${c0}15`, overflow: 'hidden' }}>
            <div style={{ width: '100%', aspectRatio: '1', overflow: 'hidden' }}>
              <img src={p.image_url || FB} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} alt="" />
            </div>
            <div style={{ padding: '6px 8px', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: darkCardText, fontWeight: 300, letterSpacing: '0.1em', textTransform: 'uppercase', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: c0 }}>₪{p.price}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ background: '#050505', padding: '16px 20px', borderTop: `1px solid ${c0}12`, display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
        <span style={{ fontSize: '10px', color: c0, opacity: 0.3, letterSpacing: '6px', textTransform: 'uppercase' }}>
          {ar ? 'مجموعة ٢٠٢٦' : 'קולקציה 2026'}
        </span>
      </div>
    </div>
  )
}
