'use client'

import { Cairo, Heebo } from 'next/font/google'
import LuxuryTemplate from '@/components/templates/LuxuryTemplate'
import GamingTemplate from '@/components/templates/GamingTemplate'
import BeautyTemplate from '@/components/templates/BeautyTemplate'
import StreetwearTemplate from '@/components/templates/StreetwearTemplate'
import MinimalTemplate from '@/components/templates/MinimalTemplate'
import RestaurantTemplate from '@/components/templates/RestaurantTemplate'
import TechTemplate from '@/components/templates/TechTemplate'
import CreatorTemplate from '@/components/templates/CreatorTemplate'
import type { TemplateProps } from '@/components/templates/types'

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

const TEMPLATES: Record<string, React.ComponentType<TemplateProps>> = {
  luxury:     LuxuryTemplate,
  gaming:     GamingTemplate,
  beauty:     BeautyTemplate,
  streetwear: StreetwearTemplate,
  minimal:    MinimalTemplate,
  restaurant: RestaurantTemplate,
  tech:       TechTemplate,
  creator:    CreatorTemplate,
}

export default function StoreClient({ store, products }: { store: Store; products: Product[] }) {
  const lang = (store.lang ?? 'ar') as 'ar' | 'he'
  const fontClass = lang === 'he' ? heebo.className : cairo.className
  const ar = lang === 'ar'

  const Template = TEMPLATES[store.archetype] ?? MinimalTemplate
  const colors = Array.isArray(store.colors) ? store.colors : ['#7c3aed', '#f59e0b', '#0f172a']

  const waNumber = store.whatsapp_number?.replace(/\D/g, '')?.replace(/^0/, '972') ?? ''
  const waLink = waNumber
    ? `https://wa.me/${waNumber}?text=${encodeURIComponent(ar
        ? `مرحباً، أريد الاستفسار عن متجر ${store.name} 👋`
        : `היי, אני רוצה לשאול על החנות ${store.name} 👋`)}`
    : ''

  return (
    <div className={fontClass} style={{ paddingBottom: waNumber ? '80px' : '0' }}>
      <style>{`*{box-sizing:border-box}body{margin:0;padding:0}`}</style>
      <Template
        storeName={store.name}
        slogan={store.slogan ?? ''}
        colors={colors}
        lang={lang}
        logoUrl={store.logo_url ?? undefined}
        products={products.map(p => ({ name: p.name, price: p.price, image_url: p.image_url }))}
      />
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
