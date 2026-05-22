'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Registration {
  id: string
  firstName: string
  lastName: string
  phoneNumber: string
  nextOfKin1Name: string
  nextOfKin1Phone: string
  nextOfKin2Name: string
  nextOfKin2Phone: string
  createdAt: string
}

export default function AdminDashboard() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRecord, setSelectedRecord] = useState<Registration | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const router = useRouter()

  // Fetch all registrations
  const fetchRegistrations = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/registrations')
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Imeshindwa kupakia taarifa.')
      }
      setRegistrations(data.data || [])
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Kuna hitilafu imetokea wakati wa kupakia taarifa.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRegistrations()
  }, [])

  // Show auto-dismissing toast messages
  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage('')
    }, 4000)
  }

  // Handle Logout
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

  // Handle deleting a record
  const handleDelete = async (id: string) => {
    setDeleteLoading(true)
    try {
      const res = await fetch(`/api/admin/registrations?id=${id}`, {
        method: 'DELETE',
      })
      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || 'Imeshindwa kufuta usajili.')
      }

      // Remove from state immediately
      setRegistrations((prev) => prev.filter((r) => r.id !== id))
      triggerToast('Usajili umefutwa kikamilifu!')
      setDeleteId(null)
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Hitilafu imetokea wakati wa kufuta.')
    } finally {
      setDeleteLoading(false)
    }
  }

  // Filter registrations locally based on live search query
  const filteredRegistrations = registrations.filter((r) => {
    const search = searchQuery.toLowerCase().trim()
    if (!search) return true
    return (
      r.firstName.toLowerCase().includes(search) ||
      r.lastName.toLowerCase().includes(search) ||
      r.phoneNumber.toLowerCase().includes(search) ||
      r.nextOfKin1Name.toLowerCase().includes(search) ||
      r.nextOfKin1Phone.toLowerCase().includes(search) ||
      r.nextOfKin2Name.toLowerCase().includes(search) ||
      r.nextOfKin2Phone.toLowerCase().includes(search)
    )
  })

  // Calculate quick stats
  const totalRegistrations = registrations.length
  const todayRegistrations = registrations.filter((r) => {
    const today = new Date().toDateString()
    const regDate = new Date(r.createdAt).toDateString()
    return today === regDate
  }).length

  // Helper to format ISO dates beautifully
  const formatDate = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleDateString('sw-TZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="admin-layout">
      {/* Floating Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          background: 'hsl(142.1, 70.6%, 45.3%)',
          color: 'white',
          padding: '12px 24px',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 10px 25px rgba(34, 197, 94, 0.3)',
          zIndex: 1100,
          fontWeight: 600,
          fontSize: '0.95rem',
          animation: 'slideIn 0.3s ease-out'
        }}>
          ✅ {toastMessage}
        </div>
      )}

      {/* Sidebar (Upande wa Kushoto) */}
      <aside className="admin-sidebar">
        {/* Top: Logo */}
        <div className="sidebar-header">
          <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src="/thepeace.jpg" alt="THE PEACE Logo" style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '50%' }} />
            <div>
              <span className="logo-text" style={{ display: 'block', lineHeight: 1, fontSize: '1.2rem' }}>THE PEACE</span>
              <span className="badge badge-purple" style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '4px' }}>Admin Panel</span>
            </div>
          </div>
        </div>

        {/* Middle: Stats */}
        <div className="sidebar-content">
          <div className="stat-grid">
            <div className="stat-card">
              <span className="stat-title">Jumla ya Usajili</span>
              <span className="stat-value text-gradient">{totalRegistrations}</span>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Waliojiandikisha jumla</div>
            </div>

            <div className="stat-card">
              <span className="stat-title">Usajili wa Leo</span>
              <span className="stat-value text-gradient-green">{todayRegistrations}</span>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Masaa 24 yaliyopita</div>
            </div>

            <div className="stat-card">
              <span className="stat-title">Hali ya Database</span>
              <span className="stat-value" style={{ color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.8rem' }}>
                Online <span style={{ width: '12px', height: '12px', background: 'var(--secondary)', borderRadius: '50%', display: 'inline-block', animation: 'blink 1.5s infinite' }}></span>
              </span>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Connection Salama</div>
            </div>
          </div>
        </div>

        {/* Bottom: Actions */}
        <div className="sidebar-footer">
          <Link href="/" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
            📝 Rudi Kwenye Fomu
          </Link>
          <button onClick={handleLogout} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', borderColor: 'rgba(239, 68, 68, 0.4)', color: 'hsl(346.8, 77.2%, 65%)' }}>
            🚪 Ondoka (Logout)
          </button>
        </div>
      </aside>

      {/* Main Content (Upande wa Kulia) */}
      <main className="admin-main">
        {/* Header Title Section */}
        <header className="main-header">
          <h1 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px' }}>
            Kudhibiti Usajili
          </h1>
          <p className="text-muted">Kagua, tafuta, na udhibiti orodha ya watu wote waliojisajili wenye wasimamizi wawili kila mmoja.</p>
        </header>

        <div className="main-body">
          {/* Live Search and Control Toolbar */}
          <div className="search-container">
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="Tafuta kwa Jina, Namba ya simu au Wasimamizi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <button className="btn btn-secondary" onClick={() => window.print()} style={{ display: 'inline-flex', gap: '8px' }}>
              🖨️ Print Orodha
            </button>
          </div>

          {/* Data Loader */}
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '64px', gap: '16px' }}>
              <span style={{
                display: 'inline-block',
                width: '40px',
                height: '40px',
                border: '4px solid rgba(255,255,255,0.1)',
                borderRadius: '50%',
                borderTopColor: 'var(--primary)',
                animation: 'spin 1s linear infinite'
              }}></span>
              <p className="text-muted">Inapakia orodha ya usajili kutoka kwenye database...</p>
            </div>
          ) : error ? (
            <div className="card" style={{ borderColor: 'var(--danger)', padding: '24px', textAlign: 'center' }}>
              <p style={{ color: 'var(--danger)', fontWeight: 600 }}>⚠️ {error}</p>
              <button className="btn btn-secondary" onClick={fetchRegistrations} style={{ marginTop: '16px' }}>
                Jaribu Kupakia Tena
              </button>
            </div>
          ) : filteredRegistrations.length === 0 ? (
            /* Empty State */
            <div className="card" style={{ textAlign: 'center', padding: '64px 32px' }}>
              <span style={{ fontSize: '3rem', display: 'block', marginBottom: '16px' }}>📂</span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>Hakuna Usajili Unaopatikana</h3>
              <p className="text-muted">
                {searchQuery ? 'Hakuna matokeo yanayolingana na utafutaji wako.' : 'Bado hakuna mtu yeyote aliyejisajili kwenye mfumo.'}
              </p>
              {searchQuery && (
                <button className="btn btn-secondary" onClick={() => setSearchQuery('')} style={{ marginTop: '16px' }}>
                  Futa Utafutaji
                </button>
              )}
            </div>
          ) : (
            /* Table Layout */
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Jina Kamili</th>
                    <th>Namba ya Simu</th>
                    <th>Mtu wa Karibu 1</th>
                    <th>Mtu wa Karibu 2</th>
                    <th>Tarehe ya Usajili</th>
                    <th style={{ textAlign: 'right' }}>Vitendo</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRegistrations.map((record) => (
                    <tr key={record.id}>
                      <td style={{ fontWeight: 600 }}>{record.firstName} {record.lastName}</td>
                      <td>{record.phoneNumber}</td>
                      <td>
                        <div>
                          <span className="badge badge-purple" style={{ marginBottom: '4px' }}>{record.nextOfKin1Name}</span>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>📞 {record.nextOfKin1Phone}</div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <span className="badge badge-green" style={{ marginBottom: '4px' }}>{record.nextOfKin2Name}</span>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>📞 {record.nextOfKin2Phone}</div>
                        </div>
                      </td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {formatDate(record.createdAt)}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button 
                            className="btn btn-secondary" 
                            style={{ padding: '6px 12px', fontSize: '0.85rem' }} 
                            onClick={() => setSelectedRecord(record)}
                            title="Angalia Taarifa"
                          >
                            👁️ Kagua
                          </button>
                          <button 
                            className="btn btn-secondary" 
                            style={{ padding: '6px 12px', fontSize: '0.85rem', borderColor: 'rgba(239, 68, 68, 0.3)', color: 'hsl(346.8, 77.2%, 65%)' }}
                            onClick={() => setDeleteId(record.id)}
                            title="Futa Usajili"
                          >
                            🗑️ Futa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* View Details Modal Overlay */}
        {selectedRecord && (
          <div className="modal-overlay" onClick={() => setSelectedRecord(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 className="text-gradient" style={{ fontSize: '1.4rem', fontWeight: 800 }}>Taarifa za Msajiliwa</h3>
                <button className="btn btn-secondary" onClick={() => setSelectedRecord(null)} style={{ padding: '6px 12px', borderRadius: '50%', minWidth: '36px', height: '36px' }}>×</button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', background: '#f8fafc', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--primary-glow)', border: '2px dashed var(--primary)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', fontSize: '1.6rem', color: 'var(--primary)' }}>
                  👤
                </div>
                <div>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{selectedRecord.firstName} {selectedRecord.lastName}</h4>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                    <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>ID: {selectedRecord.id.slice(0, 8)}</span>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>📞 {selectedRecord.phoneNumber}</span>
                  </div>
                </div>
              </div>

              {/* Side-by-Side Next of Kin Display Grid */}
              <div className="info-grid-2" style={{ marginTop: '16px' }}>
                
                {/* Kin 1 Card */}
                <div style={{ background: '#f8fafc', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <h4 className="text-gradient" style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05rem' }}>
                    👤 Mtu wa Karibu 1
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <span className="form-label" style={{ fontSize: '0.7rem' }}>Jina la Msimamizi</span>
                      <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--primary)', marginTop: '2px' }}>
                        {selectedRecord.nextOfKin1Name}
                      </div>
                    </div>
                    <div>
                      <span className="form-label" style={{ fontSize: '0.7rem' }}>Namba ya Simu</span>
                      <div style={{ fontSize: '0.95rem', fontWeight: 500, marginTop: '2px' }}>
                        📞 {selectedRecord.nextOfKin1Phone}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Kin 2 Card */}
                <div style={{ background: '#f8fafc', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <h4 className="text-gradient-green" style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05rem' }}>
                    👤 Mtu wa Karibu 2
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <span className="form-label" style={{ fontSize: '0.7rem' }}>Jina la Msimamizi</span>
                      <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--primary)', marginTop: '2px' }}>
                        {selectedRecord.nextOfKin2Name}
                      </div>
                    </div>
                    <div>
                      <span className="form-label" style={{ fontSize: '0.7rem' }}>Namba ya Simu</span>
                      <div style={{ fontSize: '0.95rem', fontWeight: 500, marginTop: '2px' }}>
                        📞 {selectedRecord.nextOfKin2Phone}
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '24px 0' }} />

              <div className="modal-footer">
                <div>
                  <span className="form-label" style={{ fontSize: '0.7rem' }}>Tarehe ya Kujiandikisha</span>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    📅 {formatDate(selectedRecord.createdAt)}
                  </div>
                </div>
                <button className="btn btn-primary" onClick={() => setSelectedRecord(null)} style={{ padding: '12px 28px' }}>
                  Funga Dirisha
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal Overlay */}
        {deleteId && (
          <div className="modal-overlay" onClick={() => setDeleteId(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px', borderColor: 'rgba(239, 68, 68, 0.4)' }}>
              <h3 className="text-gradient" style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '12px' }}>Je, una uhakika?</h3>
              <p className="text-muted" style={{ fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '24px' }}>
                Kitendo hiki kitafuta kabisa usajili huu kwenye database ya mfumo na hakitaweza kurudishwa tena.
              </p>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button className="btn btn-secondary" onClick={() => setDeleteId(null)} disabled={deleteLoading}>
                  Ghairi
                </button>
                <button className="btn btn-danger" onClick={() => handleDelete(deleteId)} disabled={deleteLoading} style={{ display: 'inline-flex', gap: '6px' }}>
                  {deleteLoading ? 'Inafuta...' : 'Ndio, Futa 🗑️'}
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes slideIn {
          from { transform: translateX(100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes blink {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
