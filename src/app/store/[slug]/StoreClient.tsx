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

const KNOWN = ['luxury', 'gaming', 'beauty', 'streetwear', 'restaurant', 'tech', 'minimal', 'creator']

// ── Color helpers (match onboarding preview exactly) ──────────────────────────

function getTextColor(bgHex: string): string {
  const hex = bgHex.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#000000' : '#ffffff'
}

function getDarkVariant(hex: string): string {
  const h = hex.replace('#', '')
  const r = Math.max(0, parseInt(h.substring(0, 2), 16) - 60)
  const g = Math.max(0, parseInt(h.substring(2, 4), 16) - 60)
  const b = Math.max(0, parseInt(h.substring(4, 6), 16) - 60)
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')
}

function getLightVariant(hex: string): string {
  const h = hex.replace('#', '')
  const r = Math.min(255, parseInt(h.substring(0, 2), 16) + 80)
  const g = Math.min(255, parseInt(h.substring(2, 4), 16) + 80)
  const b = Math.min(255, parseInt(h.substring(4, 6), 16) + 80)
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')
}

// ── Per-archetype design tokens ────────────────────────────────────────────────

type ArchCfg = {
  pageBg: string
  heroBg: string
  navBg: string
  navBorder: string
  navTextColor: string
  textColor: string
  mutedColor: string
  sectionBg: string
  sectionBorder: string
  cardBg: string
  cardBorder: string
  cardRadius: string
  cardExtra?: React.CSSProperties
  nameStyle: React.CSSProperties
  priceStyle: React.CSSProperties
  sectionTitleColor: string
  pillBg: string
  pillBorder: string
  pillColor: string
}

function getConfig(archetype: string, c0: string, c1: string, c2: string): ArchCfg {
  const navBg        = getDarkVariant(c0)
  const navText      = getTextColor(navBg)
  const heroText     = getTextColor(c0)
  const lightBg      = getLightVariant(c2)
  const lightCardText = getTextColor(lightBg)
  const darkPrice    = navText !== heroText ? c0 : c1
  const lightPrice   = lightCardText !== heroText ? c0 : c1

  switch (archetype) {
    case 'luxury':
      return {
        pageBg: '#050505',
        heroBg: `linear-gradient(160deg, #0d0d0d, ${getDarkVariant(c0)})`,
        navBg: '#050505',
        navBorder: `${c0}18`,
        navTextColor: c0,
        textColor: c0,
        mutedColor: `${c0}60`,
        sectionBg: '#0a0a0a',
        sectionBorder: `${c0}15`,
        cardBg: `${c0}08`,
        cardBorder: `${c0}15`,
        cardRadius: '2px',
        nameStyle: { fontWeight: 300, letterSpacing: '0.14em', textTransform: 'uppercase' as const, fontSize: '11px', color: navText },
        priceStyle: { fontWeight: 400, color: c0, fontSize: '14px', letterSpacing: '0.06em' },
        sectionTitleColor: `${c0}70`,
        pillBg: `${c0}15`,
        pillBorder: `${c0}30`,
        pillColor: c0,
      }
    case 'gaming':
      return {
        pageBg: '#050510',
        heroBg: `linear-gradient(135deg, #0d0020, ${c2}, ${c0}40)`,
        navBg,
        navBorder: `${c0}60`,
        navTextColor: navText,
        textColor: '#fff',
        mutedColor: 'rgba(255,255,255,0.4)',
        sectionBg: navBg,
        sectionBorder: `${c0}30`,
        cardBg: `${c0}18`,
        cardBorder: `${c0}30`,
        cardRadius: '8px',
        cardExtra: { boxShadow: `0 0 12px ${c0}25` },
        nameStyle: { fontWeight: 600, fontSize: '12px', color: navText },
        priceStyle: { fontWeight: 700, color: c0, fontSize: '15px', textShadow: `0 0 8px ${c0}80` },
        sectionTitleColor: c0,
        pillBg: `${c0}20`,
        pillBorder: `${c0}50`,
        pillColor: c0,
      }
    case 'beauty':
      return {
        pageBg: lightBg,
        heroBg: `linear-gradient(160deg, ${c0}20, ${c1}15)`,
        navBg,
        navBorder: `${c0}30`,
        navTextColor: navText,
        textColor: lightCardText,
        mutedColor: lightCardText === '#000000' ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.45)',
        sectionBg: lightBg,
        sectionBorder: `${c0}20`,
        cardBg: `${lightBg}cc`,
        cardBorder: `${c0}20`,
        cardRadius: '12px',
        cardExtra: { boxShadow: `0 4px 20px ${c0}12` },
        nameStyle: { fontWeight: 600, fontSize: '12px', color: lightCardText },
        priceStyle: { fontWeight: 700, color: lightPrice, fontSize: '14px' },
        sectionTitleColor: `${c0}80`,
        pillBg: `${c0}18`,
        pillBorder: `${c0}30`,
        pillColor: c0,
      }
    case 'streetwear':
      return {
        pageBg: '#0a0a0a',
        heroBg: c2,
        navBg,
        navBorder: 'transparent',
        navTextColor: navText,
        textColor: '#fff',
        mutedColor: 'rgba(255,255,255,0.35)',
        sectionBg: '#111',
        sectionBorder: 'rgba(255,255,255,0.06)',
        cardBg: '#111',
        cardBorder: 'transparent',
        cardRadius: '0px',
        cardExtra: { borderLeft: `3px solid ${c0}` },
        nameStyle: { fontWeight: 600, fontSize: '12px', color: '#fff' },
        priceStyle: { fontWeight: 900, color: c0, fontSize: '15px' },
        sectionTitleColor: 'rgba(255,255,255,0.3)',
        pillBg: 'rgba(255,255,255,0.05)',
        pillBorder: 'rgba(255,255,255,0.1)',
        pillColor: '#fff',
      }
    case 'minimal':
      return {
        pageBg: '#fff',
        heroBg: `${c0}08`,
        navBg,
        navBorder: `${c0}20`,
        navTextColor: navText,
        textColor: '#111',
        mutedColor: '#999',
        sectionBg: '#fafafa',
        sectionBorder: '#efefef',
        cardBg: '#fff',
        cardBorder: 'transparent',
        cardRadius: '4px',
        nameStyle: { fontWeight: 600, fontSize: '11px', color: '#777' },
        priceStyle: { fontWeight: 600, color: c0, fontSize: '13px' },
        sectionTitleColor: '#bbb',
        pillBg: '#f5f5f5',
        pillBorder: '#e8e8e8',
        pillColor: '#555',
      }
    case 'restaurant':
      return {
        pageBg: navBg,
        heroBg: `linear-gradient(135deg, ${getDarkVariant(c0)}, ${c0}55)`,
        navBg,
        navBorder: `${c0}30`,
        navTextColor: navText,
        textColor: navText,
        mutedColor: navText === '#ffffff' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
        sectionBg: navBg,
        sectionBorder: `${c0}18`,
        cardBg: `${c0}12`,
        cardBorder: `${c0}18`,
        cardRadius: '12px',
        nameStyle: { fontWeight: 600, fontSize: '13px', color: navText },
        priceStyle: { fontWeight: 700, color: c0, fontSize: '18px' },
        sectionTitleColor: `${c0}80`,
        pillBg: `${c0}18`,
        pillBorder: `${c0}35`,
        pillColor: c0,
      }
    case 'tech':
      return {
        pageBg: navBg,
        heroBg: `linear-gradient(160deg, ${getDarkVariant(c0)}, ${getDarkVariant(c1)})`,
        navBg,
        navBorder: `${c0}20`,
        navTextColor: navText,
        textColor: navText,
        mutedColor: navText === '#ffffff' ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)',
        sectionBg: navBg,
        sectionBorder: `${c0}20`,
        cardBg: `${c0}18`,
        cardBorder: `${c0}20`,
        cardRadius: '6px',
        cardExtra: { boxShadow: `0 0 16px ${c0}15` },
        nameStyle: { fontWeight: 600, fontSize: '11px', color: navText, fontFamily: 'monospace' },
        priceStyle: { fontWeight: 700, color: darkPrice, fontSize: '15px' },
        sectionTitleColor: `${c0}70`,
        pillBg: `${c0}15`,
        pillBorder: `${c0}30`,
        pillColor: c0,
      }
    case 'creator':
    default:
      return {
        pageBg: lightBg,
        heroBg: `linear-gradient(160deg, ${c0}18, ${c1}12)`,
        navBg,
        navBorder: `${c0}20`,
        navTextColor: navText,
        textColor: lightCardText,
        mutedColor: lightCardText === '#000000' ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.45)',
        sectionBg: lightBg,
        sectionBorder: `${c0}20`,
        cardBg: `${lightBg}ee`,
        cardBorder: 'transparent',
        cardRadius: '4px',
        cardExtra: { boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
        nameStyle: { fontWeight: 600, fontSize: '12px', color: lightCardText },
        priceStyle: { fontWeight: 700, color: lightPrice, fontSize: '14px' },
        sectionTitleColor: `${c0}80`,
        pillBg: `${c0}20`,
        pillBorder: `${c0}40`,
        pillColor: c0,
      }
  }
}

// ── Hero sections ───────────────────────────────────────────────────────────────

function LuxuryHero({ store, c0, heroBg, ar }: { store: Store; c0: string; heroBg: string; ar: boolean }) {
  return (
    <div style={{ background: heroBg, paddingTop: '56px', textAlign: 'center', position: 'relative' }}>
      <div style={{ padding: '60px 32px 20px' }}>
        <div style={{ width: '40px', height: '1px', background: c0, margin: '0 auto 28px', opacity: 0.5 }} />
        <p style={{ fontSize: '10px', letterSpacing: '0.35em', color: `${c0}70`, textTransform: 'uppercase', marginBottom: '20px', fontWeight: 300 }}>
          {ar ? 'مجموعة حصرية' : 'קולקציה בלעדית'}
        </p>
        <h1 style={{ fontSize: '22px', fontWeight: 200, color: c0, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '18px', lineHeight: 1.4 }}>
          {store.name}
        </h1>
        <div style={{ width: '60px', height: '1px', background: c0, margin: '0 auto 18px', opacity: 0.35 }} />
        {store.slogan && (
          <p style={{ fontSize: '11px', color: `${c0}55`, fontWeight: 200, letterSpacing: '0.15em', fontStyle: 'italic', marginBottom: '32px' }}>
            {store.slogan}
          </p>
        )}
        <a href="#products" style={{ display: 'inline-block', border: `1px solid ${c0}50`, color: c0, padding: '10px 32px', fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', textDecoration: 'none', fontWeight: 300 }}>
          {ar ? 'استكشف المجموعة' : 'גלה את הקולקציה'}
        </a>
      </div>
      <div style={{ height: '32px' }} />
    </div>
  )
}

function GamingHero({ store, c0, c1, heroBg, ar }: { store: Store; c0: string; c1: string; heroBg: string; ar: boolean }) {
  const ctaText = getTextColor(c0)
  return (
    <div style={{ background: heroBg, paddingTop: '56px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: `repeating-linear-gradient(0deg,transparent,transparent 8px,${c0}08 8px,${c0}08 9px)`, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '20px', right: '10%', width: '120px', height: '120px', background: c0, borderRadius: '50%', filter: 'blur(60px)', opacity: 0.2 }} />
      <div style={{ position: 'absolute', bottom: '0', left: '5%', width: '80px', height: '80px', background: c1, borderRadius: '50%', filter: 'blur(40px)', opacity: 0.1 }} />
      <div style={{ padding: '44px 24px 36px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: '12px', color: c0, letterSpacing: '0.15em', marginBottom: '12px', textTransform: 'uppercase', fontWeight: 700 }}>
          {ar ? 'ارتقِ بمستواك' : 'עלה רמה'}
        </div>
        <h1 style={{ fontSize: '36px', fontWeight: 900, color: '#fff', textShadow: `0 0 20px ${c0}, 0 0 60px ${c0}30`, marginBottom: '10px', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          {store.name}
        </h1>
        {store.slogan && (
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '28px' }}>{store.slogan}</p>
        )}
        <a href="#products" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: c0, color: ctaText, borderRadius: '4px', padding: '12px 28px', fontSize: '13px', fontWeight: 800, textDecoration: 'none', boxShadow: `0 0 12px ${c0}80`, letterSpacing: '0.05em' }}>
          {ar ? 'العب الآن ▶' : 'שחק עכשיו ▶'}
        </a>
      </div>
    </div>
  )
}

function BeautyHero({ store, c0, c1, heroBg, ar }: { store: Store; c0: string; c1: string; heroBg: string; ar: boolean }) {
  return (
    <div style={{ background: heroBg, paddingTop: '56px' }}>
      <div style={{ padding: '48px 24px 40px', textAlign: 'center' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: `linear-gradient(135deg, ${c0}, ${c1})`, margin: '0 auto 20px', boxShadow: `0 8px 32px ${c0}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '22px' }}>✿</span>
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: getTextColor(c0), fontStyle: 'italic', marginBottom: '10px', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
          {store.name}
        </h1>
        {store.slogan && (
          <p style={{ fontSize: '13px', color: `${c0}aa`, marginBottom: '28px', lineHeight: 1.6 }}>{store.slogan}</p>
        )}
        <a href="#products" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: `linear-gradient(135deg, ${c0}, ${c1})`, color: getTextColor(c0), borderRadius: '50px', padding: '13px 32px', fontSize: '14px', fontWeight: 700, textDecoration: 'none', boxShadow: `0 8px 24px ${c0}40` }}>
          {ar ? 'تسوّقي الآن ✿' : 'קני עכשיו ✿'}
        </a>
      </div>
      <div style={{ height: '24px' }} />
    </div>
  )
}

function StreetwearHero({ store, c0, heroBg, ar }: { store: Store; c0: string; heroBg: string; ar: boolean }) {
  const nameLen = store.name.length
  const nameFontSize = nameLen > 12 ? '36px' : nameLen > 8 ? '48px' : '56px'
  const heroTextColor = getTextColor(heroBg.startsWith('#') ? heroBg : '#000')
  return (
    <div style={{ background: heroBg, paddingTop: '56px', borderBottom: `3px solid ${c0}` }}>
      <div style={{ padding: '40px 20px 32px' }}>
        <div style={{ fontSize: '9px', color: heroTextColor, opacity: 0.4, letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: '12px' }}>
          {ar ? 'الموسم الجديد — DROP 001' : 'SEASON DROP 001'}
        </div>
        <h1 style={{ fontSize: nameFontSize, fontWeight: 900, color: heroTextColor, lineHeight: 0.95, letterSpacing: '-0.03em', textTransform: 'uppercase', marginBottom: '20px', wordBreak: 'break-word' }}>
          {store.name}
        </h1>
        {store.slogan && (
          <p style={{ fontSize: '12px', color: heroTextColor, opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '28px' }}>
            {store.slogan}
          </p>
        )}
        <a href="#products" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: heroTextColor, color: heroBg.startsWith('#') ? heroBg : '#000', padding: '12px 28px', fontSize: '12px', fontWeight: 900, textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          {ar ? 'تسوّق الدروب →' : 'SHOP THE DROP →'}
        </a>
      </div>
    </div>
  )
}

function MinimalHero({ store, c0, heroBg, ar }: { store: Store; c0: string; heroBg: string; ar: boolean }) {
  return (
    <div style={{ background: heroBg, paddingTop: '56px', borderBottom: '1px solid #efefef' }}>
      <div style={{ padding: '56px 32px 48px', textAlign: 'center' }}>
        <p style={{ fontSize: '10px', color: '#bbb', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '16px' }}>
          {ar ? 'متجر أونلاين' : 'ONLINE STORE'}
        </p>
        <h1 style={{ fontSize: '26px', fontWeight: 300, color: '#111', letterSpacing: '0.05em', marginBottom: '12px' }}>
          {store.name}
        </h1>
        <div style={{ width: '32px', height: '1px', background: '#ddd', margin: '0 auto 16px' }} />
        {store.slogan && (
          <p style={{ fontSize: '13px', color: '#aaa', fontWeight: 300, marginBottom: '36px' }}>{store.slogan}</p>
        )}
        <a href="#products" style={{ display: 'inline-block', border: '1px solid #111', color: '#111', padding: '10px 28px', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none', fontWeight: 400 }}>
          {ar ? 'عرض المنتجات' : 'VIEW PRODUCTS'}
        </a>
      </div>
    </div>
  )
}

function RestaurantHero({ store, c0, heroBg, ar }: { store: Store; c0: string; heroBg: string; ar: boolean }) {
  return (
    <div style={{ background: heroBg, paddingTop: '56px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, transparent, ${c0 || '#f59e0b'}, transparent)` }} />
      <div style={{ padding: '44px 24px 36px', textAlign: 'center' }}>
        <div style={{ fontSize: '36px', marginBottom: '14px' }}>🍽️</div>
        <h1 style={{ fontSize: '30px', fontWeight: 800, color: c0, marginBottom: '8px', lineHeight: 1.2 }}>
          {store.name}
        </h1>
        {store.slogan && (
          <p style={{ fontSize: '13px', color: `${c0}80`, marginBottom: '28px', fontStyle: 'italic' }}>{store.slogan}</p>
        )}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#products" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#22c55e', color: '#fff', borderRadius: '20px', padding: '11px 24px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>
            🛵 {ar ? 'اطلب توصيل' : 'הזמן משלוח'}
          </a>
          <a href="#products" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', border: `1px solid ${c0 || '#f59e0b'}50`, color: c0 || '#f59e0b', borderRadius: '20px', padding: '11px 24px', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
            📍 {ar ? 'استلام' : 'איסוף'}
          </a>
        </div>
      </div>
    </div>
  )
}

function TechHero({ store, c0, heroBg, ar }: { store: Store; c0: string; heroBg: string; ar: boolean }) {
  const ctaText = getTextColor(c0)
  return (
    <div style={{ background: heroBg, paddingTop: '56px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '55%', background: `${c0}08`, clipPath: 'polygon(20% 0,100% 0,100% 100%,0% 100%)', pointerEvents: 'none' }} />
      <div style={{ padding: '44px 24px 36px', position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: '11px', color: c0, letterSpacing: '0.12em', fontFamily: 'monospace', marginBottom: '14px' }}>
          {ar ? '// التقنية الجديدة' : '// טכנולוגיה חדשה'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: getTextColor(heroBg.startsWith('linear') ? c0 : heroBg), fontFamily: 'monospace', lineHeight: 1.2, margin: 0 }}>
            {store.name}
          </h1>
          <div style={{ background: '#ef4444', borderRadius: '4px', padding: '2px 8px', flexShrink: 0 }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#fff' }}>{ar ? 'جديد' : 'חדש'}</span>
          </div>
        </div>
        {store.slogan && (
          <p style={{ fontSize: '12px', color: `${c0}80`, fontFamily: 'monospace', marginBottom: '12px' }}>{store.slogan}</p>
        )}
        <div style={{ fontSize: '12px', color: c0, fontFamily: 'monospace', marginBottom: '24px', letterSpacing: '0.04em' }}>
          {ar ? '• 4K  • ذكاء اصطناعي  • سريع' : '• 4K  • AI  • מהיר'}
        </div>
        <a href="#products" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: c0, color: ctaText, borderRadius: '6px', padding: '12px 24px', fontSize: '13px', fontWeight: 700, textDecoration: 'none', fontFamily: 'monospace', boxShadow: `0 4px 20px ${c0}40` }}>
          {ar ? 'استكشف →' : 'גלה עוד →'}
        </a>
      </div>
    </div>
  )
}

function CreatorHero({ store, c0, c1, heroBg, ar }: { store: Store; c0: string; c1: string; heroBg: string; ar: boolean }) {
  const ctaText = getTextColor(c0)
  const lightBgText = getTextColor(heroBg.startsWith('#') ? heroBg : '#ffffff')
  return (
    <div style={{ background: heroBg, paddingTop: '56px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '30px', right: '20px', width: '100px', height: '100px', background: c1, borderRadius: '50%', filter: 'blur(50px)', opacity: 0.2 }} />
      <div style={{ padding: '44px 24px 36px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: '12px', color: c0, marginBottom: '8px', fontWeight: 600, letterSpacing: '0.08em' }}>
          {ar ? `بقلم ${store.name}` : `של ${store.name}`}
        </div>
        <h1 style={{ fontSize: '30px', fontWeight: 900, color: lightBgText, marginBottom: '6px', lineHeight: 1.1 }}>
          {store.slogan || store.name}
        </h1>
        <p style={{ fontSize: '13px', color: lightBgText, opacity: 0.6, marginBottom: '24px', lineHeight: 1.6 }}>
          {store.slogan ? store.name : (ar ? 'منتجات حصرية' : 'מוצרים בלעדיים')}
        </p>
        <a href="#products" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: c0, color: ctaText, borderRadius: '20px', padding: '12px 28px', fontSize: '14px', fontWeight: 700, textDecoration: 'none', boxShadow: `0 8px 24px ${c0}50` }}>
          {ar ? 'تسوّق الآن ✦' : 'קנה עכשיו ✦'}
        </a>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function StoreClient({ store, products }: { store: Store; products: Product[] }) {
  const lang = (store.lang ?? 'ar') as 'ar' | 'he'
  const fontClass = lang === 'he' ? heebo.className : cairo.className
  const ar = lang === 'ar'
  const colors = Array.isArray(store.colors) ? store.colors : ['#7c3aed', '#f59e0b', '#0f172a']
  const c0 = colors[0] ?? '#7c3aed'
  const c1 = colors[1] ?? '#f59e0b'
  const c2 = colors[2] ?? '#0f172a'
  const archetype = KNOWN.includes(store.archetype ?? '') ? (store.archetype ?? 'minimal') : 'minimal'
  const cfg = getConfig(archetype, c0, c1, c2)

  const [cartCount, setCartCount] = useState(0)
  const [drawerProduct, setDrawerProduct] = useState<Product | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const openDrawer = (p: Product) => { setDrawerProduct(p); setDrawerOpen(true) }
  const closeDrawer = () => setDrawerOpen(false)

  const waNumber = store.whatsapp_number?.replace(/\D/g, '')?.replace(/^0/, '972') ?? ''
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

  const isLight = getTextColor(cfg.pageBg) === '#000000'

  return (
    <div dir="rtl" className={fontClass} style={{ minHeight: '100vh', background: cfg.pageBg, color: cfg.textColor, overflowX: 'hidden', paddingBottom: waNumber ? '80px' : '0' }}>
      <style>{`
        *{box-sizing:border-box}
        body{margin:0;padding:0}
        @keyframes drawerUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .drawer-open{animation:drawerUp 0.28s cubic-bezier(0.32,0.72,0,1) forwards}
        .prod-card{transition:transform 0.15s,box-shadow 0.15s}
        .prod-card:active{transform:scale(0.97)}
      `}</style>

      {/* ── Navbar ─────────────────────────────────────────────── */}
      <nav dir="rtl" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: cfg.navBg, backdropFilter: 'blur(12px)', borderBottom: `1px solid ${cfg.navBorder}`, padding: '0 16px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Left group (visual right in RTL) */}
        {archetype === 'luxury' ? (
          <span style={{ fontSize: '14px', fontWeight: 300, color: cfg.navTextColor, letterSpacing: '0.2em', textTransform: 'uppercase' }}>{store.name}</span>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {archetype === 'restaurant' && <span style={{ fontSize: '18px' }}>🍕</span>}
            <div style={{ width: '34px', height: '34px', borderRadius: archetype === 'streetwear' || archetype === 'minimal' ? '4px' : '50%', background: `linear-gradient(135deg,${c0},${c1})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: archetype === 'gaming' || archetype === 'tech' ? `0 0 10px ${c0}50` : 'none' }}>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#fff' }}>{(store.name?.[0] ?? '?').toUpperCase()}</span>
            </div>
            <span style={{ fontSize: archetype === 'streetwear' ? '13px' : '15px', fontWeight: archetype === 'streetwear' ? 900 : 700, color: cfg.navTextColor, letterSpacing: archetype === 'streetwear' ? '0.05em' : '0', textTransform: archetype === 'streetwear' ? 'uppercase' : 'none' }}>
              {store.name}
            </span>
          </div>
        )}
        {/* Right group (visual left in RTL) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {archetype === 'gaming' && (
            <span style={{ fontSize: '11px', color: '#0f0', background: 'rgba(0,255,0,0.1)', padding: '3px 8px', borderRadius: '4px', fontWeight: 700 }}>🔴 LIVE</span>
          )}
          {archetype === 'restaurant' && (
            <div style={{ background: '#22c55e', borderRadius: '6px', padding: '3px 8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#fff' }}>30 min</span>
            </div>
          )}
          {archetype === 'tech' && (
            <div style={{ background: '#1e3a8a', borderRadius: '4px', padding: '3px 8px' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#93c5fd' }}>v2.0</span>
            </div>
          )}
          <div style={{ position: 'relative' }}>
            <span style={{ fontSize: '22px', cursor: 'pointer', opacity: archetype === 'luxury' ? 0.4 : 1 }}>🛒</span>
            {cartCount > 0 && (
              <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: c0, color: '#fff', fontSize: '9px', fontWeight: 800, width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cartCount}</span>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────── */}
      {archetype === 'luxury'     && <LuxuryHero     store={store} c0={c0}           heroBg={cfg.heroBg} ar={ar} />}
      {archetype === 'gaming'     && <GamingHero     store={store} c0={c0} c1={c1}   heroBg={cfg.heroBg} ar={ar} />}
      {archetype === 'beauty'     && <BeautyHero     store={store} c0={c0} c1={c1}   heroBg={cfg.heroBg} ar={ar} />}
      {archetype === 'streetwear' && <StreetwearHero store={store} c0={c0}           heroBg={cfg.heroBg} ar={ar} />}
      {archetype === 'minimal'    && <MinimalHero    store={store} c0={c0}           heroBg={cfg.heroBg} ar={ar} />}
      {archetype === 'restaurant' && <RestaurantHero store={store} c0={c0}           heroBg={cfg.heroBg} ar={ar} />}
      {archetype === 'tech'       && <TechHero       store={store} c0={c0}           heroBg={cfg.heroBg} ar={ar} />}
      {archetype === 'creator'    && <CreatorHero    store={store} c0={c0} c1={c1}   heroBg={cfg.heroBg} ar={ar} />}

      {/* ── About ──────────────────────────────────────────────── */}
      {store.description && (
        <div style={{ padding: '20px 16px 0', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ background: cfg.sectionBg, border: `1px solid ${cfg.sectionBorder}`, borderRadius: '16px', padding: '16px 18px' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, color: cfg.sectionTitleColor, marginBottom: '8px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {ar ? 'نبذة عنّا' : 'עלינו'}
            </p>
            <p style={{ fontSize: '13px', color: cfg.mutedColor, lineHeight: 1.7 }}>{store.description}</p>
          </div>
        </div>
      )}

      {/* ── Products ──────────────────────────────────────────── */}
      <div id="products" style={{ padding: '20px 16px 0', maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '11px', fontWeight: 700, color: cfg.sectionTitleColor, marginBottom: '14px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          {ar ? 'المنتجات' : 'מוצרים'}
        </h2>

        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 24px', background: cfg.sectionBg, borderRadius: '16px', border: `1px solid ${cfg.sectionBorder}`, marginBottom: '24px' }}>
            <div style={{ fontSize: '44px', marginBottom: '12px' }}>📦</div>
            <p style={{ fontSize: '15px', fontWeight: 700, color: cfg.textColor, marginBottom: '6px', opacity: 0.8 }}>
              {ar ? 'قريباً — المتجر يستعد للإطلاق' : 'בקרוב — החנות בהכנה'}
            </p>
            <p style={{ fontSize: '12px', color: cfg.mutedColor }}>
              {ar ? 'تابعونا للتحديثات' : 'עקבו אחרינו לעדכונים'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: archetype === 'streetwear' ? '2px' : '12px', marginBottom: '24px' }}>
            {products.map(p => (
              <div key={p.id} className="prod-card"
                onClick={() => openDrawer(p)}
                style={{ background: cfg.cardBg, borderRadius: cfg.cardRadius, overflow: 'hidden', cursor: 'pointer', border: `1px solid ${cfg.cardBorder}`, ...cfg.cardExtra }}>
                {/* Restaurant: horizontal layout with big price */}
                {archetype === 'restaurant' ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0', height: '90px' }}>
                    <div style={{ width: '90px', height: '90px', overflow: 'hidden', background: '#200800', flexShrink: 0 }}>
                      <img src={p.image_url || imgFallback} alt={p.name} onError={e => { (e.target as HTMLImageElement).src = imgFallback }}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>
                    <div style={{ padding: '10px 12px', flex: 1 }}>
                      <p style={{ ...cfg.nameStyle, marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</p>
                      <p style={{ ...cfg.priceStyle }}>₪{p.price}</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ aspectRatio: '1', overflow: 'hidden', background: isLight ? '#f5f5f5' : '#111' }}>
                      <img src={p.image_url || imgFallback} alt={p.name} onError={e => { (e.target as HTMLImageElement).src = imgFallback }}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>
                    <div style={{ padding: archetype === 'luxury' ? '12px 14px 14px' : '10px 12px' }}>
                      {archetype === 'luxury' && (
                        <div style={{ width: '20px', height: '1px', background: c0, marginBottom: '8px', opacity: 0.4 }} />
                      )}
                      <p style={{ ...cfg.nameStyle, marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                      <p style={{ ...cfg.priceStyle }}>₪{p.price}</p>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Delivery & payment ─────────────────────────────────── */}
      <div style={{ padding: '0 16px 40px', maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {(store.delivery_type || paymentMethods.length > 0) && (
          <div style={{ background: cfg.sectionBg, border: `1px solid ${cfg.sectionBorder}`, borderRadius: '16px', padding: '16px 18px' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, color: cfg.sectionTitleColor, marginBottom: '12px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {ar ? 'التوصيل والدفع' : 'משלוח ותשלום'}
            </p>

            {store.delivery_type && (
              <div style={{ marginBottom: paymentMethods.length > 0 ? '12px' : '0' }}>
                <p style={{ fontSize: '14px', fontWeight: 600, color: cfg.textColor, marginBottom: store.delivery_areas ? '4px' : '0' }}>
                  {store.delivery_type === 'self'    && '🛵 ' + (ar ? 'توصيل للمنزل'      : 'משלוח לבית')}
                  {store.delivery_type === 'pickup'  && '📍 ' + (ar ? 'استلام من المتجر'   : 'איסוף מהחנות')}
                  {store.delivery_type === 'courier' && '🚚 ' + (ar ? 'شحن لجميع المناطق' : 'משלוח לכל הארץ')}
                  {!['self', 'pickup', 'courier'].includes(store.delivery_type) && '🚚 ' + store.delivery_type}
                </p>
                {store.delivery_areas && (
                  <p style={{ fontSize: '12px', color: cfg.mutedColor }}>{store.delivery_areas}</p>
                )}
              </div>
            )}

            {paymentMethods.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {paymentMethods.includes('bit') && (
                  <span style={{ background: cfg.pillBg, border: `1px solid ${cfg.pillBorder}`, borderRadius: '20px', padding: '4px 12px', fontSize: '12px', fontWeight: 600, color: cfg.pillColor }}>💜 Bit</span>
                )}
                {paymentMethods.includes('bank') && (
                  <span style={{ background: cfg.pillBg, border: `1px solid ${cfg.pillBorder}`, borderRadius: '20px', padding: '4px 12px', fontSize: '12px', fontWeight: 600, color: cfg.pillColor }}>
                    🏦 {ar ? 'تحويل بنكي' : 'העברה בנקאית'}
                  </span>
                )}
                {paymentMethods.includes('cash') && (
                  <span style={{ background: cfg.pillBg, border: `1px solid ${cfg.pillBorder}`, borderRadius: '20px', padding: '4px 12px', fontSize: '12px', fontWeight: 600, color: cfg.pillColor }}>
                    💵 {ar ? 'كاش' : 'מזומן'}
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Archetype bottom bars ──────────────────────────── */}
        {archetype === 'luxury' && (
          <div style={{ background: cfg.pageBg, borderTop: `1px solid ${c0}12`, padding: '14px 16px', display: 'flex', justifyContent: 'center' }}>
            <span style={{ fontSize: '10px', color: c0, opacity: 0.3, letterSpacing: '6px', textTransform: 'uppercase' }}>
              {ar ? 'مجموعة ٢٠٢٦' : 'קולקציה 2026'}
            </span>
          </div>
        )}

        {archetype === 'gaming' && (
          <div dir="ltr" style={{ background: cfg.sectionBg, borderTop: `1px solid ${c0}25`, display: 'flex' }}>
            {(['🏠', '🎮', '📦', '👤'] as const).map((icon, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 4px 10px', borderLeft: i > 0 ? `1px solid ${c0}15` : 'none' }}>
                <span style={{ fontSize: '20px' }}>{icon}</span>
                <div style={{ width: i === 0 ? '20px' : '0', height: '3px', background: c0, borderRadius: '2px', marginTop: '5px', boxShadow: i === 0 ? `0 0 6px ${c0}` : 'none' }} />
              </div>
            ))}
          </div>
        )}

        {archetype === 'creator' && (
          <div style={{ background: cfg.navBg, borderTop: `1px solid ${c0}20`, padding: '12px 16px', display: 'flex', gap: '10px' }}>
            <a href={waGeneralLink || '#'} style={{ flex: 1, background: c0, borderRadius: '20px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: getTextColor(c0) }}>+ {ar ? 'تابع' : 'עקוב'}</span>
            </a>
            <a href={waGeneralLink || '#'} target="_blank" rel="noopener noreferrer" style={{ flex: 1, border: `1px solid ${c0}`, borderRadius: '20px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
              <span style={{ fontSize: '13px', color: cfg.navTextColor, fontWeight: 600 }}>💬 {ar ? 'راسل' : 'שלח הודעה'}</span>
            </a>
          </div>
        )}

        {archetype === 'streetwear' && (
          <div style={{ background: '#0a0a0a', borderTop: `1px solid ${c0}30`, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '16px' }}>🔔</span>
            <span style={{ flex: 1, fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{ar ? 'تنبيه الدروب القادم' : 'התראת דרופ הבא'}</span>
            <div style={{ background: c0, borderRadius: '4px', padding: '6px 14px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: getTextColor(c0) }}>{ar ? 'سجّل' : 'הרשם'}</span>
            </div>
          </div>
        )}

        {archetype === 'minimal' && (
          <div style={{ background: '#fff', borderTop: '1px solid #f0f0f0', padding: '14px 16px', display: 'flex', justifyContent: 'center', gap: '32px' }}>
            {[ar ? 'الرئيسية' : 'בית', ar ? 'المتجر' : 'חנות', ar ? 'حساب' : 'פרופיל'].map((label, i) => (
              <span key={i} style={{ fontSize: '12px', color: i === 0 ? c0 : '#ccc', fontWeight: i === 0 ? 600 : 400, borderBottom: i === 0 ? `2px solid ${c0}` : 'none', paddingBottom: '2px' }}>{label}</span>
            ))}
          </div>
        )}

        {archetype === 'restaurant' && (
          <div style={{ background: cfg.navBg, borderTop: `1px solid ${c0}20`, padding: '12px 16px', display: 'flex', justifyContent: 'center' }}>
            <span style={{ fontSize: '12px', color: cfg.navTextColor, opacity: 0.45 }}>{ar ? 'الحد الأدنى للطلب: ₪50' : 'מינימום הזמנה: ₪50'}</span>
          </div>
        )}

        {archetype === 'tech' && (
          <div style={{ background: cfg.navBg, borderTop: `1px solid ${c0}15`, padding: '12px 16px', display: 'flex', gap: '8px' }}>
            {[ar ? '⚡ سريع' : '⚡ מהיר', ar ? '🔒 آمن' : '🔒 מאובטח', ar ? '✓ ضمان' : '✓ אחריות'].map((tag, i) => (
              <div key={i} style={{ flex: 1, background: `${c0}12`, border: `1px solid ${c0}20`, borderRadius: '6px', padding: '6px 4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '11px', color: c0, textAlign: 'center' }}>{tag}</span>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: 'center', paddingTop: '8px', display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <a href="/" style={{ fontSize: '11px', color: cfg.mutedColor, textDecoration: 'none', opacity: 0.6 }}>
            {ar ? 'مدعوم بـ Instok.ai' : 'מופעל על ידי Instok.ai'}
          </a>
          <a href="/policy" style={{ fontSize: '11px', color: cfg.mutedColor, textDecoration: 'none', opacity: 0.6 }}>
            {ar ? 'سياسة الخصوصية' : 'מדיניות פרטיות'}
          </a>
        </div>
      </div>

      {/* ── Sticky WhatsApp button ──────────────────────────────── */}
      {waNumber && (
        <a href={waGeneralLink} target="_blank" rel="noopener noreferrer"
          style={{ position: 'fixed', bottom: '16px', left: '50%', transform: 'translateX(-50%)', zIndex: 40, display: 'flex', alignItems: 'center', gap: '8px', background: '#22c55e', color: '#fff', borderRadius: '50px', padding: '14px 28px', fontSize: '15px', fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 24px rgba(34,197,94,0.45)', whiteSpace: 'nowrap' }}>
          <span style={{ fontSize: '18px' }}>💬</span>
          {ar ? 'تواصل عبر واتساب' : 'צור קשר בוואטסאפ'}
        </a>
      )}

      {/* ── Product drawer ──────────────────────────────────────── */}
      {drawerOpen && drawerProduct && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100 }}>
          <div onClick={closeDrawer} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)' }} />
          <div className="drawer-open" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: isLight ? '#fff' : '#111', borderRadius: '24px 24px 0 0', padding: '0 0 40px', maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ width: '36px', height: '4px', background: 'rgba(128,128,128,0.25)', borderRadius: '2px', margin: '12px auto 0' }} />
            <div style={{ aspectRatio: '4/3', overflow: 'hidden', background: isLight ? '#f5f5f5' : '#1a1a1a' }}>
              <img src={drawerProduct.image_url || imgFallback} alt={drawerProduct.name}
                onError={e => { (e.target as HTMLImageElement).src = imgFallback }}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <div style={{ padding: '20px 20px 0' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: isLight ? '#111' : '#fff', marginBottom: '6px' }}>{drawerProduct.name}</h2>
              {drawerProduct.description && (
                <p style={{ fontSize: '13px', color: isLight ? '#888' : 'rgba(255,255,255,0.45)', marginBottom: '12px', lineHeight: 1.6 }}>{drawerProduct.description}</p>
              )}
              <p style={{ fontSize: '24px', fontWeight: 800, color: c0, marginBottom: '20px' }}>₪{drawerProduct.price}</p>
              {waNumber ? (
                <a href={makeWaLink(drawerProduct)}
                  onClick={() => setCartCount(n => n + 1)}
                  target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#22c55e', color: '#fff', borderRadius: '14px', padding: '15px 24px', fontSize: '15px', fontWeight: 700, textDecoration: 'none', width: '100%', boxShadow: '0 4px 20px rgba(34,197,94,0.35)' }}>
                  <span style={{ fontSize: '18px' }}>💬</span>
                  {ar ? 'اطلب عبر واتساب' : 'הזמן דרך וואט��אפ'}
                </a>
              ) : (
                <div style={{ background: isLight ? '#f5f5f5' : '#1a1a1a', borderRadius: '14px', padding: '15px 24px', fontSize: '14px', color: isLight ? '#aaa' : 'rgba(255,255,255,0.45)', textAlign: 'center' }}>
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
