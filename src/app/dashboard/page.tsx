'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Cairo, Heebo } from 'next/font/google'
import { createBrowserClient } from '@supabase/ssr'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const cairo = Cairo({ subsets: ['arabic'], display: 'swap', weight: ['400', '500', '600', '700'] })
const heebo = Heebo({ subsets: ['hebrew', 'latin'], display: 'swap', weight: ['400', '500', '600', '700'] })

type Store = {
  id: string
  slug: string
  name: string
  slogan: string
  archetype: string
  colors: string[]
  whatsapp_number?: string
  business_phone?: string
  description?: string
  lang?: string
}

type Product = {
  id: string
  name: string
  price: number
  description?: string
  image_url?: string
  store_id: string
}

const inp: React.CSSProperties = {
  width: '100%', background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '12px', padding: '12px 14px', color: '#fff', fontSize: '14px',
  outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
}

export default function Dashboard() {
  const router = useRouter()
  const [store, setStore] = useState<Store | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  const [form, setForm] = useState({ name: '', price: '', description: '', image_url: '' })
  const [formSaving, setFormSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [uploadingImg, setUploadingImg] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState<{ price_min: number; price_max: number } | null>(null)
  const [aiDone, setAiDone] = useState(false)

  const [waInput, setWaInput] = useState('')
  const [waSaving, setWaSaving] = useState(false)
  const [waSaved, setWaSaved] = useState(false)
  const [waError, setWaError] = useState('')

  const [descInput, setDescInput] = useState('')
  const [descSaving, setDescSaving] = useState(false)
  const [descSaved, setDescSaved] = useState(false)
  const [descError, setDescError] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.replace('/'); return }

      const fetchStore = () => supabase
        .from('stores').select('*').eq('owner_id', session.user.id).limit(1).maybeSingle()

      let { data: storeData } = await fetchStore()
      if (!storeData) {
        await new Promise(r => setTimeout(r, 2000))
        ;({ data: storeData } = await fetchStore())
        if (!storeData) { router.replace('/onboarding'); return }
      }

      const { data: prods } = await supabase
        .from('products').select('*').eq('store_id', storeData.id).order('created_at', { ascending: false })

      setStore(storeData)
      setProducts(prods ?? [])
      setWaInput((storeData.whatsapp_number ?? storeData.business_phone ?? '').replace(/^972/, '0'))
      setDescInput(storeData.description ?? '')
      setLoading(false)
    })
  }, []) // eslint-disable-line

  const lang = (store?.lang ?? 'ar') as 'ar' | 'he'
  const fontClass = lang === 'he' ? heebo.className : cairo.className
  const ar = lang === 'ar'
  const c0 = store?.colors?.[0] ?? '#7c3aed'
  const storeUrl = store ? `https://instok-ai.vercel.app/store/${store.slug}` : ''
  const waShareText = ar
    ? `تفضلوا متجري على Instok: ${storeUrl}`
    : `הנה החנות שלי באינסטוק: ${storeUrl}`

  const handleGenerateProduct = async () => {
    if (!pendingFile) return
    setAiLoading(true)
    try {
      const fd = new FormData()
      fd.append('file', pendingFile)
      const res = await fetch('/api/generate-product', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.error) return
      setForm(f => ({
        ...f,
        name: ar ? (data.name_ar ?? '') : (data.name_he ?? ''),
        description: ar ? (data.description_ar ?? '') : (data.description_he ?? ''),
      }))
      setAiSuggestion({ price_min: data.price_min, price_max: data.price_max })
      setAiDone(true)
    } catch (err) {
      console.error('[generate-product]', err)
    } finally {
      setAiLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !store) return
    setPendingFile(file)
    setAiSuggestion(null)
    setUploadingImg(true)
    setUploadError('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('storeId', store.id)
      const res = await fetch('/api/upload-image', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.error) {
        setUploadError(data.error)
      } else {
        setForm(f => ({ ...f, image_url: data.url }))
      }
    } catch (err) {
      setUploadError(String(err))
    }
    setUploadingImg(false)
  }

  const handleAddProduct = async () => {
    if (!form.name.trim() || !form.price || !store) return
    setFormSaving(true)
    setFormError('')
    try {
      const res = await fetch('/api/add-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          store_id: store.id,
          name: form.name.trim(),
          price: parseFloat(form.price),
          description: form.description.trim(),
          image_url: form.image_url.trim(),
        }),
      })
      const data = await res.json()
      if (data.error) { setFormError(data.error); return }
      setProducts(p => [data.product, ...p])
      setForm({ name: '', price: '', description: '', image_url: '' })
      setPendingFile(null)
      setAiSuggestion(null)
      setAiDone(false)
      setUploadError('')
    } catch (err) {
      setFormError(String(err))
    } finally {
      setFormSaving(false)
    }
  }

  const handleUpdateWa = async () => {
    if (!store) return
    setWaSaving(true)
    setWaError('')
    setWaSaved(false)
    try {
      const res = await fetch('/api/update-store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storeId: store.id, whatsappNumber: waInput.trim() }),
      })
      const data = await res.json()
      if (data.error) { setWaError(data.error); return }
      setStore(s => s ? { ...s, whatsapp_number: waInput.trim(), business_phone: waInput.trim() } : s)
      setWaSaved(true)
      setTimeout(() => setWaSaved(false), 2500)
    } catch (err) {
      setWaError(String(err))
    } finally {
      setWaSaving(false)
    }
  }

  const handleUpdateDesc = async () => {
    if (!store) return
    setDescSaving(true)
    setDescError('')
    setDescSaved(false)
    try {
      const res = await fetch('/api/update-store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storeId: store.id, description: descInput.trim() }),
      })
      const data = await res.json()
      if (data.error) { setDescError(data.error); return }
      setStore(s => s ? { ...s, description: descInput.trim() } : s)
      setDescSaved(true)
      setTimeout(() => setDescSaved(false), 2500)
    } catch (err) {
      setDescError(String(err))
    } finally {
      setDescSaving(false)
    }
  }

  const handleDeleteProduct = async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) { console.error('[dashboard] delete error:', error); return }
    setProducts(p => p.filter(x => x.id !== id))
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid rgba(124,58,237,0.3)', borderTopColor: '#7c3aed', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    )
  }

  return (
    <div dir="rtl" className={fontClass} style={{ minHeight: '100vh', background: '#080808', color: '#fff', overflowX: 'hidden' }}>
      <style>{`input:focus,textarea:focus{border-color:rgba(124,58,237,0.6)!important;box-shadow:0 0 0 3px rgba(124,58,237,0.1)}`}</style>

      {/* Navbar */}
      <nav style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '0 20px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#080808', zIndex: 50 }}>
        <a href="/" style={{ fontSize: '15px', fontWeight: 700, color: 'inherit', textDecoration: 'none' }}>Instok<span style={{ color: '#8b5cf6' }}>.ai</span></a>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <a href={`/store/${store?.slug}`} target="_blank" rel="noopener noreferrer"
            style={{ fontSize: '12px', color: '#c4b5fd', textDecoration: 'none', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '8px', padding: '5px 12px' }}>
            {ar ? 'عرض المتجر' : 'צפה בחנות'}
          </a>
          <button onClick={async () => { await supabase.auth.signOut(); router.replace('/') }}
            style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '5px 12px', color: 'rgba(255,255,255,0.4)', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}>
            {ar ? 'خروج' : 'יציאה'}
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '540px', margin: '0 auto', padding: '24px 16px 60px' }}>

        {/* ── Store card ─────────────────────────────────────── */}
        <div style={{ background: '#111', border: `1px solid ${c0}28`, borderRadius: '18px', padding: '20px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: `linear-gradient(135deg,${c0},${store?.colors?.[1] ?? '#4f46e5'})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>{(store?.name?.[0] ?? '?').toUpperCase()}</span>
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '17px', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{store?.name}</div>
              {store?.slogan && <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>{store.slogan}</div>}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <a href={`/store/${store?.slug}`}
              style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '9px 12px', textDecoration: 'none', overflow: 'hidden' }}>
              <span style={{ fontSize: '11px', color: '#c4b5fd', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                instok-ai.vercel.app/store/{store?.slug}
              </span>
            </a>
            <button onClick={() => { navigator.clipboard?.writeText(storeUrl); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
              style={{ flexShrink: 0, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '9px 14px', color: copied ? '#22c55e' : 'rgba(255,255,255,0.4)', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}>
              {copied ? '✓' : ar ? 'نسخ' : 'העתק'}
            </button>
          </div>

          <a href={`https://wa.me/?text=${encodeURIComponent(waShareText)}`}
            target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#22c55e', borderRadius: '10px', padding: '11px', textDecoration: 'none', marginTop: '10px' }}>
            <span style={{ fontSize: '16px' }}>💬</span>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>{ar ? 'شارك متجرك على واتساب' : 'שתף את החנות בוואטסאפ'}</span>
          </a>
        </div>

        {/* ── Store settings ─────────────────────────────────── */}
        <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '18px', padding: '20px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px', color: 'rgba(255,255,255,0.85)' }}>
            {ar ? 'تعديل إعدادات المتجر' : 'עריכת הגדרות החנות'}
          </h3>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>
            {ar ? 'رقم واتساب التجاري 📱' : 'מספר וואטסאפ עסקי 📱'}
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="tel"
              placeholder="+972501234567"
              value={waInput}
              onChange={e => { setWaInput(e.target.value); setWaSaved(false) }}
              style={{ ...inp, flex: 1, direction: 'ltr', textAlign: 'left' }}
              dir="ltr"
            />
            <button
              onClick={handleUpdateWa}
              disabled={waSaving}
              style={{ flexShrink: 0, background: waSaved ? '#22c55e' : `linear-gradient(135deg,${c0},${c0}cc)`, border: 'none', borderRadius: '12px', padding: '0 18px', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: waSaving ? 'default' : 'pointer', fontFamily: 'inherit', opacity: waSaving ? 0.6 : 1, transition: 'background 0.2s' }}>
              {waSaving ? '...' : waSaved ? '✓' : (ar ? 'حفظ' : 'שמור')}
            </button>
          </div>
          {waError && <p style={{ fontSize: '12px', color: '#f87171', marginTop: '8px' }}>{waError}</p>}

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.07)', margin: '16px 0' }} />

          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>
            {ar ? 'نبذة عن متجرك — ستظهر للزبائن ✍️' : 'תיאור החנות — יוצג ללקוחות ✍️'}
          </p>
          <textarea
            placeholder={ar ? 'اكتب وصفاً قصيراً عن متجرك...' : 'כתוב תיאור קצר על החנות שלך...'}
            value={descInput}
            onChange={e => { setDescInput(e.target.value); setDescSaved(false) }}
            rows={3}
            style={{ ...inp, resize: 'none', marginBottom: '8px' }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={handleUpdateDesc}
              disabled={descSaving}
              style={{ background: descSaved ? '#22c55e' : `linear-gradient(135deg,${c0},${c0}cc)`, border: 'none', borderRadius: '12px', padding: '9px 20px', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: descSaving ? 'default' : 'pointer', fontFamily: 'inherit', opacity: descSaving ? 0.6 : 1, transition: 'background 0.2s' }}>
              {descSaving ? '...' : descSaved ? '✓' : (ar ? 'حفظ' : 'שמור')}
            </button>
          </div>
          {descError && <p style={{ fontSize: '12px', color: '#f87171', marginTop: '6px' }}>{descError}</p>}
        </div>

        {/* ── Products section ───────────────────────────────── */}
        <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px', color: 'rgba(255,255,255,0.85)' }}>
          {ar ? `المنتجات (${products.length})` : `מוצרים (${products.length})`}
        </h2>

        {products.length === 0 ? (
          <div style={{ background: '#111', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '14px', padding: '32px', textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>📦</div>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>{ar ? 'لا يوجد منتجات — أضف أول منتج أدناه' : 'אין מוצרים — הוסף מוצר ראשון למטה'}</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '24px' }}>
            {products.map(p => (
              <div key={p.id} style={{ background: '#111', borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)', position: 'relative' }}>
                <div style={{ aspectRatio: '1', overflow: 'hidden', background: '#1a1a1a' }}>
                  <img
                    src={p.image_url || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop'}
                    alt={p.name}
                    onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop' }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
                <div style={{ padding: '8px 10px 10px' }}>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: '#fff', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: c0 }}>₪{p.price}</p>
                </div>
                <button
                  onClick={() => handleDeleteProduct(p.id)}
                  style={{ position: 'absolute', top: '6px', left: '6px', background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '8px', width: '28px', height: '28px', color: 'rgba(255,100,100,0.8)', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}
                  title={ar ? 'حذف' : 'מחק'}>
                  🗑
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ── Add product form ───────────────────────────────── */}
        <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '18px', padding: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px', color: 'rgba(255,255,255,0.85)' }}>
            {ar ? 'إضافة منتج جديد' : 'הוספת מוצר חדש'}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

            {/* ── Image upload zone ── */}
            <input type="file" accept="image/*" ref={fileRef} onChange={handleFileUpload} style={{ display: 'none' }} />

            {form.image_url ? (
              <div style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', background: '#1a1a1a' }}>
                <div style={{ aspectRatio: '16/9', overflow: 'hidden', background: '#111', position: 'relative' }}>
                  <img src={form.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  <button
                    type="button"
                    onClick={() => { setForm(f => ({ ...f, image_url: '' })); setUploadError(''); setPendingFile(null); setAiSuggestion(null); setAiDone(false); if (fileRef.current) fileRef.current.value = '' }}
                    style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '8px', padding: '4px 10px', color: 'rgba(255,100,100,0.85)', fontSize: '11px', cursor: 'pointer', fontFamily: 'inherit', backdropFilter: 'blur(4px)' }}>
                    {ar ? 'إزالة' : 'הסר'}
                  </button>
                </div>

                {/* AI generate button */}
                {!aiDone && (
                  <div style={{ padding: '12px' }}>
                    <button
                      type="button"
                      onClick={handleGenerateProduct}
                      disabled={aiLoading}
                      style={{ width: '100%', background: aiLoading ? 'rgba(124,58,237,0.2)' : 'linear-gradient(135deg,#7c3aed,#4f46e5)', border: 'none', borderRadius: '12px', padding: '14px', color: aiLoading ? 'rgba(255,255,255,0.5)' : '#fff', fontSize: '14px', fontWeight: 700, cursor: aiLoading ? 'default' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: aiLoading ? 'none' : '0 4px 20px rgba(124,58,237,0.4)', transition: 'all 0.2s' }}>
                      {aiLoading ? (
                        <>
                          <span style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.2)', borderTopColor: 'rgba(255,255,255,0.7)', borderRadius: '50%', animation: 'spin 0.7s linear infinite', flexShrink: 0 }} />
                          {ar ? 'جاري تحليل الصورة... 🔍' : 'מנתח את התמונה... 🔍'}
                        </>
                      ) : (
                        <>{ar ? '✨ ولّد تفاصيل المنتج بالذكاء الاصطناعي' : '✨ צור פרטי מוצר עם AI'}</>
                      )}
                    </button>
                  </div>
                )}

                {/* Success banner */}
                {aiDone && (
                  <div style={{ margin: '0 12px 12px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', color: '#86efac', fontWeight: 500 }}>
                    {ar ? '✅ تم توليد التفاصيل — راجع وعدّل إذا أردت' : '✅ הפרטים נוצרו — בדוק וערוך אם תרצה'}
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => { setUploadError(''); fileRef.current?.click() }}
                  disabled={uploadingImg}
                  style={{ width: '100%', background: '#141414', border: '2px dashed rgba(255,255,255,0.12)', borderRadius: '16px', padding: '32px 20px', color: uploadingImg ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.5)', cursor: uploadingImg ? 'default' : 'pointer', fontFamily: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', transition: 'border-color 0.15s' }}>
                  <span style={{ fontSize: '32px' }}>{uploadingImg ? '⏳' : '📸'}</span>
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>{uploadingImg ? (ar ? 'جاري الرفع...' : 'מעלה...') : (ar ? 'ارفع صورة المنتج' : 'העלה תמונת מוצר')}</span>
                  {!uploadingImg && (
                    <span style={{ fontSize: '12px', color: '#a78bfa', fontWeight: 500, textAlign: 'center', lineHeight: 1.5 }}>
                      {ar ? '✨ الذكاء الاصطناعي سيكتب لك الاسم والوصف والسعر تلقائياً' : '✨ ה-AI יכתוב לך שם, תיאור ומחיר אוטומטית'}
                    </span>
                  )}
                </button>
                {uploadError && (
                  <div>
                    <p style={{ fontSize: '11px', color: 'rgba(248,113,113,0.8)', marginBottom: '6px' }}>
                      {ar ? 'فشل الرفع — أدخل رابط الصورة يدوياً:' : 'העלאה נכשלה — הכנס קישור לתמונה:'}
                    </p>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={form.image_url}
                      onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
                      style={{ ...inp, direction: 'ltr' }}
                    />
                  </div>
                )}
              </>
            )}

            {/* ── Fields ── */}
            <input
              type="text"
              placeholder={ar ? 'اسم المنتج *' : 'שם המוצר *'}
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              style={inp}
            />
            <div>
              <input
                type="number"
                placeholder={ar ? 'السعر بالشيكل *' : 'מחיר בשקלים *'}
                value={form.price}
                onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                style={{ ...inp, direction: 'ltr' }}
              />
              {aiSuggestion && (
                <p style={{ fontSize: '11px', color: '#a78bfa', marginTop: '5px', paddingRight: '2px' }}>
                  {ar ? `السعر المقترح: ₪${aiSuggestion.price_min} - ₪${aiSuggestion.price_max}` : `מחיר מוצע: ₪${aiSuggestion.price_min} - ₪${aiSuggestion.price_max}`}
                </p>
              )}
            </div>
            <textarea
              placeholder={ar ? 'وصف المنتج (اختياري)' : 'תיאור המוצר (אופציונלי)'}
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={2}
              style={{ ...inp, resize: 'none' }}
            />

            {formError && (
              <p style={{ fontSize: '12px', color: '#f87171', padding: '8px 12px', background: 'rgba(248,113,113,0.1)', borderRadius: '8px' }}>{formError}</p>
            )}

            <button
              onClick={handleAddProduct}
              disabled={formSaving || !form.name.trim() || !form.price}
              style={{ background: `linear-gradient(135deg,${c0},${c0}cc)`, border: 'none', borderRadius: '12px', padding: '13px', color: '#fff', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', opacity: (formSaving || !form.name.trim() || !form.price) ? 0.5 : 1, transition: 'opacity 0.15s' }}>
              {formSaving ? (ar ? 'جاري الحفظ...' : 'שומר...') : (ar ? '+ أضف منتج' : '+ הוסף מוצר')}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
