'use client'

import { useState } from 'react'
import { Cairo, Heebo } from 'next/font/google'

const cairo = Cairo({ subsets: ['arabic'], display: 'swap', weight: ['400', '500', '600', '700'] })
const heebo = Heebo({ subsets: ['hebrew', 'latin'], display: 'swap', weight: ['400', '500', '600', '700'] })

type Store = {
  id: string
  name: string
  slogan: string
  description?: string
  colors: string[]
  archetype: string
  whatsapp_number: string
  delivery_type?: string
  delivery_areas?: string
  lang?: string
  payment_methods?: string
}

type Product = {
  id: string
  name: string
  price: number
  image_url?: string
  description?: string
}

const ARCHETYPE_LABELS: Record<string, { ar: string; he: string }> = {
  luxury:     { ar: 'فاخر',     he: 'יוקרה' },
  gaming:     { ar: 'جيمنج',   he: 'גיימינג' },
  beauty:     { ar: 'جمال',    he: 'יופי' },
  streetwear: { ar: 'ستريت',   he: 'סטריט' },
  restaurant: { ar: 'مطعم',   he: 'מסעדה' },
  tech:       { ar: 'تقنية',   he: 'טק' },
  minimal:    { ar: 'مينيمال', he: 'מינימל' },
  creator:    { ar: 'إبداعي',  he: 'יצירתי' },
}

function getHeroBg(archetype: string, c0: string, c1: string) {
  switch (archetype) {
    case 'luxury':     return `linear-gradient(160deg, #050505 0%, ${c0}30 60%, #0d0a00 100%)`
    case 'gaming':     return `linear-gradient(135deg, #050510 0%, ${c0}40 100%)`
    case 'beauty':     return `linear-gradient(135deg, #0a0505 0%, ${c0}55 100%)`
    case 'streetwear': return `linear-gradient(160deg, #0a0a0a 0%, ${c0}30 70%, #1a0a2e 100%)`
    case 'minimal':    return `linear-gradient(135deg, #0a0a0a 0%, ${c0}25 100%)`
    case 'restaurant': return `linear-gradient(135deg, #1a0800 0%, ${c0}40 100%)`
    case 'tech':       return `linear-gradient(135deg, #000814 0%, ${c0}35 100%)`
    case 'creator':    return `linear-gradient(135deg, #0f0a1e 0%, ${c1}30 100%)`
    default:           return `linear-gradient(135deg, #0a0a0a 0%, ${c0}25 100%)`
  }
}

export default function StoreClient({ store, products }: { store: Store; products: Product[] }) {
  const lang = (store.lang ?? 'ar') as 'ar' | 'he'
  const fontClass = lang === 'he' ? heebo.className : cairo.className
  const ar = lang === 'ar'
  const colors = Array.isArray(store.colors) ? store.colors : ['#7c3aed', '#f59e0b', '#0f172a']
  const c0 = colors[0] ?? '#7c3aed'
  const c1 = colors[1] ?? '#f59e0b'
  const KNOWN = ['luxury', 'gaming', 'beauty', 'streetwear', 'restaurant', 'tech', 'minimal', 'creator']
  const archetype = KNOWN.includes(store.archetype ?? '') ? (store.archetype ?? 'minimal') : 'minimal'

  const heroBg = getHeroBg(archetype, c0, c1)
  const archetypeLabel = ARCHETYPE_LABELS[archetype]?.[lang] ?? archetype

  const [cartCount, setCartCount] = useState(0)
  const [drawerProduct, setDrawerProduct] = useState<Product | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const openDrawer = (p: Product) => { setDrawerProduct(p); setDrawerOpen(true) }
  const closeDrawer = () => setDrawerOpen(false)

  const waNumber = store.whatsapp_number
    ?.replace(/\D/g, '')
    ?.replace(/^0/, '972')
    ?? ''
  const waGeneralLink = waNumber
    ? `https://wa.me/${waNumber}?text=${encodeURIComponent(ar ? `مرحباً، أريد الاستفسار عن متجر ${store.name} 👋` : `היי, אני רוצה לשאול על החנות ${store.name} 👋`)}`
    : ''

  const makeWaLink = (p: Product) =>
    `https://wa.me/${waNumber}?text=${encodeURIComponent(ar
      ? `مرحباً، أريد طلب: ${p.name} — ₪${p.price}`
      : `היי, אני רוצה להזמין: ${p.name} — ₪${p.price}`)}`

  const paymentMethods = store.payment_methods
    ? store.payment_methods.split(',').map(s => s.trim()).filter(Boolean)
    : []

  const imgFallback = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop'

  const deliveryLabel = (type: string) => {
    const map: Record<string, { ar: string; he: string }> = {
      delivery: { ar: 'توصيل للباب',    he: 'משלוח עד הבית' },
      pickup:   { ar: 'استلام من المتجر', he: 'איסוף מהחנות' },
      both:     { ar: 'توصيل واستلام',   he: 'משלוח ואיסוף' },
    }
    return map[type]?.[lang] ?? type
  }

  return (
    <div dir="rtl" className={fontClass} style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', overflowX: 'hidden', paddingBottom: waNumber ? '80px' : '0' }}>
      <style>{`
        *{box-sizing:border-box}
        body{margin:0;padding:0}
        @keyframes drawerUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
        .drawer-open{animation:drawerUp 0.28s cubic-bezier(0.32,0.72,0,1) forwards}
        .prod-card:active{transform:scale(0.97)}
      `}</style>

      {/* ── Navbar ────────────────────────────────────────────── */}
      <nav dir="rtl" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 16px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: `linear-gradient(135deg,${c0},${c1})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: '14px', fontWeight: 800, color: '#fff' }}>{(store.name?.[0] ?? '?').toUpperCase()}</span>
          </div>
          <span style={{ fontSize: '15px', fontWeight: 700 }}>{store.name}</span>
        </div>
        <div style={{ position: 'relative' }}>
          <span style={{ fontSize: '22px', cursor: 'pointer' }}>🛒</span>
          {cartCount > 0 && (
            <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: c0, color: '#fff', fontSize: '9px', fontWeight: 800, width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cartCount}</span>
          )}
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <div id="hero" style={{ background: heroBg, paddingTop: '56px', paddingBottom: '0', position: 'relative', overflow: 'hidden' }}>
        {archetype === 'gaming' && (
          <div style={{ position: 'absolute', inset: 0, background: `repeating-linear-gradient(0deg,transparent,transparent 24px,${c0}08 24px,${c0}08 25px)`, pointerEvents: 'none' }} />
        )}
        <div style={{ padding: '40px 24px 36px', textAlign: 'center', position: 'relative' }}>
          {/* Store name */}
          <h1 style={{
            fontSize: '32px',
            fontWeight: archetype === 'luxury' ? 300 : 800,
            color: archetype === 'luxury' ? c0 : '#fff',
            letterSpacing: archetype === 'luxury' ? '0.12em' : '-0.02em',
            textTransform: archetype === 'luxury' ? 'uppercase' : 'none',
            marginBottom: '10px',
            lineHeight: 1.2,
            wordBreak: 'break-word',
          }}>
            {store.name}
          </h1>

          {/* Slogan */}
          {store.slogan && (
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '28px', fontStyle: archetype === 'luxury' ? 'italic' : 'normal', lineHeight: 1.5 }}>
              {store.slogan}
            </p>
          )}

          {/* Scroll CTA */}
          <a href="#products" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: c0, color: '#fff', borderRadius: '14px', padding: '12px 24px', fontSize: '14px', fontWeight: 700, textDecoration: 'none', boxShadow: `0 4px 24px ${c0}55` }}>
            {ar ? 'تسوّق الآن ↓' : 'קנה עכשיו ↓'}
          </a>
        </div>

        {/* Bottom fade into page bg */}
        <div style={{ height: '40px', background: 'linear-gradient(to bottom, transparent, #0a0a0a)' }} />
      </div>

      {/* ── About ─────────────────────────────────────────────── */}
      {store.description && (
        <div style={{ padding: '0 16px', maxWidth: '600px', margin: '0 auto 16px' }}>
          <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '16px 18px' }}>
            <p style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginBottom: '8px', letterSpacing: '0.06em' }}>
              {ar ? 'نبذة عنّا' : 'עלינו'}
            </p>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7 }}>{store.description}</p>
          </div>
        </div>
      )}

      {/* ── Products ──────────────────────────────────────────── */}
      <div id="products" style={{ padding: '0 16px', maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: '14px', letterSpacing: '0.04em' }}>
          {ar ? 'المنتجات' : 'מוצרים'}
        </h2>

        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 24px', background: '#111', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '24px' }}>
            <div style={{ fontSize: '52px', marginBottom: '14px' }}>📦</div>
            <p style={{ fontSize: '16px', fontWeight: 700, color: 'rgba(255,255,255,0.8)', marginBottom: '6px' }}>
              {ar ? 'قريباً — المتجر يستعد للإطلاق' : 'בקרוב — החנות בהכנה'}
            </p>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>
              {ar ? 'تابعونا للتحديثات' : 'עקבו אחרינו לעדכונים'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '32px' }}>
            {products.map(p => (
              <div key={p.id} className="prod-card"
                onClick={() => openDrawer(p)}
                style={{ background: '#111', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 4px 20px rgba(0,0,0,0.3)', transition: 'transform 0.15s' }}>
                <div style={{ aspectRatio: '1', overflow: 'hidden', background: '#1a1a1a' }}>
                  <img
                    src={p.image_url || imgFallback}
                    alt={p.name}
                    onError={e => { (e.target as HTMLImageElement).src = imgFallback }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
                <div style={{ padding: '10px 12px' }}>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#fff', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                  <p style={{ fontSize: '15px', fontWeight: 700, color: c0 }}>₪{p.price}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Store info ────────────────────────────────────────── */}
      <div style={{ padding: '0 16px 40px', maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>

        {/* Delivery */}
        {(store.delivery_type || store.delivery_areas) && (
          <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '16px 18px' }}>
            <p style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginBottom: '8px', letterSpacing: '0.06em' }}>
              {ar ? 'التوصيل' : 'משלוח'}
            </p>
            {store.delivery_type && (
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: store.delivery_areas ? '4px' : '0' }}>
                🚚 {deliveryLabel(store.delivery_type)}
              </p>
            )}
            {store.delivery_areas && (
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{store.delivery_areas}</p>
            )}
          </div>
        )}

        {/* Payment methods */}
        {paymentMethods.length > 0 && (
          <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '16px 18px' }}>
            <p style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginBottom: '10px', letterSpacing: '0.06em' }}>
              {ar ? 'طرق الدفع' : 'אמצעי תשלום'}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {paymentMethods.includes('bit') && (
                <span style={{ background: `${c0}18`, border: `1px solid ${c0}33`, borderRadius: '20px', padding: '5px 14px', fontSize: '13px', fontWeight: 600, color: c0 }}>💜 Bit</span>
              )}
              {paymentMethods.includes('bank') && (
                <span style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '5px 14px', fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>
                  🏦 {ar ? 'تحويل بنكي' : 'העברה בנקאית'}
                </span>
              )}
              {paymentMethods.includes('cash') && (
                <span style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '5px 14px', fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>
                  💵 {ar ? 'دفع عند الاستلام' : 'תשלום במסירה'}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Powered by */}
        <div style={{ textAlign: 'center', paddingTop: '8px', display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <a href="/" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.18)', textDecoration: 'none' }}>
            {ar ? 'مدعوم بـ Instok.ai' : 'מופעל על ידי Instok.ai'}
          </a>
          <a href="/policy" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.18)', textDecoration: 'none' }}>
            {ar ? 'سياسة الخصوصية' : 'מדיניות פרטיות'}
          </a>
        </div>
      </div>

      {/* ── Sticky WhatsApp button ─────────────────────────────── */}
      {waNumber && (
        <a
          href={waGeneralLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{ position: 'fixed', bottom: '16px', left: '50%', transform: 'translateX(-50%)', zIndex: 40, display: 'flex', alignItems: 'center', gap: '8px', background: '#22c55e', color: '#fff', borderRadius: '50px', padding: '14px 28px', fontSize: '15px', fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 24px rgba(34,197,94,0.45)', whiteSpace: 'nowrap' }}>
          <span style={{ fontSize: '18px' }}>💬</span>
          {ar ? 'تواصل عبر واتساب' : 'צור קשר בוואטסאפ'}
        </a>
      )}

      {/* ── Product drawer ─────────────────────────────────────── */}
      {drawerOpen && drawerProduct && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100 }}>
          <div onClick={closeDrawer} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)' }} />
          <div className="drawer-open" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#111', borderRadius: '24px 24px 0 0', padding: '0 0 40px', maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ width: '36px', height: '4px', background: 'rgba(255,255,255,0.15)', borderRadius: '2px', margin: '12px auto 0' }} />
            <div style={{ aspectRatio: '4/3', overflow: 'hidden', background: '#1a1a1a' }}>
              <img
                src={drawerProduct.image_url || imgFallback}
                alt={drawerProduct.name}
                onError={e => { (e.target as HTMLImageElement).src = imgFallback }}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
            <div style={{ padding: '20px 20px 0' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>{drawerProduct.name}</h2>
              {drawerProduct.description && (
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginBottom: '12px', lineHeight: 1.6 }}>{drawerProduct.description}</p>
              )}
              <p style={{ fontSize: '24px', fontWeight: 800, color: c0, marginBottom: '20px' }}>₪{drawerProduct.price}</p>
              {waNumber ? (
                <a href={makeWaLink(drawerProduct)}
                  onClick={() => setCartCount(n => n + 1)}
                  target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#22c55e', color: '#fff', borderRadius: '14px', padding: '15px 24px', fontSize: '15px', fontWeight: 700, textDecoration: 'none', width: '100%', boxShadow: '0 4px 20px rgba(34,197,94,0.35)' }}>
                  <span style={{ fontSize: '18px' }}>💬</span>
                  {ar ? 'اطلب عبر واتساب' : 'הזמן דרך וואטסאפ'}
                </a>
              ) : (
                <div style={{ background: '#1a1a1a', borderRadius: '14px', padding: '15px 24px', fontSize: '14px', color: 'rgba(255,255,255,0.45)', textAlign: 'center' }}>
                  {ar ? 'تواصل مع صاحب المتجر' : 'צור קשר עם בעל החנות'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
