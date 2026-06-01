import { getTextColor, getDarkVariant, getLightVariant } from '@/lib/storePreview'
import type { TemplateProps } from './types'

const FB = 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop'

export default function BeautyTemplate({ storeName, slogan, colors, lang, logoUrl, products }: TemplateProps) {
  const ar = lang === 'ar'
  const c0 = colors[0] ?? '#d4a4d0'
  const c1 = colors[1] ?? '#f0d4a8'
  const c2 = colors[2] ?? '#2d1b3d'
  const navBg = getDarkVariant(c0)
  const navText = getTextColor(navBg)
  const ctaText = getTextColor(c0)
  const lightBg = getLightVariant(c2)
  const lightCardText = getTextColor(lightBg)
  const lightPrice = getTextColor(lightBg) !== getTextColor(c0) ? c0 : c1
  const nameSz = storeName.length > 14 ? '18px' : storeName.length > 10 ? '22px' : '28px'
  const prods = products.length > 0 ? products : [
    { name: ar ? 'منتج تجميل' : 'מוצר יופי', price: 89, image_url: FB },
    { name: ar ? 'منتج ثاني' : 'מוצר שני', price: 129, image_url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop' },
  ]

  return (
    <div dir="rtl" style={{ minHeight: '100vh', background: lightBg, color: lightCardText, display: 'flex', flexDirection: 'column' }}>
      {/* Status */}
      <div style={{ height: '24px', background: lightBg, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', flexShrink: 0 }}>
        <span style={{ fontSize: '12px', color: lightCardText, opacity: 0.5 }}>9:41</span>
        <span style={{ fontSize: '12px', color: lightCardText, opacity: 0.5 }}>●●●</span>
      </div>

      {/* Nav */}
      <div style={{ height: '56px', background: navBg, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', borderBottom: `1px solid ${c0}30`, flexShrink: 0 }}>
        <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: `linear-gradient(135deg, ${c0}, ${c1})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
          {logoUrl ? <img src={logoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : <span style={{ fontSize: '16px', color: ctaText }}>✿</span>}
        </div>
        <span style={{ fontSize: nameSz, fontWeight: 700, color: navText, fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '60%' }}>{storeName}</span>
        <span style={{ fontSize: '14px', color: navText }}>✿</span>
      </div>

      {/* Hero */}
      <div style={{ background: `linear-gradient(160deg, ${c0}20, ${c1}15)`, padding: '32px 24px 28px', textAlign: 'center', flexShrink: 0 }}>
        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: `linear-gradient(135deg, ${c0}, ${c1})`, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 6px 24px ${c0}40`, overflow: 'hidden' }}>
          {logoUrl ? <img src={logoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} alt="" /> : <span style={{ fontSize: '24px', color: ctaText }}>✿</span>}
        </div>
        <div style={{ fontSize: nameSz, fontWeight: 700, color: getTextColor(c0), fontStyle: 'italic', marginBottom: '6px', wordBreak: 'break-word' }}>{storeName}</div>
        {slogan && <div style={{ fontSize: '13px', color: getTextColor(c0), opacity: 0.6, marginBottom: '16px', lineHeight: 1.5 }}>{slogan}</div>}
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(135deg, ${c0}, ${c1})`, borderRadius: '24px', padding: '10px 24px', boxShadow: `0 6px 16px ${c0}40` }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: ctaText }}>{ar ? 'تسوّقي الآن ✿' : 'קני עכשיו ✿'}</span>
        </div>
      </div>

      {/* Products */}
      <div style={{ flex: 1, background: lightBg, padding: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {prods.map((p, i) => (
          <div key={i} style={{ background: `${lightBg}cc`, borderRadius: '14px', overflow: 'hidden', border: `1px solid ${c0}20`, display: 'flex', flexDirection: 'column' }}>
            <div style={{ overflow: 'hidden', height: '140px' }}>
              <img src={p.image_url || FB} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} alt="" />
            </div>
            <div style={{ padding: '8px 10px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: lightCardText, marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: lightPrice }}>₪{p.price}</div>
            </div>
          </div>
        ))}
      </div>

      {/* WA Footer */}
      <div style={{ background: '#22c55e', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexShrink: 0 }}>
        <span style={{ fontSize: '18px' }}>💬</span>
        <span style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>{ar ? 'اطلبي عبر واتساب' : 'הזמיני דרך וואטסאפ'}</span>
      </div>
    </div>
  )
}
