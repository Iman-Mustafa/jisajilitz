'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!password) {
      setErrorMsg('Tafadhali weka password ili kuingia.')
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Password uliyoweka siyo sahihi.')
      }

      // Successful login
      if (data.isFirstLogin) {
        router.push('/admin/change-password')
      } else {
        router.push('/admin')
      }
    } catch (err: any) {
      setErrorMsg(err.message)
      setIsLoading(false)
    }
  }

  return (
    <main className="login-container">
      {/* Decorative Light-Blue Gradients */}
      <div className="decor-orb top-orb"></div>
      <div className="decor-orb bottom-orb"></div>

      <div className="login-dialog">
        {/* Brand Header */}
        <div className="login-header">
          <div className="login-logo-container">
            🔒
          </div>
          <h1 className="login-title">Ingia kama Admin</h1>
          <p className="login-subtitle">
            Weka password yako ya usalama ili kudhibiti na kuona usajili.
          </p>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="login-error">
            <span className="login-error-icon">⚠️</span>
            <div>
              <p className="login-error-title">Hitilafu!</p>
              <p className="login-error-text">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="login-form">
          <div className="login-field">
            <label className="login-label">
              Nenosiri (Password)
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="login-input"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="login-button"
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                <span>Inathibitisha...</span>
              </>
            ) : (
              <>
                <span>Ingia Kwenye Mfumo</span>
                <span style={{ fontSize: '1.1rem' }}>➡️</span>
              </>
            )}
          </button>
        </form>

        {/* Back Link */}
        <div style={{ textAlign: 'center' }}>
          <Link href="/" className="login-back-link">
            ⬅️ Rudi Kwenye Fomu ya Usajili
          </Link>
        </div>
      </div>

      {/* Standalone Styled JSX for Absolute Layout Integrity */}
      <style jsx global>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background-color: #ffffff; /* White background */
          font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
          color: #0f172a; /* Slate black text */
          position: relative;
          overflow: hidden;
        }

        /* Ambient light blue background accents */
        .decor-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          pointer-events: none;
          z-index: 1;
          opacity: 0.6;
        }

        .top-orb {
          top: -10%;
          left: -10%;
          width: 500px;
          height: 500px;
          background-color: rgba(14, 165, 233, 0.12); /* Very soft sky blue */
        }

        .bottom-orb {
          bottom: -10%;
          right: -10%;
          width: 500px;
          height: 500px;
          background-color: rgba(56, 189, 248, 0.1);
        }

        .login-dialog {
          background-color: #ffffff;
          border-radius: 24px;
          width: 100%;
          max-width: 440px;
          padding: 40px;
          box-shadow: 
            0 4px 6px -1px rgba(0, 0, 0, 0.05),
            0 20px 40px -15px rgba(2, 132, 199, 0.12),
            0 0 0 1px rgba(2, 132, 199, 0.08); /* Crisp light blue border highlight */
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          animation: scaleUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes scaleUp {
          from {
            transform: scale(0.96);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .login-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 32px;
        }

        .login-logo-container {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          border-radius: 20px;
          background-color: #f0f9ff; /* Softest light blue */
          color: #0284c7; /* Light blue accent */
          margin-bottom: 20px;
          font-size: 2rem;
          box-shadow: 0 8px 20px -6px rgba(2, 132, 199, 0.15);
        }

        .login-title {
          font-size: 1.6rem;
          font-weight: 800;
          color: #0f172a; /* Deep Charcoal Black */
          text-align: center;
          margin-bottom: 8px;
          letter-spacing: -0.02em;
        }

        .login-subtitle {
          font-size: 0.9rem;
          color: #64748b; /* Muted slate gray */
          text-align: center;
          line-height: 1.5;
          margin: 0;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .login-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .login-label {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #475569;
        }

        .login-input {
          background-color: #f8fafc;
          border: 1.5px solid #cbd5e1;
          border-radius: 12px;
          padding: 14px 16px;
          font-size: 1rem;
          color: #0f172a;
          outline: none;
          transition: all 0.2s ease;
        }

        .login-input::placeholder {
          color: #94a3b8;
        }

        .login-input:focus {
          border-color: #0284c7; /* Light blue focus border */
          background-color: #ffffff;
          box-shadow: 0 0 0 4px rgba(2, 132, 199, 0.15);
        }

        .login-button {
          background-color: #0284c7; /* Light blue primary button */
          color: #ffffff;
          border: none;
          border-radius: 12px;
          padding: 14px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s ease;
          box-shadow: 0 4px 14px rgba(2, 132, 199, 0.25);
        }

        .login-button:hover:not(:disabled) {
          background-color: #0369a1; /* Hover dark blue */
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(2, 132, 199, 0.35);
        }

        .login-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .login-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .login-back-link {
          display: inline-block;
          margin-top: 24px;
          font-size: 0.85rem;
          color: #64748b;
          font-weight: 600;
          transition: color 0.2s ease;
          text-decoration: none;
        }

        .login-back-link:hover {
          color: #0284c7;
        }

        .login-error {
          background-color: #fef2f2;
          border: 1px solid #fca5a5;
          border-radius: 12px;
          padding: 14px;
          color: #b91c1c;
          font-size: 0.85rem;
          margin-bottom: 24px;
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }

        .login-error-icon {
          font-size: 1.1rem;
          line-height: 1;
        }

        .login-error-title {
          font-weight: 700;
          margin: 0 0 2px 0;
        }

        .login-error-text {
          margin: 0;
          opacity: 0.9;
        }

        .spinner {
          display: inline-block;
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: #ffffff;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 480px) {
          .login-container {
            padding: 16px;
          }
          .login-dialog {
            padding: 28px 20px;
            border-radius: 16px;
          }
          .login-title {
            font-size: 1.35rem;
          }
          .login-subtitle {
            font-size: 0.85rem;
          }
          .login-input {
            padding: 12px 14px;
            font-size: 0.95rem;
          }
          .login-button {
            padding: 12px;
            font-size: 0.95rem;
          }
        }
      `}</style>
    </main>
  )
}
