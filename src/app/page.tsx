'use client'

import { useState, useEffect, useRef, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { Inter, Cairo } from 'next/font/google'
import { createBrowserClient } from '@supabase/ssr'
import MarketplaceSection from '@/components/MarketplaceSection'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' })
const cairo = Cairo({
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-cairo',
  weight: ['300', '400', '500', '600', '700'],
})

type Lang = 'ar' | 'he'

// ─── Scroll fade-in hook ───────────────────────────────────────────────────────
function useFadeIn(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

function FadeIn({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useFadeIn()
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────

function IgIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function TtIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.67a8.16 8.16 0 004.77 1.52V6.72a4.85 4.85 0 01-1-.03z" />
    </svg>
  )
}

function WaIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.05 2A9.944 9.944 0 002.1 11.95a9.91 9.91 0 001.591 5.35L2.1 22l4.839-1.269a9.946 9.946 0 004.912 1.271h.004A9.944 9.944 0 0021.9 11.95 9.944 9.944 0 0012.05 2z" />
    </svg>
  )
}

function StoreIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  )
}

function ZapIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}

function WalletIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 12V8H6a2 2 0 01-2-2c0-1.1.9-2 2-2h12v4" />
      <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
      <path d="M18 12a2 2 0 000 4h4v-4h-4z" />
    </svg>
  )
}

function MessageIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  )
}

// ─── Content ──────────────────────────────────────────────────────────────────

const CONTENT = {
  ar: {
    nav: { cta: 'ابدأ مجاناً', langLabel: 'עברית' },
    hero: {
      badge: 'مدعوم بالذكاء الاصطناعي — يبني متجرك تلقائياً',
      h1a: 'حوّل الواتساب TikTok والانستغرام',
      h1b: 'إلى متجر حقيقي',
      sub: 'ارفع صور منتجاتك فقط، وInstok يبني المتجر ويجهز المنتجات تلقائياً.',
      sub2: 'ابدأ البيع خلال دقائق.',
      cta: 'ابدأ مجاناً',
      ctaSub: 'لا يلزم بطاقة ائتمانية',
      storeLabel: 'متجرك',
      aiLines: [
        '✦ جاري تحليل هويتك التجارية...',
        '✦ بناء متجرك بالذكاء الاصطناعي...',
        '✦ متجرك جاهز في 3... 2... 1...',
      ] as [string, string, string],
    },
    features: {
      title: 'كل ما تحتاجه في مكان واحد',
      items: [
        { icon: 'zap',     title: 'هوية تجارية بالذكاء الاصطناعي', desc: 'AI يفهم بزنسك ويبني هويتك الكاملة — اسم، شعار، ألوان، ومحتوى' },
        { icon: 'wallet',  title: 'استقبل الدفع بـ Bit مباشرة',    desc: 'فلوسك تيجي مباشرة على حسابك بدون وسيط أو عمولة' },
        { icon: 'message', title: 'طلباتك على واتساب فوراً',        desc: 'كل طلب بيوصلك على واتساب فوراً — تابع مبيعاتك من هاتفك' },
      ],
    },
    hiw: {
      label: 'كيف يشتغل؟',
      title: 'ثلاث خطوات وبس',
      steps: [
        { n: '01', title: 'أخبرنا عن بزنسك',               desc: 'اسم متجرك، شو بتبيع، وشو احساس علامتك التجارية — ثلاث أسئلة وخلصنا' },
        { n: '02', title: 'الذكاء الاصطناعي يبني هويتك',    desc: 'AI يولّد اسم المتجر، الشعار، الألوان، والمحتوى — خصيصاً لك' },
        { n: '03', title: 'شارك وابدأ البيع',               desc: 'انشر رابط متجرك على كل منصاتك وابدأ تستقبل الطلبات فوراً على واتساب' },
      ],
    },
    cta: {
      title: 'جاهز تحوّل بزنسك؟',
      sub: 'انضم لآلاف البائعين اللي حولوا صفحاتهم لمتاجر حقيقية',
      btn: 'ابدأ مجاناً — بدون بطاقة ائتمانية',
    },
    footer: { copy: '© ٢٠٢٥ Instok — جميع الحقوق محفوظة', policy: 'سياسة الخصوصية' },
  },
  he: {
    nav: { cta: 'התחל בחינם', langLabel: 'العربية' },
    hero: {
      badge: 'מופעל על ידי AI — בונה את החנות שלך אוטומטית',
      h1a: 'הפוך את הוואטסאפ TikTok והאינסטגרם',
      h1b: 'לחנות אמיתית',
      sub: 'פשוט העלה תמונות מוצרים, ו-Instok בונה את החנות ומכין את המוצרים עבורך.',
      sub2: 'התחל למכור תוך דקות.',
      cta: 'התחל בחינם',
      ctaSub: 'לא נדרש כרטיס אשראי',
      storeLabel: 'החנות שלך',
      aiLines: [
        '✦ מנתח את זהות המותג שלך...',
        '✦ בונה את החנות שלך עם AI...',
        '✦ החנות שלך מוכנה בעוד 3... 2... 1...',
      ] as [string, string, string],
    },
    features: {
      title: 'הכל במקום אחד',
      items: [
        { icon: 'zap',     title: 'זהות עסקית עם AI',          desc: 'ה-AI מבין את העסק שלך ובונה את הזהות המלאה — שם, לוגו, צבעים ותוכן' },
        { icon: 'wallet',  title: 'קבל תשלום ב-Bit ישירות',    desc: 'הכסף מגיע ישירות לחשבון שלך ללא מתווך או עמלה' },
        { icon: 'message', title: 'הזמנות בוואטסאפ מיד',       desc: 'כל הזמנה מגיעה לוואטסאפ שלך מיד — עקוב אחרי המכירות מהטלפון' },
      ],
    },
    hiw: {
      label: 'איך זה עובד?',
      title: 'שלושה שלבים פשוטים',
      steps: [
        { n: '01', title: 'ספר לנו על העסק',        desc: 'שם החנות, מה אתה מוכר, ומה הוויב של המותג — שלוש שאלות וסיימנו' },
        { n: '02', title: 'ה-AI בונה את הזהות שלך', desc: 'AI מייצר שם חנות, לוגו, צבעים ותוכן — בדיוק בשבילך' },
        { n: '03', title: 'שתף והתחל למכור',        desc: 'פרסם את קישור החנות בכל הפלטפורמות שלך והתחל לקבל הזמנות מיד בוואטסאפ' },
      ],
    },
    cta: {
      title: 'מוכן להפוך את העסק?',
      sub: 'הצטרף לאלפי מוכרים שהפכו את הדפים שלהם לחנויות אמיתיות',
      btn: 'התחל בחינם — ללא כרטיס אשראי',
    },
    footer: { copy: '© 2025 Instok — כל הזכויות שמורות', policy: 'מדיניות פרטיות' },
  },
}

const PLATFORMS = [
  { label: 'Instagram', Icon: IgIcon },
  { label: 'TikTok',    Icon: TtIcon },
  { label: 'WhatsApp',  Icon: WaIcon },
]

// ─── AI Demo ──────────────────────────────────────────────────────────────────

function AiDemo({ lines }: { lines: [string, string, string] }) {
  const boxRef = useRef<HTMLDivElement>(null)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const el = boxRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => setPaused(!entry.isIntersecting),
      { threshold: 0.1 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const playState = paused ? 'paused' : 'running'

  return (
    <div ref={boxRef} className="w-full max-w-md mx-auto rounded-2xl"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', height: '190px', overflow: 'hidden' }}>
      <div className="flex items-center gap-1.5 px-4 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
        <span className="mr-3 text-[10px] font-medium" style={{ color: 'rgba(255,255,255,0.25)', fontFamily: 'monospace' }}>
          instok.co.il / ai-builder
        </span>
      </div>
      <div className="px-5 py-4 flex flex-col gap-3"
        style={{ height: '130px', overflow: 'hidden', position: 'relative' }}>
        {/* Line 1 — always at full opacity */}
        <div dir="rtl" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', fontFamily: 'monospace' }}>{lines[0]}</span>
          <span className="ai-cursor" style={{ animationPlayState: playState }} />
        </div>
        {/* Line 2 — fades in at 1s mark */}
        <div dir="rtl" style={{ opacity: 0.15, animation: 'ai-op-2 4s ease-out infinite', animationPlayState: playState, willChange: 'opacity' }}>
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', fontFamily: 'monospace' }}>{lines[1]}</span>
        </div>
        {/* Line 3 — fades in at 2s mark, green */}
        <div dir="rtl" style={{ opacity: 0.15, animation: 'ai-op-3 4s ease-out infinite', animationPlayState: playState, willChange: 'opacity' }}>
          <span style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(74,222,128,0.9)', fontFamily: 'monospace' }}>{lines[2]}</span>
        </div>
      </div>
    </div>
  )
}

// ─── Mini archetype phone previews ────────────────────────────────────────────

function BeautyMiniPreview() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff5f7' }}>
      <div style={{ height: '18px', background: '#fff5f7', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 11px', flexShrink: 0 }}>
        <span style={{ fontSize: '7px', color: '#cc0066', opacity: 0.5 }}>9:41</span>
        <span style={{ fontSize: '7px', color: '#cc0066', opacity: 0.4 }}>●●</span>
      </div>
      <div style={{ height: '34px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #fce8ee', flexShrink: 0 }}>
        <span style={{ fontSize: '12px', fontWeight: 700, color: '#1a1a1a', fontStyle: 'italic' }}>Dana Beauty</span>
      </div>
      <div style={{ background: 'linear-gradient(160deg,#fff0f4,#fce4ec)', padding: '12px', textAlign: 'center', flexShrink: 0 }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#e11d74,#f97316)', margin: '0 auto 5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '18px' }}>✿</span>
        </div>
        <div style={{ fontSize: '12px', fontWeight: 700, color: '#1a1a1a', marginBottom: '3px' }}>Dana Beauty</div>
        <div style={{ fontSize: '7px', color: '#888', marginBottom: '8px' }}>جمال وتجميل</div>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#e11d74,#f97316)', borderRadius: '10px', padding: '4px 10px' }}>
          <span style={{ fontSize: '7px', fontWeight: 700, color: '#fff' }}>تسوّق الآن</span>
        </div>
      </div>
      <div style={{ flex: 1, background: '#fff', padding: '6px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', overflow: 'hidden' }}>
        <div style={{ background: '#fff8fa', borderRadius: '8px', overflow: 'hidden', border: '1px solid #fce4ec', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, overflow: 'hidden', minHeight: '70px' }}>
            <img src="https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=200&h=200&fit=crop" alt="كريم مرطب" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
          <div style={{ padding: '4px 5px', flexShrink: 0 }}>
            <div style={{ fontSize: '7px', color: '#1a1a1a', fontWeight: 600, marginBottom: '1px' }}>كريم مرطب</div>
            <div style={{ fontSize: '8px', color: '#e11d74', fontWeight: 700 }}>₪95</div>
          </div>
        </div>
        <div style={{ background: '#fff8f0', borderRadius: '8px', overflow: 'hidden', border: '1px solid #fed7aa', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, overflow: 'hidden', minHeight: '70px' }}>
            <img src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&h=200&fit=crop" alt="سيروم ذهبي" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
          <div style={{ padding: '4px 5px', flexShrink: 0 }}>
            <div style={{ fontSize: '7px', color: '#1a1a1a', fontWeight: 600, marginBottom: '1px' }}>سيروم ذهبي</div>
            <div style={{ fontSize: '8px', color: '#d97706', fontWeight: 700 }}>₪140</div>
          </div>
        </div>
      </div>
      <div style={{ background: '#22c55e', padding: '6px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', flexShrink: 0 }}>
        <span style={{ fontSize: '11px' }}>💬</span>
        <span style={{ fontSize: '7px', fontWeight: 700, color: '#fff' }}>اطلب عبر واتساب</span>
      </div>
    </div>
  )
}

function GamingMiniPreview() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#050510' }}>
      <div style={{ height: '18px', background: '#050510', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 11px', flexShrink: 0 }}>
        <span style={{ fontSize: '7px', color: '#7c3aed', opacity: 0.7 }}>9:41</span>
        <span style={{ fontSize: '6px', color: '#0f0', background: 'rgba(0,255,0,0.12)', padding: '1px 3px', borderRadius: '3px' }}>LIVE</span>
      </div>
      <div style={{ height: '34px', background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 11px', borderBottom: '1px solid rgba(124,58,237,0.4)', flexShrink: 0 }}>
        <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#00ff88)', flexShrink: 0 }} />
        <span style={{ fontSize: '12px', fontWeight: 800, color: '#7c3aed', textShadow: '0 0 6px #7c3aed' }}>GameZone</span>
        <span style={{ width: '20px' }} />
      </div>
      <div style={{ background: 'linear-gradient(135deg,#0d0020,#1a0040,rgba(124,58,237,0.25))', padding: '12px 11px', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
        <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg,transparent,transparent 8px,rgba(124,58,237,0.06) 8px,rgba(124,58,237,0.06) 9px)' }} />
        <div style={{ fontSize: '7px', color: '#7c3aed', letterSpacing: '0.15em', marginBottom: '3px', fontWeight: 700, position: 'relative', zIndex: 1 }}>LEVEL UP</div>
        <div style={{ fontSize: '15px', fontWeight: 900, color: '#fff', marginBottom: '5px', textShadow: '0 0 10px #7c3aed', position: 'relative', zIndex: 1 }}>GameZone</div>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#7c3aed', borderRadius: '5px', padding: '4px 10px', boxShadow: '0 0 6px rgba(124,58,237,0.6)', position: 'relative', zIndex: 1 }}>
          <span style={{ fontSize: '7px', fontWeight: 800, color: '#fff' }}>PLAY NOW ▶</span>
        </div>
      </div>
      <div style={{ background: '#080815', padding: '6px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', flex: 1, overflow: 'hidden' }}>
        <div style={{ background: '#0d0d20', borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(124,58,237,0.3)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, overflow: 'hidden', minHeight: '70px' }}>
            <img src="https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=200&h=200&fit=crop" alt="هيدسيت برو" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
          <div style={{ padding: '4px 5px', flexShrink: 0 }}>
            <div style={{ fontSize: '7px', color: '#c4b5fd', fontWeight: 600, marginBottom: '1px' }}>هيدسيت برو</div>
            <div style={{ fontSize: '8px', color: '#7c3aed', fontWeight: 800 }}>₪299</div>
          </div>
        </div>
        <div style={{ background: '#0d0d20', borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(0,255,136,0.2)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, overflow: 'hidden', minHeight: '70px' }}>
            <img src="https://images.unsplash.com/photo-1527814050087-3793815479db?w=200&h=200&fit=crop" alt="ماوس RGB" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
          <div style={{ padding: '4px 5px', flexShrink: 0 }}>
            <div style={{ fontSize: '7px', color: '#c4b5fd', fontWeight: 600, marginBottom: '1px' }}>ماوس RGB</div>
            <div style={{ fontSize: '8px', color: '#00ff88', fontWeight: 800 }}>₪149</div>
          </div>
        </div>
      </div>
      <div style={{ background: '#040410', borderTop: '1px solid rgba(124,58,237,0.2)', display: 'flex', flexShrink: 0 }}>
        {['🏠', '🎮', '📦', '👤'].map((icon, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '5px 2px' }}>
            <span style={{ fontSize: '14px' }}>{icon}</span>
            {i === 0 && <div style={{ width: '13px', height: '2px', background: '#7c3aed', borderRadius: '2px', marginTop: '2px' }} />}
          </div>
        ))}
      </div>
    </div>
  )
}

function LuxuryMiniPreview() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#080505' }}>
      <div style={{ height: '18px', background: '#080505', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 11px', flexShrink: 0 }}>
        <span style={{ fontSize: '7px', color: '#b8960c', opacity: 0.7 }}>9:41</span>
        <span style={{ fontSize: '7px', color: '#b8960c', opacity: 0.5 }}>●●</span>
      </div>
      <div style={{ height: '34px', background: '#080505', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid rgba(184,150,12,0.25)', flexShrink: 0 }}>
        <span style={{ fontSize: '11px', fontWeight: 700, color: '#d4a912', letterSpacing: '0.1em' }}>LUXE HOUSE</span>
      </div>
      <div style={{ background: 'linear-gradient(160deg,#0f0a02,#1a1002)', padding: '14px 12px 12px', textAlign: 'center', borderBottom: '1px solid rgba(184,150,12,0.15)', flexShrink: 0 }}>
        <div style={{ fontSize: '6px', letterSpacing: '0.2em', color: 'rgba(184,150,12,0.6)', marginBottom: '3px', textTransform: 'uppercase' }}>مجموعة ٢٠٢٦</div>
        <div style={{ fontSize: '13px', fontWeight: 800, color: '#d4a912', marginBottom: '3px' }}>LUXE HOUSE</div>
        <div style={{ fontSize: '6px', color: 'rgba(212,169,18,0.4)', marginBottom: '8px' }}>الفخامة الحقيقية</div>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(184,150,12,0.5)', padding: '3px 11px' }}>
          <span style={{ fontSize: '6px', fontWeight: 600, color: '#d4a912', letterSpacing: '0.1em' }}>تسوّق الآن</span>
        </div>
      </div>
      <div style={{ flex: 1, background: '#0a0705', padding: '6px', display: 'flex', gap: '5px', overflow: 'hidden' }}>
        <div style={{ flex: 1, background: '#111008', borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(184,150,12,0.2)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, overflow: 'hidden', minHeight: '70px' }}>
            <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop" alt="ساعة كلاسيك" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
          <div style={{ padding: '4px 5px', flexShrink: 0 }}>
            <div style={{ fontSize: '7px', color: '#d4a912', fontWeight: 600, marginBottom: '1px', opacity: 0.9 }}>ساعة كلاسيك</div>
            <div style={{ fontSize: '8px', color: '#d4a912', fontWeight: 700 }}>₪890</div>
          </div>
        </div>
        <div style={{ flex: 1, background: '#111008', borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(184,150,12,0.2)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, overflow: 'hidden', minHeight: '70px' }}>
            <img src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&h=200&fit=crop" alt="خاتم ذهبي" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
          <div style={{ padding: '4px 5px', flexShrink: 0 }}>
            <div style={{ fontSize: '7px', color: '#d4a912', fontWeight: 600, marginBottom: '1px', opacity: 0.9 }}>خاتم ذهبي</div>
            <div style={{ fontSize: '8px', color: '#d4a912', fontWeight: 700 }}>₪1,200</div>
          </div>
        </div>
      </div>
      <div style={{ background: '#060403', padding: '7px 11px', borderTop: '1px solid rgba(184,150,12,0.15)', display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
        <span style={{ fontSize: '6px', color: 'rgba(184,150,12,0.5)', letterSpacing: '0.1em' }}>استكشف المجموعة الكاملة</span>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Page() {
  const [lang, setLang] = useState<Lang>('ar')
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const t = CONTENT[lang]
  const fontClass = lang === 'ar' ? cairo.className : inter.className
  const ar = lang === 'ar'

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserEmail(session?.user?.email ?? null)
    })
    const saved = localStorage.getItem('instok_lang') as Lang | null
    if (saved === 'ar' || saved === 'he') {
      setLang(saved)
    } else if (navigator.language.startsWith('he')) {
      setLang('he')
    }
  }, [])

  useEffect(() => {
    if (!dropdownOpen) return
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [dropdownOpen])

  return (
    <div dir="rtl" className={`min-h-screen antialiased ${fontClass}`} style={{ backgroundColor: '#080808', color: '#ffffff', overflowX: 'hidden', maxWidth: '100vw' }}>
      <style>{`
        @keyframes march {
          0%   { background-position: 0 0; }
          100% { background-position: 30px 0; }
        }
        .march-line {
          background: repeating-linear-gradient(90deg, rgba(139,92,246,0.75) 0px, rgba(139,92,246,0.75) 5px, transparent 5px, transparent 11px);
          background-size: 11px 1px;
          animation: march 0.55s linear infinite;
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hu  { animation: fade-up 0.65s ease-out forwards; }
        .hu1 { animation-delay: 0.05s; opacity: 0; }
        .hu2 { animation-delay: 0.18s; opacity: 0; }
        .hu3 { animation-delay: 0.30s; opacity: 0; }
        .hu4 { animation-delay: 0.44s; opacity: 0; }
        .hu5 { animation-delay: 0.58s; opacity: 0; }
        @keyframes orb-pulse {
          0%, 100% { opacity: 0.55; }
          50%       { opacity: 0.85; }
        }
        .orb-pulse { animation: orb-pulse 4s ease-in-out infinite; }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        .ai-cursor {
          display: inline-block; width: 1.5px; height: 13px;
          background: rgba(139,92,246,0.9); border-radius: 1px;
          vertical-align: middle; margin-inline-start: 3px;
          animation: blink 0.75s ease-in-out infinite;
        }
        @keyframes ai-op-2 {
          0%, 22%  { opacity: 0.15; }
          28%, 100% { opacity: 1; }
        }
        @keyframes ai-op-3 {
          0%, 47%  { opacity: 0.15; }
          53%, 100% { opacity: 1; }
        }
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-track { animation: ticker 18s linear infinite; }
        @keyframes proof-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.25); }
          50%       { box-shadow: 0 0 0 6px rgba(34,197,94,0); }
        }
        .proof-pill { animation: proof-pulse 2.4s ease-in-out infinite; }
      `}</style>

      {/* ── NAVBAR ─────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50"
        style={{ backgroundColor: 'rgba(8,8,8,0.75)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.055)' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center justify-between" style={{ height: '60px' }}>
          <span className="text-[15px] font-bold tracking-tight select-none" style={{ letterSpacing: '-0.01em' }}>
            <span style={{ color: '#fff' }}>ins</span><span style={{ color: '#9945FF' }}>tok</span>
          </span>
          <div className="flex items-center gap-2">
            <div style={{ padding: '1.5px', borderRadius: '9px', background: 'linear-gradient(90deg, #9945FF, #14F195)', flexShrink: 0 }}>
              <button
                onClick={() => {
                  const next: Lang = lang === 'ar' ? 'he' : 'ar'
                  setLang(next)
                  localStorage.setItem('instok_lang', next)
                }}
                className="text-sm font-semibold transition-opacity hover:opacity-80"
                style={{ background: '#080808', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit', display: 'block', borderRadius: '7.5px', padding: '6.5px 14.5px' }}>
                {t.nav.langLabel}
              </button>
            </div>
            {userEmail ? (
              <div ref={dropdownRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setDropdownOpen(o => !o)}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: 'none', cursor: 'pointer', padding: 0 }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>{userEmail[0].toUpperCase()}</span>
                </button>
                {dropdownOpen && (
                  <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', overflow: 'hidden', minWidth: '180px', boxShadow: '0 8px 32px rgba(0,0,0,0.7)', zIndex: 200 }}>
                    <button
                      onClick={() => { setDropdownOpen(false); router.push('/dashboard') }}
                      style={{ width: '100%', padding: '11px 16px', background: 'none', border: 'none', color: '#fff', fontSize: '13px', fontWeight: 500, cursor: 'pointer', textAlign: 'start', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '8px' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
                      <span>📊</span>
                      {ar ? 'لوحة التحكم' : 'Dashboard'}
                    </button>
                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '0 12px' }} />
                    <button
                      onClick={async () => { setDropdownOpen(false); await supabase.auth.signOut(); setUserEmail(null) }}
                      style={{ width: '100%', padding: '11px 16px', background: 'none', border: 'none', color: '#ff6b6b', fontSize: '13px', fontWeight: 500, cursor: 'pointer', textAlign: 'start', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '8px' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,107,107,0.1)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
                      <span>🚪</span>
                      {ar ? 'تسجيل خروج' : 'Logout'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => router.push('/onboarding')}
                className="text-sm font-semibold px-4 py-2 rounded-lg text-white transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)' }}>
                {t.nav.cta}
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center text-center px-5 sm:px-8 pt-36 sm:pt-44 pb-28 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 85% 60% at 50% 0%, transparent 0%, #080808 75%)' }} />
        <div className="orb-pulse absolute pointer-events-none"
          style={{ top: '-200px', left: '50%', transform: 'translateX(-50%)', width: '720px', height: '560px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.22) 0%, transparent 68%)', filter: 'blur(48px)' }} />

        <div className="relative z-10 max-w-3xl mx-auto w-full">
          {/* Badge */}
          <div className="hu hu1 flex justify-center mb-8">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium"
              style={{ border: '1px solid rgba(139,92,246,0.28)', backgroundColor: 'rgba(139,92,246,0.08)', color: 'rgba(255,255,255,0.7)' }}>
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#8b5cf6' }} />
              {t.hero.badge}
            </span>
          </div>

          {/* Headline */}
          <h1 className="hu hu2 font-bold leading-tight mb-5"
            style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', letterSpacing: '-0.03em', lineHeight: 1.15 }}>
            <span style={{ color: '#f5f5f5' }}>{t.hero.h1a}</span>
            <br />
            <span className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(135deg, #c4b5fd 0%, #8b5cf6 45%, #6366f1 100%)' }}>
              {t.hero.h1b}
            </span>
          </h1>

          {/* Sub */}
          <p className="hu hu3 text-base sm:text-lg max-w-xl mx-auto mb-3 leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.42)' }}>
            {lang === 'ar'
              ? <>ارفع صور منتجاتك فقط، و-<span dir="ltr" style={{ unicodeBidi: 'isolate' }}>Instok</span> يبني المتجر ويجهز المنتجات تلقائياً.</>
              : t.hero.sub}
          </p>
          <p className="hu hu3 text-base sm:text-lg max-w-xl mx-auto mb-12 leading-relaxed font-semibold"
            style={{ color: 'rgba(255,255,255,0.75)' }}>
            {t.hero.sub2}
          </p>

          {/* Platform flow */}
          <div className="hu hu4 flex justify-center mb-12" dir="ltr">
            <div className="inline-flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3.5 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(8px)' }}>
              <div className="flex items-center gap-2 sm:gap-2.5">
                {PLATFORMS.map(({ label, Icon }) => (
                  <div key={label} className="flex items-center justify-center rounded-xl"
                    style={{ width: '38px', height: '38px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.7)' }}
                    title={label}>
                    <Icon size={16} />
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1.5">
                <div className="march-line rounded-full" style={{ width: '48px', height: '1.5px' }} />
                <svg width="8" height="13" viewBox="0 0 8 13" fill="none">
                  <path d="M1 1L7 6.5L1 12" stroke="rgba(139,92,246,0.85)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="flex items-center justify-center rounded-xl"
                style={{ width: '42px', height: '42px', background: 'linear-gradient(135deg, rgba(124,58,237,0.22), rgba(79,70,229,0.18))', border: '1px solid rgba(139,92,246,0.38)', color: '#a78bfa', boxShadow: '0 0 18px rgba(124,58,237,0.18)' }}>
                <StoreIcon size={19} />
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="hu hu5 flex flex-col items-center gap-3 mb-10">
            <button onClick={() => router.push('/onboarding')}
              className="w-full sm:w-auto text-sm font-semibold px-8 py-3.5 rounded-xl text-white transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)', boxShadow: '0 0 45px rgba(124,58,237,0.38), 0 4px 24px rgba(0,0,0,0.35)' }}>
              {t.hero.cta}
            </button>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.28)' }}>{t.hero.ctaSub}</span>
          </div>

          {/* Social proof bar */}
          <div className="hu hu5 flex flex-col items-center gap-2 mb-8">
            <div className="proof-pill inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
              style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(124,58,237,0.35)', color: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(8px)' }}>
              <span style={{ color: '#22c55e', fontSize: '8px' }}>●</span>
              {ar ? '+١٢٠ متجر أُنشئ هذا الأسبوع' : '+120 חנויות נפתחו השבוע'}
            </div>
            <div style={{ width: '260px', overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #030712 0%, transparent 18%, transparent 82%, #030712 100%)', zIndex: 1, pointerEvents: 'none' }} />
              <div className="ticker-track flex gap-4 text-xs" style={{ color: 'rgba(255,255,255,0.28)', whiteSpace: 'nowrap', width: 'max-content' }}>
                {[...Array(2)].map((_, rep) => (
                  <span key={rep}>
                    {ar
                      ? 'متاجر في: الناصرة • حيفا • أم الفحم • تل أبيب • باقة الغربية • عكا • رهط • سخنين •'
                      : 'חנויות ב: נצרת • חיפה • אום אל-פחם • תל אביב • באקה • עכו • רהט • סחנין •'}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* AI demo */}
          <div className="hu hu5 w-full">
            <AiDemo lines={t.hero.aiLines} />
          </div>
        </div>
      </section>

      {/* ── MARKETPLACE ────────────────────────────────────────────────────── */}
      <MarketplaceSection lang={lang} />

      {/* ── FEATURES ───────────────────────────────────────────────────────── */}
      <section className="py-12 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white" style={{ letterSpacing: '-0.025em' }}>
              {t.features.title}
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {t.features.items.map((f, i) => (
              <FadeIn key={i} delay={i * 90}>
                <FeatureCard icon={f.icon} title={f.title} desc={f.desc} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── BEFORE / AFTER ─────────────────────────────────────────────────── */}
      <section className="py-12 px-5 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <FadeIn className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3" style={{ letterSpacing: '-0.025em' }}>
              {ar ? 'من هذا... لهذا' : 'מזה... לזה'}
            </h2>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.38)' }}>
              {ar ? 'بدون خبرة تقنية. بدون تصميم. فقط بزنسك.' : 'ללא ידע טכני. ללא עיצוב. רק העסק שלך.'}
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* BEFORE */}
            <FadeIn delay={0}>
              <div className="p-7 sm:p-8 rounded-2xl h-full"
                style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex items-center gap-3 mb-7">
                  <div className="flex items-center gap-1.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    <WaIcon size={18} />
                    <IgIcon size={18} />
                  </div>
                  <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    {ar ? 'قبل Instok' : 'לפני Instok'}
                  </span>
                </div>
                <div className="flex flex-col gap-4">
                  {(ar
                    ? ['ردود يدوية على كل DM', 'تحويلات بنكية وكاش', 'لا متجر لا هوية لا احترافية']
                    : ['תגובות ידניות לכל DM', 'העברות בנקאיות ומזומן', 'אין חנות, אין זהות, אין מקצועיות']
                  ).map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-lg flex-shrink-0" style={{ color: 'rgba(255,255,255,0.18)' }}>✗</span>
                      <span className="text-sm" style={{ color: 'rgba(255,255,255,0.32)' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* AFTER */}
            <FadeIn delay={110}>
              <div className="p-7 sm:p-8 rounded-2xl h-full relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.13), rgba(79,70,229,0.08))', border: '1px solid rgba(139,92,246,0.28)', boxShadow: '0 0 60px rgba(124,58,237,0.1)' }}>
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse 80% 55% at 50% 0%, rgba(124,58,237,0.18), transparent)' }} />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-7">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.32)', color: '#a78bfa' }}>
                      <StoreIcon size={15} />
                    </div>
                    <span className="text-sm font-semibold" style={{ color: '#c4b5fd' }}>
                      {ar ? 'بعد Instok ✦' : 'אחרי Instok ✦'}
                    </span>
                  </div>
                  <div className="flex flex-col gap-4">
                    {(ar
                      ? ['متجر احترافي بهوية AI', 'استقبل Bit وكاش وتحويل', 'طلبات واتساب تلقائية']
                      : ['חנות מקצועית עם זהות AI', 'קבל Bit, מזומן והעברה', 'הזמנות וואטסאפ אוטומטיות']
                    ).map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-lg flex-shrink-0" style={{ color: '#4ade80' }}>✓</span>
                        <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.78)' }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── PURPLE PROMO BAND ──────────────────────────────────────────────── */}
      <section className="py-14 px-5 sm:px-8 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 80% at 30% 50%, rgba(255,255,255,0.07), transparent)' }} />
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] mb-4" style={{ color: 'rgba(255,255,255,0.55)' }}>
            {ar ? 'لماذا Instok؟' : 'למה Instok?'}
          </p>
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-5" style={{ letterSpacing: '-0.03em', lineHeight: 1.2 }}>
            {ar ? 'متجرك الاحترافي جاهز\nفي أقل من ٥ دقائق' : 'החנות המקצועית שלך מוכנה\nתוך פחות מ-5 דקות'}
          </h2>
          <p className="text-base mb-8 max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.72)', lineHeight: 1.6 }}>
            {ar
              ? 'الذكاء الاصطناعي يفهم بزنسك ويبني هويتك الكاملة — اسم، ألوان، شعار، وصفحة منتجات احترافية'
              : 'ה-AI מבין את העסק שלך ובונה את הזהות המלאה — שם, צבעים, לוגו ודף מוצרים מקצועי'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            {(ar
              ? ['⚡ لا خبرة تقنية', '🎨 تصميم تلقائي بالذكاء الاصطناعي', '💬 طلبات واتساب فوراً', '💳 Bit & كاش']
              : ['⚡ ללא ידע טכני', '🎨 עיצוב אוטומטי עם AI', '💬 הזמנות בוואטסאפ מיד', '💳 Bit ומזומן']
            ).map((item, i) => (
              <span key={i} className="text-sm px-4 py-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(6px)' }}>
                {item}
              </span>
            ))}
          </div>
          <button onClick={() => router.push('/onboarding')}
            className="text-sm font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: 'rgba(255,255,255,0.95)', color: '#4f46e5', boxShadow: '0 8px 30px rgba(0,0,0,0.25)' }}>
            {ar ? 'ابدأ مجاناً الآن ←' : 'התחל בחינם עכשיו ←'}
          </button>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────────────────── */}
      <section className="py-12 px-5 sm:px-8 relative overflow-hidden">
        <div className="absolute pointer-events-none"
          style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '700px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,70,229,0.07) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="relative max-w-4xl mx-auto">
          <FadeIn className="text-center mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.15em] mb-3" style={{ color: '#8b5cf6' }}>
              {t.hiw.label}
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white" style={{ letterSpacing: '-0.025em' }}>
              {t.hiw.title}
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-6">
            {t.hiw.steps.map((step, i) => (
              <FadeIn key={i} delay={i * 100}>
                <div className="flex flex-col gap-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(79,70,229,0.2))', border: '1px solid rgba(139,92,246,0.3)', color: '#a78bfa', fontVariantNumeric: 'tabular-nums', fontFamily: 'monospace' }}>
                      {step.n}
                    </div>
                    {i < t.hiw.steps.length - 1 && (
                      <div className="hidden sm:block flex-1 h-px"
                        style={{ background: 'linear-gradient(to left, transparent, rgba(139,92,246,0.25))' }} />
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white mb-2" style={{ letterSpacing: '-0.015em' }}>
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.38)' }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── STORE EXAMPLES ─────────────────────────────────────────────────── */}
      <section className="py-12 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3" style={{ letterSpacing: '-0.025em' }}>
              {ar ? 'متاجر بناها الذكاء الاصطناعي' : 'חנויות שנבנו על ידי AI'}
            </h2>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.38)' }}>
              {ar ? 'كل متجر هوية مختلفة — AI يفهم كل بزنس' : 'כל חנות זהות שונה — AI מבין כל עסק'}
            </p>
          </FadeIn>

          <div style={{ display: 'flex', overflowX: 'auto', gap: '24px', paddingBottom: '12px', paddingLeft: '4px', paddingRight: '4px', scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
            {/* Beauty */}
            <div style={{ flexShrink: 0, scrollSnapAlign: 'start', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', width: '260px' }}>
              <div className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.7)' }}>💄 {ar ? 'متجر جمال وتجميل' : 'חנות יופי וטיפוח'}</div>
              <div style={{ width: '260px', borderRadius: '28px', border: '2px solid #1e1e1e', overflow: 'hidden', height: '456px', boxShadow: '0 24px 70px rgba(225,29,116,0.22), 0 0 0 1px rgba(225,29,116,0.14)' }}>
                <BeautyMiniPreview />
              </div>
            </div>

            {/* Gaming */}
            <div style={{ flexShrink: 0, scrollSnapAlign: 'start', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', width: '260px' }}>
              <div className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.7)' }}>🎮 {ar ? 'متجر ألعاب وغيمنج' : 'חנות משחקים וגיימינג'}</div>
              <div style={{ width: '260px', borderRadius: '28px', border: '2px solid #1a1a2e', overflow: 'hidden', height: '456px', boxShadow: '0 24px 70px rgba(124,58,237,0.28), 0 0 0 1px rgba(124,58,237,0.22)' }}>
                <GamingMiniPreview />
              </div>
            </div>

            {/* Luxury */}
            <div style={{ flexShrink: 0, scrollSnapAlign: 'start', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', width: '260px' }}>
              <div className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.7)' }}>👑 {ar ? 'متجر فاخر وراقي' : 'חנות יוקרתית ומפוארת'}</div>
              <div style={{ width: '260px', borderRadius: '28px', border: '2px solid #1a1505', overflow: 'hidden', height: '456px', boxShadow: '0 24px 70px rgba(184,150,12,0.18), 0 0 0 1px rgba(184,150,12,0.14)' }}>
                <LuxuryMiniPreview />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────────────────────── */}
      <section className="py-12 px-5 sm:px-8">
        <FadeIn>
          <div className="max-w-4xl mx-auto">
            <div className="rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.11) 0%, rgba(79,70,229,0.07) 100%)', border: '1px solid rgba(139,92,246,0.18)' }}>
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse 65% 55% at 50% 0%, rgba(124,58,237,0.16), transparent)' }} />
              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3" style={{ letterSpacing: '-0.03em' }}>
                  {t.cta.title}
                </h2>
                <p className="text-base mb-9" style={{ color: 'rgba(255,255,255,0.4)' }}>{t.cta.sub}</p>
                <button onClick={() => router.push('/onboarding')}
                  className="w-full sm:w-auto text-sm font-semibold px-8 py-3.5 rounded-xl text-white transition-all duration-200 hover:opacity-90 hover:scale-[1.02]"
                  style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)', boxShadow: '0 0 50px rgba(124,58,237,0.4)' }}>
                  {t.cta.btn}
                </button>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer className="py-8 px-5 sm:px-8" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.5)', letterSpacing: '-0.01em' }}>
            <span>ins</span><span style={{ color: '#9945FF' }}>tok</span>
          </span>
          <div className="flex items-center gap-4">
            <a href="/policy" className="text-xs" style={{ color: 'rgba(255,255,255,0.22)', textDecoration: 'none' }}>
              {t.footer.policy}
            </a>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.22)' }}>{t.footer.copy}</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

// ─── Feature card ─────────────────────────────────────────────────────────────

function FeatureCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  const [hovered, setHovered] = useState(false)
  const isWa = icon === 'message'
  return (
    <div className="p-6 sm:p-7 rounded-2xl h-full transition-all duration-300"
      style={{
        background: isWa ? 'linear-gradient(135deg, rgba(34,197,94,0.07), rgba(21,128,61,0.04))' : 'rgba(255,255,255,0.025)',
        border: isWa
          ? `1px solid ${hovered ? 'rgba(34,197,94,0.45)' : 'rgba(34,197,94,0.25)'}`
          : `1px solid ${hovered ? 'rgba(139,92,246,0.28)' : 'rgba(255,255,255,0.07)'}`,
        borderTop: isWa ? '2px solid rgba(34,197,94,0.5)' : undefined,
        backdropFilter: 'blur(12px)',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: isWa
          ? (hovered ? '0 12px 40px rgba(34,197,94,0.15)' : '0 0 24px rgba(34,197,94,0.07)')
          : (hovered ? '0 12px 40px rgba(0,0,0,0.25)' : 'none'),
      }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5 transition-all duration-300"
        style={{
          background: isWa
            ? (hovered ? 'rgba(34,197,94,0.2)' : 'rgba(34,197,94,0.12)')
            : (hovered ? 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(79,70,229,0.18))' : 'rgba(139,92,246,0.1)'),
          border: isWa
            ? `1px solid ${hovered ? 'rgba(34,197,94,0.4)' : 'rgba(34,197,94,0.22)'}`
            : `1px solid ${hovered ? 'rgba(139,92,246,0.3)' : 'rgba(139,92,246,0.15)'}`,
          color: isWa ? '#4ade80' : '#a78bfa',
        }}>
        {icon === 'zap' ? <ZapIcon /> : icon === 'wallet' ? <WalletIcon /> : <MessageIcon />}
      </div>
      <h3 className="text-base font-semibold text-white mb-2" style={{ letterSpacing: '-0.015em' }}>{title}</h3>
      <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.42)' }}>{desc}</p>
      {isWa && (
        <div className="mt-4 inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full" style={{ background: 'rgba(34,197,94,0.12)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)' }}>
          <span style={{ fontSize: '8px' }}>●</span> Live
        </div>
      )}
    </div>
  )
}
