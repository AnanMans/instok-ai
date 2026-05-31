'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Cairo, Heebo } from 'next/font/google'
import { createBrowserClient } from '@supabase/ssr'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function handleGoogleLogin() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + '/auth/callback',
    },
  })
  if (error) console.error(error)
}

const cairo = Cairo({ subsets: ['arabic'], display: 'swap', weight: ['400', '500', '600', '700'] })
const heebo = Heebo({ subsets: ['hebrew', 'latin'], display: 'swap', weight: ['400', '500', '600', '700'] })

type Lang = 'ar' | 'he'

type BrandResult = {
  storeName: string
  slogan: string
  colors: string[]
  vibe: string
  direction: string
  archetype?: string
  _fallback?: boolean
}

// ── Translations ───────────────────────────────────────────────────────────────
const T = {
  ar: {
    langSub: 'اختار لغتك / בחר שפה',
    langAr: 'العربية',
    langHe: 'עברית',
    s1Title: 'أنشئ حسابك',
    s1Sub: 'ثانية وتكون جاهز',
    s1Google: 'تابع مع Google',
    s1Apple: 'تابع مع Apple',
    s1Email: 'تابع مع الإيميل',
    s1EmailPH: 'بريدك الإلكتروني',
    s1PassPH: 'كلمة المرور',
    s1EnterBtn: 'دخول',
    s1ToSignIn: 'عندك حساب؟ سجل دخول',
    s1ToSignUp: 'ما عندك حساب؟ أنشئ حساباً',
    s1PhoneTitle: 'أهلاً! شو رقم جوالك؟',
    s1PhoneSub: 'نبعتلك رمز عبر واتساب أو SMS',
    s1PhonePH: 'مثال: 0521234567',
    s1SendCode: 'أرسل الرمز ←',
    s1OtpTitle: 'أدخل رمز التحقق',
    s1OtpResend: 'أعد الإرسال',
    s1WaTitle: 'شو رقم واتساب؟',
    s1WaSub: 'عملاؤك يتواصلون معك هنا',
    s1WaSame: 'نفس رقم الجوال',
    s1WaDiff: 'رقم مختلف',
    s1WaConfirm: 'تأكيد ←',
    s2Title: 'شو بتبني؟',
    s2Sub: 'ثلاث أسئلة وخلصنا',
    s2NameLabel: 'اسم متجرك أو علامتك التجارية الحالية',
    s2NameHelper: 'هذا هو اسمك الرسمي — لن يتغير',
    s2NamePH: 'مثال: دانا للجمال',
    s2CatLabel: 'شو بتبيع؟',
    s2Cats: ['ملابس', 'مكياج وجمال', 'إلكترونيات', 'ألعاب وغيمنج', 'أكل وحلويات', 'إكسسوار', 'منتجات يدوية', 'أخرى'],
    s2VibeLabel: 'شو احساس متجرك؟',
    s2Vibes: [
      { id: 'luxury', label: 'فاخر', icon: '✦' },
      { id: 'youth', label: 'شبابي', icon: '⚡' },
      { id: 'minimal', label: 'بسيط', icon: '○' },
      { id: 'tech', label: 'تقني', icon: '◈' },
      { id: 'soft', label: 'ناعم', icon: '✿' },
      { id: 'bold', label: 'جريء', icon: '◆' },
    ],
    s2DescLabel: 'صف متجرك بجملة (اختياري)',
    s2DescPH: 'مثال: أبيع عبايات فاخرة للمرأة العصرية',
    s2ImgLabel: 'رفع شعار أو صورة منتج (اختياري)',
    s2ImgBtn: 'اضغط لرفع صورة',
    s2CTA: 'ولّد متجري بالذكاء الاصطناعي ✨',
    s3Lines: [
      '✦ جاري تحليل علامتك التجارية...',
      '✦ اكتشاف الألوان المثالية...',
      '✦ توليد الشعار والهوية...',
      '✦ بناء صفحة المتجر...',
      '✦ تحسين التصميم للجوال...',
      '✦ متجرك جاهز تقريباً...',
    ],
    s4Badge: 'متجرك جاهز بنسبة 82% 🚀',
    s4DNALabel: '✦ الذكاء الاصطناعي اختار:',
    s4Archetypes: [
      { id: 'luxury',     label: '✦ فاخر' },
      { id: 'gaming',     label: '🎮 غيمنج' },
      { id: 'creator',    label: '🎨 كريتور' },
      { id: 'beauty',     label: '💄 جمال' },
      { id: 'streetwear', label: '🔥 ستريت' },
      { id: 'minimal',    label: '○ بسيط' },
      { id: 'restaurant', label: '🍕 مطعم' },
      { id: 'tech',       label: '⚡ تقني' },
    ],
    s4ShopNow: 'تسوّق الآن ←',
    s4Prods: 'المنتجات',
    s4Prod1: 'منتج ١',
    s4Prod2: 'منتج ٢',
    s4WA: 'اطلب عبر واتساب',
    s4CustomManual: 'تخصيص يدوي ⚙',
    s4Luxe: 'أكثر فخامة ✦',
    s4Simple: 'أكثر بساطة ○',
    s4BoldBtn: 'أكثر جرأة ◆',
    s4Confirm: 'هذا متجري — كمّل ✓',
    s4Retry: 'جرّب اتجاه ثاني ✦',
    s5Title: 'اختار الطريقة الأسهل لعملائك 💸',
    s5Sub: 'تقدر تغير هذا لاحقاً',
    s5BitLabel: 'Bit — الأسهل والأسرع',
    s5BankLabel: 'تحويل بنكي',
    s5CashLabel: 'دفع عند الاستلام',
    s5BitPH: 'رقم الجوال المرتبط بـ Bit',
    s5IbanPH: 'رقم IBAN',
    s5BankPH: 'اسم البنك',
    s6Title: 'كيف بتوصّل البهجة لعملائك؟ 🚚',
    s6SelfLabel: 'أنا بوصّل بنفسي',
    s6PickupLabel: 'استلام من عندي',
    s6CourierLabel: 'شركة شحن',
    s6AreasPH: 'مثال: الناصرة، حيفا، باقة الغربية...',
    s6AreasHelper: 'اكتب المناطق اللي بتوصّل إلها',
    s6AddressPH: 'عنوانك الكامل',
    s6CourierPH: 'اكتب اسم شركة الشحن',
    s6WaLabel: 'رقم واتساب للطلبات 📱',
    s6WaPH: '+972501234567',
    s7Title: 'متجرك صار حقيقي! 🎉',
    s7WA: 'شارك على واتساب',
    s7IG: 'شارك على انستغرام',
    s7Copy: 'نسخ الرابط',
    s7Copied: 'تم النسخ ✓',
    s7Go: 'اذهب لمتجري ←',
    s7Hint: 'تقدر تضيف منتجاتك من لوحة التحكم',
    next: 'التالي',
    back: 'رجوع',
  },
  he: {
    langSub: 'اختار لغتك / בחר שפה',
    langAr: 'العربية',
    langHe: 'עברית',
    s1Title: 'צור חשבון',
    s1Sub: 'שנייה ואתה מוכן',
    s1Google: 'המשך עם Google',
    s1Apple: 'המשך עם Apple',
    s1Email: 'המשך עם אימייל',
    s1EmailPH: 'כתובת אימייל',
    s1PassPH: 'סיסמה',
    s1EnterBtn: 'כניסה',
    s1ToSignIn: 'יש לך חשבון? התחבר',
    s1ToSignUp: 'אין לך חשבון? צור חשבון',
    s1PhoneTitle: 'היי! מה מספר הטלפון שלך?',
    s1PhoneSub: 'נשלח לך קוד דרך וואטסאפ או SMS',
    s1PhonePH: 'לדוגמה: 0521234567',
    s1SendCode: 'שלח קוד ←',
    s1OtpTitle: 'הזן את הקוד',
    s1OtpResend: 'שלח שוב',
    s1WaTitle: 'מה מספר הוואטסאפ?',
    s1WaSub: 'הלקוחות שלך יצרו איתך קשר כאן',
    s1WaSame: 'אותו מספר',
    s1WaDiff: 'מספר אחר',
    s1WaConfirm: 'אישור ←',
    s2Title: 'מה אתה בונה?',
    s2Sub: 'שלוש שאלות וסיימנו',
    s2NameLabel: 'שם החנות או המותג הקיים שלך',
    s2NameHelper: 'זה השם הרשמי שלך — לא ישתנה',
    s2NamePH: 'לדוגמה: דנה ביוטי',
    s2CatLabel: 'מה אתה מוכר?',
    s2Cats: ['בגדים', 'איפור ויופי', 'אלקטרוניקה', 'גיימינג', 'אוכל', 'אקססוריז', 'מוצרי יד', 'אחר'],
    s2VibeLabel: 'מה הוויב של החנות?',
    s2Vibes: [
      { id: 'luxury', label: 'יוקרתי', icon: '✦' },
      { id: 'youth', label: 'צעיר', icon: '⚡' },
      { id: 'minimal', label: 'מינימלי', icon: '○' },
      { id: 'tech', label: 'טכנולוגי', icon: '◈' },
      { id: 'soft', label: 'עדין', icon: '✿' },
      { id: 'bold', label: 'נועז', icon: '◆' },
    ],
    s2DescLabel: 'תאר את החנות במשפט (אופציונלי)',
    s2DescPH: 'לדוגמה: אני מוכר רהיטים מעוצבים',
    s2ImgLabel: 'העלה לוגו או תמונת מוצר (אופציונלי)',
    s2ImgBtn: 'לחץ להעלאת תמונה',
    s2CTA: 'צור את החנות שלי עם AI ✨',
    s3Lines: [
      '✦ מנתח את המותג שלך...',
      '✦ מגלה את הצבעים המושלמים...',
      '✦ יוצר לוגו וזהות...',
      '✦ בונה את דף החנות...',
      '✦ מייצב לנייד...',
      '✦ החנות שלך כמעט מוכנה...',
    ],
    s4Badge: 'החנות שלך מוכנה ב-82% 🚀',
    s4DNALabel: '✦ הבינה המלאכותית בחרה:',
    s4Archetypes: [
      { id: 'luxury',     label: '✦ יוקרה' },
      { id: 'gaming',     label: '🎮 גיימינג' },
      { id: 'creator',    label: '🎨 יוצר' },
      { id: 'beauty',     label: '💄 יופי' },
      { id: 'streetwear', label: '🔥 סטריט' },
      { id: 'minimal',    label: '○ מינימלי' },
      { id: 'restaurant', label: '🍕 מסעדה' },
      { id: 'tech',       label: '⚡ טכנולוגי' },
    ],
    s4ShopNow: 'קנה עכשיו ←',
    s4Prods: 'מוצרים',
    s4Prod1: 'מוצר 1',
    s4Prod2: 'מוצר 2',
    s4WA: 'הזמן דרך וואטסאפ',
    s4CustomManual: 'התאמה ידנית ⚙',
    s4Luxe: 'יותר יוקרתי ✦',
    s4Simple: 'יותר פשוט ○',
    s4BoldBtn: 'יותר נועז ◆',
    s4Confirm: 'זו החנות שלי — המשך ✓',
    s4Retry: 'נסה כיוון אחר ✦',
    s5Title: 'איך תרצה לקבל תשלום?',
    s5Sub: 'אפשר לשנות את זה אחר כך',
    s5BitLabel: 'Bit — הכי קל',
    s5BankLabel: 'העברה בנקאית',
    s5CashLabel: 'תשלום במזומן',
    s5BitPH: 'מספר טלפון ל-Bit',
    s5IbanPH: 'מספר IBAN',
    s5BankPH: 'שם הבנק',
    s6Title: 'איך תשלח הזמנות?',
    s6SelfLabel: 'אני מוסר בעצמי',
    s6PickupLabel: 'איסוף עצמי',
    s6CourierLabel: 'חברת שילוח',
    s6AreasPH: 'לדוגמה: נצרת, חיפה, באקה...',
    s6AreasHelper: 'כתוב את האזורים',
    s6AddressPH: 'הכתובת המלאה שלך',
    s6CourierPH: 'כתוב את שם חברת המשלוח',
    s6WaLabel: 'מספר וואטסאפ להזמנות 📱',
    s6WaPH: '+972501234567',
    s7Title: 'החנות שלך הפכה לאמיתית! 🎉',
    s7WA: 'שתף בוואטסאפ',
    s7IG: 'שתף באינסטגרם',
    s7Copy: 'העתק קישור',
    s7Copied: 'הועתק ✓',
    s7Go: 'עבור לחנות שלי ←',
    s7Hint: 'תוכל להוסיף מוצרים מלוח הבקרה',
    next: 'הבא',
    back: 'חזור',
  },
}

// ── SVG Icons ──────────────────────────────────────────────────────────────────
const IcShirt = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/></svg>
const IcLipstick = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 22V11l5-9 5 9v11"/><path d="M7 22h10"/><path d="M7 11h10"/></svg>
const IcPhone = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
const IcGamepad = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="10" rx="5"/><path d="M8 11v4m-2-2h4"/><circle cx="16" cy="11" r="0.5" fill="currentColor" stroke="none"/><circle cx="18" cy="13" r="0.5" fill="currentColor" stroke="none"/></svg>
const IcFood = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
const IcDiamond = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12l4 6-10 13L2 9z"/><path d="M2 9h20"/></svg>
const IcHand = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 11V6a2 2 0 0 0-4 0v5"/><path d="M14 10V4a2 2 0 0 0-4 0v6"/><path d="M10 10.5V6a2 2 0 0 0-4 0v8"/><path d="M6 14v4a6 6 0 0 0 6 6h2a6 6 0 0 0 6-6v-3a2 2 0 0 0-2-2h-4"/></svg>
const IcBox = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>

const CAT_ICONS = [IcShirt, IcLipstick, IcPhone, IcGamepad, IcFood, IcDiamond, IcHand, IcBox]

const IcGoogle = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

const IcApple = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
)

const IcBank = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/>
    <line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/>
    <line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/>
  </svg>
)

const IcCash = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="6" width="20" height="12" rx="2"/>
    <circle cx="12" cy="12" r="3"/>
    <path d="M6 12h.01M18 12h.01"/>
  </svg>
)

// ── Helper components ──────────────────────────────────────────────────────────
function Dot({ active }: { active: boolean }) {
  return (
    <div style={{
      width: 20, height: 20, borderRadius: '50%', flexShrink: 0, transition: 'all 0.15s',
      border: active ? '6px solid #7c3aed' : '1.5px solid rgba(255,255,255,0.25)',
      background: 'transparent',
    }} />
  )
}

// ── Style constants ────────────────────────────────────────────────────────────
const inp = {
  width: '100%', background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '14px', padding: '14px 16px', color: '#fff', fontSize: '15px',
  outline: 'none', boxSizing: 'border-box' as const, fontFamily: 'inherit',
}
const btnP = {
  width: '100%', background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', color: '#fff',
  border: 'none', borderRadius: '14px', padding: '15px 24px', fontSize: '15px',
  fontWeight: 600, cursor: 'pointer', boxShadow: '0 0 30px rgba(124,58,237,0.25)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
  fontFamily: 'inherit',
}
const cardB = {
  width: '100%', background: '#111', border: '1.5px solid rgba(255,255,255,0.08)',
  borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center',
  gap: '12px', cursor: 'pointer', textAlign: 'start' as const, fontFamily: 'inherit',
}
const cardS = {
  ...cardB, border: '1.5px solid rgba(124,58,237,0.6)',
  background: 'rgba(124,58,237,0.1)', boxShadow: '0 0 20px rgba(124,58,237,0.12)',
}

// ── Archetype system ───────────────────────────────────────────────────────────
const archetypeLabels: Record<string, Record<Lang, string>> = {
  luxury:     { ar: '👑 فاخر وراقي',               he: '👑 יוקרתי ומפואר' },
  gaming:     { ar: '🎮 ألعاب وغيمنج',              he: '🎮 משחקים וגיימינג' },
  creator:    { ar: '🎨 منتجات يدوية',              he: '🎨 מוצרי יד' },
  beauty:     { ar: '💄 جمال وتجميل',               he: '💄 יופי וטיפוח' },
  streetwear: { ar: '👕 ملابس وموضة',               he: '👕 בגדים ואופנה' },
  minimal:    { ar: '⬜ بسيط ونظيف',               he: '⬜ פשוט ונקי' },
  restaurant: { ar: '🍕 أكل ومطاعم',               he: '🍕 אוכל ומסעדות' },
  tech:       { ar: '💻 إلكترونيات وتقنية',         he: '💻 אלקטרוניקה וטכנולוגיה' },
}

const vibeToArchetype: Record<string, string> = {
  luxury: 'luxury', soft: 'beauty', youth: 'streetwear',
  bold: 'creator', minimal: 'minimal', tech: 'tech',
}

const categoryToArchetype: Record<string, string> = {
  'ملابس': 'streetwear', 'בגדים': 'streetwear',
  'مكياج وجمال': 'beauty', 'איפור ויופי': 'beauty',
  'إلكترونيات': 'tech', 'אלקטרוניקה': 'tech',
  'ألعاب وغيمنج': 'gaming', 'גיימינג': 'gaming',
  'أكل وحلويات': 'restaurant', 'אוכל': 'restaurant',
}

const ALL_ARCHETYPES = ['luxury', 'gaming', 'creator', 'beauty', 'streetwear', 'minimal', 'restaurant', 'tech']

const MOOD_PALETTES = [
  { colors: ['#1a1a2e', '#c9a84c', '#f5f0e8'], ar: 'ليل فاخر',   he: 'לילה יוקרתי' },
  { colors: ['#fff0f5', '#e11d74', '#f97316'], ar: 'جمال ناعم',  he: 'יופי עדין' },
  { colors: ['#0d0d14', '#7c3aed', '#00ff88'], ar: 'نيون غيمنج', he: 'ניאון גיימינג' },
  { colors: ['#ffffff', '#6c47ff', '#06b6d4'], ar: 'نظيف عصري', he: 'נקי ומודרני' },
  { colors: ['#fef9f0', '#d47c0a', '#8b4513'], ar: 'طبيعي دافئ', he: 'טבעי וחמים' },
]

// ── Category → product images ──────────────────────────────────────────────────
const CATEGORY_IMAGES: Record<string, string[]> = {
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

// ── Store previews (8 archetypes) ──────────────────────────────────────────────
function renderStorePreview(
  archetype: string,
  displayBrand: BrandResult,
  customColors: string[],
  lang: Lang,
  uploadedImage: string | null,
  t: typeof T['ar'],
  categories: string[] = []
): React.ReactNode {
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
          <div style={{ flex: 1, background: '#0a0a0a', padding: '8px', overflow: 'hidden' }}>
            <div style={{ background: `${c0}08`, border: `1px solid ${c0}15`, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ flex: 1, overflow: 'hidden', minHeight: '100px' }}>
                <img src={imgs[0]} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} alt="" />
              </div>
              <div style={{ padding: '8px 12px', textAlign: 'center', flexShrink: 0 }}>
                <div style={{ fontSize: '7px', color: darkCardText, fontWeight: 300, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '3px', opacity: 0.55 }}>{t.s4Prod1}</div>
                <div style={{ fontSize: '13px', fontWeight: 400, color: c0 }}>₪299</div>
              </div>
            </div>
          </div>
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
            {imgs.map((src, i) => (
              <div key={i} style={{ background: `${c0}18`, borderRadius: '8px', overflow: 'hidden', border: `1px solid ${c0}30`, display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, overflow: 'hidden', minHeight: '70px', position: 'relative' }}>
                  <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} alt="" />
                  {i === 0 && (
                    <div style={{ position: 'absolute', top: '3px', right: '3px', background: 'rgba(239,68,68,0.92)', borderRadius: '3px', padding: '1px 4px' }}>
                      <span style={{ fontSize: '6px', fontWeight: 800, color: '#fff' }}>{lang === 'ar' ? '🔥 رائج' : '🔥 חם'}</span>
                    </div>
                  )}
                </div>
                <div style={{ padding: '4px 5px', flexShrink: 0 }}>
                  <div style={{ fontSize: '7px', fontWeight: 600, marginBottom: '1px', color: darkCardText }}>{i === 0 ? t.s4Prod1 : t.s4Prod2}</div>
                  <div style={{ fontSize: '8px', fontWeight: 700, color: c0, textShadow: `0 0 8px ${c0}80` }}>₪199</div>
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
            {imgs.map((src, i) => (
              <div key={i} style={{ background: `${lightCardBg}ee`, borderRadius: '4px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transform: i === 0 ? 'rotate(-1.5deg)' : 'rotate(1.5deg)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, overflow: 'hidden', minHeight: '70px' }}>
                  <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} alt="" />
                </div>
                <div style={{ padding: '4px 5px', flexShrink: 0 }}>
                  <div style={{ fontSize: '7px', fontWeight: 600, marginBottom: '1px', color: lightCardText }}>{i === 0 ? t.s4Prod1 : t.s4Prod2}</div>
                  <div style={{ fontSize: '8px', fontWeight: 700, color: lightPrice }}>₪149</div>
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
            {imgs.map((src, i) => (
              <div key={i} style={{ background: `${lightCardBg}cc`, borderRadius: '12px', overflow: 'hidden', border: `1px solid ${c0}20`, display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, overflow: 'hidden', minHeight: '70px' }}>
                  <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} alt="" />
                </div>
                <div style={{ padding: '4px 5px', flexShrink: 0 }}>
                  <div style={{ fontSize: '7px', fontWeight: 600, marginBottom: '1px', color: lightCardText }}>{i === 0 ? t.s4Prod1 : t.s4Prod2}</div>
                  <div style={{ fontSize: '8px', fontWeight: 700, color: lightPrice }}>₪89</div>
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
            {imgs.map((src, i) => (
              <div key={i} style={{ background: '#111', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ flex: 1, overflow: 'hidden', minHeight: '70px', position: 'relative' }}>
                  <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} alt="" />
                  <div style={{ position: 'absolute', inset: 0, background: `${[c0, c1][i]}20` }} />
                </div>
                <div style={{ padding: '4px 5px', flexShrink: 0 }}>
                  <div style={{ fontSize: '7px', fontWeight: 600, marginBottom: '1px', color: '#fff' }}>{i === 0 ? t.s4Prod1 : t.s4Prod2}</div>
                  <div style={{ fontSize: '8px', fontWeight: 700, color: [c0, c1][i] }}>₪149</div>
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
            {imgs.map((src, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: '4px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, overflow: 'hidden', minHeight: '70px' }}>
                  <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} alt="" />
                </div>
                <div style={{ padding: '4px 5px', flexShrink: 0 }}>
                  <div style={{ fontSize: '7px', fontWeight: 600, marginBottom: '1px', color: '#777' }}>{i === 0 ? t.s4Prod1 : t.s4Prod2}</div>
                  <div style={{ fontSize: '8px', fontWeight: 700, color: c0 }}>₪199</div>
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
            {imgs.map((src, i) => (
              <div key={i} style={{ background: `${c0}12`, borderRadius: '8px', overflow: 'hidden', border: `1px solid ${c0}18`, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                <div style={{ width: '60px', height: '60px', flexShrink: 0, overflow: 'hidden' }}>
                  <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} alt="" />
                </div>
                <div style={{ padding: '6px 8px', flex: 1 }}>
                  <div style={{ fontSize: '8px', fontWeight: 600, color: darkCardText, marginBottom: '2px' }}>{i === 0 ? t.s4Prod1 : t.s4Prod2}</div>
                  <div style={{ fontSize: '9px', fontWeight: 700, color: c0 }}>{i === 0 ? '₪65' : '₪45'}</div>
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
            {imgs.map((src, i) => (
              <div key={i} style={{ background: `${c0}18`, borderRadius: '8px', overflow: 'hidden', border: `1px solid ${c0}20`, display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, overflow: 'hidden', minHeight: '70px', position: 'relative' }}>
                  <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} alt="" />
                  <div style={{ position: 'absolute', top: '3px', left: '3px', background: c0, borderRadius: '3px', padding: '1px 5px' }}>
                    <span style={{ fontSize: '6px', fontWeight: 700, color: ctaText }}>{lang === 'ar' ? 'مميز' : 'מיוחד'}</span>
                  </div>
                </div>
                <div style={{ padding: '4px 5px', flexShrink: 0 }}>
                  <div style={{ fontSize: '7px', fontWeight: 600, marginBottom: '1px', color: darkCardText }}>{i === 0 ? t.s4Prod1 : t.s4Prod2}</div>
                  <div style={{ fontSize: '8px', fontWeight: 700, color: darkPrice }}>{i === 0 ? '₪299' : '₪499'}</div>
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

// ── Page ───────────────────────────────────────────────────────────────────────
export default function Page() {
  const router = useRouter()
  const [lang, setLang] = useState<Lang | null>(null)
  const [step, setStep] = useState(0)
  const [brandName, setBrandName] = useState('')
  const [categories, setCategories] = useState<string[]>([])
  const [vibe, setVibe] = useState('')
  const [description, setDescription] = useState('')
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [brandData, setBrandData] = useState<BrandResult | null>(null)
  const [brandLoading, setBrandLoading] = useState(false)
  const [customColors, setCustomColors] = useState<string[]>(['#7c3aed', '#f59e0b', '#0f172a'])
  const [selectedArchetype, setSelectedArchetype] = useState('')
  const [selectedPalette, setSelectedPalette] = useState<number | null>(null)
  const [showCustomColors, setShowCustomColors] = useState(false)
  const [shownArchetypes, setShownArchetypes] = useState<string[]>([])
  const [archetypeHistory, setArchetypeHistory] = useState<string[]>([])
  const [animLine, setAnimLine] = useState(0)
  const [animProgress, setAnimProgress] = useState(0)
  const [payments, setPayments] = useState<string[]>([])
  const [bitPhone, setBitPhone] = useState('')
  const [iban, setIban] = useState('')
  const [bankName, setBankName] = useState('')
  const [delivery, setDelivery] = useState('')
  const [deliveryAreas, setDeliveryAreas] = useState('')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [deliveryCourier, setDeliveryCourier] = useState('')
  const [copied, setCopied] = useState(false)
  const [whatsappPhone, setWhatsappPhone] = useState('')
  const [savedSlug, setSavedSlug] = useState('')
  const [storeSaving, setStoreSaving] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  const imgInputRef = useRef<HTMLInputElement>(null)
  const t = T[lang ?? 'ar']
  const fontClass = lang === 'he' ? heebo.className : cairo.className

  useEffect(() => {
    if (step !== 3) return
    setAnimLine(0); setAnimProgress(0); setBrandLoading(true); setBrandData(null)
    fetch('/api/analyze-brand', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brandName, url: brandName, category: categories.join(', '), lang: lang ?? 'ar', description, vibe: vibe || (lang === 'ar' ? 'بسيط' : 'מינימלי') }),
    })
      .then(r => r.json()).then((data: BrandResult) => { setBrandData(data); if (data.colors?.length >= 3) setCustomColors(data.colors) })
      .catch(() => {}).finally(() => setBrandLoading(false))
    let li = 0
    const lineTimer = setInterval(() => { li = (li + 1) % 6; setAnimLine(li) }, 667)
    const progTimer = setInterval(() => setAnimProgress(p => Math.min(p + 1, 100)), 40)
    const advance = setTimeout(() => { clearInterval(lineTimer); clearInterval(progTimer); setAnimProgress(100); setStep(4) }, 4000)
    return () => { clearInterval(lineTimer); clearInterval(progTimer); clearTimeout(advance) }
  }, [step]) // eslint-disable-line

  useEffect(() => {
    if (brandData && brandData.colors && brandData.colors.length >= 3) setCustomColors(brandData.colors)
  }, [brandData])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const stepParam = params.get('step')
    if (stepParam === '2') {
      setStep(2)
    }

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user?.email) setUserEmail(session.user.email)
      if (session) {
        const { data: existing } = await supabase
          .from('stores')
          .select('id')
          .eq('owner_id', session.user.id)
          .limit(1)
          .maybeSingle()
        if (existing) {
          router.replace('/dashboard')
          return
        }
        if (stepParam !== '2') setStep(2)
      }
    })
  }, []) // eslint-disable-line

  const goNext = () => setStep(s => s + 1)
  const goBack = () => setStep(s => s - 1)

  const canNext = step === 2
    ? brandName.trim().length > 0 && categories.length > 0
    : step === 5 ? payments.length > 0
    : step === 6 ? delivery.length > 0
    : true

  const showProgress = [1, 2, 5, 6].includes(step)
  const showBack = [1, 2, 5, 6].includes(step)
  const progressPct = step === 1 ? 25 : step === 2 ? 50 : step === 5 ? 75 : step === 6 ? 100 : 0

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setUploadedImage(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const computedSlug = (brandName || brandData?.storeName || 'mystore').split(' ')[0].toLowerCase().replace(/[^\w]/g, '') || 'mystore'
  const storeUrl = `instok-ai.vercel.app/store/${savedSlug || computedSlug}`

  const c0 = customColors[0] ?? '#7c3aed'
  const c1 = customColors[1] ?? '#f59e0b'
  const autoArchetype = brandData?.archetype
    || (vibe ? vibeToArchetype[vibe] : null)
    || (categories[0] ? categoryToArchetype[categories[0]] : null)
    || 'minimal'
  const effectiveArchetype = selectedArchetype || autoArchetype
  const displayBrand = brandData ?? { storeName: brandName || '—', slogan: '—', colors: customColors, vibe: '', direction: '' }
  const boldArchetype = categories.some(c => ['ألعاب وغيمنج', 'גיימינג', 'إلكترونيات', 'אלקטרוניקה'].includes(c)) ? 'gaming' : 'streetwear'

  const handleConfirmStore = async () => {
    setStoreSaving(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch('/api/save-store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandName: displayBrand.storeName,
          slogan: displayBrand.slogan,
          colors: customColors,
          archetype: effectiveArchetype,
          vibe,
          category: categories.join(', '),
          description,
          whatsappNumber: whatsappPhone,
          delivery,
          deliveryAreas,
          payments: payments.join(', '),
          lang: lang ?? 'ar',
          userId: session?.user?.id,
        }),
      })
      const data = await res.json()
      console.log('[onboarding] save-store response:', data)
      if (data.error) {
        alert('خطأ: ' + data.error)
      } else if (data.slug) {
        setSavedSlug(data.slug)
      }
    } catch (err) {
      console.error('[onboarding] handleConfirmStore error:', err)
    }
    setStoreSaving(false)
    goNext()
  }

  const handleRetryArchetype = () => {
    const current = effectiveArchetype
    const nowShown = [...new Set([...shownArchetypes, current])]
    let remaining = ALL_ARCHETYPES.filter(a => !nowShown.includes(a))
    let nextShown = nowShown
    if (remaining.length === 0) { nextShown = []; remaining = ALL_ARCHETYPES.filter(a => a !== current) }
    const next = remaining[0] ?? ALL_ARCHETYPES[0]
    setShownArchetypes(nextShown)
    setArchetypeHistory(h => [...h, selectedArchetype])
    setSelectedArchetype(next)
  }

  const handleBackArchetype = () => {
    if (archetypeHistory.length === 0) return
    const prev = archetypeHistory[archetypeHistory.length - 1]
    setArchetypeHistory(h => h.slice(0, -1))
    setSelectedArchetype(prev)
  }

  const confettiPieces = useMemo(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      color: [...customColors, '#fff', '#a78bfa', '#4f46e5', '#f59e0b'][i % 7],
      left: `${((i * 37 + 11) % 97)}%`,
      dur: `${2 + (i % 4) * 0.6}s`,
      delay: `${(i * 0.12) % 1.8}s`,
      size: `${5 + (i % 4) * 2}px`,
    }))
  , [customColors]) // eslint-disable-line

  return (
    <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', justifyContent: 'center', overflowX: 'clip', maxWidth: '100%', width: '100%', position: 'relative' }}>
      <style>{`
        *{box-sizing:border-box}
        input,button,textarea{font-family:inherit}
        input:focus{border-color:rgba(124,58,237,0.6)!important;box-shadow:0 0 0 3px rgba(124,58,237,0.12)}
        @keyframes stepEnter{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes orbPulse{0%,100%{transform:scale(0.95);opacity:.85}50%{transform:scale(1.06);opacity:1}}
        @keyframes ringOut{from{transform:scale(1);opacity:.4}to{transform:scale(1.7);opacity:0}}
        @keyframes lineAnim{0%{opacity:0;transform:translateY(7px)}15%{opacity:1;transform:translateY(0)}75%{opacity:1}100%{opacity:0}}
        @keyframes confettiFall{0%{transform:translateY(-10px) rotate(0deg);opacity:1}85%{opacity:.9}100%{transform:translateY(105vh) rotate(600deg);opacity:0}}
        @keyframes btnPulse{0%,100%{box-shadow:0 0 30px rgba(124,58,237,0.35)}50%{box-shadow:0 0 55px rgba(124,58,237,0.65),0 0 90px rgba(124,58,237,0.2)}}
        .step-enter{animation:stepEnter .3s ease forwards}
        .orb{animation:orbPulse 1.5s ease-in-out infinite}
        .ring1{animation:ringOut 2s ease-out infinite}
        .ring2{animation:ringOut 2s ease-out infinite .7s}
        .ring3{animation:ringOut 2s ease-out infinite 1.4s}
        .ai-line{animation:lineAnim .67s ease forwards}
        .confetti-piece{position:fixed;top:0;border-radius:50%;animation:confettiFall var(--dur) var(--delay) ease-in both;pointer-events:none;z-index:200}
        .palette-scroll::-webkit-scrollbar{display:none}
        .palette-scroll{scrollbar-width:none}
      `}</style>

      <div className={fontClass} dir="rtl" style={{ width: '100%', maxWidth: '430px', minHeight: '100vh', position: 'relative' }}>

        {/* ── Step 0: Language ──────────────────────────────────────────────── */}
        {step === 0 && (
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px' }}>
            <div style={{ marginBottom: '16px', textAlign: 'center' }}>
              <span style={{ fontSize: '38px', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em' }}>Instok</span>
              <span style={{ fontSize: '38px', fontWeight: 800, letterSpacing: '-0.03em', background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>.ai</span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px', marginBottom: '48px', textAlign: 'center' }}>{t.langSub}</p>
            <div style={{ display: 'flex', gap: '16px', width: '100%', direction: 'ltr' }}>
              <button onClick={() => { setLang('he'); setStep(1) }}
                style={{ flex: 1, background: '#111', border: '1.5px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '28px 16px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '18px', fontWeight: 700, color: '#fff', fontFamily: heebo.style.fontFamily }}>עברית</span>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', fontFamily: heebo.style.fontFamily }}>Hebrew</span>
              </button>
              <button onClick={() => { setLang('ar'); setStep(1) }}
                style={{ flex: 1, background: '#111', border: '1.5px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '28px 16px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '18px', fontWeight: 700, color: '#fff', fontFamily: cairo.style.fontFamily }}>العربية</span>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', fontFamily: cairo.style.fontFamily }}>Arabic</span>
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: AI Animation ──────────────────────────────────────────── */}
        {step === 3 && (
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px' }}>
            <div style={{ position: 'relative', marginBottom: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="ring1" style={{ position: 'absolute', width: 180, height: 180, borderRadius: '50%', border: '1px solid rgba(124,58,237,0.2)' }} />
              <div className="ring2" style={{ position: 'absolute', width: 140, height: 140, borderRadius: '50%', border: '1px solid rgba(124,58,237,0.3)' }} />
              <div className="ring3" style={{ position: 'absolute', width: 110, height: 110, borderRadius: '50%', border: '1px solid rgba(124,58,237,0.4)' }} />
              <div className="orb" style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', boxShadow: '0 0 60px rgba(124,58,237,0.6),0 0 120px rgba(124,58,237,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '28px' }}>✦</span>
              </div>
            </div>
            <div style={{ height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '48px' }}>
              <p key={animLine} className="ai-line" style={{ color: '#c4b5fd', fontSize: '15px', fontWeight: 500, textAlign: 'center' }}>
                {t.s3Lines[animLine]}
              </p>
            </div>
            <div style={{ width: '100%', maxWidth: '260px', height: '3px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${animProgress}%`, background: 'linear-gradient(90deg,#7c3aed,#4f46e5)', borderRadius: '2px', transition: 'width 0.04s linear' }} />
            </div>
          </div>
        )}

        {/* ── Step 4: WOW Moment — full-screen hero layout ─────────────────── */}
        {step === 4 && (
          <div key={step} className="step-enter" style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#080808', position: 'relative', overflowX: 'clip', width: '100%', maxWidth: '100%', WebkitOverflowScrolling: 'touch' }}>

            {/* Back button */}
            <button onClick={goBack} style={{ position: 'absolute', top: '14px', right: '16px', zIndex: 20, background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '3px', padding: '4px' }}>
              ← {t.back}
            </button>

            {/* Phone hero area — flex: 1, fills most of screen */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '44px 0 6px', overflow: 'hidden', minHeight: 0, minWidth: 0, maxWidth: '100%' }}>

              {/* DNA badge — floating above phone */}
              <div style={{ textAlign: 'center', marginBottom: '6px', minWidth: 0, maxWidth: '100%' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#111', border: '1px solid rgba(124,58,237,0.5)', borderRadius: '20px', padding: '7px 16px', boxShadow: '0 4px 24px rgba(0,0,0,0.6)' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, background: 'linear-gradient(135deg,#c4b5fd,#7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {t.s4DNALabel}
                  </span>
                  <span style={{ fontSize: '12px', color: '#c4b5fd', fontWeight: 700 }}>
                    {t.s4Archetypes.find(a => a.id === effectiveArchetype)?.label ?? archetypeLabels[effectiveArchetype]?.[lang ?? 'ar']}
                  </span>
                </div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', marginTop: '5px' }}>{t.s4Badge}</div>
              </div>

              {/* Phone mockup */}
              <div style={{ width: '240px', height: '420px', maxWidth: '100%', minWidth: 0, overflowX: 'hidden', borderRadius: '24px', overflow: 'hidden', margin: '0 auto', flexShrink: 0, border: '2px solid rgba(255,255,255,0.15)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                {renderStorePreview(effectiveArchetype, displayBrand, customColors, lang ?? 'ar', uploadedImage, t, categories)}
              </div>

            </div>

            {/* Controls panel — compact, sticky bottom */}
            <div style={{ flexShrink: 0, padding: '8px 16px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', background: '#080808', position: 'sticky', bottom: 0, zIndex: 10, minWidth: 0, maxWidth: '100%' }}>

              {/* Mood palettes */}
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', overflowY: 'hidden', width: '100%', minWidth: 0, maxWidth: '100%', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', paddingBottom: '4px', marginBottom: '6px' }}>
              <div className="palette-scroll" style={{ display: 'flex', gap: '6px', minWidth: 0 }}>
                {MOOD_PALETTES.map((p, i) => {
                  const isSel = selectedPalette === i
                  return (
                    <button key={i} onClick={() => { setCustomColors(p.colors); setSelectedPalette(i); setShowCustomColors(false) }}
                      style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', borderRadius: '20px', border: isSel ? '1.5px solid rgba(124,58,237,0.7)' : '1.5px solid rgba(255,255,255,0.1)', background: isSel ? 'rgba(124,58,237,0.12)' : 'rgba(255,255,255,0.04)', cursor: 'pointer', boxShadow: isSel ? '0 0 12px rgba(124,58,237,0.3)' : 'none', fontFamily: 'inherit', touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {p.colors.map((col, ci) => (
                          <div key={ci} style={{ width: '7px', height: '7px', borderRadius: '50%', background: col, border: '1px solid rgba(255,255,255,0.15)', flexShrink: 0 }} />
                        ))}
                      </div>
                      <span style={{ fontSize: '10px', color: isSel ? '#c4b5fd' : 'rgba(255,255,255,0.45)', fontWeight: isSel ? 600 : 400, whiteSpace: 'nowrap' }}>
                        {lang === 'he' ? p.he : p.ar}
                      </span>
                    </button>
                  )
                })}
              </div>
              </div>

              {/* Manual color toggle */}
              <div style={{ marginBottom: '6px' }}>
                <button onClick={() => setShowCustomColors(v => !v)}
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: '11px', cursor: 'pointer', fontFamily: 'inherit', padding: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {t.s4CustomManual} <span style={{ fontSize: '9px' }}>{showCustomColors ? '▲' : '▼'}</span>
                </button>
                {showCustomColors && (
                  <div style={{ display: 'flex', gap: '12px', marginTop: '8px', alignItems: 'center' }}>
                    {customColors.map((col, i) => (
                      <div key={i} style={{ position: 'relative', width: '28px', height: '28px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: col, border: '2px solid rgba(255,255,255,0.2)', boxShadow: '0 2px 8px rgba(0,0,0,0.4)' }} />
                        <input type="color" value={col}
                          onChange={e => { const nc = [...customColors]; nc[i] = e.target.value; setCustomColors(nc); setSelectedPalette(null) }}
                          style={{ position: 'absolute', inset: 0, opacity: 0, width: '100%', height: '100%', cursor: 'pointer', border: 'none', padding: 0 }} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Style direction buttons */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', width: '100%', minWidth: 0, maxWidth: '100%', overflowX: 'auto' }}>
                {[
                  { label: t.s4Luxe,    arch: 'luxury' },
                  { label: t.s4Simple,  arch: 'minimal' },
                  { label: t.s4BoldBtn, arch: boldArchetype },
                ].map(item => {
                  const isSel = selectedArchetype === item.arch
                  return (
                    <button key={item.arch} onClick={() => { setArchetypeHistory(h => [...h, selectedArchetype]); setSelectedArchetype(selectedArchetype === item.arch ? '' : item.arch) }}
                      style={{ flex: 1, padding: '8px 4px', borderRadius: '10px', border: isSel ? `1px solid ${c0}` : '1px solid rgba(255,255,255,0.1)', background: isSel ? `${c0}18` : 'transparent', color: isSel ? '#c4b5fd' : 'rgba(255,255,255,0.4)', fontSize: '11px', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center', fontWeight: isSel ? 600 : 400, transition: 'all 0.15s', touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}>
                      {item.label}
                    </button>
                  )
                })}
              </div>

              {/* Confirm button — prominent + pulsing */}
              <button onClick={handleConfirmStore} disabled={storeSaving}
                style={{ ...btnP, background: `linear-gradient(135deg,${c0},${c0}cc)`, padding: '14px 20px', animation: storeSaving ? 'none' : 'btnPulse 2.5s ease-in-out infinite', marginBottom: '8px', opacity: storeSaving ? 0.7 : 1, cursor: storeSaving ? 'default' : 'pointer', touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}>
                {storeSaving ? (lang === 'ar' ? 'جاري الحفظ...' : 'שומר...') : t.s4Confirm}
              </button>

              {/* History navigation + Retry */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'stretch' }}>
                {archetypeHistory.length > 0 && (
                  <button onClick={handleBackArchetype}
                    style={{ flexShrink: 0, background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '10px 12px', color: 'rgba(255,255,255,0.35)', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '4px', touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}>
                    ← {lang === 'he' ? 'הקודם' : 'السابق'}
                  </button>
                )}
                <button onClick={handleRetryArchetype}
                  style={{ flex: 1, background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '10px 16px', color: 'rgba(255,255,255,0.45)', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'border-color 0.15s', touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}>
                  {t.s4Retry}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 7: Launch ────────────────────────────────────────────────── */}
        {step === 7 && (
          <>
            {confettiPieces.map(p => (
              <div key={p.id} className="confetti-piece"
                style={{ left: p.left, width: p.size, height: p.size, background: p.color, '--dur': p.dur, '--delay': p.delay } as React.CSSProperties & Record<string, string>} />
            ))}
            <div key={step} className="step-enter" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: '64px', marginBottom: '20px' }}>🚀</div>
              <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#fff', marginBottom: '8px', letterSpacing: '-0.025em' }}>{t.s7Title}</h1>
              <p style={{ fontSize: '22px', fontWeight: 700, background: `linear-gradient(135deg,${c0},${c1})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '28px' }}>
                {displayBrand.storeName}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#111', border: `1px solid rgba(124,58,237,0.4)`, borderRadius: '14px', padding: '12px 16px', width: '100%', marginBottom: '24px', cursor: 'pointer' }}
                onClick={() => { navigator.clipboard?.writeText(storeUrl); setCopied(true); setTimeout(() => setCopied(false), 2000) }}>
                <span style={{ flex: 1, fontSize: '13px', color: '#c4b5fd', fontFamily: 'monospace' }}>{storeUrl}</span>
                <span style={{ fontSize: '12px', color: copied ? '#22c55e' : 'rgba(255,255,255,0.4)', fontWeight: 500, flexShrink: 0 }}>{copied ? t.s7Copied : t.s7Copy}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', width: '100%', marginBottom: '16px' }}>
                <a href={`https://wa.me/?text=${encodeURIComponent((lang === 'ar' ? 'تفضلوا متجري: ' : 'הנה החנות שלי: ') + 'https://' + storeUrl)}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ flex: 1, background: '#22c55e', border: 'none', borderRadius: '12px', padding: '12px 8px', color: '#fff', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {t.s7WA}
                </a>
                <button style={{ flex: 1, background: 'linear-gradient(135deg,#7c3aed,#a855f7)', border: 'none', borderRadius: '12px', padding: '12px 8px', color: '#fff', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>{t.s7IG}</button>
                <button onClick={() => { navigator.clipboard?.writeText(storeUrl); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
                  style={{ flex: 1, background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px 8px', color: '#fff', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {copied ? t.s7Copied : t.s7Copy}
                </button>
              </div>
              <a href="/dashboard" style={{ ...btnP, marginBottom: '16px', textDecoration: 'none' }}>{t.s7Go}</a>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>{t.s7Hint}</p>
            </div>
          </>
        )}

        {/* ── Regular steps: 1, 2, 5, 6 ───────────────────────────────────── */}
        {[1, 2, 5, 6].includes(step) && (
          <>
            {showProgress && (
              <div style={{ position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '430px', height: '3px', background: 'rgba(255,255,255,0.06)', zIndex: 100 }}>
                <div style={{ height: '100%', width: `${progressPct}%`, background: 'linear-gradient(90deg,#7c3aed,#4f46e5)', transition: 'width 0.5s ease' }} />
              </div>
            )}
            <div key={step} className="step-enter" style={{ padding: '24px', paddingTop: showProgress ? '27px' : '24px', paddingBottom: step === 2 ? '120px' : '40px' }}>
              {showBack && (
                <button onClick={goBack}
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', fontSize: '13px', cursor: 'pointer', padding: '4px 0', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'inherit' }}>
                  ← {t.back}
                </button>
              )}

              {/* ── Step 1: Auth ─────────────────────────────────────────── */}
              {step === 1 && (
                <>
                  {userEmail && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: '12px', padding: '10px 14px' }}>
                      <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
                        {lang === 'ar' ? 'مرحباً' : 'שלום'}{' '}
                        <span style={{ color: '#c4b5fd', fontWeight: 600 }}>{userEmail}</span>
                      </span>
                      <button onClick={async () => { await supabase.auth.signOut(); setUserEmail(null) }}
                        style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit', padding: '0 0 0 12px' }}>
                        {lang === 'ar' ? 'خروج' : 'יציאה'}
                      </button>
                    </div>
                  )}
                  <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#fff', marginBottom: '6px', letterSpacing: '-0.025em' }}>{t.s1Title}</h1>
                  <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: '14px', marginBottom: '32px' }}>{t.s1Sub}</p>

                  {/* Google button */}
                  <button
                    onClick={handleGoogleLogin}
                    style={{ ...cardB, marginBottom: '24px', justifyContent: 'center', gap: '12px', padding: '16px', border: '1.5px solid rgba(255,255,255,0.12)' }}>
                    <IcGoogle />
                    <span style={{ color: '#fff', fontSize: '16px', fontWeight: 500 }}>{t.s1Google}</span>
                  </button>

                  {/* Divider */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
                    <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '12px', whiteSpace: 'nowrap' }}>
                      {lang === 'ar' ? 'أو جرّب بدون حساب' : 'או נסה ללא חשבון'}
                    </span>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
                  </div>

                  {/* WhatsApp input for order notifications */}
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', marginBottom: '8px', fontWeight: 500 }}>
                    {lang === 'ar' ? 'رقم واتساب لاستقبال الطلبات' : 'מספר וואטסאפ לקבלת הזמנות'}
                  </p>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                    <div style={{ ...inp, width: 'auto', padding: '14px 12px', color: 'rgba(255,255,255,0.45)', fontSize: '15px', flexShrink: 0 }}>+972</div>
                    <input
                      type="tel" inputMode="numeric" placeholder="05X XXX XXXX"
                      value={whatsappPhone}
                      onChange={e => setWhatsappPhone(e.target.value.replace(/\D/g, ''))}
                      style={{ ...inp, flex: 1 }} dir="ltr"
                    />
                  </div>

                  {/* Skip button */}
                  <button onClick={goNext}
                    style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', fontSize: '14px', cursor: 'pointer', width: '100%', textAlign: 'center', fontFamily: 'inherit', padding: '8px 0' }}>
                    {lang === 'ar' ? 'كمّل للتجربة ←' : 'המשך לניסיון ←'}
                  </button>
                </>
              )}

              {/* ── Step 2: Smart Onboarding ─────────────────────────────── */}
              {step === 2 && (
                <>
                  <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#fff', marginBottom: '4px', letterSpacing: '-0.025em' }}>{t.s2Title}</h1>
                  <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: '14px', marginBottom: '28px' }}>{t.s2Sub}</p>

                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px', fontWeight: 500 }}>{t.s2NameLabel}</p>
                  <input type="text" placeholder={t.s2NamePH} value={brandName} onChange={e => setBrandName(e.target.value)}
                    style={{ ...inp, marginBottom: '6px', fontSize: '16px', borderColor: brandName ? 'rgba(124,58,237,0.4)' : undefined }} autoFocus />
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', marginBottom: '24px' }}>{t.s2NameHelper}</p>

                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '10px', fontWeight: 500 }}>{t.s2CatLabel}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px', marginBottom: '24px' }}>
                    {t.s2Cats.map((cat, i) => {
                      const Icon = CAT_ICONS[i]; const sel = categories.includes(cat)
                      return (
                        <button key={cat} onClick={() => setCategories(p => sel ? p.filter(x => x !== cat) : [...p, cat])}
                          style={{ background: sel ? 'rgba(124,58,237,0.2)' : '#111', border: sel ? '1.5px solid rgba(124,58,237,0.6)' : '1.5px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '10px 6px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', color: sel ? '#c4b5fd' : 'rgba(255,255,255,0.5)', transition: 'all 0.15s', fontFamily: 'inherit', touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}>
                          <Icon />
                          <span style={{ fontSize: '10px', fontWeight: sel ? 600 : 400, textAlign: 'center', lineHeight: 1.2 }}>{cat}</span>
                        </button>
                      )
                    })}
                  </div>

                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '10px', fontWeight: 500 }}>{t.s2VibeLabel}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px', marginBottom: '24px' }}>
                    {t.s2Vibes.map(v => {
                      const sel = vibe === v.id
                      return (
                        <button key={v.id} onClick={() => setVibe(sel ? '' : v.id)}
                          style={{ background: sel ? 'rgba(124,58,237,0.2)' : '#111', border: sel ? '1.5px solid rgba(124,58,237,0.6)' : '1.5px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '10px 8px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', fontFamily: 'inherit', transition: 'all 0.15s', touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}>
                          <span style={{ fontSize: '16px' }}>{v.icon}</span>
                          <span style={{ fontSize: '12px', color: sel ? '#c4b5fd' : 'rgba(255,255,255,0.55)', fontWeight: sel ? 600 : 400 }}>{v.label}</span>
                        </button>
                      )
                    })}
                  </div>

                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px', fontWeight: 500 }}>{t.s2DescLabel}</p>
                  <input type="text" placeholder={t.s2DescPH} value={description} onChange={e => setDescription(e.target.value)} style={{ ...inp, marginBottom: '24px' }} />

                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px', fontWeight: 500 }}>{t.s2ImgLabel}</p>
                  <input type="file" accept="image/*" ref={imgInputRef} onChange={handleImageUpload} style={{ display: 'none' }} />
                  <button onClick={() => imgInputRef.current?.click()}
                    style={{ width: '100%', background: '#111', border: '1.5px dashed rgba(255,255,255,0.12)', borderRadius: '14px', padding: '20px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginBottom: '28px', fontFamily: 'inherit' }}>
                    {uploadedImage ? <img src={uploadedImage} alt="" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 10 }} /> : <><span style={{ fontSize: '24px' }}>📷</span><span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>{t.s2ImgBtn}</span></>}
                  </button>

                  <button
                    onClick={canNext ? goNext : undefined}
                    onTouchEnd={canNext ? (e) => { e.preventDefault(); goNext() } : undefined}
                    style={{ ...btnP, opacity: canNext ? 1 : 0.4, cursor: canNext ? 'pointer' : 'default', display: 'block', width: '100%', touchAction: 'manipulation' }}>
                    {t.s2CTA}
                  </button>
                </>
              )}

              {/* ── Step 5: Payment ──────────────────────────────────────── */}
              {step === 5 && (
                <>
                  <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#fff', marginBottom: '4px', letterSpacing: '-0.025em' }}>{t.s5Title}</h1>
                  <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: '14px', marginBottom: '24px' }}>{t.s5Sub}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                    <div>
                      <button onClick={() => setPayments(p => p.includes('bit') ? p.filter(x => x !== 'bit') : [...p, 'bit'])} style={payments.includes('bit') ? cardS : cardB}>
                        <Dot active={payments.includes('bit')} />
                        <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ fontSize: '9px', fontWeight: 800, color: '#fff' }}>bit</span>
                        </div>
                        <span style={{ color: '#fff', fontSize: '15px', fontWeight: 500 }}>{t.s5BitLabel}</span>
                      </button>
                      {payments.includes('bit') && <input type="tel" placeholder={t.s5BitPH} value={bitPhone} onChange={e => setBitPhone(e.target.value)} style={{ ...inp, marginTop: '8px' }} dir="ltr" />}
                    </div>
                    <div>
                      <button onClick={() => setPayments(p => p.includes('bank') ? p.filter(x => x !== 'bank') : [...p, 'bank'])} style={payments.includes('bank') ? cardS : cardB}>
                        <Dot active={payments.includes('bank')} /><span style={{ color: 'rgba(255,255,255,0.5)' }}><IcBank /></span>
                        <span style={{ color: '#fff', fontSize: '15px', fontWeight: 500 }}>{t.s5BankLabel}</span>
                      </button>
                      {payments.includes('bank') && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                          <input type="text" placeholder={t.s5IbanPH} value={iban} onChange={e => setIban(e.target.value)} style={inp} dir="ltr" />
                          <input type="text" placeholder={t.s5BankPH} value={bankName} onChange={e => setBankName(e.target.value)} style={inp} />
                        </div>
                      )}
                    </div>
                    <button onClick={() => setPayments(p => p.includes('cash') ? p.filter(x => x !== 'cash') : [...p, 'cash'])} style={payments.includes('cash') ? cardS : cardB}>
                      <Dot active={payments.includes('cash')} /><span style={{ color: 'rgba(255,255,255,0.5)' }}><IcCash /></span>
                      <span style={{ color: '#fff', fontSize: '15px', fontWeight: 500 }}>{t.s5CashLabel}</span>
                    </button>
                  </div>
                  <button onClick={canNext ? goNext : undefined} style={{ ...btnP, opacity: canNext ? 1 : 0.4, cursor: canNext ? 'pointer' : 'default' }}>{t.next}</button>
                </>
              )}

              {/* ── Step 6: Delivery ─────────────────────────────────────── */}
              {step === 6 && (
                <>
                  <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#fff', marginBottom: '24px', letterSpacing: '-0.025em' }}>{t.s6Title}</h1>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                    <div>
                      <button onClick={() => setDelivery(delivery === 'self' ? '' : 'self')} style={delivery === 'self' ? cardS : cardB}>
                        <Dot active={delivery === 'self'} /><span style={{ fontSize: '20px' }}>🛵</span>
                        <span style={{ color: '#fff', fontSize: '15px', fontWeight: 500 }}>{t.s6SelfLabel}</span>
                      </button>
                      {delivery === 'self' && (
                        <div style={{ marginTop: '8px' }}>
                          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginBottom: '6px' }}>{t.s6AreasHelper}</p>
                          <input type="text" placeholder={t.s6AreasPH} value={deliveryAreas} onChange={e => setDeliveryAreas(e.target.value)} style={inp} />
                        </div>
                      )}
                    </div>
                    <div>
                      <button onClick={() => setDelivery(delivery === 'pickup' ? '' : 'pickup')} style={delivery === 'pickup' ? cardS : cardB}>
                        <Dot active={delivery === 'pickup'} /><span style={{ fontSize: '20px' }}>📍</span>
                        <span style={{ color: '#fff', fontSize: '15px', fontWeight: 500 }}>{t.s6PickupLabel}</span>
                      </button>
                      {delivery === 'pickup' && <input type="text" placeholder={t.s6AddressPH} value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)} style={{ ...inp, marginTop: '8px' }} />}
                    </div>
                    <div>
                      <button onClick={() => setDelivery(delivery === 'courier' ? '' : 'courier')} style={delivery === 'courier' ? cardS : cardB}>
                        <Dot active={delivery === 'courier'} /><span style={{ fontSize: '20px' }}>📦</span>
                        <span style={{ color: '#fff', fontSize: '15px', fontWeight: 500 }}>{t.s6CourierLabel}</span>
                      </button>
                      {delivery === 'courier' && <input type="text" placeholder={t.s6CourierPH} value={deliveryCourier} onChange={e => setDeliveryCourier(e.target.value)} style={{ ...inp, marginTop: '8px' }} />}
                    </div>
                  </div>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px', fontWeight: 500 }}>{t.s6WaLabel}</p>
                  <input type="tel" placeholder={t.s6WaPH} value={whatsappPhone} onChange={e => setWhatsappPhone(e.target.value)} style={{ ...inp, marginBottom: '24px', direction: 'ltr', textAlign: 'right' }} dir="ltr" />
                  <button onClick={canNext ? goNext : undefined} style={{ ...btnP, opacity: canNext ? 1 : 0.4, cursor: canNext ? 'pointer' : 'default' }}>{t.next}</button>
                </>
              )}

            </div>
          </>
        )}

      </div>
    </div>
  )
}
