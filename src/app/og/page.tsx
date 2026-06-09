'use client'

import { useState, useEffect } from 'react'
import { Cairo, Heebo } from 'next/font/google'

const cairo = Cairo({ subsets: ['arabic'], display: 'swap', weight: ['400', '600', '700', '800', '900'] })
const heebo = Heebo({ subsets: ['hebrew', 'latin'], display: 'swap', weight: ['400', '600', '700', '800', '900'] })

type Lang = 'ar' | 'he'
type Format = 'square' | 'story'
type PostId = 'launch' | 'beforeafter' | 'showcase' | 'aidemo'

const POSTS: { id: PostId; label: string }[] = [
  { id: 'launch',      label: '🚀 Launch' },
  { id: 'beforeafter', label: '↔️ Before/After' },
  { id: 'showcase',    label: '🏪 Store Showcase' },
  { id: 'aidemo',      label: '✨ AI Demo' },
]

// ── Mini phone frame ────────────────────────────────────────────────────────
function PhoneFrame({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div style={{
      width: '160px', height: '290px', borderRadius: '24px',
      border: `6px solid ${dark ? '#1a1a2e' : '#e8e4ff'}`,
      background: dark ? '#0d0d14' : '#f8f7ff',
      overflow: 'hidden', flexShrink: 0, position: 'relative',
      boxShadow: dark
        ? '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)'
        : '0 20px 60px rgba(124,58,237,0.18), 0 0 0 1px rgba(124,58,237,0.1)',
    }}>
      {/* Notch */}
      <div style={{ position: 'absolute', top: '8px', left: '50%', transform: 'translateX(-50%)', width: '40px', height: '6px', background: dark ? '#2a2a3e' : '#ddd8ff', borderRadius: '3px', zIndex: 10 }} />
      <div style={{ paddingTop: '20px', height: '100%', overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  )
}

// ── Store mini preview ──────────────────────────────────────────────────────
function StoreMini({ lang }: { lang: Lang }) {
  const ar = lang === 'ar'
  return (
    <div style={{ height: '100%', background: 'linear-gradient(160deg,#1a1a2e 0%,#0d0d14 100%)', padding: '12px 10px', fontFamily: ar ? cairo.style.fontFamily : heebo.style.fontFamily }}>
      <div dir="ltr" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
        <div style={{ width: '24px', height: '24px', borderRadius: '8px', background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '10px' }}>👑</span>
        </div>
        <div>
          <div style={{ fontSize: '8px', fontWeight: 800, color: '#fff' }}>{ar ? 'دانا للجمال' : 'דנה יופי'}</div>
          <div style={{ fontSize: '6px', color: 'rgba(255,255,255,0.4)' }}>{ar ? 'جمال وتجميل' : 'יופי וטיפוח'}</div>
        </div>
      </div>
      {[1,2,3].map(i => (
        <div key={i} style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '10px', background: `linear-gradient(135deg,hsl(${270+i*20},60%,${25+i*5}%),hsl(${250+i*15},50%,${30+i*4}%))`, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '7px', fontWeight: 700, color: '#fff', marginBottom: '2px' }}>{ar ? `منتج ${i}` : `מוצר ${i}`}</div>
            <div style={{ fontSize: '6px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>{ar ? 'وصف المنتج' : 'תיאור המוצר'}</div>
            <div style={{ fontSize: '8px', fontWeight: 800, color: '#c4b5fd' }}>₪{49 + i * 30}</div>
          </div>
        </div>
      ))}
      <div style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', borderRadius: '8px', padding: '6px', textAlign: 'center', marginTop: '4px' }}>
        <span style={{ fontSize: '7px', fontWeight: 800, color: '#fff' }}>{ar ? '💬 اطلب الآن' : '💬 הזמן עכשיו'}</span>
      </div>
    </div>
  )
}

// ── POST 1: Launch ──────────────────────────────────────────────────────────
function LaunchPost({ lang, size }: { lang: Lang; size: { w: number; h: number } }) {
  const ar = lang === 'ar'
  const font = ar ? cairo.style.fontFamily : heebo.style.fontFamily
  return (
    <div style={{ width: size.w, height: size.h, background: 'linear-gradient(145deg,#6d28d9 0%,#4f46e5 45%,#7c3aed 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', fontFamily: font }} dir="rtl">
      {/* BG glow */}
      <div style={{ position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)', width: '700px', height: '700px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(255,255,255,0.12) 0%,transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-80px', right: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,0.4) 0%,transparent 65%)', pointerEvents: 'none' }} />

      {/* Phone */}
      <div style={{ marginBottom: size.h > 800 ? '40px' : '20px', filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.4))' }}>
        <PhoneFrame dark>
          <StoreMini lang={lang} />
        </PhoneFrame>
      </div>

      {/* Text */}
      <div style={{ textAlign: 'center', padding: '0 40px' }}>
        <div style={{ fontSize: size.w > 800 ? '48px' : '36px', fontWeight: 900, color: '#fff', lineHeight: 1.15, marginBottom: '14px' }}>
          {ar ? 'متجرك جاهز\nفي دقيقتين ⚡' : 'החנות שלך מוכנה\nתוך שתי דקות ⚡'}
        </div>
        <div style={{ fontSize: size.w > 800 ? '20px' : '16px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.5, marginBottom: '28px' }}>
          {ar ? 'ارفع صورة منتجك — الذكاء الاصطناعي يبني متجرك كاملاً' : 'העלה תמונת מוצר — ה-AI בונה לך חנות שלמה'}
        </div>
      </div>
    </div>
  )
}

// ── POST 2: Before / After ──────────────────────────────────────────────────
function BeforeAfterPost({ lang, size }: { lang: Lang; size: { w: number; h: number } }) {
  const ar = lang === 'ar'
  const font = ar ? cairo.style.fontFamily : heebo.style.fontFamily
  const isStory = size.h > size.w

  const beforeItems = ar
    ? ['ردود يدوية على كل DM', 'بدون متجر أو هوية', 'تحويلات بنكية يدوية', 'لا احترافية 😩']
    : ['תגובות ידניות לכל DM', 'ללא חנות או זהות', 'העברות בנקאיות ידניות', 'לא מקצועי 😩']
  const afterItems = ar
    ? ['متجر AI احترافي ✦', 'هوية كاملة وفريدة', 'Bit وكاش تلقائي', 'طلبات واتساب فوراً 🚀']
    : ['חנות AI מקצועית ✦', 'זהות מלאה וייחודית', 'Bit ומזומן אוטומטי', 'הזמנות וואטסאפ מיד 🚀']

  return (
    <div style={{ width: size.w, height: size.h, background: '#f8f7ff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: font, padding: '40px' }} dir="rtl">

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: '50px', padding: '6px 18px', marginBottom: '16px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#7c3aed' }}>✦ instok</span>
        </div>
        <div style={{ fontSize: isStory ? '42px' : '36px', fontWeight: 900, color: '#0f0a1e', lineHeight: 1.2 }}>
          {ar ? 'من هذا... لهذا' : 'מזה... לזה'}
        </div>
      </div>

      {/* Cards */}
      <div style={{ display: 'flex', gap: '16px', width: '100%', flexDirection: isStory ? 'column' : 'row' }}>
        {/* BEFORE */}
        <div style={{ flex: 1, background: '#fff', border: '2px solid rgba(239,68,68,0.2)', borderRadius: '24px', padding: '24px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(239,68,68,0.7)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>😩</span>
            {ar ? 'قبل Instok' : 'לפני Instok'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {beforeItems.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: 'rgba(239,68,68,0.5)', fontSize: '16px', flexShrink: 0 }}>✗</span>
                <span style={{ fontSize: '13px', color: 'rgba(15,10,30,0.5)' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <div style={{ width: isStory ? '80px' : '4px', height: isStory ? '4px' : '80px', background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', borderRadius: '2px' }} />
        </div>

        {/* AFTER */}
        <div style={{ flex: 1, background: 'linear-gradient(135deg,rgba(124,58,237,0.08),rgba(79,70,229,0.05))', border: '2px solid rgba(124,58,237,0.25)', borderRadius: '24px', padding: '24px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#7c3aed', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>🚀</span>
            {ar ? 'بعد Instok ✦' : 'אחרי Instok ✦'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {afterItems.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: '#22c55e', fontSize: '16px', flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f0a1e' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}

// ── POST 3: Store Showcase ──────────────────────────────────────────────────
function ShowcasePost({ lang, size }: { lang: Lang; size: { w: number; h: number } }) {
  const ar = lang === 'ar'
  const font = ar ? cairo.style.fontFamily : heebo.style.fontFamily

  const stores = ar
    ? [{ emoji: '💄', name: 'دانا للجمال', cat: 'جمال وتجميل', color: '#e11d74' },
       { emoji: '🎮', name: '4GAMERS', cat: 'ألعاب وغيمنج', color: '#7c3aed' },
       { emoji: '👑', name: 'منصور جولد', cat: 'فاخر وراقي', color: '#d4a912' }]
    : [{ emoji: '💄', name: 'דנה יופי', cat: 'יופי וטיפוח', color: '#e11d74' },
       { emoji: '🎮', name: '4GAMERS', cat: 'גיימינג', color: '#7c3aed' },
       { emoji: '👑', name: 'מנסור גולד', cat: 'יוקרה', color: '#d4a912' }]

  return (
    <div style={{ width: size.w, height: size.h, background: '#f8f7ff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: font, padding: '40px', position: 'relative', overflow: 'hidden' }} dir="rtl">
      <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(124,58,237,0.08) 0%,transparent 65%)' }} />

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ fontSize: '14px', fontWeight: 700, color: '#7c3aed', letterSpacing: '0', marginBottom: '10px' }}>
          {ar ? '✦ متاجر بناها الذكاء الاصطناعي' : '✦ חנויות שנבנו עם AI'}
        </div>
        <div style={{ fontSize: size.w > 800 ? '44px' : '34px', fontWeight: 900, color: '#0f0a1e', lineHeight: 1.15 }}>
          {ar ? 'كل متجر هوية\nمختلفة' : 'כל חנות —\nזהות שונה'}
        </div>
      </div>

      {/* Phone row */}
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '32px', alignItems: 'flex-end' }}>
        {stores.map((s, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', transform: i === 1 ? 'translateY(-16px)' : 'none' }}>
            <PhoneFrame dark={i % 2 === 1}>
              <div style={{ height: '100%', background: i === 1 ? 'linear-gradient(160deg,#0d0d14,#1a1a2e)' : `linear-gradient(160deg,${s.color}18,${s.color}08)`, padding: '12px 10px', fontFamily: font }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: `linear-gradient(135deg,${s.color},${s.color}99)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px' }}>{s.emoji}</span>
                </div>
                <div style={{ fontSize: '9px', fontWeight: 800, color: i === 1 ? '#fff' : '#0f0a1e', marginBottom: '2px' }}>{s.name}</div>
                <div style={{ fontSize: '7px', color: i === 1 ? 'rgba(255,255,255,0.4)' : 'rgba(15,10,30,0.4)' }}>{s.cat}</div>
                <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {[1,2].map(j => (
                    <div key={j} style={{ height: '38px', borderRadius: '8px', background: i === 1 ? 'rgba(255,255,255,0.06)' : `${s.color}12`, border: `1px solid ${s.color}25` }} />
                  ))}
                </div>
                <div style={{ marginTop: '8px', background: `linear-gradient(135deg,${s.color},${s.color}cc)`, borderRadius: '8px', padding: '6px', textAlign: 'center' }}>
                  <span style={{ fontSize: '7px', fontWeight: 800, color: '#fff' }}>{ar ? 'اطلب الآن' : 'הזמן'}</span>
                </div>
              </div>
            </PhoneFrame>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(15,10,30,0.5)', textAlign: 'center' }}>{s.cat}</div>
          </div>
        ))}
      </div>

    </div>
  )
}

// ── POST 4: AI Demo ─────────────────────────────────────────────────────────
function AiDemoPost({ lang, size }: { lang: Lang; size: { w: number; h: number } }) {
  const ar = lang === 'ar'
  const font = ar ? cairo.style.fontFamily : heebo.style.fontFamily
  const isStory = size.h > size.w

  const steps = ar
    ? [{ n: '01', icon: '📸', title: 'ارفع صورة منتجك', desc: 'من الكاميرا أو الجاليري' },
       { n: '02', icon: '✦', title: 'الذكاء الاصطناعي يحلل', desc: 'اسم، وصف، سعر — تلقائي' },
       { n: '03', icon: '🏪', title: 'متجرك جاهز', desc: 'مع هوية كاملة وواتساب' }]
    : [{ n: '01', icon: '📸', title: 'העלה תמונת מוצר', desc: 'מהמצלמה או הגלריה' },
       { n: '02', icon: '✦', title: 'ה-AI מנתח', desc: 'שם, תיאור, מחיר — אוטומטי' },
       { n: '03', icon: '🏪', title: 'החנות שלך מוכנה', desc: 'עם זהות מלאה ווואטסאפ' }]

  return (
    <div style={{ width: size.w, height: size.h, background: '#0f0a1e', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: font, padding: isStory ? '60px 40px' : '40px', position: 'relative', overflow: 'hidden' }} dir="rtl">
      {/* BG */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(124,58,237,0.18) 0%,transparent 65%)', pointerEvents: 'none' }} />

      {/* Badge */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '50px', padding: '8px 20px', marginBottom: isStory ? '40px' : '24px' }}>
        <span style={{ fontSize: '14px' }}>✦</span>
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#c4b5fd' }}>
          {ar ? 'كيف يشتغل Instok؟' : 'איך Instok עובד?'}
        </span>
      </div>

      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: isStory ? '50px' : '32px' }}>
        <div style={{ fontSize: isStory ? '48px' : '38px', fontWeight: 900, color: '#fff', lineHeight: 1.15, marginBottom: '12px' }}>
          {ar ? 'صورة → متجر كامل\nفي دقيقتين' : 'תמונה → חנות שלמה\nבשתי דקות'}
        </div>
        <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.45)' }}>
          {ar ? 'بدون تصميم. بدون كود. بدون خبرة.' : 'ללא עיצוב. ללא קוד. ללא ניסיון.'}
        </div>
      </div>

      {/* Steps */}
      <div style={{ display: 'flex', flexDirection: isStory ? 'column' : 'row', gap: isStory ? '16px' : '12px', width: '100%', maxWidth: isStory ? '420px' : '900px' }}>
        {steps.map((s, i) => (
          <div key={i} style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: '20px', padding: isStory ? '24px' : '20px', display: 'flex', flexDirection: isStory ? 'row' : 'column', alignItems: isStory ? 'center' : 'flex-start', gap: '12px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'linear-gradient(135deg,rgba(124,58,237,0.3),rgba(79,70,229,0.2))', border: '1px solid rgba(124,58,237,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '20px' }}>{s.icon}</span>
            </div>
            <div>
              <div style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(124,58,237,0.6)', marginBottom: '4px', fontFamily: 'monospace' }}>{s.n}</div>
              <div style={{ fontSize: isStory ? '16px' : '14px', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>{s.title}</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{s.desc}</div>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

// ── Main page ───────────────────────────────────────────────────────────────
export default function OgPage() {
  const [post, setPost] = useState<PostId>('launch')
  const [lang, setLang] = useState<Lang>('ar')
  const [format, setFormat] = useState<Format>('square')
  const [hideUI, setHideUI] = useState(false)
  const [vw, setVw] = useState(600)

  useEffect(() => {
    setVw(window.innerWidth)
    const onResize = () => setVw(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const SIZE = {
    square: { w: 1080, h: 1080 },
    story:  { w: 1080, h: 1920 },
  }[format]

  const SCALE = format === 'square'
    ? Math.min((vw - 48) / 1080, 560 / 1080)
    : Math.min((vw - 48) / 1080, 800 / 1920)

  function renderPost() {
    const props = { lang, size: SIZE }
    if (post === 'launch')      return <LaunchPost      {...props} />
    if (post === 'beforeafter') return <BeforeAfterPost {...props} />
    if (post === 'showcase')    return <ShowcasePost    {...props} />
    return                             <AiDemoPost      {...props} />
  }

  if (hideUI) {
    return (
      <div style={{ background: '#111', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: SIZE.w, height: SIZE.h, transform: `scale(${SCALE})`, transformOrigin: 'center center', flexShrink: 0 }}>
          {renderPost()}
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', fontFamily: 'system-ui, sans-serif' }}>
      {/* Controls */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', justifyContent: 'center' }}>

        {/* Post selector */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {POSTS.map(p => (
            <button key={p.id} onClick={() => setPost(p.id)}
              style={{ padding: '6px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, background: post === p.id ? '#7c3aed' : 'rgba(255,255,255,0.08)', color: post === p.id ? '#fff' : 'rgba(255,255,255,0.55)', transition: 'all 0.15s' }}>
              {p.label}
            </button>
          ))}
        </div>

        <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.12)' }} />

        {/* Lang */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {(['ar', 'he'] as Lang[]).map(l => (
            <button key={l} onClick={() => setLang(l)}
              style={{ padding: '6px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, background: lang === l ? '#4f46e5' : 'rgba(255,255,255,0.08)', color: lang === l ? '#fff' : 'rgba(255,255,255,0.55)' }}>
              {l === 'ar' ? 'عربي' : 'עברית'}
            </button>
          ))}
        </div>

        <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.12)' }} />

        {/* Format */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button onClick={() => setFormat('square')}
            style={{ padding: '6px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, background: format === 'square' ? '#059669' : 'rgba(255,255,255,0.08)', color: format === 'square' ? '#fff' : 'rgba(255,255,255,0.55)' }}>
            ▪ Square (Feed)
          </button>
          <button onClick={() => setFormat('story')}
            style={{ padding: '6px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, background: format === 'story' ? '#059669' : 'rgba(255,255,255,0.08)', color: format === 'story' ? '#fff' : 'rgba(255,255,255,0.55)' }}>
            ▬ Story / Reel
          </button>
        </div>

        <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.12)' }} />

        {/* Screenshot mode */}
        <button onClick={() => setHideUI(true)}
          style={{ padding: '6px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 700, background: '#f59e0b', color: '#000' }}>
          📸 Screenshot Mode
        </button>
      </div>

      {/* Hint */}
      <div style={{ textAlign: 'center', padding: '10px', fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
        Click "Screenshot Mode" → use Cmd+Shift+4 on Mac to capture the post exactly
      </div>

      {/* Preview */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', minHeight: 'calc(100vh - 140px)' }}>
        <div style={{
          width: SIZE.w, height: SIZE.h,
          transform: `scale(${SCALE})`,
          transformOrigin: 'top center',
          flexShrink: 0,
          boxShadow: '0 0 0 1px rgba(255,255,255,0.1), 0 40px 80px rgba(0,0,0,0.6)',
        }}>
          {renderPost()}
        </div>
      </div>

      {/* Back button in screenshot mode */}
      {hideUI && (
        <button onClick={() => setHideUI(false)}
          style={{ position: 'fixed', top: '12px', left: '12px', background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '8px', padding: '6px 14px', color: '#fff', fontSize: '12px', cursor: 'pointer', zIndex: 100 }}>
          ← Back
        </button>
      )}
    </div>
  )
}
