'use client'

import { useState, useEffect, useMemo } from 'react'
import { createBrowserClient } from '@supabase/ssr'

type Store = {
  id: string
  name: string
  slug: string
  colors: string[]
  category?: string
  archetype: string
  product_count: number
  preview_image?: string
}

type Product = {
  id: string
  name: string
  price: number
  image_url?: string
  store_name: string
  store_slug: string
  store_whatsapp?: string
  store_lang?: string
}

const ARCHETYPE_EMOJI: Record<string, string> = {
  luxury: '👑', gaming: '🎮', beauty: '💄', streetwear: '👟',
  restaurant: '🍽️', tech: '💻', minimal: '🏷️', creator: '✨',
}

const imgFallback = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop'

export default function MarketplaceSection({ lang }: { lang: 'ar' | 'he' }) {
  const ar = lang === 'ar'
  const [stores, setStores] = useState<Store[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [query, setQuery] = useState('')
  const [mode, setMode] = useState<'stores' | 'products'>('stores')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    async function fetchData() {
      const [{ data: storesRaw }, { data: productsRaw }] = await Promise.all([
        supabase
          .from('stores')
          .select('id, name, slug, colors, category, archetype, lang, products(id, image_url)')
          .order('created_at', { ascending: false })
          .limit(30),
        supabase
          .from('products')
          .select('id, name, price, image_url, stores(name, slug, whatsapp_number, lang)')
          .order('created_at', { ascending: false })
          .limit(40),
      ])

      if (storesRaw) {
        setStores(
          storesRaw
            .filter(s => Array.isArray(s.products) && s.products.length > 0)
            .map(s => ({
              id: s.id,
              name: s.name,
              slug: s.slug,
              colors: Array.isArray(s.colors) ? s.colors : ['#7c3aed'],
              category: s.category,
              archetype: s.archetype ?? 'minimal',
              product_count: s.products.length,
              preview_image: (s.products as { image_url?: string }[])[0]?.image_url,
            }))
        )
      }

      if (productsRaw) {
        setProducts(
          productsRaw.map(p => {
            const store = (Array.isArray(p.stores) ? p.stores[0] : p.stores) as { name: string; slug: string; whatsapp_number?: string; lang?: string } | null
            return {
              id: p.id,
              name: p.name,
              price: p.price,
              image_url: p.image_url,
              store_name: store?.name ?? '',
              store_slug: store?.slug ?? '',
              store_whatsapp: store?.whatsapp_number,
              store_lang: store?.lang,
            }
          })
        )
      }

      setLoading(false)
    }

    fetchData()
  }, [])

  const q = query.toLowerCase().trim()

  const filteredStores = useMemo(() => {
    if (!q) return stores.slice(0, 12)
    const productStoreIds = new Set(
      products
        .filter(p => p.name.toLowerCase().includes(q))
        .map(p => p.store_slug)
    )
    return stores.filter(s =>
      s.name.toLowerCase().includes(q) ||
      (s.category ?? '').toLowerCase().includes(q) ||
      productStoreIds.has(s.slug)
    )
  }, [stores, products, q])

  const filteredProducts = useMemo(() => {
    if (!q) return products.slice(0, 12)
    return products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.store_name.toLowerCase().includes(q)
    )
  }, [products, q])

  const displayed = mode === 'stores' ? filteredStores : filteredProducts
  const isEmpty = displayed.length === 0

  return (
    <section style={{ padding: '72px 20px 80px', position: 'relative', overflowX: 'clip', overflowY: 'hidden', background: '#eeeaff' }}>
      <style>{`
        .market-grid-stores {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 16px;
        }
        .market-grid-products {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
        }
        @media (max-width: 640px) {
          .market-grid-stores {
            display: flex !important;
            flex-direction: row !important;
            align-items: flex-start !important;
            overflow-x: auto !important;
            scroll-snap-type: x mandatory !important;
            gap: 12px !important;
            padding-bottom: 12px !important;
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
          }
          .market-grid-stores::-webkit-scrollbar { display: none; }
          .market-card-store {
            flex: 0 0 72vw !important;
            scroll-snap-align: start !important;
          }
          .market-grid-products {
            display: flex !important;
            flex-direction: row !important;
            align-items: flex-start !important;
            overflow-x: auto !important;
            scroll-snap-type: x mandatory !important;
            gap: 12px !important;
            padding-bottom: 12px !important;
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
          }
          .market-grid-products::-webkit-scrollbar { display: none; }
          .market-card-product {
            flex: 0 0 47vw !important;
            scroll-snap-align: start !important;
          }
          /* Fix image height so all product cards are the same compact size */
          .market-card-product > div > a > div {
            height: 140px !important;
            aspect-ratio: unset !important;
          }
        }
      `}</style>

      {/* Solana orbs */}
      <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '420px', height: '420px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(153,69,255,0.28) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '360px', height: '360px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(20,241,149,0.18) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%)', width: '600px', height: '300px', background: 'radial-gradient(ellipse, rgba(153,69,255,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Top border with Solana gradient */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, #9945FF, #14F195, transparent)' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(153,69,255,0.4), transparent)' }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <p style={{
            fontSize: '12px', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '12px',
            background: 'linear-gradient(90deg, #9945FF, #14F195)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            {ar ? '✦ تسوّق الآن' : '✦ קנה עכשיו'}
          </p>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 900, color: '#0f0a1e', letterSpacing: '-0.03em', marginBottom: '10px', lineHeight: 1.15 }}>
            {ar ? 'متاجر حقيقية بنيت بالذكاء الاصطناعي' : 'חנויות אמיתיות שנבנו עם AI'}
          </h2>
          <p style={{ fontSize: '14px', color: 'rgba(15,10,30,0.5)' }}>
            {ar ? 'اكتشف منتجات واطلب مباشرة عبر واتساب' : 'גלה מוצרים והזמן ישירות דרך וואטסאפ'}
          </p>
        </div>

        {/* Search bar */}
        <div style={{ maxWidth: '540px', margin: '0 auto 20px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '50%', right: '16px', transform: 'translateY(-50%)', color: 'rgba(15,10,30,0.3)', pointerEvents: 'none', fontSize: '16px' }}>
            🔍
          </div>
          <input
            type="text"
            dir={ar ? 'rtl' : 'ltr'}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={ar ? 'ابحث عن منتج أو متجر...' : 'חפש מוצר או חנות...'}
            style={{
              width: '100%',
              background: '#fff',
              border: '1px solid rgba(124,58,237,0.2)',
              borderRadius: '14px',
              padding: '15px 48px 15px 16px',
              color: '#0f0a1e',
              fontSize: '15px',
              outline: 'none',
              backdropFilter: 'blur(20px)',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
            onFocus={e => {
              e.target.style.borderColor = '#9945FF'
              e.target.style.boxShadow = '0 0 0 3px rgba(153,69,255,0.15), 0 0 20px rgba(153,69,255,0.1)'
            }}
            onBlur={e => {
              e.target.style.borderColor = 'rgba(153,69,255,0.3)'
              e.target.style.boxShadow = 'none'
            }}
          />
        </div>

        {/* Toggle */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '36px' }}>
          {(['stores', 'products'] as const).map(m => (
            <button key={m} onClick={() => setMode(m)}
              style={{
                padding: '9px 24px',
                borderRadius: '50px',
                border: mode === m ? '1px solid rgba(124,58,237,0.6)' : '1px solid rgba(0,0,0,0.1)',
                background: mode === m ? 'linear-gradient(135deg, #7c3aed, #4f46e5)' : '#fff',
                color: mode === m ? '#fff' : 'rgba(15,10,30,0.45)',
                fontSize: '13px',
                fontWeight: mode === m ? 700 : 500,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.18s',
                boxShadow: mode === m ? '0 0 20px rgba(153,69,255,0.2)' : 'none',
              }}>
              {m === 'stores'
                ? (ar ? '🏪 متاجر' : '🏪 חנויות')
                : (ar ? '🛍️ منتجات' : '🛍️ מוצרים')}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: 'rgba(15,10,30,0.3)', fontSize: '14px' }}>
            {ar ? 'جاري التحميل...' : 'טוען...'}
          </div>
        ) : isEmpty ? (
          <div style={{ textAlign: 'center', padding: '48px', color: 'rgba(15,10,30,0.3)', fontSize: '14px' }}>
            {ar ? 'لا توجد نتائج' : 'אין תוצאות'}
          </div>
        ) : mode === 'stores' ? (
          <div className="market-grid-stores">
            {(filteredStores as Store[]).map(store => (
              <div key={store.id} className="market-card-store"><StoreCard store={store} ar={ar} /></div>
            ))}
          </div>
        ) : (
          <div className="market-grid-products">
            {(filteredProducts as Product[]).map(product => (
              <div key={product.id} className="market-card-product"><ProductCard product={product} ar={ar} /></div>
            ))}
          </div>
        )}

      </div>
    </section>
  )
}

function StoreCard({ store, ar }: { store: Store; ar: boolean }) {
  const c0 = store.colors[0] ?? '#7c3aed'
  const c1 = store.colors[1] ?? '#4f46e5'
  const emoji = ARCHETYPE_EMOJI[store.archetype] ?? '🏪'

  return (
    <a href={`/store/${store.slug}`}
      style={{ textDecoration: 'none', display: 'block', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.07)', background: '#fff', transition: 'transform 0.18s, box-shadow 0.18s', cursor: 'pointer', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 16px 48px ${c0}25` }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}>

      {/* Color band / preview */}
      <div style={{ height: '90px', background: `linear-gradient(135deg, ${c0}, ${c1})`, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)' }} />
        {store.preview_image && (
          <img src={store.preview_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35, display: 'block' }}
            onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
        )}
        <div style={{ position: 'absolute', bottom: '10px', right: '12px', fontSize: '28px' }}>{emoji}</div>
      </div>

      {/* Info */}
      <div style={{ padding: '14px 16px 16px' }}>
        <p style={{ fontSize: '15px', fontWeight: 700, color: '#0f0a1e', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {store.name}
        </p>
        {store.category && (
          <p style={{ fontSize: '11px', color: 'rgba(15,10,30,0.4)', marginBottom: '10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {store.category}
          </p>
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '11px', color: 'rgba(15,10,30,0.35)' }}>
            {store.product_count} {ar ? 'منتج' : 'מוצרים'}
          </span>
          <span style={{ fontSize: '12px', fontWeight: 600, color: c0 }}>
            {ar ? 'زيارة ←' : 'ביקור ←'}
          </span>
        </div>
      </div>
    </a>
  )
}

function ProductCard({ product, ar }: { product: Product; ar: boolean }) {
  const waLink = product.store_whatsapp
    ? `https://wa.me/${product.store_whatsapp}?text=${encodeURIComponent(
        ar
          ? `مرحباً، أريد طلب: ${product.name} — ₪${product.price.toLocaleString('en-US')}`
          : `היי, אני רוצה להזמין: ${product.name} — ₪${product.price.toLocaleString('en-US')}`
      )}`
    : `/store/${product.store_slug}`

  return (
    <div style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.07)', background: '#fff', transition: 'transform 0.18s', cursor: 'pointer', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none' }}>

      {/* Image */}
      <a href={`/store/${product.store_slug}`} style={{ textDecoration: 'none', display: 'block' }}>
        <div style={{ aspectRatio: '1', overflow: 'hidden', background: '#f3f0ff' }}>
          <img src={product.image_url || imgFallback} alt={product.name}
            onError={e => { (e.target as HTMLImageElement).src = imgFallback }}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s' }} />
        </div>
      </a>

      {/* Info */}
      <div style={{ padding: '12px 12px 14px' }}>
        <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f0a1e', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {product.name}
        </p>
        <p style={{ fontSize: '11px', color: 'rgba(15,10,30,0.38)', marginBottom: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {product.store_name}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
          <span style={{ fontSize: '15px', fontWeight: 700, color: '#a78bfa' }}>{'₪' + product.price.toLocaleString('en-US')}</span>
          <a href={waLink} target="_blank" rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#22c55e', color: '#fff', borderRadius: '8px', padding: '5px 10px', fontSize: '11px', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}>
            💬 {ar ? 'اطلب' : 'הזמן'}
          </a>
        </div>
      </div>
    </div>
  )
}
