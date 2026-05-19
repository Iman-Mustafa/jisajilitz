'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ChangePasswordPage() {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
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

      setSuccessMsg('Hongera! Password imebadilishwa kikamilifu. Unahamishiwa kwenye dashboard...')
      
      setTimeout(() => {
        router.push('/admin')
      }, 2500)
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

      <div className="card w-full max-w-lg p-8 relative z-10 glass">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-secondary to-purple flex items-center justify-center shadow-lg shadow-purple/20 mb-4">
            <span className="text-3xl">🔑</span>
          </div>
          <h1 className="text-2xl font-bold text-gradient text-center">Usalama wa Kwanza!</h1>
          <p className="text-gray-300 text-sm text-center mt-3 leading-relaxed px-2">
            Huu ni usajili wako wa kwanza kabisa! Ili kulinda usalama wa mfumo, tafadhali **badilisha password ya kuanzia (ALIX2026)** sasa na uweke nenosiri jipya la siri ili sisi na watu wengine tusiweze kulijua kamwe.
          </p>
        </div>

        {/* Status Messages */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm flex items-start gap-3 animate-shake">
            <span className="text-lg">⚠️</span>
            <div>
              <p className="font-semibold">Hitilafu ya Usajili</p>
              <p className="text-xs mt-0.5 text-danger/80">{errorMsg}</p>
            </div>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-green/10 border border-green/20 text-green-400 text-sm flex items-start gap-3 animate-scaleUp">
            <span className="text-lg">✅</span>
            <div>
              <p className="font-semibold">Imefanikiwa!</p>
              <p className="text-xs mt-0.5 text-green-300/80">{successMsg}</p>
            </div>
          </div>
        )}

        {/* Change Password Form */}
        <form onSubmit={handleChangePassword} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider block">
              Nenosiri Jipya (New Password)
            </label>
            <input
              type="password"
              placeholder="Weka password mpya (herufi 6+)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={isLoading || successMsg !== ''}
              className="form-input w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider block">
              Thibitisha Nenosiri Jipya (Confirm Password)
            </label>
            <input
              type="password"
              placeholder="Rudia password mpya hapa"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading || successMsg !== ''}
              className="form-input w-full"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || successMsg !== ''}
            className="btn-primary w-full flex items-center justify-center gap-2 py-3.5"
          >
            {isLoading ? (
              <>
                <span className="animate-spin text-lg">⏳</span>
                <span>Inahifadhi Password Mpya...</span>
              </>
            ) : (
              <>
                <span>Hifadhi na Uendelee</span>
                <span>🔓</span>
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  )
}
