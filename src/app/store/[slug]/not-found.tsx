export default function StoreNotFound() {
  return (
    <div dir="rtl" style={{ minHeight: '100vh', background: '#080808', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔍</div>
      <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>هذا المتجر غير موجود</h1>
      <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginBottom: '32px' }}>החנות הזו לא קיימת</p>
      <a href="/" style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', color: '#fff', borderRadius: '14px', padding: '14px 28px', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
        أنشئ متجرك الآن
      </a>
    </div>
  )
}
