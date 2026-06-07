'use client'

import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function SignupPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const username = formData.get('username') as string
      const email = formData.get('email') as string
      const password = formData.get('password') as string
      const confirmPassword = formData.get('confirmPassword') as string

      // Fast-path client side validation check
      if (password !== confirmPassword) {
        setError('Security keys do not match.')
        setIsLoading(false)
        return
      }

      if (password.length < 8) {
        setError('Security key must be at least 8 characters.')
        setIsLoading(false)
        return
      }

      const result = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      })

      const data = await result.json()

      if (!result.ok) {
        setError(data.error || 'Account generation sequence aborted.')
      } else {
        // Auto-login pipeline activation
        const signInResult = await signIn('credentials', {
          email,
          password,
          redirect: false,
        })

        if (signInResult?.ok) {
          router.push('/dashboard')
        } else {
          router.push('/auth/login')
        }
      }
    } catch (err) {
      setError('An internal core registration error occurred.')
      console.error('[DevFlow] Signup error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased flex flex-col items-center justify-center relative overflow-hidden px-4 py-12">
      
      {/* Premium Backlight Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl h-[500px] bg-blue-500/5 blur-3xl pointer-events-none rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 15, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-[440px] relative z-10 space-y-6"
      >
        {/* Branding & Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group mx-auto mb-2">
            <div className="w-7 h-7 rounded-lg bg-zinc-100 flex items-center justify-center shadow-md">
              <span className="text-xs font-bold text-zinc-950 tracking-tighter">DF</span>
            </div>
            <span className="text-sm font-semibold tracking-tight text-zinc-300 group-hover:text-white transition-colors">
              DevFlow<span className="text-blue-500">.</span>
            </span>
          </Link>
          <h1 className="text-xl font-bold tracking-tight text-zinc-100">Create your environment</h1>
          <p className="text-xs text-zinc-500">Deploy your developer identity across the platform</p>
        </div>

        {/* Auth Interface Card */}
        <div className="bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl shadow-black/50">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Error Vector */}
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-medium"
              >
                {error}
              </motion.div>
            )}

            {/* Profile Anchor Name */}
            <div className="space-y-1.5">
              <label htmlFor="username" className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-500">
                Identity Profile Name
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                autoComplete="name"
                placeholder="John Doe"
                className="w-full bg-zinc-950/60 border border-zinc-800/80 focus:border-blue-500/70 rounded-xl px-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-0 transition-all duration-200"
              />
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-500">
                System Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="name@domain.com"
                className="w-full bg-zinc-950/60 border border-zinc-800/80 focus:border-blue-500/70 rounded-xl px-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-0 transition-all duration-200"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-500">
                  Root Security Key
                </label>
                <span className="text-[10px] text-zinc-600">Min. 8 keys</span>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="new-password"
                placeholder="••••••••"
                className="w-full bg-zinc-950/60 border border-zinc-800/80 focus:border-blue-500/70 rounded-xl px-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-0 transition-all duration-200"
              />
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-500">
                Re-enter Security Key
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                autoComplete="new-password"
                placeholder="••••••••"
                className="w-full bg-zinc-950/60 border border-zinc-800/80 focus:border-blue-500/70 rounded-xl px-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-0 transition-all duration-200"
              />
            </div>

            {/* Terms Consensus Checklist */}
            <div className="flex items-start gap-2.5 pt-1">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="w-4 h-4 mt-0.5 rounded border-zinc-800 bg-zinc-950 text-blue-500 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-blue-500"
              />
              <label htmlFor="terms" className="text-xs text-zinc-500 select-none cursor-pointer hover:text-zinc-400 transition-colors leading-relaxed">
                I accept the platform system parameters and algorithmic policies
              </label>
            </div>

            {/* Action Trigger */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full relative mt-2 flex items-center justify-center bg-zinc-100 hover:bg-white disabled:bg-zinc-800 text-zinc-950 disabled:text-zinc-500 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all active:scale-[0.99] disabled:scale-100 cursor-pointer disabled:cursor-not-allowed shadow-md"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-3.5 w-3.5 text-zinc-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Building profile network...
                </div>
              ) : (
                'Provision New Account'
              )}
            </button>
          </form>
        </div>

        {/* Redirection Layer */}
        <p className="text-center text-xs text-zinc-500 font-medium">
          Already established on DevFlow?{' '}
          <Link href="/auth/login" className="text-zinc-300 hover:text-blue-400 hover:underline transition-colors ml-0.5">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  )
}