import { getTextColor, getDarkVariant, getLightVariant } from '@/lib/storePreview'
import type { TemplateProps } from './types'

const FB = 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400&h=400&fit=crop'

export default function CreatorTemplate({ storeName, slogan, colors, lang, logoUrl, products }: TemplateProps) {
  const ar = lang === 'ar'
  const c0 = colors[0] ?? '#7c3aed'
  const c1 = colors[1] ?? '#f59e0b'
  const c2 = colors[2] ?? '#0f172a'
  const navBg = getDarkVariant(c0)
  const navText = getTextColor(navBg)
  const ctaText = getTextColor(c0)
  const lightBg = getLightVariant(c2)
  const lightCardText = getTextColor(lightBg)
  const lightPrice = lightCardText !== getTextColor(c0) ? c0 : c1
  const nameSz = storeName.length > 14 ? '18px' : storeName.length > 10 ? '22px' : '28px'
  const prods = products.length > 0 ? products : [
    { name: ar ? 'منتج حصري' : 'מוצר בלעדי', price: 149, image_url: FB },
    { name: ar ? 'منتج ثاني' : 'מוצר שני', price: 199, image_url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&h=400&fit=crop' },
  ]

  return (
    <div dir="rtl" style={{ minHeight: '100vh', background: lightBg, color: lightCardText, display: 'flex', flexDirection: 'column' }}>
      {/* Status */}
      <div style={{ height: '24px', background: lightBg, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', flexShrink: 0 }}>
        <span style={{ fontSize: '12px', color: lightCardText, opacity: 0.5 }}>9:41</span>
        <span style={{ fontSize: '12px', color: lightCardText, opacity: 0.5 }}>●●●</span>
      </div>

      {/* Nav */}
      <div style={{ height: '56px', background: navBg, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', borderBottom: `1px solid ${c0}20`, flexShrink: 0 }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: `linear-gradient(135deg, ${c0}, ${c1})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
          {logoUrl ? <img src={logoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : <span style={{ fontSize: '15px', fontWeight: 700, color: ctaText }}>{(storeName[0] ?? '?').toUpperCase()}</span>}
        </div>
        <span style={{ fontSize: nameSz, fontWeight: 700, color: navText, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '60%' }}>{storeName}</span>
        <span style={{ fontSize: '14px', color: navText }}>✦</span>
      </div>

      {/* Hero */}
      <div style={{ background: `linear-gradient(160deg, ${c0}18, ${c1}12)`, padding: '32px 20px 28px', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
        <div style={{ position: 'absolute', top: '20px', right: '16px', width: '120px', height: '120px', background: c1, borderRadius: '50%', filter: 'blur(60px)', opacity: 0.2, pointerEvents: 'none' }} />
        <div style={{ fontSize: '13px', color: c0, marginBottom: '6px', fontWeight: 600, letterSpacing: '0.06em' }}>
          {ar ? `بقلم ${storeName}` : `של ${storeName}`}
        </div>
        <div style={{ fontSize: slogan ? '26px' : nameSz, fontWeight: 900, color: lightCardText, marginBottom: '6px', lineHeight: 1.1, wordBreak: 'break-word' }}>
          {slogan || storeName}
        </div>
        <div style={{ fontSize: '13px', color: lightCardText, opacity: 0.6, marginBottom: '20px' }}>
          {slogan ? storeName : (ar ? 'منتجات حصرية' : 'מוצרים בלעדיים')}
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', background: c0, borderRadius: '24px', padding: '10px 22px', boxShadow: `0 6px 20px ${c0}50` }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: ctaText }}>{ar ? 'تسوّق الآن ✦' : 'קנה עכשיו ✦'}</span>
        </div>
      </div>

      {/* Products */}
      <div style={{ flex: 1, minWidth: 0, background: lightBg, padding: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {prods.map((p, i) => (
          <div key={i} style={{ background: `${lightBg}ee`, borderRadius: '6px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', transform: i === 0 ? 'rotate(-1.5deg)' : 'rotate(1.5deg)', display: 'flex', flexDirection: 'column' }}>
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

      {/* Footer */}
      <div style={{ background: navBg, borderTop: `1px solid ${c0}20`, padding: '12px 16px', display: 'flex', gap: '10px', flexShrink: 0 }}>
        <div style={{ flex: 1, background: c0, borderRadius: '24px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: ctaText }}>+ {ar ? 'تابع' : 'עקוב'}</span>
        </div>
        <div style={{ flex: 1, border: `1px solid ${c0}`, borderRadius: '24px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '13px', color: navText, fontWeight: 600 }}>💬 {ar ? 'راسل' : 'שלח הודעה'}</span>
        </div>
      </div>
    </div>
  )
}
