'use client'

import { useState } from 'react'
import { Cairo, Heebo } from 'next/font/google'

const cairo = Cairo({ subsets: ['arabic'], display: 'swap', weight: ['400', '500', '600', '700'] })
const heebo = Heebo({ subsets: ['hebrew', 'latin'], display: 'swap', weight: ['400', '500', '600', '700'] })

const CONTENT = {
  ar: {
    dir: 'rtl' as const,
    back: '→ الرئيسية',
    title: 'سياسات المنصة',
    subtitle: 'Instok.ai',
    sections: [
      {
        title: 'سياسة الشحن والتوصيل',
        icon: '🚚',
        body: `تعتمد المتاجر على منصة Instok.ai على التواصل المباشر عبر واتساب لتأكيد الطلبات والتوصيل.

المدة المتوقعة للتوصيل: من 1 إلى 3 أيام عمل داخل نطاق التوصيل المحدد لكل متجر.

بعد إتمام الطلب، سيتواصل معك صاحب المتجر عبر واتساب لتأكيد العنوان وموعد التوصيل.

تكاليف التوصيل تختلف من متجر لآخر وتُحدَّد عند التواصل مع البائع. يُنصح بالتحقق من تفاصيل التوصيل مع كل متجر على حدة قبل إتمام الطلب.`,
      },
      {
        title: 'سياسة الاسترجاع والاستبدال',
        icon: '↩️',
        body: `يحق للمشتري طلب الاسترجاع أو الاستبدال خلال 7 أيام من تاريخ الاستلام في الحالات التالية:

• المنتج به عيب مصنعي واضح
• المنتج المُستلَم مختلف جوهرياً عن الوصف المعروض في المتجر

لا يُقبل الاسترجاع في الحالات التالية:
• المنتجات المستخدمة أو التالفة من قِبل المشتري
• منتجات الطعام والمشروبات بعد التسليم
• المنتجات المخصصة (مطبوعة أو مُصنَّعة حسب الطلب)

لبدء طلب الاسترجاع، تواصل مع صاحب المتجر مباشرة عبر واتساب مع إرفاق صورة للمنتج.`,
      },
      {
        title: 'سياسة الخصوصية',
        icon: '🔒',
        body: `نحن في Instok.ai نأخذ خصوصيتك بجدية تامة.

البيانات التي نجمعها:
• بيانات تسجيل الدخول (البريد الإلكتروني أو حساب Google)
• معلومات المتجر التي تدخلها عند الإنشاء
• بيانات المنتجات التي ترفعها

ما لا نفعله أبداً:
• لا نبيع بياناتك لأي جهة خارجية
• لا نشارك معلوماتك مع أطراف ثالثة لأغراض تسويقية
• لا نتتبع سلوك المتسوقين خارج المنصة

بيانات المتسوقين (أرقام الواتساب وتفاصيل الطلبات) تُعالَج مباشرة بين البائع والمشتري ولا تُخزَّن على خوادمنا.

للتواصل بشأن الخصوصية: support@instok.ai`,
      },
      {
        title: 'شروط الاستخدام',
        icon: '📋',
        body: `باستخدامك لمنصة Instok.ai فإنك توافق على الشروط التالية:

دور المنصة:
Instok.ai هي منصة تربط البائعين بالمشترين فقط. نحن لسنا طرفاً في أي صفقة بين البائع والمشتري ولا نتحمل مسؤولية أي نزاع ينشأ عن المعاملات الفردية.

مسؤولية البائع:
كل صاحب متجر مسؤول كلياً عن دقة معلومات المنتجات، وجودة البضاعة، والوفاء بالطلبات وشروط التوصيل والاسترجاع المعلنة في متجره.

مسؤولية المشتري:
يتحمل المشتري مسؤولية التحقق من تفاصيل المنتج والتواصل مع البائع قبل إتمام أي طلب.

الاستخدام المقبول:
يُمنع استخدام المنصة لبيع منتجات مخالفة للقانون أو الآداب العامة. تحتفظ Instok.ai بحق إيقاف أي متجر يخالف هذه الشروط دون إشعار مسبق.

آخر تحديث: مايو 2025`,
      },
    ],
  },
  he: {
    dir: 'rtl' as const,
    back: '→ דף הבית',
    title: 'מדיניות הפלטפורמה',
    subtitle: 'Instok.ai',
    sections: [
      {
        title: 'מדיניות משלוח',
        icon: '🚚',
        body: `החנויות על פלטפורמת Instok.ai מתבססות על תקשורת ישירה בוואטסאפ לאישור הזמנות ומשלוח.

זמן משלוח צפוי: בין 1 ל-3 ימי עסקים בתוך אזור המשלוח המוגדר לכל חנות.

לאחר השלמת ההזמנה, בעל החנות יצור עמך קשר בוואטסאפ לאישור הכתובת ומועד המשלוח.

עלויות המשלוח משתנות מחנות לחנות ומוגדרות בעת התקשורת עם המוכר. מומלץ לאמת את פרטי המשלוח עם כל חנות בנפרד לפני השלמת ההזמנה.`,
      },
      {
        title: 'מדיניות החזרות והחלפות',
        icon: '↩️',
        body: `הקונה רשאי לבקש החזרה או החלפה תוך 7 ימים מתאריך הקבלה במקרים הבאים:

• המוצר סובל מפגם ייצור ברור
• המוצר שהתקבל שונה מהותית מהתיאור המוצג בחנות

לא יתקבלו החזרות במקרים הבאים:
• מוצרים שנעשה בהם שימוש או שניזוקו על ידי הקונה
• מוצרי מזון ומשקאות לאחר המסירה
• מוצרים מותאמים אישית (הדפסה או ייצור לפי הזמנה)

לפתיחת בקשת החזרה, צור קשר עם בעל החנות ישירות בוואטסאפ עם צירוף תמונה של המוצר.`,
      },
      {
        title: 'מדיניות פרטיות',
        icon: '🔒',
        body: `ב-Instok.ai אנו מתייחסים לפרטיותך ברצינות מלאה.

הנתונים שאנו אוספים:
• נתוני כניסה (כתובת אימייל או חשבון Google)
• פרטי החנות שאתה מזין בעת היצירה
• נתוני המוצרים שאתה מעלה

מה שאנחנו לעולם לא עושים:
• לא מוכרים את הנתונים שלך לשום גורם חיצוני
• לא משתפים את המידע שלך עם צדדים שלישיים למטרות שיווקיות
• לא עוקבים אחר התנהגות הקונים מחוץ לפלטפורמה

נתוני הקונים (מספרי וואטסאפ ופרטי הזמנות) מעובדים ישירות בין המוכר לקונה ואינם מאוחסנים בשרתים שלנו.

לפניות בנושא פרטיות: support@instok.ai`,
      },
      {
        title: 'תנאי שימוש',
        icon: '📋',
        body: `בשימושך בפלטפורמת Instok.ai אתה מסכים לתנאים הבאים:

תפקיד הפלטפורמה:
Instok.ai היא פלטפורמה המחברת בין מוכרים לקונים בלבד. איננו צד בשום עסקה בין מוכר לקונה ואיננו אחראים לכל מחלוקת הנובעת מעסקאות בודדות.

אחריות המוכר:
כל בעל חנות אחראי לחלוטין על דיוק פרטי המוצרים, איכות הסחורה, עמידה בהזמנות ותנאי המשלוח וההחזרה המוצהרים בחנותו.

אחריות הקונה:
הקונה אחראי לאמת את פרטי המוצר ולתקשר עם המוכר לפני השלמת כל הזמנה.

שימוש מקובל:
אסור להשתמש בפלטפורמה למכירת מוצרים המנוגדים לחוק או לנורמות הציבוריות. Instok.ai שומרת לעצמה את הזכות להשהות כל חנות המפרה תנאים אלה ללא הודעה מוקדמת.

עדכון אחרון: מאי 2025`,
      },
    ],
  },
}

export default function PolicyPage() {
  const [lang, setLang] = useState<'ar' | 'he'>('ar')
  const t = CONTENT[lang]
  const fontClass = lang === 'he' ? heebo.className : cairo.className

  return (
    <div dir={t.dir} className={fontClass} style={{ minHeight: '100vh', background: '#080808', color: '#fff' }}>
      <style>{`*{box-sizing:border-box} body{margin:0;padding:0}`}</style>

      {/* Navbar */}
      <nav style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '0 20px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#080808', zIndex: 50 }}>
        <a href="/" style={{ fontSize: '15px', fontWeight: 700, color: '#fff', textDecoration: 'none' }}>
          Instok<span style={{ color: '#8b5cf6' }}>.ai</span>
        </a>
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', borderRadius: '10px', padding: '3px' }}>
          <button onClick={() => setLang('ar')} style={{ padding: '5px 14px', borderRadius: '8px', border: 'none', background: lang === 'ar' ? '#7c3aed' : 'transparent', color: lang === 'ar' ? '#fff' : 'rgba(255,255,255,0.4)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
            العربية
          </button>
          <button onClick={() => setLang('he')} style={{ padding: '5px 14px', borderRadius: '8px', border: 'none', background: lang === 'he' ? '#7c3aed' : 'transparent', color: lang === 'he' ? '#fff' : 'rgba(255,255,255,0.4)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
            עברית
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '32px 20px 80px' }}>

        {/* Back */}
        <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'rgba(255,255,255,0.35)', textDecoration: 'none', marginBottom: '28px' }}>
          {t.back}
        </a>

        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '6px' }}>{t.title}</h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.3)' }}>{t.subtitle}</p>
        </div>

        {/* Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {t.sections.map((s, i) => (
            <div key={i} style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '18px', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <span style={{ fontSize: '22px' }}>{s.icon}</span>
                <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#fff' }}>{s.title}</h2>
              </div>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.85, whiteSpace: 'pre-line' }}>
                {s.body}
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)', textAlign: 'center', marginTop: '40px' }}>
          {lang === 'ar' ? 'للتواصل: support@instok.ai' : 'לפניות: support@instok.ai'}
        </p>
      </div>
    </div>
  )
}
