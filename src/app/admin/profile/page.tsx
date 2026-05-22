'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminProfilePage() {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const router = useRouter()

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    if (!newPassword || !confirmPassword) {
      setErrorMsg('Tafadhali jaza password zote mbili.')
      return
    }

    if (newPassword.length < 6) {
      setErrorMsg('Password mpya lazima iwe na herufi zisizopungua sita.')
      return
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Password ulizoweka hazilingani. Hakikisha zinafanana kabisa!')
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword, confirmPassword }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Hitilafu imetokea wakati wa kubadilisha password.')
      }

      setSuccessMsg('Hongera! Password imebadilishwa kikamilifu.')
      setNewPassword('')
      setConfirmPassword('')
      setIsLoading(false)
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : String(err))
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/admin/logout', {
        method: 'POST'
      })
      if (res.ok) {
        window.location.href = '/'
      }
    } catch (err) {
      console.error('Error logging out:', err)
    }
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src="/thepeace.jpg" alt="THE PEACE Logo" style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '50%' }} />
            <div>
              <span className="logo-text" style={{ display: 'block', lineHeight: 1, fontSize: '1.2rem' }}>THE PEACE</span>
            </div>
          </div>
        </div>

        <div className="sidebar-content">
          <nav className="profile-nav">
            <Link href="/admin" className="profile-nav-item">
              📊 Dashboard
            </Link>
            <Link href="/admin/profile" className="profile-nav-item active">
              👤 Wasifu Wangu
            </Link>
          </nav>
        </div>

        <div className="sidebar-footer">
          <Link href="/" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
            📝 Rudi Kwenye Fomu
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="main-header">
          <h1 className="text-gradient" style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '8px' }}>
            Wasifu Wangu (My Profile)
          </h1>
          <p className="text-muted">Dhibiti taarifa zako, badilisha password, na toka kwenye mfumo.</p>
        </header>

        <div className="main-body">
          {/* Profile Info Section */}
          <div className="profile-section">
            <div className="profile-card">
              <div className="profile-avatar">
                <img src="/thepeace.jpg" alt="Admin" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '50%', border: '3px solid var(--primary)' }} />
              </div>
              <div className="profile-info">
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '4px' }}>Admin</h2>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Msimamizi Mkuu wa Mfumo</span>
                <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span className="badge badge-purple">Jukumu: Admin</span>
                  <span className="badge badge-green">Hali: Hai</span>
                </div>
              </div>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '32px 0' }} />

          {/* Change Password Section */}
          <div className="profile-section">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🔐 Badilisha Password
            </h3>

            {errorMsg && (
              <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 'var(--radius-md)', padding: '14px', color: '#b91c1c', fontSize: '0.85rem', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span>⚠️</span>
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 'var(--radius-md)', padding: '14px', color: '#15803d', fontSize: '0.85rem', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span>✅</span>
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} style={{ maxWidth: '500px' }}>
              <div className="form-group">
                <label className="form-label">Nenosiri Jipya (New Password)</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Weka password mpya (herufi 6+)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isLoading}
                    className="form-input"
                    style={{ width: '100%', paddingRight: '40px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    style={{ position: 'absolute', right: '12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#64748b' }}
                    title={showNewPassword ? "Ficha Password" : "Onyesha Password"}
                  >
                    {showNewPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Thibitisha Nenosiri (Confirm Password)</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Rudia password mpya hapa"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                    className="form-input"
                    style={{ width: '100%', paddingRight: '40px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ position: 'absolute', right: '12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#64748b' }}
                    title={showConfirmPassword ? "Ficha Password" : "Onyesha Password"}
                  >
                    {showConfirmPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={isLoading} className="btn btn-primary" style={{ marginTop: '8px' }}>
                {isLoading ? 'Inahifadhi...' : '🔒 Hifadhi Password Mpya'}
              </button>
            </form>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '32px 0' }} />

          {/* Logout Section */}
          <div className="profile-section">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🚪 Toka Kwenye Mfumo
            </h3>
            <p className="text-muted" style={{ marginBottom: '16px', fontSize: '0.9rem' }}>
              Ukibonyeza hapa, utaondolewa kwenye mfumo na kurudishwa kwenye ukurasa mkuu.
            </p>
            <button 
              onClick={handleLogout} 
              className="btn btn-secondary" 
              style={{ borderColor: 'rgba(239, 68, 68, 0.4)', color: 'hsl(346.8, 77.2%, 65%)' }}
            >
              🚪 Ondoka (Logout)
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
