'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Home() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    nextOfKinName: '',
    nextOfKinPhone: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Kuna hitilafu iliyotokea.')
      }

      setSuccess(true)
      setFormData({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        nextOfKinName: '',
        nextOfKinPhone: '',
      })
    } catch (err: any) {
      setError(err.message || 'Kashindwa kuwasiliana na server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Navigation Header */}
      <header className="nav-header">
        <div className="container nav-container">
          <div className="logo">
            <span style={{ fontSize: '1.8rem' }}>✦</span> Jisajili
          </div>
          <Link href="/admin" className="btn btn-secondary">
            Kazi ya Admin 🛡️
          </Link>
        </div>
      </header>

      {/* Main Form Area */}
      <main className="container" style={{ padding: '60px 24px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '600px' }}>
          
          {success ? (
            /* Success Screen Screen */
            <div className="card success-screen">
              <div className="success-icon">✓</div>
              <h2 className="text-gradient-green" style={{ fontSize: '1.8rem', fontWeight: 800 }}>
                Usajili Umekamilika!
              </h2>
              <p className="text-muted" style={{ fontSize: '1.05rem', lineHeight: '1.6' }}>
                Hongera sana! Taarifa zako zimepokelewa na zimehifadhiwa salama kwenye database yetu.
              </p>
              <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
                <button className="btn btn-primary" onClick={() => setSuccess(false)}>
                  Sajili Mwingine
                </button>
                <Link href="/admin" className="btn btn-secondary">
                  Angalia Admin Panel
                </Link>
              </div>
            </div>
          ) : (
            /* Registration Form */
            <div className="card">
              <div style={{ marginBottom: '32px', textAlign: 'center' }}>
                <h1 className="text-gradient" style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '8px' }}>
                  Fomu Ya Usajili
                </h1>
                <p className="text-muted">Jaza taarifa zako kwa usahihi hapa chini ili kujisajili.</p>
              </div>

              {error && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  color: 'hsl(346.8, 77.2%, 60%)',
                  marginBottom: '24px',
                  fontSize: '0.95rem',
                  fontWeight: 500
                }}>
                  ⚠️ {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <h3 className="text-gradient" style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  1. Taarifa Binafsi
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label htmlFor="firstName" className="form-label">Jina la Kwanza</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Mfano: Khadija"
                      className="form-input"
                      required
                      autoComplete="off"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastName" className="form-label">Jina la Mwisho</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Mfano: Iman"
                      className="form-input"
                      required
                      autoComplete="off"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="phoneNumber" className="form-label">Namba ya Simu</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Mfano: 0712345678"
                    className="form-input"
                    required
                    autoComplete="off"
                  />
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '32px 0 24px 0' }} />

                <h3 className="text-gradient" style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  2. Taarifa ya Mtu wa Karibu (Next of Kin)
                </h3>

                <div className="form-group">
                  <label htmlFor="nextOfKinName" className="form-label">Jina la Mtu wa Karibu</label>
                  <input
                    type="text"
                    id="nextOfKinName"
                    name="nextOfKinName"
                    value={formData.nextOfKinName}
                    onChange={handleChange}
                    placeholder="Mfano: Ahmed Ibrahim"
                    className="form-input"
                    required
                    autoComplete="off"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="nextOfKinPhone" className="form-label">Namba ya Simu ya Mtu wa Karibu</label>
                  <input
                    type="tel"
                    id="nextOfKinPhone"
                    name="nextOfKinPhone"
                    value={formData.nextOfKinPhone}
                    onChange={handleChange}
                    placeholder="Mfano: 0687654321"
                    className="form-input"
                    required
                    autoComplete="off"
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ width: '100%', padding: '16px', marginTop: '16px', fontSize: '1.05rem' }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span style={{
                        display: 'inline-block',
                        width: '18px',
                        height: '18px',
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderRadius: '50%',
                        borderTopColor: 'white',
                        animation: 'spin 0.8s linear infinite',
                        marginRight: '8px'
                      }}></span>
                      Kuwasilisha taarifa...
                    </>
                  ) : 'Kamilisha Usajili 🚀'}
                </button>
              </form>
            </div>
          )}

        </div>
      </main>

      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  )
}
