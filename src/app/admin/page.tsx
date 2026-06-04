'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type StoreRow = {
  id: string
  name: string
  slug: string
  is_pro: boolean
  lang: string
  created_at: string
  product_count?: number
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [authError, setAuthError] = useState('')
  const [stores, setStores] = useState<StoreRow[]>([])
  const [loading, setLoading] = useState(false)
  const [toggling, setToggling] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!password.trim()) return
    setAuthed(true)
    setAuthError('')
    loadStores(password.trim())
  }

  const loadStores = async (pwd: string) => {
    setLoading(true)
    const { data: storeData } = await supabase
      .from('stores')
      .select('id, name, slug, is_pro, lang, created_at')
      .order('created_at', { ascending: false })

    if (!storeData) { setLoading(false); return }

    const withCounts = await Promise.all(
      storeData.map(async s => {
        const { count } = await supabase
          .from('products')
          .select('id', { count: 'exact', head: true })
          .eq('store_id', s.id)
        return { ...s, is_pro: s.is_pro ?? false, product_count: count ?? 0 }
      })
    )

    setStores(withCounts)
    setLoading(false)
  }

  const togglePro = async (store: StoreRow) => {
    setToggling(store.id)
    const res = await fetch('/api/admin/upgrade-store', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ storeId: store.id, is_pro: !store.is_pro, password }),
    })
    const data = await res.json()
    if (data.error) {
      if (res.status === 401) { setAuthed(false); setAuthError('كلمة المرور خاطئة') }
    } else {
      setStores(prev => prev.map(s => s.id === store.id ? { ...s, is_pro: !s.is_pro } : s))
    }
    setToggling(null)
  }

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <form onSubmit={handleLogin} style={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '40px 32px', width: '100%', maxWidth: '360px', textAlign: 'center' }}>
          <div style={{ fontSize: '36px', marginBottom: '16px' }}>🔐</div>
          <h1 style={{ color: '#fff', fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Admin Panel</h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px', marginBottom: '28px' }}>Instok internal dashboard</p>
          <input
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoFocus
            style={{ width: '100%', background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px 14px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box', marginBottom: '12px' }}
          />
          {authError && <p style={{ color: '#f87171', fontSize: '12px', marginBottom: '12px' }}>{authError}</p>}
          <button type="submit"
            style={{ width: '100%', background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', border: 'none', borderRadius: '12px', padding: '13px', color: '#fff', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
            Enter
          </button>
        </form>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#080808', color: '#fff', padding: '32px 20px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 800, margin: 0 }}>Instok Admin</h1>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', marginTop: '4px' }}>
              {stores.length} stores · {stores.filter(s => s.is_pro).length} pro
            </p>
          </div>
          <button onClick={() => { setAuthed(false); setPassword('') }}
            style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '6px 14px', color: 'rgba(255,255,255,0.4)', fontSize: '12px', cursor: 'pointer' }}>
            Logout
          </button>
        </div>

        <input
          type="text"
          placeholder="Search by name or slug..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '11px 16px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box', marginBottom: '20px' }}
        />

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(255,255,255,0.3)' }}>Loading...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {stores.filter(s => {
              const q = search.toLowerCase()
              return !q || s.name.toLowerCase().includes(q) || s.slug.toLowerCase().includes(q)
            }).map(store => (
              <div key={store.id} style={{ background: '#111', border: `1px solid ${store.is_pro ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.08)'}`, borderRadius: '14px', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>{store.name}</span>
                    {store.is_pro && (
                      <span style={{ fontSize: '10px', fontWeight: 700, background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', color: '#fff', borderRadius: '20px', padding: '2px 8px' }}>PRO</span>
                    )}
                  </div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', display: 'flex', gap: '12px' }}>
                    <span>/{store.slug}</span>
                    <span>{store.product_count} products</span>
                    <span>{store.lang?.toUpperCase()}</span>
                    <span>{new Date(store.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <button
                  onClick={() => togglePro(store)}
                  disabled={toggling === store.id}
                  style={{
                    flexShrink: 0,
                    background: store.is_pro ? 'rgba(239,68,68,0.15)' : 'linear-gradient(135deg,#7c3aed,#4f46e5)',
                    border: store.is_pro ? '1px solid rgba(239,68,68,0.3)' : 'none',
                    borderRadius: '10px', padding: '8px 16px',
                    color: store.is_pro ? '#f87171' : '#fff',
                    fontSize: '12px', fontWeight: 700, cursor: toggling === store.id ? 'default' : 'pointer',
                    opacity: toggling === store.id ? 0.5 : 1, transition: 'opacity 0.15s',
                  }}>
                  {toggling === store.id ? '...' : store.is_pro ? 'Revoke Pro' : 'Upgrade → Pro'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
