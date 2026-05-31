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
  whatsapp_number: string
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
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.replace('/'); return }

      const { data: storeData } = await supabase
        .from('stores').select('*').eq('owner_id', session.user.id).limit(1).single()
      if (!storeData) { router.replace('/onboarding'); return }

      const { data: prods } = await supabase
        .from('products').select('*').eq('store_id', storeData.id).order('created_at', { ascending: false })

      setStore(storeData)
      setProducts(prods ?? [])
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !store) return
    setUploadingImg(true)
    const ext = file.name.split('.').pop()
    const path = `${store.id}/${Date.now()}.${ext}`
    const { data, error } = await supabase.storage.from('product-images').upload(path, file, { upsert: true })
    if (error) {
      console.error('[dashboard] upload error:', error)
      setUploadingImg(false)
      return
    }
    const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(data.path)
    setForm(f => ({ ...f, image_url: publicUrl }))
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
    } catch (err) {
      setFormError(String(err))
    } finally {
      setFormSaving(false)
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
        <span style={{ fontSize: '15px', fontWeight: 700 }}>Instok<span style={{ color: '#8b5cf6' }}>.ai</span></span>
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              type="text"
              placeholder={ar ? 'اسم المنتج *' : 'שם המוצר *'}
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              style={inp}
            />
            <input
              type="number"
              placeholder={ar ? 'السعر بالشيكل *' : 'מחיר בשקלים *'}
              value={form.price}
              onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
              style={{ ...inp, direction: 'ltr' }}
            />
            <textarea
              placeholder={ar ? 'وصف المنتج (اختياري)' : 'תיאור המוצר (אופציונלי)'}
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={2}
              style={{ ...inp, resize: 'none' }}
            />

            {/* Image: URL input + file upload */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="url"
                placeholder={ar ? 'رابط صورة المنتج' : 'קישור לתמונת המוצר'}
                value={form.image_url}
                onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
                style={{ ...inp, flex: 1, direction: 'ltr' }}
              />
              <input type="file" accept="image/*" ref={fileRef} onChange={handleFileUpload} style={{ display: 'none' }} />
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploadingImg}
                style={{ flexShrink: 0, background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '0 14px', color: 'rgba(255,255,255,0.5)', fontSize: '20px', cursor: 'pointer', opacity: uploadingImg ? 0.5 : 1 }}>
                {uploadingImg ? '⏳' : '📷'}
              </button>
            </div>

            {form.image_url && (
              <div style={{ width: '64px', height: '64px', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                <img src={form.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
              </div>
            )}

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
