import { getTextColor, getDarkVariant } from '@/lib/storePreview'
import type { TemplateProps } from './types'

const FB = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop'

export default function RestaurantTemplate({ storeName, slogan, colors, lang, logoUrl, products }: TemplateProps) {
  const ar = lang === 'ar'
  const c0 = colors[0] ?? '#d97706'
  const c1 = colors[1] ?? '#b45309'
  const c2 = colors[2] ?? '#1c1009'
  const navBg = getDarkVariant(c0)
  const navText = getTextColor(navBg)
  const ctaText = getTextColor(c0)
  const darkCard = getDarkVariant(c0)
  const darkCardText = getTextColor(darkCard)
  const nameSz = storeName.length > 14 ? '18px' : storeName.length > 10 ? '22px' : '28px'
  const prods = products.length > 0 ? products : [
    { name: ar ? 'طبق رئيسي' : 'מנה עיקרית', price: 65, image_url: FB },
    { name: ar ? 'طبق ثاني' : 'מנה שנייה', price: 45, image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop' },
  ]

  return (
    <div dir="rtl" style={{ height: 'auto', background: navBg, color: navText, display: 'flex', flexDirection: 'column' }}>
      {/* Status */}
      <div style={{ height: '24px', background: navBg, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', flexShrink: 0 }}>
        <span style={{ fontSize: '12px', color: navText, opacity: 0.6 }}>9:41</span>
        <span style={{ fontSize: '12px', color: navText, opacity: 0.6 }}>●●●</span>
      </div>

      {/* Nav */}
      <div style={{ height: '56px', background: navBg, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', borderBottom: `1px solid ${c0}30`, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>🍕</span>
          <span style={{ fontSize: nameSz, fontWeight: 700, color: navText, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>{storeName}</span>
        </div>
        <div style={{ background: '#22c55e', borderRadius: '6px', padding: '4px 10px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#fff' }}>30 min</span>
        </div>
      </div>

      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${getDarkVariant(c0)}, ${c0}55)`, padding: '24px 20px 20px', textAlign: 'center', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, transparent, ${c0}, transparent)` }} />
        <div style={{ fontSize: '36px', marginBottom: '10px' }}>🍽️</div>
        <div style={{ fontSize: nameSz, fontWeight: 800, color: c0, marginBottom: '4px', wordBreak: 'break-word' }}>{storeName}</div>
        {slogan && <div style={{ fontSize: '12px', color: `${c0}80`, marginBottom: '16px', fontStyle: 'italic' }}>{slogan}</div>}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <div style={{ background: '#22c55e', borderRadius: '20px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>🛵 {ar ? 'اطلب توصيل' : 'משלוח'}</span>
          </div>
          <div style={{ border: `1px solid ${c0}55`, borderRadius: '20px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ fontSize: '12px', color: c0, fontWeight: 600 }}>🏪 {ar ? 'استلام' : 'איסוף'}</span>
          </div>
        </div>
      </div>

      {/* Products — horizontal cards */}
      <div style={{ flex: 1, background: darkCard, padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {prods.map((p, i) => (
          <div key={i} style={{ background: `${c0}12`, borderRadius: '10px', overflow: 'hidden', border: `1px solid ${c0}18`, display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '80px', height: '80px', flexShrink: 0, overflow: 'hidden' }}>
              <img src={p.image_url || FB} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} alt="" />
            </div>
            <div style={{ padding: '10px 12px', flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: darkCardText, marginBottom: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: c0 }}>₪{p.price}</div>
            </div>
            <div style={{ padding: '0 12px' }}>
              <div style={{ width: '30px', height: '30px', background: c0, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '20px', color: ctaText, lineHeight: 1 }}>+</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ background: navBg, borderTop: `1px solid ${c0}20`, padding: '12px 20px', display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
        <span style={{ fontSize: '12px', color: navText, opacity: 0.45 }}>{ar ? 'الحد الأدنى للطلب: ₪50' : 'מינימום הזמנה: ₪50'}</span>
      </div>
    </div>
  )
}
