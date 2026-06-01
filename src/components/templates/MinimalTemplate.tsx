import { getTextColor, getDarkVariant } from '@/lib/storePreview'
import type { TemplateProps } from './types'

const FB = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop'

export default function MinimalTemplate({ storeName, slogan, colors, lang, logoUrl, products }: TemplateProps) {
  const ar = lang === 'ar'
  const c0 = colors[0] ?? '#374151'
  const c1 = colors[1] ?? '#6b7280'
  const c2 = colors[2] ?? '#f9fafb'
  const navBg = getDarkVariant(c0)
  const navText = getTextColor(navBg)
  const nameSz = storeName.length > 14 ? '18px' : storeName.length > 10 ? '22px' : '28px'
  const prods = products.length > 0 ? products : [
    { name: ar ? 'منتج أنيق' : 'מוצר אלגנטי', price: 199, image_url: FB },
    { name: ar ? 'منتج ثاني' : 'מוצר שני', price: 249, image_url: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop' },
  ]

  return (
    <div dir="rtl" style={{ minHeight: '100vh', background: '#fff', color: '#111', display: 'flex', flexDirection: 'column' }}>
      {/* Status */}
      <div style={{ height: '24px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', flexShrink: 0 }}>
        <span style={{ fontSize: '12px', color: '#aaa' }}>9:41</span>
        <span style={{ fontSize: '12px', color: '#aaa' }}>●●●</span>
      </div>

      {/* Nav */}
      <div style={{ height: '56px', background: navBg, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', borderBottom: `1px solid ${c0}20`, flexShrink: 0 }}>
        <div style={{ width: '34px', height: '34px', borderRadius: '4px', background: `linear-gradient(135deg, ${c0}, ${c1})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
          {logoUrl ? <img src={logoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : <span style={{ fontSize: '14px', fontWeight: 800, color: '#fff' }}>{(storeName[0] ?? '?').toUpperCase()}</span>}
        </div>
        <span style={{ fontSize: nameSz, fontWeight: 500, color: navText, letterSpacing: '0.05em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '60%' }}>{storeName}</span>
        <span style={{ fontSize: '18px', color: navText, opacity: 0.4 }}>≡</span>
      </div>

      {/* Hero */}
      <div style={{ background: `${c0}08`, padding: '44px 24px 36px', textAlign: 'center', flexShrink: 0, borderBottom: '1px solid #efefef' }}>
        <div style={{ fontSize: '12px', color: '#999', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '14px' }}>
          {ar ? 'مجموعة جديدة' : 'קולקציה חדשה'}
        </div>
        <div style={{ fontSize: nameSz, fontWeight: 300, color: '#111', marginBottom: '8px', letterSpacing: '-0.01em', wordBreak: 'break-word' }}>{storeName}</div>
        <div style={{ width: '32px', height: '1px', background: '#ddd', margin: '0 auto 16px' }} />
        {slogan && <div style={{ fontSize: '13px', color: '#aaa', fontWeight: 300, marginBottom: '24px' }}>{slogan}</div>}
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${c0}`, padding: '10px 24px' }}>
          <span style={{ fontSize: '12px', fontWeight: 500, color: c0, letterSpacing: '0.1em' }}>{ar ? 'عرض المنتجات' : 'VIEW PRODUCTS'}</span>
        </div>
      </div>

      {/* Products */}
      <div style={{ flex: 1, minWidth: 0, background: '#fafafa', padding: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {prods.map((p, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: '4px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ overflow: 'hidden', height: '140px' }}>
              <img src={p.image_url || FB} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} alt="" />
            </div>
            <div style={{ padding: '8px 10px' }}>
              <div style={{ fontSize: '12px', fontWeight: 500, color: '#777', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: c0 }}>₪{p.price}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer nav */}
      <div style={{ background: '#fff', borderTop: '1px solid #f0f0f0', padding: '14px 20px', display: 'flex', justifyContent: 'center', gap: '32px', flexShrink: 0 }}>
        {[ar ? 'الرئيسية' : 'בית', ar ? 'المتجر' : 'חנות', ar ? 'حساب' : 'פרופיל'].map((label, i) => (
          <span key={i} style={{ fontSize: '12px', color: i === 0 ? c0 : '#ccc', fontWeight: i === 0 ? 600 : 400, borderBottom: i === 0 ? `2px solid ${c0}` : 'none', paddingBottom: '2px' }}>{label}</span>
        ))}
      </div>
    </div>
  )
}
