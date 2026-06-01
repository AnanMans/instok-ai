'use client'

import { Cairo, Heebo } from 'next/font/google'
import { renderStorePreview, type Lang, type BrandResult, type PreviewTranslations } from '@/lib/storePreview'

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
  logo_url?: string
  category?: string
}

type Product = {
  id: string
  name: string
  price: number
  image_url?: string
}

export default function StoreClient({ store, products }: { store: Store; products: Product[] }) {
  const lang = (store.lang ?? 'ar') as Lang
  const fontClass = lang === 'he' ? heebo.className : cairo.className
  const ar = lang === 'ar'

  const colors = Array.isArray(store.colors) ? store.colors : ['#7c3aed', '#f59e0b', '#0f172a']

  const displayBrand: BrandResult = {
    storeName: store.name,
    slogan: store.slogan ?? '',
    colors,
    vibe: '',
    direction: 'rtl',
    archetype: store.archetype,
  }

  const t: PreviewTranslations = {
    s4Prod1:  ar ? 'منتج ١'              : 'מוצר 1',
    s4Prod2:  ar ? 'منتج ٢'              : 'מוצר 2',
    s4ShopNow: ar ? 'تسوّق الآن ←'       : 'קנה עכשיו ←',
    s4WA:     ar ? 'اطلب عبر واتساب'    : 'הזמן דרך וואטסאפ',
  }

  const categories = store.category ? [store.category] : []

  const realProds = products.map(p => ({
    name: p.name,
    price: p.price,
    image_url: p.image_url ?? '',
  }))

  const waNumber = store.whatsapp_number?.replace(/\D/g, '')?.replace(/^0/, '972') ?? ''
  const waLink = waNumber
    ? `https://wa.me/${waNumber}?text=${encodeURIComponent(ar
        ? `مرحباً، أريد الاستفسار عن متجر ${store.name} 👋`
        : `היי, אני רוצה לשאול על החנות ${store.name} 👋`)}`
    : ''

  return (
    <div dir="rtl" className={fontClass} style={{ maxWidth: 430, margin: '0 auto', minHeight: '100vh', paddingBottom: waNumber ? '80px' : '0' }}>
      <style>{`*{box-sizing:border-box}body{margin:0;padding:0}`}</style>
      {renderStorePreview(store.archetype, displayBrand, colors, lang, store.logo_url ?? null, t, categories, realProds)}
      {waNumber && (
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{ position: 'fixed', bottom: '16px', left: '50%', transform: 'translateX(-50%)', zIndex: 40, display: 'flex', alignItems: 'center', gap: '8px', background: '#22c55e', color: '#fff', borderRadius: '50px', padding: '14px 28px', fontSize: '15px', fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 24px rgba(34,197,94,0.45)', whiteSpace: 'nowrap' }}
        >
          <span style={{ fontSize: '18px' }}>💬</span>
          {ar ? 'تواصل عبر واتساب' : 'צור קשר בוואטסאפ'}
        </a>
      )}
    </div>
  )
}
