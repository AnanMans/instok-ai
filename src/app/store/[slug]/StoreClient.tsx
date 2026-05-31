'use client'

import { useState } from 'react'
import { Cairo, Heebo } from 'next/font/google'

const cairo = Cairo({ subsets: ['arabic'], display: 'swap', weight: ['400', '500', '600', '700'] })
const heebo = Heebo({ subsets: ['hebrew', 'latin'], display: 'swap', weight: ['400', '500', '600', '700'] })

type Store = {
  id: string
  name: string
  slogan: string
  colors: string[]
  archetype: string
  whatsapp_number: string
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

function getHeroStyles(archetype: string, colors: string[]) {
  const c0 = colors[0] ?? '#7c3aed'
  const c1 = colors[1] ?? '#f59e0b'
  switch (archetype) {
    case 'luxury':
      return { background: `linear-gradient(160deg, #050505, ${c0}22, #0d0a00)`, color: c0, accent: c0 }
    case 'gaming':
      return { background: `linear-gradient(135deg, #050510, #0d002a)`, color: c0, accent: c0 }
    case 'beauty':
      return { background: `linear-gradient(135deg, #0a0505, ${c0}44)`, color: c0, accent: c0 }
    case 'streetwear':
      return { background: `linear-gradient(135deg, #0a0a0a, ${c0}22, #1a0a2e)`, color: '#fff', accent: c0 }
    case 'minimal':
      return { background: `linear-gradient(135deg, #0a0a0a, ${c0}22)`, color: c0, accent: c0 }
    case 'restaurant':
      return { background: `linear-gradient(135deg, #1a0800, #2d0f00)`, color: '#f97316', accent: '#f97316' }
    case 'tech':
      return { background: `linear-gradient(135deg, #000814, #001233)`, color: c0, accent: c0 }
    case 'creator':
      return { background: `linear-gradient(135deg, #0f0a1e, ${c1}22)`, color: c0, accent: c0 }
    default:
      return { background: '#080808', color: '#fff', accent: c0 }
  }
}

export default function StoreClient({ store, products }: { store: Store; products: Product[] }) {
  const lang = (store.lang ?? 'ar') as 'ar' | 'he'
  const fontClass = lang === 'he' ? heebo.className : cairo.className
  const colors = Array.isArray(store.colors) ? store.colors : ['#7c3aed', '#f59e0b', '#0f172a']
  const c0 = colors[0] ?? '#7c3aed'
  const KNOWN_ARCHETYPES = ['luxury', 'gaming', 'beauty', 'streetwear', 'restaurant', 'tech', 'minimal', 'creator']
  const archetype = KNOWN_ARCHETYPES.includes(store.archetype ?? '') ? (store.archetype ?? 'minimal') : 'minimal'

  const hero = getHeroStyles(archetype, colors)
  const isDark = true

  const [cartCount, setCartCount] = useState(0)
  const [drawerProduct, setDrawerProduct] = useState<Product | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const openDrawer = (p: Product) => { setDrawerProduct(p); setDrawerOpen(true) }
  const closeDrawer = () => setDrawerOpen(false)

  const waNumber = store.whatsapp_number?.replace(/\D/g, '') ?? ''
  const storeLink = `instok-ai.vercel.app/store/${store.id}`

  const makeWaLink = (p: Product) => {
    const text = lang === 'ar'
      ? `مرحباً، أريد طلب: ${p.name} — ₪${p.price} | ${storeLink}`
      : `היי, אני רוצה להזמין: ${p.name} — ₪${p.price} | ${storeLink}`
    return `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`
  }

  const navBg = 'rgba(0,0,0,0.85)'
  const navText = '#fff'
  const cardBg = '#111'
  const cardText = '#fff'
  const cardSub = 'rgba(255,255,255,0.45)'
  const pageBg = '#0a0a0a'

  const paymentMethods = store.payment_methods ? store.payment_methods.split(',').map(s => s.trim()).filter(Boolean) : []
  const imgFallback = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop'

  return (
    <div dir="rtl" className={fontClass} style={{ minHeight: '100vh', background: pageBg, overflowX: 'hidden', maxWidth: '100%' }}>
      <style>{`
        *{box-sizing:border-box}
        body{margin:0;padding:0}
        @keyframes drawerUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
        .drawer-open{animation:drawerUp 0.28s cubic-bezier(0.32,0.72,0,1) forwards}
      `}</style>

      {/* Navbar */}
      <nav dir="rtl" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: navBg, backdropFilter: 'blur(12px)', borderBottom: 'rgba(255,255,255,0.06)', padding: '0 16px', height: '56px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', direction: 'rtl' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: `linear-gradient(135deg,${c0},${colors[1] ?? '#f59e0b'})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: '14px', fontWeight: 800, color: '#fff' }}>{(store.name?.[0] ?? '?').toUpperCase()}</span>
          </div>
          <span style={{ fontSize: '15px', fontWeight: 700, color: navText }}>{store.name}</span>
        </div>
        <div style={{ position: 'relative' }}>
          <span style={{ fontSize: '22px', cursor: 'pointer' }}>🛒</span>
          {cartCount > 0 && (
            <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: c0, color: '#fff', fontSize: '9px', fontWeight: 800, width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cartCount}</span>
          )}
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background: hero.background, padding: '76px 20px 20px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {archetype === 'gaming' && (
          <div style={{ position: 'absolute', inset: 0, background: `repeating-linear-gradient(0deg,transparent,transparent 20px,${c0}08 20px,${c0}08 21px)`, pointerEvents: 'none' }} />
        )}
        <h1 style={{ fontSize: '22px', fontWeight: archetype === 'luxury' ? 200 : 800, color: hero.color, letterSpacing: archetype === 'luxury' ? '0.1em' : '-0.02em', textTransform: archetype === 'luxury' ? 'uppercase' : 'none', marginBottom: '4px', position: 'relative' }}>
          {store.name}
        </h1>
        {store.slogan && (
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontStyle: archetype === 'luxury' ? 'italic' : 'normal', marginBottom: '10px', position: 'relative' }}>
            {store.slogan}
          </p>
        )}
        {archetype === 'luxury' && (
          <div style={{ width: '32px', height: '1px', background: c0, margin: '0 auto', opacity: 0.5 }} />
        )}
      </div>

      {/* Products or empty state */}
      <div style={{ padding: '16px', maxWidth: '600px', margin: '0 auto' }}>
        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 24px' }}>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>📦</div>
            <p style={{ fontSize: '17px', fontWeight: 700, color: 'rgba(255,255,255,0.85)', marginBottom: '8px' }}>
              {lang === 'ar' ? 'قريباً — المتجر يستعد للإطلاق' : 'בקרוב — החנות בהכנה'}
            </p>
            {waNumber && (
              <a
                href={`https://wa.me/${waNumber}?text=${encodeURIComponent(lang === 'ar' ? 'أريد التحديثات عن متجركم 📦' : 'אני רוצה עדכונים על החנות שלכם 📦')}`}
                target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '16px', background: '#22c55e', color: '#fff', borderRadius: '12px', padding: '10px 20px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>
                <span>💬</span>
                {lang === 'ar' ? 'تابعنا على واتساب للتحديثات' : 'עקבו אחרינו בוואטסאפ לעדכונים'}
              </a>
            )}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {products.map(p => (
              <div key={p.id}
                onClick={() => openDrawer(p)}
                style={{ background: cardBg, borderRadius: '16px', overflow: 'hidden', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 4px 20px rgba(0,0,0,0.3)', transition: 'transform 0.15s' }}>
                <div style={{ aspectRatio: '1', overflow: 'hidden', background: '#1a1a1a' }}>
                  <img
                    src={p.image_url || imgFallback}
                    alt={p.name}
                    onError={e => { (e.target as HTMLImageElement).src = imgFallback }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
                <div style={{ padding: '10px 12px' }}>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: cardText, marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                  <p style={{ fontSize: '15px', fontWeight: 700, color: c0 }}>₪{p.price}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: '24px 16px 40px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: '16px' }}>
        {paymentMethods.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginBottom: '16px' }}>
            {paymentMethods.includes('bit') && <span style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '4px 12px', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Bit</span>}
            {paymentMethods.includes('bank') && <span style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '4px 12px', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{lang === 'ar' ? 'تحويل بنكي' : 'העברה בנקאית'}</span>}
            {paymentMethods.includes('cash') && <span style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '4px 12px', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{lang === 'ar' ? 'دفع عند الاستلام' : 'תשלום במסירה'}</span>}
          </div>
        )}
        <a href="/" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', textDecoration: 'none' }}>
          {lang === 'ar' ? 'مدعوم بـ Instok.ai' : 'מופעל על ידי Instok.ai'}
        </a>
      </div>

      {/* Product drawer */}
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
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: cardText, marginBottom: '6px' }}>{drawerProduct.name}</h2>
              {drawerProduct.description && <p style={{ fontSize: '13px', color: cardSub, marginBottom: '12px', lineHeight: 1.6 }}>{drawerProduct.description}</p>}
              <p style={{ fontSize: '24px', fontWeight: 800, color: c0, marginBottom: '20px' }}>₪{drawerProduct.price}</p>
              {waNumber ? (
                <a href={makeWaLink(drawerProduct)}
                  onClick={() => setCartCount(n => n + 1)}
                  target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#22c55e', color: '#fff', borderRadius: '14px', padding: '15px 24px', fontSize: '15px', fontWeight: 700, textDecoration: 'none', width: '100%', boxShadow: '0 4px 20px rgba(34,197,94,0.35)' }}>
                  <span style={{ fontSize: '18px' }}>💬</span>
                  {lang === 'ar' ? 'اطلب عبر واتساب' : 'הזמן דרך וואטסאפ'}
                </a>
              ) : (
                <div style={{ background: '#1a1a1a', borderRadius: '14px', padding: '15px 24px', fontSize: '14px', color: cardSub, textAlign: 'center' }}>
                  {lang === 'ar' ? 'تواصل مع صاحب المتجر' : 'צור קשר עם בעל החנות'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
