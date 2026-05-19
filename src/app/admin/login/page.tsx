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
        // Redirect to change password first
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
    <main className="min-h-screen flex items-center justify-center p-4 bg-base relative overflow-hidden">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-secondary/10 blur-[100px] pointer-events-none"></div>

      <div className="card w-full max-w-md p-8 relative z-10 glass">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20 mb-4">
            <span className="text-3xl">🔒</span>
          </div>
          <h1 className="text-2xl font-bold text-gradient">Ingia kama Admin</h1>
          <p className="text-gray-400 text-sm text-center mt-1">
            Weka password yako ya usalama ili kudhibiti na kuona usajili
          </p>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm flex items-start gap-3 animate-shake">
            <span className="text-lg">⚠️</span>
            <div>
              <p className="font-semibold">Hitilafu!</p>
              <p className="text-xs mt-0.5 text-danger/80">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider block">
              Nenosiri (Password)
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="form-input w-full"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 relative overflow-hidden"
          >
            {isLoading ? (
              <>
                <span className="animate-spin text-lg">⏳</span>
                <span>Inathibitisha...</span>
              </>
            ) : (
              <>
                <span>Ingia Kwenye Mfumo</span>
                <span>➡️</span>
              </>
            )}
          </button>
        </form>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link href="/" className="text-xs text-gray-400 hover:text-white transition-colors duration-200">
            ⬅️ Rudi Kwenye Fomu ya Usajili
          </Link>
        </div>
      </div>
    </main>
  )
}
