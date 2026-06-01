import type { ReactNode } from 'react'

export type Lang = 'ar' | 'he'

export type BrandResult = {
  storeName: string
  slogan: string
  colors: string[]
  vibe: string
  direction: string
  archetype?: string
  _fallback?: boolean
}

export type PreviewTranslations = {
  s4Prod1: string
  s4Prod2: string
  s4ShopNow: string
  s4WA: string
}

// ── Category → product images ──────────────────────────────────────────────────
export const CATEGORY_IMAGES: Record<string, string[]> = {
  'ملابس':        ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop','https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop'],
  'مكياج وجمال': ['https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=200&h=200&fit=crop','https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&h=200&fit=crop'],
  'إلكترونيات':  ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=200&fit=crop','https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=200&h=200&fit=crop'],
  'ألعاب وغيمنج':['https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=200&h=200&fit=crop','https://images.unsplash.com/photo-1527814050087-3793815479db?w=200&h=200&fit=crop'],
  'أكل وحلويات': ['https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop','https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop'],
  'إكسسوار':     ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&h=200&fit=crop','https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop'],
  'منتجات يدوية':['https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=200&h=200&fit=crop','https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=200&h=200&fit=crop'],
  'أخرى':        ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&h=200&fit=crop','https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=200&h=200&fit=crop'],
  'בגדים':       ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop','https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop'],
  'איפור ויופי': ['https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=200&h=200&fit=crop','https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&h=200&fit=crop'],
  'אלקטרוניקה':  ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=200&fit=crop','https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=200&h=200&fit=crop'],
  'גיימינג':     ['https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=200&h=200&fit=crop','https://images.unsplash.com/photo-1527814050087-3793815479db?w=200&h=200&fit=crop'],
  'אוכל':        ['https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop','https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop'],
  'אקססוריז':    ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&h=200&fit=crop','https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop'],
  'מוצרי יד':    ['https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=200&h=200&fit=crop','https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=200&h=200&fit=crop'],
}

// ── Color-safe helpers ─────────────────────────────────────────────────────────
export function getTextColor(bgHex: string): string {
  const hex = bgHex.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#000000' : '#ffffff'
}

export function getDarkVariant(hex: string): string {
  const h = hex.replace('#', '')
  const r = Math.max(0, parseInt(h.substring(0, 2), 16) - 60)
  const g = Math.max(0, parseInt(h.substring(2, 4), 16) - 60)
  const b = Math.max(0, parseInt(h.substring(4, 6), 16) - 60)
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')
}

export function getLightVariant(hex: string): string {
  const h = hex.replace('#', '')
  const r = Math.min(255, parseInt(h.substring(0, 2), 16) + 80)
  const g = Math.min(255, parseInt(h.substring(2, 4), 16) + 80)
  const b = Math.min(255, parseInt(h.substring(4, 6), 16) + 80)
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')
}

// ── Store previews (8 archetypes) ──────────────────────────────────────────────
export type RealProduct = { name: string; price: number; image_url: string }

export function renderStorePreview(
  archetype: string,
  displayBrand: BrandResult,
  customColors: string[],
  lang: Lang,
  uploadedImage: string | null,
  t: PreviewTranslations,
  categories: string[] = [],
  realProducts?: RealProduct[]
): ReactNode {
  const c0 = customColors[0] ?? '#7c3aed'
  const c1 = customColors[1] ?? '#f59e0b'
  const c2 = customColors[2] ?? '#0f172a'
  const name = displayBrand.storeName
  const slogan = displayBrand.slogan || '—'
  const initial = name[0] ?? '?'

  // Derived safe colors
  const navBg        = getDarkVariant(c0)
  const navText      = getTextColor(navBg)
  const heroText     = getTextColor(c0)
  const ctaText      = getTextColor(c0)
  const darkCardBg   = getDarkVariant(c0)
  const darkCardText = getTextColor(darkCardBg)
  const lightCardBg  = getLightVariant(c2)
  const lightCardText = getTextColor(lightCardBg)
  // For product price: use c0 if it contrasts with the card bg, else c1
  const darkPrice  = getTextColor(darkCardBg) !== getTextColor(c0) ? c0 : c1
  const lightPrice = getTextColor(lightCardBg) !== getTextColor(c0) ? c0 : c1

  const nameSz = name.length > 15 ? '11px' : name.length > 10 ? '13px' : '15px'
  const nameStyle = { wordBreak: 'break-word' as const, overflowWrap: 'break-word' as const, overflow: 'hidden', maxWidth: '100%' }

  const ARCHETYPE_IMGS: Record<string, string[]> = {
    luxury:     ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&h=200&fit=crop'],
    gaming:     ['https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=200&h=200&fit=crop', 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=200&h=200&fit=crop'],
    beauty:     ['https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=200&h=200&fit=crop', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&h=200&fit=crop'],
    streetwear: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop'],
    restaurant: ['https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop'],
    tech:       ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=200&fit=crop', 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=200&h=200&fit=crop'],
    minimal:    ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&h=200&fit=crop', 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=200&h=200&fit=crop'],
    creator:    ['https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=200&h=200&fit=crop', 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=200&h=200&fit=crop'],
  }
  const firstCatMatch = categories.find(cat => CATEGORY_IMAGES[cat])
  const imgs = firstCatMatch ? CATEGORY_IMAGES[firstCatMatch] : (ARCHETYPE_IMGS[archetype] ?? ARCHETYPE_IMGS.minimal)

  const getItems = (defaultPrices: string[]) => realProducts && realProducts.length > 0
    ? realProducts.map(p => ({ src: p.image_url || '', name: p.name, priceStr: `₪${p.price}` }))
    : imgs.map((src, i) => ({ src, name: i === 0 ? t.s4Prod1 : t.s4Prod2, priceStr: defaultPrices[i] ?? '₪—' }))

  const LogoCircle = ({ size = 22 }: { size?: number }) => (
    <div style={{ width: size, height: size, borderRadius: '50%', overflow: 'hidden', background: `linear-gradient(135deg,${c0},${c1})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {uploadedImage
        ? <img src={uploadedImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
        : <span style={{ fontSize: size * 0.45 + 'px', fontWeight: 700, color: ctaText }}>{initial}</span>}
    </div>
  )

  switch (archetype) {
    case 'luxury': {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#050505' }}>
          <div style={{ height: '18px', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', flexShrink: 0 }}>
            <span style={{ fontSize: '7px', color: c0, opacity: 0.4 }}>9:41</span>
            <span style={{ fontSize: '7px', color: c0, opacity: 0.4 }}>●●●</span>
          </div>
          {/* Nav: centered name only, small caps, letterSpacing 3px, thin */}
          <div style={{ height: '34px', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: `1px solid ${c0}18`, flexShrink: 0 }}>
            <span style={{ fontSize: name.length > 12 ? '8px' : '10px', fontWeight: 300, color: c0, letterSpacing: '3px', textTransform: 'uppercase', opacity: 0.8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80%' }}>{name}</span>
          </div>
          {/* Hero: dark bg, name two lines large, gold divider, italic thin slogan */}
          <div style={{ background: `linear-gradient(160deg, #0d0d0d, ${getDarkVariant(c0)})`, padding: '20px 16px 14px', textAlign: 'center', flexShrink: 0 }}>
            <div style={{ fontSize: name.length > 14 ? '11px' : name.length > 10 ? '13px' : name.length > 6 ? '16px' : '20px', fontWeight: 200, color: c0, letterSpacing: '0.05em', lineHeight: 1.3, textTransform: 'uppercase', width: '100%', textAlign: 'center', wordBreak: 'break-word', whiteSpace: 'normal', marginBottom: '10px' }}>
              {name}
            </div>
            <div style={{ width: '36px', height: '1px', background: c0, margin: '0 auto 10px', opacity: 0.45 }} />
            <div style={{ fontSize: '7px', color: heroText, fontStyle: 'italic', fontWeight: 300, opacity: 0.45, letterSpacing: '0.04em' }}>{slogan}</div>
          </div>
          {/* Products: ONE featured product, full width, tall */}
          {(() => { const item0 = realProducts?.[0] ? { src: realProducts[0].image_url || '', name: realProducts[0].name, priceStr: `₪${realProducts[0].price}` } : { src: imgs[0], name: t.s4Prod1, priceStr: '₪299' }; return (
          <div style={{ flex: 1, background: '#0a0a0a', padding: '8px', overflow: 'hidden' }}>
            <div style={{ background: `${c0}08`, border: `1px solid ${c0}15`, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ flex: 1, overflow: 'hidden', minHeight: '100px' }}>
                <img src={item0.src} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} alt="" />
              </div>
              <div style={{ padding: '8px 12px', textAlign: 'center', flexShrink: 0 }}>
                <div style={{ fontSize: '7px', color: darkCardText, fontWeight: 300, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '3px', opacity: 0.55 }}>{item0.name}</div>
                <div style={{ fontSize: '13px', fontWeight: 400, color: c0 }}>{item0.priceStr}</div>
              </div>
            </div>
          </div>
          )})()}
          {/* Footer: COLLECTION 2026 */}
          <div style={{ background: '#050505', padding: '10px 12px', borderTop: `1px solid ${c0}12`, display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: '6px', color: c0, opacity: 0.3, letterSpacing: '4px', textTransform: 'uppercase' }}>{lang === 'ar' ? 'مجموعة ٢٠٢٦' : 'קולקציה 2026'}</span>
          </div>
        </div>
      )
    }

    case 'gaming':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#050510' }}>
          <div style={{ height: '18px', background: '#050510', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', flexShrink: 0 }}>
            <span style={{ fontSize: '7px', color: navText, opacity: 0.7 }}>9:41</span>
            <span style={{ fontSize: '7px', color: navText, opacity: 0.7 }}>●●●</span>
          </div>
          <div style={{ height: '34px', background: navBg, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px', borderBottom: `1px solid ${c0}60`, flexShrink: 0 }}>
            <span style={{ fontSize: '7px', color: '#0f0', background: 'rgba(0,255,0,0.1)', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>🔴 LIVE</span>
            <span style={{ fontSize: nameSz, fontWeight: 800, color: navText, textShadow: `0 0 10px ${c0}`, ...nameStyle, maxWidth: '60%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
          </div>
          <div style={{ background: `linear-gradient(135deg,#0d0020,${c2},${c0}40)`, padding: '18px 10px 16px', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
            <div style={{ position: 'absolute', inset: 0, background: `repeating-linear-gradient(0deg,transparent,transparent 8px,${c0}08 8px,${c0}08 9px)` }} />
            <div style={{ fontSize: '7px', color: c0, letterSpacing: '0.15em', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 700, position: 'relative', zIndex: 1 }}>{lang === 'ar' ? 'ارتقِ بمستواك' : 'עלה רמה'}</div>
            <div style={{ fontSize: nameSz, fontWeight: 900, color: heroText, marginBottom: '3px', textShadow: `0 0 20px ${c0}`, position: 'relative', zIndex: 1, ...nameStyle }}>{name}</div>
            <div style={{ fontSize: '7.5px', color: heroText, opacity: 0.5, marginBottom: '10px', position: 'relative', zIndex: 1 }}>{slogan}</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: c0, borderRadius: '4px', padding: '4px 12px', boxShadow: `0 0 12px ${c0}80`, position: 'relative', zIndex: 1 }}>
              <span style={{ fontSize: '8px', fontWeight: 800, color: ctaText, textAlign: 'center' }}>{lang === 'ar' ? 'العب الآن ▶' : 'שחק עכשיו ▶'}</span>
            </div>
          </div>
          <div style={{ flex: 1, background: darkCardBg, padding: '6px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', overflow: 'hidden' }}>
            {getItems(['₪199', '₪199']).map((item, i) => (
              <div key={i} style={{ background: `${c0}18`, borderRadius: '8px', overflow: 'hidden', border: `1px solid ${c0}30`, display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, overflow: 'hidden', minHeight: '70px', position: 'relative' }}>
                  <img src={item.src} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} alt="" />
                  {i === 0 && (
                    <div style={{ position: 'absolute', top: '3px', right: '3px', background: 'rgba(239,68,68,0.92)', borderRadius: '3px', padding: '1px 4px' }}>
                      <span style={{ fontSize: '6px', fontWeight: 800, color: '#fff' }}>{lang === 'ar' ? '🔥 رائج' : '🔥 חם'}</span>
                    </div>
                  )}
                </div>
                <div style={{ padding: '4px 5px', flexShrink: 0 }}>
                  <div style={{ fontSize: '7px', fontWeight: 600, marginBottom: '1px', color: darkCardText }}>{item.name}</div>
                  <div style={{ fontSize: '8px', fontWeight: 700, color: c0, textShadow: `0 0 8px ${c0}80` }}>{item.priceStr}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: darkCardBg, borderTop: `1px solid ${c0}25`, padding: '0', display: 'flex', flexShrink: 0 }}>
            {['🏠', '🎮', '📦', '👤'].map((icon, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '7px 4px', borderRight: i < 3 ? `1px solid ${c0}15` : 'none' }}>
                <span style={{ fontSize: '12px' }}>{icon}</span>
                <div style={{ width: i === 0 ? '16px' : '0', height: '2px', background: c0, borderRadius: '1px', marginTop: '3px', boxShadow: i === 0 ? `0 0 6px ${c0}` : 'none' }} />
              </div>
            ))}
          </div>
        </div>
      )

    case 'creator':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: lightCardBg }}>
          <div style={{ height: '18px', background: lightCardBg, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', flexShrink: 0 }}>
            <span style={{ fontSize: '7px', color: lightCardText, opacity: 0.5 }}>9:41</span>
            <span style={{ fontSize: '7px', color: lightCardText, opacity: 0.5 }}>●●●</span>
          </div>
          <div style={{ height: '34px', background: navBg, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px', borderBottom: `1px solid ${c0}20`, flexShrink: 0 }}>
            <LogoCircle />
            <span style={{ fontSize: nameSz, fontWeight: 700, color: navText, ...nameStyle, maxWidth: '60%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
            <span style={{ fontSize: '8px', color: navText }}>✦</span>
          </div>
          <div style={{ background: `linear-gradient(160deg,${c0}18,${c1}12)`, padding: '18px 12px 14px', flexShrink: 0 }}>
            <div style={{ fontSize: '7px', color: c0, marginBottom: '4px', fontWeight: 600, letterSpacing: '0.08em', ...nameStyle }}>{lang === 'ar' ? 'بقلم' : 'של'} {name}</div>
            <div style={{ fontSize: '14px', fontWeight: 900, color: heroText, marginBottom: '4px', lineHeight: 1.1 }}>{slogan}</div>
            <div style={{ fontSize: '7.5px', color: heroText, opacity: 0.6, marginBottom: '12px' }}>{lang === 'ar' ? 'منتجات حصرية' : 'מוצרים בלעדיים'}</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: c0, borderRadius: '20px', padding: '5px 14px' }}>
              <span style={{ fontSize: '8px', fontWeight: 700, color: ctaText, textAlign: 'center' }}>{t.s4ShopNow}</span>
            </div>
          </div>
          <div style={{ flex: 1, background: lightCardBg, padding: '6px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', overflow: 'hidden' }}>
            {getItems(['₪149', '₪149']).map((item, i) => (
              <div key={i} style={{ background: `${lightCardBg}ee`, borderRadius: '4px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transform: i === 0 ? 'rotate(-1.5deg)' : 'rotate(1.5deg)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, overflow: 'hidden', minHeight: '70px' }}>
                  <img src={item.src} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} alt="" />
                </div>
                <div style={{ padding: '4px 5px', flexShrink: 0 }}>
                  <div style={{ fontSize: '7px', fontWeight: 600, marginBottom: '1px', color: lightCardText }}>{item.name}</div>
                  <div style={{ fontSize: '8px', fontWeight: 700, color: lightPrice }}>{item.priceStr}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: navBg, borderTop: `1px solid ${c0}20`, padding: '9px 12px', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <div style={{ flex: 1, background: c0, borderRadius: '20px', padding: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '8px', fontWeight: 700, color: ctaText }}>+ {lang === 'ar' ? 'تابع' : 'עקוב'}</span>
            </div>
            <div style={{ flex: 1, border: `1px solid ${c0}`, borderRadius: '20px', padding: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '8px', color: navText, fontWeight: 600 }}>{lang === 'ar' ? '💬 راسل' : '💬 שלח הודעה'}</span>
            </div>
          </div>
        </div>
      )

    case 'beauty':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: lightCardBg }}>
          <div style={{ height: '18px', background: lightCardBg, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', flexShrink: 0 }}>
            <span style={{ fontSize: '7px', color: lightCardText, opacity: 0.5 }}>9:41</span>
            <span style={{ fontSize: '7px', color: lightCardText, opacity: 0.5 }}>●●●</span>
          </div>
          <div style={{ height: '34px', background: navBg, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px', borderBottom: `1px solid ${c0}30`, flexShrink: 0 }}>
            <LogoCircle />
            <span style={{ fontSize: nameSz, fontWeight: 700, color: navText, fontStyle: 'italic', ...nameStyle, maxWidth: '60%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
            <span style={{ fontSize: '8px', color: navText }}>✿</span>
          </div>
          <div style={{ background: `linear-gradient(160deg,${c0}20,${c1}15)`, padding: '20px 12px 14px', textAlign: 'center', flexShrink: 0 }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: `linear-gradient(135deg,${c0},${c1})`, margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 16px ${c0}40` }}>
              {uploadedImage ? <img src={uploadedImage} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} alt="" /> : <span style={{ fontSize: '20px', color: ctaText }}>✿</span>}
            </div>
            <div style={{ fontSize: nameSz, fontWeight: 700, color: heroText, marginBottom: '3px', ...nameStyle }}>{name}</div>
            <div style={{ fontSize: '8px', color: heroText, opacity: 0.6, marginBottom: '10px', lineHeight: 1.4 }}>{slogan}</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(135deg,${c0},${c1})`, borderRadius: '20px', padding: '5px 16px', boxShadow: `0 4px 12px ${c0}40` }}>
              <span style={{ fontSize: '8px', fontWeight: 700, color: ctaText, textAlign: 'center' }}>{t.s4ShopNow}</span>
            </div>
          </div>
          <div style={{ flex: 1, background: lightCardBg, padding: '6px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', overflow: 'hidden' }}>
            {getItems(['₪89', '₪89']).map((item, i) => (
              <div key={i} style={{ background: `${lightCardBg}cc`, borderRadius: '12px', overflow: 'hidden', border: `1px solid ${c0}20`, display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, overflow: 'hidden', minHeight: '70px' }}>
                  <img src={item.src} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} alt="" />
                </div>
                <div style={{ padding: '4px 5px', flexShrink: 0 }}>
                  <div style={{ fontSize: '7px', fontWeight: 600, marginBottom: '1px', color: lightCardText }}>{item.name}</div>
                  <div style={{ fontSize: '8px', fontWeight: 700, color: lightPrice }}>{item.priceStr}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: '#22c55e', padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', flexShrink: 0 }}>
            <span style={{ fontSize: '11px' }}>💬</span>
            <span style={{ fontSize: '9px', fontWeight: 700, color: '#fff' }}>{t.s4WA}</span>
          </div>
        </div>
      )

    case 'streetwear': {
      const heroOnC2 = getTextColor(c2)
      const ctaBtnBg = heroOnC2
      const ctaBtnText = c2
      return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#0a0a0a' }}>
          <div style={{ height: '18px', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', flexShrink: 0 }}>
            <span style={{ fontSize: '7px', color: '#fff', opacity: 0.4 }}>9:41</span>
            <span style={{ fontSize: '7px', color: '#fff', opacity: 0.4 }}>●●●</span>
          </div>
          <div style={{ height: '34px', background: navBg, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px', flexShrink: 0 }}>
            <span style={{ fontSize: nameSz, color: navText, fontWeight: 900, letterSpacing: '0.05em', textTransform: 'uppercase', ...nameStyle, maxWidth: '60%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
            <LogoCircle />
          </div>
          <div style={{ background: c2, padding: '16px 12px 14px', textAlign: 'center', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
            <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '80px', height: '80px', background: c0, opacity: 0.15, borderRadius: '50%' }} />
            <div style={{ fontSize: '7px', color: heroOnC2, opacity: 0.55, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '2px', fontWeight: 600 }}>DROP 001</div>
            <div style={{ fontSize: name.length > 10 ? '16px' : name.length > 6 ? '22px' : '28px', fontWeight: 900, color: heroOnC2, lineHeight: 1.1, letterSpacing: '-0.02em', textTransform: 'uppercase', width: '100%', textAlign: 'center', wordBreak: 'break-word', whiteSpace: 'normal', marginBottom: '5px' }}>
              {name}
            </div>
            <div style={{ fontSize: '7px', color: heroOnC2, opacity: 0.5, marginBottom: '10px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{slogan}</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: ctaBtnBg, padding: '5px 14px' }}>
              <span style={{ fontSize: '8px', fontWeight: 900, color: ctaBtnText, letterSpacing: '0.08em', textAlign: 'center' }}>{lang === 'ar' ? 'تسوّق الجديد →' : 'קנה את החדש →'}</span>
            </div>
          </div>
          <div style={{ flex: 1, background: '#111', padding: '6px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', overflow: 'hidden' }}>
            {getItems(['₪149', '₪149']).map((item, i) => (
              <div key={i} style={{ background: '#111', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ flex: 1, overflow: 'hidden', minHeight: '70px', position: 'relative' }}>
                  <img src={item.src} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} alt="" />
                  <div style={{ position: 'absolute', inset: 0, background: `${[c0, c1][i]}20` }} />
                </div>
                <div style={{ padding: '4px 5px', flexShrink: 0 }}>
                  <div style={{ fontSize: '7px', fontWeight: 600, marginBottom: '1px', color: '#fff' }}>{item.name}</div>
                  <div style={{ fontSize: '8px', fontWeight: 700, color: [c0, c1][i] }}>{item.priceStr}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: '#0a0a0a', borderTop: `1px solid ${c0}30`, padding: '9px 12px', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <span style={{ fontSize: '10px' }}>🔔</span>
            <span style={{ flex: 1, fontSize: '8px', color: 'rgba(255,255,255,0.5)' }}>{lang === 'ar' ? 'تنبيه الدروب القادم' : 'התראת דרופ הבא'}</span>
            <div style={{ background: c0, borderRadius: '4px', padding: '3px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '7px', fontWeight: 700, color: ctaText, textAlign: 'center' }}>{lang === 'ar' ? 'تسجيل' : 'הרשם'}</span>
            </div>
          </div>
        </div>
      )
    }

    case 'minimal':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff' }}>
          <div style={{ height: '18px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', flexShrink: 0 }}>
            <span style={{ fontSize: '7px', color: '#aaa' }}>9:41</span>
            <span style={{ fontSize: '7px', color: '#aaa' }}>●●●</span>
          </div>
          <div style={{ height: '34px', background: navBg, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px', borderBottom: `1px solid ${c0}20`, flexShrink: 0 }}>
            <LogoCircle />
            <span style={{ fontSize: nameSz, fontWeight: 500, color: navText, letterSpacing: '0.05em', ...nameStyle, maxWidth: '60%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
            <span style={{ fontSize: '10px', color: navText, opacity: 0.4 }}>≡</span>
          </div>
          <div style={{ background: `${c0}08`, padding: '28px 12px 20px', textAlign: 'center', flexShrink: 0 }}>
            <div style={{ fontSize: '8px', color: '#999', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px' }}>{lang === 'ar' ? 'مجموعة جديدة' : 'קולקציה חדשה'}</div>
            <div style={{ fontSize: nameSz, fontWeight: 300, color: '#111', marginBottom: '4px', letterSpacing: '-0.01em', ...nameStyle }}>{name}</div>
            <div style={{ width: '30px', height: '1px', background: '#ddd', margin: '8px auto' }} />
            <div style={{ fontSize: '8px', color: '#bbb', marginBottom: '14px' }}>{slogan}</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${c0}`, padding: '5px 14px' }}>
              <span style={{ fontSize: '8px', fontWeight: 500, color: c0, letterSpacing: '0.06em', textAlign: 'center' }}>{t.s4ShopNow}</span>
            </div>
          </div>
          <div style={{ flex: 1, background: '#fafafa', padding: '6px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', overflow: 'hidden' }}>
            {getItems(['₪199', '₪199']).map((item, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: '4px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, overflow: 'hidden', minHeight: '70px' }}>
                  <img src={item.src} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} alt="" />
                </div>
                <div style={{ padding: '4px 5px', flexShrink: 0 }}>
                  <div style={{ fontSize: '7px', fontWeight: 600, marginBottom: '1px', color: '#777' }}>{item.name}</div>
                  <div style={{ fontSize: '8px', fontWeight: 700, color: c0 }}>{item.priceStr}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: '#fff', borderTop: '1px solid #f0f0f0', padding: '9px 12px', display: 'flex', justifyContent: 'center', gap: '16px', flexShrink: 0 }}>
            {[lang === 'ar' ? 'الرئيسية' : 'בית', lang === 'ar' ? 'المتجر' : 'חנות', lang === 'ar' ? 'حساب' : 'פרופיל'].map((label, i) => (
              <span key={i} style={{ fontSize: '7px', color: i === 0 ? c0 : '#ccc', fontWeight: i === 0 ? 600 : 400, borderBottom: i === 0 ? `1px solid ${c0}` : 'none', paddingBottom: '1px' }}>{label}</span>
            ))}
          </div>
        </div>
      )

    case 'restaurant':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: navBg }}>
          <div style={{ height: '18px', background: navBg, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', flexShrink: 0 }}>
            <span style={{ fontSize: '7px', color: navText, opacity: 0.6 }}>9:41</span>
            <span style={{ fontSize: '7px', color: navText, opacity: 0.6 }}>●●●</span>
          </div>
          {/* Nav: name + 🍕, "30 min" delivery badge right */}
          <div style={{ height: '34px', background: navBg, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px', borderBottom: `1px solid ${c0}30`, flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '10px' }}>🍕</span>
              <span style={{ fontSize: nameSz, fontWeight: 700, color: navText, ...nameStyle, maxWidth: '60%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
            </div>
            <div style={{ background: '#22c55e', borderRadius: '6px', padding: '2px 6px' }}>
              <span style={{ fontSize: '6px', fontWeight: 700, color: '#fff' }}>30 min</span>
            </div>
          </div>
          {/* Hero: warm gradient, name, two buttons side by side */}
          <div style={{ background: `linear-gradient(135deg, ${getDarkVariant(c0)}, ${c0}55)`, padding: '14px 12px 11px', textAlign: 'center', flexShrink: 0 }}>
            <div style={{ fontSize: '22px', marginBottom: '3px' }}>🍽️</div>
            <div style={{ fontSize: nameSz, fontWeight: 800, color: c0, marginBottom: '2px', ...nameStyle }}>{name}</div>
            <div style={{ fontSize: '7px', color: heroText, opacity: 0.5, marginBottom: '8px' }}>{slogan}</div>
            <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
              <div style={{ background: '#22c55e', borderRadius: '14px', padding: '4px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '7px', fontWeight: 700, color: '#fff' }}>🛵 {lang === 'ar' ? 'اطلب توصيل' : 'משלוח'}</span>
              </div>
              <div style={{ border: `1px solid ${c0}55`, borderRadius: '14px', padding: '4px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '7px', color: c0, fontWeight: 600 }}>🏪 {lang === 'ar' ? 'استلام' : 'איסוף'}</span>
              </div>
            </div>
          </div>
          {/* Menu items: full-width horizontal cards */}
          <div style={{ flex: 1, background: darkCardBg, padding: '6px', display: 'flex', flexDirection: 'column', gap: '5px', overflow: 'hidden' }}>
            {getItems(['₪65', '₪45']).map((item, i) => (
              <div key={i} style={{ background: `${c0}12`, borderRadius: '8px', overflow: 'hidden', border: `1px solid ${c0}18`, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                <div style={{ width: '60px', height: '60px', flexShrink: 0, overflow: 'hidden' }}>
                  <img src={item.src} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} alt="" />
                </div>
                <div style={{ padding: '6px 8px', flex: 1 }}>
                  <div style={{ fontSize: '8px', fontWeight: 600, color: darkCardText, marginBottom: '2px' }}>{item.name}</div>
                  <div style={{ fontSize: '9px', fontWeight: 700, color: c0 }}>{item.priceStr}</div>
                </div>
                <div style={{ padding: '0 8px' }}>
                  <div style={{ width: '22px', height: '22px', background: c0, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '14px', color: ctaText, lineHeight: 1 }}>+</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Footer: min order info */}
          <div style={{ background: navBg, borderTop: `1px solid ${c0}20`, padding: '8px 12px', display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: '7px', color: navText, opacity: 0.45 }}>{lang === 'ar' ? 'الحد الأدنى للطلب: ₪50' : 'מינימום הזמנה: ₪50'}</span>
          </div>
        </div>
      )

    case 'tech':
    default:
      return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: navBg }}>
          <div style={{ height: '18px', background: navBg, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', flexShrink: 0 }}>
            <span style={{ fontSize: '7px', color: navText, opacity: 0.5 }}>9:41</span>
            <span style={{ fontSize: '7px', color: navText, opacity: 0.5 }}>●●●</span>
          </div>
          {/* Nav: store name + v2.0 badge with dark blue accent */}
          <div style={{ height: '34px', background: navBg, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px', borderBottom: `1px solid ${c0}20`, flexShrink: 0 }}>
            <LogoCircle />
            <span style={{ fontSize: nameSz, fontWeight: 700, color: navText, ...nameStyle, maxWidth: '60%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
            <div style={{ background: '#1e3a8a', borderRadius: '4px', padding: '2px 5px' }}>
              <span style={{ fontSize: '6px', fontWeight: 700, color: '#93c5fd' }}>v2.0</span>
            </div>
          </div>
          {/* Hero: left-aligned, name + NEW badge, spec-style bullets */}
          <div style={{ background: `linear-gradient(160deg,${getDarkVariant(c0)},${getDarkVariant(c1)})`, padding: '16px 10px 12px', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
            <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '55%', background: `${c0}08`, clipPath: 'polygon(20% 0,100% 0,100% 100%,0% 100%)' }} />
            <div style={{ fontSize: '7px', color: c0, letterSpacing: '0.12em', marginBottom: '4px', position: 'relative', zIndex: 1 }}>// {lang === 'ar' ? 'التقنية الجديدة' : 'טכנולוגיה חדשה'}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px', position: 'relative', zIndex: 1 }}>
              <span style={{ fontSize: nameSz, fontWeight: 800, color: heroText, lineHeight: 1.1, ...nameStyle }}>{name}</span>
              <div style={{ background: '#ef4444', borderRadius: '3px', padding: '1px 5px', flexShrink: 0 }}>
                <span style={{ fontSize: '6px', fontWeight: 800, color: '#fff' }}>{lang === 'ar' ? 'جديد' : 'חדש'}</span>
              </div>
            </div>
            <div style={{ fontSize: '7.5px', color: c0, fontFamily: 'monospace', marginBottom: '10px', position: 'relative', zIndex: 1, letterSpacing: '0.04em' }}>
              {lang === 'ar' ? '• 4K  • ذكاء اصطناعي  • سريع' : '• 4K  • AI  • מהיר'}
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: c0, borderRadius: '6px', padding: '5px 12px', position: 'relative', zIndex: 1 }}>
              <span style={{ fontSize: '8px', fontWeight: 700, color: ctaText, textAlign: 'center' }}>{lang === 'ar' ? 'استكشف →' : 'גלה עוד →'}</span>
            </div>
          </div>
          {/* Products: cards with SPEC badge on top corner */}
          <div style={{ flex: 1, background: darkCardBg, padding: '6px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', overflow: 'hidden' }}>
            {getItems(['₪299', '₪499']).map((item, i) => (
              <div key={i} style={{ background: `${c0}18`, borderRadius: '8px', overflow: 'hidden', border: `1px solid ${c0}20`, display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, overflow: 'hidden', minHeight: '70px', position: 'relative' }}>
                  <img src={item.src} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} alt="" />
                  <div style={{ position: 'absolute', top: '3px', left: '3px', background: c0, borderRadius: '3px', padding: '1px 5px' }}>
                    <span style={{ fontSize: '6px', fontWeight: 700, color: ctaText }}>{lang === 'ar' ? 'مميز' : 'מיוחד'}</span>
                  </div>
                </div>
                <div style={{ padding: '4px 5px', flexShrink: 0 }}>
                  <div style={{ fontSize: '7px', fontWeight: 600, marginBottom: '1px', color: darkCardText }}>{item.name}</div>
                  <div style={{ fontSize: '8px', fontWeight: 700, color: darkPrice }}>{item.priceStr}</div>
                </div>
              </div>
            ))}
          </div>
          {/* Footer: 3 feature pills */}
          <div style={{ background: navBg, borderTop: `1px solid ${c0}15`, padding: '8px 10px', display: 'flex', gap: '4px', flexShrink: 0 }}>
            {[lang === 'ar' ? '⚡ سريع' : '⚡ מהיר', lang === 'ar' ? '🔒 آمن' : '🔒 מאובטח', lang === 'ar' ? '✓ ضمان' : '✓ אחריות'].map((tag, i) => (
              <div key={i} style={{ flex: 1, background: `${c0}12`, border: `1px solid ${c0}20`, borderRadius: '4px', padding: '3px 4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '7px', color: c0 }}>{tag}</span>
              </div>
            ))}
          </div>
        </div>
      )
  }
}
