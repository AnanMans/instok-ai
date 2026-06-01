import { getTextColor, getDarkVariant } from '@/lib/storePreview'
import type { TemplateProps } from './types'

const FB = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop'

export default function TechTemplate({ storeName, slogan, colors, lang, logoUrl, products }: TemplateProps) {
  const ar = lang === 'ar'
  const c0 = colors[0] ?? '#3b82f6'
  const c1 = colors[1] ?? '#1e40af'
  const c2 = colors[2] ?? '#0f172a'
  const navBg = getDarkVariant(c0)
  const navText = getTextColor(navBg)
  const ctaText = getTextColor(c0)
  const darkCard = getDarkVariant(c0)
  const darkCardText = getTextColor(darkCard)
  const heroText = getTextColor(c0)
  const darkPrice = getTextColor(darkCard) !== getTextColor(c0) ? c0 : c1
  const nameSz = storeName.length > 12 ? '20px' : storeName.length > 8 ? '26px' : '32px'
  const prods = products.length > 0 ? products : [
    { name: ar ? 'منتج تقني' : 'מוצר טכנולוגי', price: 299, image_url: FB },
    { name: ar ? 'منتج ثاني' : 'מוצר שני', price: 499, image_url: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=400&fit=crop' },
  ]

  return (
    <div dir="rtl" style={{ height: 'auto', background: navBg, color: navText, display: 'flex', flexDirection: 'column' }}>
      {/* Status */}
      <div style={{ height: '24px', background: navBg, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', flexShrink: 0 }}>
        <span style={{ fontSize: '12px', color: navText, opacity: 0.5 }}>9:41</span>
        <span style={{ fontSize: '12px', color: navText, opacity: 0.5 }}>●●●</span>
      </div>

      {/* Nav */}
      <div style={{ height: '56px', background: navBg, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', borderBottom: `1px solid ${c0}20`, flexShrink: 0 }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: `linear-gradient(135deg, ${c0}, ${c1})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden', boxShadow: `0 0 10px ${c0}50` }}>
          {logoUrl ? <img src={logoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : <span style={{ fontSize: '15px', fontWeight: 800, color: ctaText, fontFamily: 'monospace' }}>{(storeName[0] ?? '?').toUpperCase()}</span>}
        </div>
        <span style={{ fontSize: nameSz, fontWeight: 700, color: navText, fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '55%' }}>{storeName}</span>
        <div style={{ background: '#1e3a8a', borderRadius: '4px', padding: '4px 8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#93c5fd', fontFamily: 'monospace' }}>v2.0</span>
        </div>
      </div>

      {/* Hero */}
      <div style={{ background: `linear-gradient(160deg, ${getDarkVariant(c0)}, ${getDarkVariant(c1)})`, padding: '28px 20px 24px', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
        <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '55%', background: `${c0}08`, clipPath: 'polygon(20% 0,100% 0,100% 100%,0% 100%)', pointerEvents: 'none' }} />
        <div style={{ fontSize: '12px', color: c0, letterSpacing: '0.12em', fontFamily: 'monospace', marginBottom: '12px', position: 'relative', zIndex: 1 }}>
          {'// '}{ar ? 'التقنية الجديدة' : 'טכנולוגיה חדשה'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', position: 'relative', zIndex: 1, flexWrap: 'wrap' }}>
          <span style={{ fontSize: nameSz, fontWeight: 800, color: heroText, fontFamily: 'monospace', wordBreak: 'break-word' }}>{storeName}</span>
          <div style={{ background: '#ef4444', borderRadius: '4px', padding: '2px 8px', flexShrink: 0 }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#fff' }}>{ar ? 'جديد' : 'חדש'}</span>
          </div>
        </div>
        {slogan && <div style={{ fontSize: '12px', color: `${c0}80`, fontFamily: 'monospace', marginBottom: '10px', position: 'relative', zIndex: 1 }}>{slogan}</div>}
        <div style={{ fontSize: '12px', color: c0, fontFamily: 'monospace', marginBottom: '18px', position: 'relative', zIndex: 1, letterSpacing: '0.04em' }}>
          {ar ? '• 4K  • ذكاء اصطناعي  • سريع' : '• 4K  • AI  • מהיר'}
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', background: c0, borderRadius: '6px', padding: '10px 20px', position: 'relative', zIndex: 1, boxShadow: `0 4px 16px ${c0}40` }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: ctaText, fontFamily: 'monospace' }}>{ar ? 'استكشف →' : 'גלה עוד →'}</span>
        </div>
      </div>

      {/* Products */}
      <div style={{ flex: 1, minWidth: 0, background: darkCard, padding: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {prods.map((p, i) => (
          <div key={i} style={{ background: `${c0}18`, borderRadius: '10px', overflow: 'hidden', border: `1px solid ${c0}20`, display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '1', overflow: 'hidden' }}>
              <img src={p.image_url || FB} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} alt="" />
              <div style={{ position: 'absolute', top: '6px', left: '6px', background: c0, borderRadius: '4px', padding: '2px 8px' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: ctaText }}>{ar ? 'مميز' : 'מיוחד'}</span>
              </div>
            </div>
            <div style={{ padding: '6px 8px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: darkCardText, fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: darkPrice }}>₪{p.price}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Feature pills */}
      <div style={{ background: navBg, borderTop: `1px solid ${c0}15`, padding: '12px 16px', display: 'flex', gap: '8px', flexShrink: 0 }}>
        {[ar ? '⚡ سريع' : '⚡ מהיר', ar ? '🔒 آمن' : '🔒 מאובטח', ar ? '✓ ضمان' : '✓ אחריות'].map((tag, i) => (
          <div key={i} style={{ flex: 1, background: `${c0}12`, border: `1px solid ${c0}20`, borderRadius: '6px', padding: '8px 4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '11px', color: c0, textAlign: 'center' }}>{tag}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
