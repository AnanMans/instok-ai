'use client'

import { useState, useEffect } from 'react'
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

export default function Dashboard() {
  const router = useRouter()
  const [store, setStore] = useState<Store | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        router.replace('/')
        return
      }
      const { data } = await supabase
        .from('stores')
        .select('*')
        .eq('owner_id', session.user.id)
        .limit(1)
        .single()
      if (!data) {
        router.replace('/onboarding')
        return
      }
      setStore(data)
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
      {/* Navbar */}
      <nav style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '0 20px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '15px', fontWeight: 700 }}>
          Instok<span style={{ color: '#8b5cf6' }}>.ai</span>
        </span>
        <button
          onClick={async () => { await supabase.auth.signOut(); router.replace('/') }}
          style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '6px 14px', color: 'rgba(255,255,255,0.45)', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>
          {ar ? 'خروج' : 'יציאה'}
        </button>
      </nav>

      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '32px 20px' }}>
        {/* Header */}
        <h1 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '4px', letterSpacing: '-0.02em' }}>
          {ar ? 'لوحة التحكم' : 'לוח הבקרה'}
        </h1>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', marginBottom: '32px' }}>
          {ar ? 'إدارة متجرك' : 'ניהול החנות שלך'}
        </p>

        {/* Store card */}
        <div style={{ background: '#111', border: `1px solid ${c0}30`, borderRadius: '20px', padding: '24px', marginBottom: '16px', boxShadow: `0 0 40px ${c0}12` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: `linear-gradient(135deg,${c0},${store?.colors?.[1] ?? '#4f46e5'})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>{(store?.name?.[0] ?? '?').toUpperCase()}</span>
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '18px', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{store?.name}</div>
              {store?.slogan && <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{store.slogan}</div>}
            </div>
          </div>

          {/* Store link */}
          <a href={`/store/${store?.slug}`}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px 14px', textDecoration: 'none', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', color: '#c4b5fd', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              instok-ai.vercel.app/store/{store?.slug}
            </span>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', flexShrink: 0, marginRight: '8px' }}>←</span>
          </a>

          {/* WhatsApp share */}
          <a href={`https://wa.me/?text=${encodeURIComponent(waShareText)}`}
            target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#22c55e', borderRadius: '12px', padding: '13px 20px', textDecoration: 'none', boxShadow: '0 4px 20px rgba(34,197,94,0.3)' }}>
            <span style={{ fontSize: '18px' }}>💬</span>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>
              {ar ? 'شارك متجرك' : 'שתף את החנות'}
            </span>
          </a>
        </div>

        {/* Quick actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <button
            onClick={() => router.push(`/store/${store?.slug}`)}
            style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '16px', cursor: 'pointer', fontFamily: 'inherit', color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: 500, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '22px' }}>🛍</span>
            {ar ? 'عرض المتجر' : 'צפה בחנות'}
          </button>
          <button
            onClick={() => { navigator.clipboard?.writeText(storeUrl) }}
            style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '16px', cursor: 'pointer', fontFamily: 'inherit', color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: 500, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '22px' }}>🔗</span>
            {ar ? 'نسخ الرابط' : 'העתק קישור'}
          </button>
        </div>
      </div>
    </div>
  )
}
