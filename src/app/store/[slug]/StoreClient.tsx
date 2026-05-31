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

const DEMO_PRODUCTS: Record<string, { ar: Product[]; he: Product[] }> = {
  luxury: {
    ar: [
      { id: 'd1', name: 'عطر فاخر',      price: 299,  image_url: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=400&h=400&fit=crop' },
      { id: 'd2', name: 'ساعة راقية',    price: 1499, image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop' },
      { id: 'd3', name: 'حقيبة جلد',     price: 899,  image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop' },
      { id: 'd4', name: 'إكسسوار ذهبي', price: 449,  image_url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop' },
    ],
    he: [
      { id: 'd1', name: 'בושם יוקרתי', price: 299,  image_url: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=400&h=400&fit=crop' },
      { id: 'd2', name: 'שעון יוקרה',  price: 1499, image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop' },
      { id: 'd3', name: 'תיק עור',     price: 899,  image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop' },
      { id: 'd4', name: 'תכשיט זהב',  price: 449,  image_url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop' },
    ],
  },
  gaming: {
    ar: [
      { id: 'd1', name: 'هيدسيت جيمنج', price: 399, image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop' },
      { id: 'd2', name: 'ماوس ليزر',    price: 199, image_url: 'https://images.unsplash.com/photo-1527864550417-7519fa1d6c37?w=400&h=400&fit=crop' },
      { id: 'd3', name: 'كرسي جيمنج',   price: 899, image_url: 'https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=400&h=400&fit=crop' },
      { id: 'd4', name: 'لوحة مضيئة',   price: 149, image_url: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&h=400&fit=crop' },
    ],
    he: [
      { id: 'd1', name: 'אוזניות גיימינג', price: 399, image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop' },
      { id: 'd2', name: 'עכבר לייזר',     price: 199, image_url: 'https://images.unsplash.com/photo-1527864550417-7519fa1d6c37?w=400&h=400&fit=crop' },
      { id: 'd3', name: 'כיסא גיימינג',   price: 899, image_url: 'https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=400&h=400&fit=crop' },
      { id: 'd4', name: 'מקלדת RGB',      price: 149, image_url: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&h=400&fit=crop' },
    ],
  },
  beauty: {
    ar: [
      { id: 'd1', name: 'كريم مرطب',  price: 89,  image_url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop' },
      { id: 'd2', name: 'أحمر شفاه',  price: 59,  image_url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop' },
      { id: 'd3', name: 'مكياج عيون', price: 79,  image_url: 'https://images.unsplash.com/photo-1512207736890-6ffed8a84e8d?w=400&h=400&fit=crop' },
      { id: 'd4', name: 'عطر نسائي',  price: 199, image_url: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=400&h=400&fit=crop' },
    ],
    he: [
      { id: 'd1', name: 'קרם לחות',    price: 89,  image_url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop' },
      { id: 'd2', name: 'שפתון',       price: 59,  image_url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop' },
      { id: 'd3', name: 'איפור עיניים', price: 79,  image_url: 'https://images.unsplash.com/photo-1512207736890-6ffed8a84e8d?w=400&h=400&fit=crop' },
      { id: 'd4', name: 'בושם נשי',    price: 199, image_url: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=400&h=400&fit=crop' },
    ],
  },
  streetwear: {
    ar: [
      { id: 'd1', name: 'هودي أوفرسايز',  price: 199, image_url: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&h=400&fit=crop' },
      { id: 'd2', name: 'تيشيرت بريميوم', price: 129, image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop' },
      { id: 'd3', name: 'بنطلون كارغو',   price: 249, image_url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=400&fit=crop' },
      { id: 'd4', name: 'سنيكر',          price: 399, image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop' },
    ],
    he: [
      { id: 'd1', name: 'הודי אוברסייז', price: 199, image_url: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&h=400&fit=crop' },
      { id: 'd2', name: 'טישרט פרמיום',  price: 129, image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop' },
      { id: 'd3', name: 'מכנסי קארגו',   price: 249, image_url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=400&fit=crop' },
      { id: 'd4', name: 'סניקר',         price: 399, image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop' },
    ],
  },
  restaurant: {
    ar: [
      { id: 'd1', name: 'بيتزا مارغريتا', price: 59, image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop' },
      { id: 'd2', name: 'برغر كلاسيك',    price: 49, image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop' },
      { id: 'd3', name: 'سلطة فريش',      price: 35, image_url: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=400&fit=crop' },
      { id: 'd4', name: 'كيك شوكولا',     price: 29, image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop' },
    ],
    he: [
      { id: 'd1', name: 'פיצה מרגריטה',   price: 59, image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop' },
      { id: 'd2', name: 'המבורגר קלאסי',  price: 49, image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop' },
      { id: 'd3', name: 'סלט טרי',         price: 35, image_url: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=400&fit=crop' },
      { id: 'd4', name: 'עוגת שוקולד',    price: 29, image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop' },
    ],
  },
  tech: {
    ar: [
      { id: 'd1', name: 'سماعة بلوتوث',   price: 299, image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop' },
      { id: 'd2', name: 'لاب توب',         price: 999, image_url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop' },
      { id: 'd3', name: 'موبايل',          price: 599, image_url: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=400&fit=crop' },
      { id: 'd4', name: 'لوحة مفاتيح',    price: 199, image_url: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&h=400&fit=crop' },
    ],
    he: [
      { id: 'd1', name: 'אוזניות Bluetooth', price: 299, image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop' },
      { id: 'd2', name: 'לפטופ',             price: 999, image_url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop' },
      { id: 'd3', name: 'סמארטפון',          price: 599, image_url: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=400&fit=crop' },
      { id: 'd4', name: 'מקלדת',            price: 199, image_url: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&h=400&fit=crop' },
    ],
  },
  minimal: {
    ar: [
      { id: 'd1', name: 'دفتر ملاحظات', price: 49,  image_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&h=400&fit=crop' },
      { id: 'd2', name: 'كوب قهوة',     price: 69,  image_url: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=400&fit=crop' },
      { id: 'd3', name: 'حافظة جلد',   price: 129, image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop' },
      { id: 'd4', name: 'ديكور مكتبي', price: 89,  image_url: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=400&fit=crop' },
    ],
    he: [
      { id: 'd1', name: 'מחברת',       price: 49,  image_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&h=400&fit=crop' },
      { id: 'd2', name: 'כוס קפה',    price: 69,  image_url: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=400&fit=crop' },
      { id: 'd3', name: 'תיק עור',    price: 129, image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop' },
      { id: 'd4', name: 'עיצוב שולחן', price: 89,  image_url: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=400&fit=crop' },
    ],
  },
  creator: {
    ar: [
      { id: 'd1', name: 'لوحة رسم',    price: 149, image_url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop' },
      { id: 'd2', name: 'أدوات فنية',  price: 99,  image_url: 'https://images.unsplash.com/photo-1460661419176-9f72e37ed10f?w=400&h=400&fit=crop' },
      { id: 'd3', name: 'كانفس يدوي', price: 79,  image_url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop' },
      { id: 'd4', name: 'كاميرا',     price: 899, image_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop' },
    ],
    he: [
      { id: 'd1', name: 'לוח ציור',    price: 149, image_url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop' },
      { id: 'd2', name: 'כלי אמן',     price: 99,  image_url: 'https://images.unsplash.com/photo-1460661419176-9f72e37ed10f?w=400&h=400&fit=crop' },
      { id: 'd3', name: 'קנבס יד',     price: 79,  image_url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop' },
      { id: 'd4', name: 'מצלמה',       price: 899, image_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop' },
    ],
  },
}

const FALLBACK_IMAGES: Record<string, string> = {
  luxury:     'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
  gaming:     'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&h=400&fit=crop',
  beauty:     'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop',
  streetwear: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
  restaurant: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop',
  tech:       'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
  minimal:    'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&h=400&fit=crop',
  creator:    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop',
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

export default function StoreClient({ store, products: rawProducts }: { store: Store; products: Product[] }) {
  const lang = (store.lang ?? 'ar') as 'ar' | 'he'
  const fontClass = lang === 'he' ? heebo.className : cairo.className
  const dir = 'rtl'
  const colors = Array.isArray(store.colors) ? store.colors : ['#7c3aed', '#f59e0b', '#0f172a']
  const c0 = colors[0] ?? '#7c3aed'
  const KNOWN_ARCHETYPES = ['luxury', 'gaming', 'beauty', 'streetwear', 'restaurant', 'tech', 'minimal', 'creator']
  const archetype = KNOWN_ARCHETYPES.includes(store.archetype ?? '') ? (store.archetype ?? 'minimal') : 'minimal'

  const demoByLang = DEMO_PRODUCTS[archetype] ?? DEMO_PRODUCTS.minimal
  const products = rawProducts.length > 0 ? rawProducts : (demoByLang[lang] ?? demoByLang.ar)

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

  const navBg = isDark ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.9)'
  const navText = isDark ? '#fff' : '#111'
  const cardBg = isDark ? '#111' : '#f8f8f8'
  const cardText = isDark ? '#fff' : '#111'
  const cardSub = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)'
  const pageBg = '#0a0a0a'

  const paymentMethods = store.payment_methods ? store.payment_methods.split(',').map(s => s.trim()).filter(Boolean) : []

  const imgFallback = FALLBACK_IMAGES[archetype] ?? FALLBACK_IMAGES.minimal

  return (
    <div dir="rtl" className={fontClass} style={{ minHeight: '100vh', background: pageBg, overflowX: 'hidden', maxWidth: '100%' }}>
      <style>{`
        *{box-sizing:border-box}
        body{margin:0;padding:0}
        @keyframes drawerUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
        .drawer-open{animation:drawerUp 0.28s cubic-bezier(0.32,0.72,0,1) forwards}
      `}</style>

      {/* Navbar */}
      <nav dir="rtl" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: navBg, backdropFilter: 'blur(12px)', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`, padding: '0 16px', height: '56px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', direction: 'rtl' }}>
        {/* Logo + name — right side in RTL */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: `linear-gradient(135deg,${c0},${colors[1] ?? '#f59e0b'})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: '14px', fontWeight: 800, color: '#fff' }}>{(store.name?.[0] ?? '?').toUpperCase()}</span>
          </div>
          <span style={{ fontSize: '15px', fontWeight: 700, color: navText }}>{store.name}</span>
        </div>
        {/* Cart — left side in RTL */}
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
          <p style={{ fontSize: '12px', color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)', fontStyle: archetype === 'luxury' ? 'italic' : 'normal', marginBottom: '10px', position: 'relative' }}>
            {store.slogan}
          </p>
        )}
        {archetype === 'luxury' && (
          <div style={{ width: '32px', height: '1px', background: c0, margin: '0 auto', opacity: 0.5 }} />
        )}
      </div>

      {/* Products grid */}
      <div style={{ padding: '16px', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {products.map(p => (
            <div key={p.id}
              onClick={() => openDrawer(p)}
              style={{ background: cardBg, borderRadius: '16px', overflow: 'hidden', cursor: 'pointer', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`, boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 2px 12px rgba(0,0,0,0.06)', transition: 'transform 0.15s', active: undefined }}>
              <div style={{ aspectRatio: '1', overflow: 'hidden', background: isDark ? '#1a1a1a' : '#eee' }}>
                <img
                  src={p.image_url || imgFallback}
                  alt={p.name}
                  onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop' }}
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
      </div>

      {/* Footer */}
      <div style={{ padding: '24px 16px 40px', textAlign: 'center', borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`, marginTop: '16px' }}>
        {paymentMethods.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginBottom: '16px' }}>
            {paymentMethods.includes('bit') && <span style={{ background: isDark ? '#1a1a1a' : '#f0f0f0', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)'}`, borderRadius: '20px', padding: '4px 12px', fontSize: '12px', color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>Bit</span>}
            {paymentMethods.includes('bank') && <span style={{ background: isDark ? '#1a1a1a' : '#f0f0f0', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)'}`, borderRadius: '20px', padding: '4px 12px', fontSize: '12px', color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>{lang === 'ar' ? 'تحويل بنكي' : 'העברה בנקאית'}</span>}
            {paymentMethods.includes('cash') && <span style={{ background: isDark ? '#1a1a1a' : '#f0f0f0', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)'}`, borderRadius: '20px', padding: '4px 12px', fontSize: '12px', color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>{lang === 'ar' ? 'دفع عند الاستلام' : 'תשלום במסירה'}</span>}
          </div>
        )}
        <a href="/" style={{ fontSize: '11px', color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.25)', textDecoration: 'none' }}>
          {lang === 'ar' ? 'مدعوم بـ Instok.ai' : 'מופעל על ידי Instok.ai'}
        </a>
      </div>

      {/* Product drawer overlay */}
      {drawerOpen && drawerProduct && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100 }}>
          <div onClick={closeDrawer} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)' }} />
          <div className="drawer-open" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: isDark ? '#111' : '#fff', borderRadius: '24px 24px 0 0', padding: '0 0 40px', maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ width: '36px', height: '4px', background: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)', borderRadius: '2px', margin: '12px auto 0' }} />
            <div style={{ aspectRatio: '4/3', overflow: 'hidden', background: isDark ? '#1a1a1a' : '#f0f0f0' }}>
              <img
                src={drawerProduct.image_url || imgFallback}
                alt={drawerProduct.name}
                onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop' }}
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
                <div style={{ background: isDark ? '#1a1a1a' : '#f0f0f0', borderRadius: '14px', padding: '15px 24px', fontSize: '14px', color: cardSub, textAlign: 'center' }}>
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
