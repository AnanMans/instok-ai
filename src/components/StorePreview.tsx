import type { CSSProperties } from 'react'
import LuxuryTemplate from './templates/LuxuryTemplate'
import GamingTemplate from './templates/GamingTemplate'
import BeautyTemplate from './templates/BeautyTemplate'
import StreetwearTemplate from './templates/StreetwearTemplate'
import MinimalTemplate from './templates/MinimalTemplate'
import RestaurantTemplate from './templates/RestaurantTemplate'
import TechTemplate from './templates/TechTemplate'
import CreatorTemplate from './templates/CreatorTemplate'
import type { TemplateProps } from './templates/types'

type Lang = 'ar' | 'he'

const FAKE_PRODUCTS: Record<string, { ar: string; he: string; price: number; image_url: string }[]> = {
  luxury:     [{ ar: 'منتج مميز', he: 'מוצר בלעדי', price: 299, image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop' }, { ar: 'قطعة راقية', he: 'פריט יוקרתי', price: 499, image_url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop' }],
  gaming:     [{ ar: 'منتج رائج', he: 'מוצר חם', price: 199, image_url: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&h=400&fit=crop' }, { ar: 'منتج ثاني', he: 'מוצר שני', price: 299, image_url: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop' }],
  beauty:     [{ ar: 'منتج تجميل', he: 'מוצר יופי', price: 89, image_url: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop' }, { ar: 'منتج ثاني', he: 'מוצר שני', price: 129, image_url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop' }],
  streetwear: [{ ar: 'قطعة جديدة', he: 'פריט חדש', price: 149, image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop' }, { ar: 'منتج ثاني', he: 'מוצר שני', price: 199, image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop' }],
  minimal:    [{ ar: 'منتج أنيق', he: 'מוצר אלגנטי', price: 199, image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop' }, { ar: 'منتج ثاني', he: 'מוצר שני', price: 249, image_url: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop' }],
  restaurant: [{ ar: 'طبق رئيسي', he: 'מנה עיקרית', price: 65, image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop' }, { ar: 'طبق ثاني', he: 'מנה שנייה', price: 45, image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop' }],
  tech:       [{ ar: 'منتج تقني', he: 'מוצר טכנולוגי', price: 299, image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop' }, { ar: 'منتج ثاني', he: 'מוצר שני', price: 499, image_url: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=400&fit=crop' }],
  creator:    [{ ar: 'منتج حصري', he: 'מוצר בלעדי', price: 149, image_url: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400&h=400&fit=crop' }, { ar: 'منتج ثاني', he: 'מוצר שני', price: 199, image_url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&h=400&fit=crop' }],
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

type Props = {
  archetype: string
  storeName: string
  slogan: string
  colors: string[]
  lang: Lang
  logoUrl?: string
  style?: CSSProperties
}

export default function StorePreview({ archetype, storeName, slogan, colors, lang, logoUrl, style }: Props) {
  const Template = TEMPLATES[archetype] ?? MinimalTemplate
  const raw = FAKE_PRODUCTS[archetype] ?? FAKE_PRODUCTS.minimal
  const products = raw.map(p => ({ name: lang === 'ar' ? p.ar : p.he, price: p.price, image_url: p.image_url }))

  return (
    <div style={{ width: '240px', height: '420px', overflow: 'hidden', borderRadius: '24px', ...style }}>
      <div style={{ width: '390px', transformOrigin: 'top left', transform: 'scale(0.615)' }}>
        <Template
          storeName={storeName}
          slogan={slogan}
          colors={colors}
          lang={lang}
          logoUrl={logoUrl}
          products={products}
          preview={true}
        />
      </div>
    </div>
  )
}
