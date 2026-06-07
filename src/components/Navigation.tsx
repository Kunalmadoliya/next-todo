'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function Navigation() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/auth/login' })
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 text-white flex items-center justify-center font-bold text-lg rounded-md">
              D
            </div>
            <span className="hidden sm:inline font-bold text-lg text-zinc-100">
              DevFlow
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/blogs"
              className="text-zinc-400 hover:text-blue-400 transition-colors"
            >
              Explore
            </Link>

            {session?.user && (
              <>
                <Link
                  href="/dashboard"
                  className="text-zinc-400 hover:text-blue-400 transition-colors"
                >
                  Dashboard
                </Link>

                <Link
                  href="/profile"
                  className="text-zinc-400 hover:text-blue-400 transition-colors"
                >
                  Profile
                </Link>
              </>
            )}
          </div>

          {/* Auth Buttons / User Menu */}
          <div className="flex items-center gap-4">
            {session?.user ? (
              <div className="flex items-center gap-4">
                <span className="hidden sm:inline text-sm text-zinc-400">
                  {session.user.name || session.user.email}
                </span>

                <button
                  onClick={handleLogout}
                  className="px-3 py-2 text-sm border border-zinc-800 rounded-lg hover:bg-zinc-900 text-zinc-300 transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/auth/login')}
                  className="border border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 cursor-pointer"
                >
                  Login
                </Button>

                <Button
                  size="sm"
                  onClick={() => router.push('/auth/signup')}
                  className="bg-blue-600 text-white hover:bg-blue-500 cursor-pointer"
                >
                  Sign Up
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 hover:bg-zinc-900 rounded transition-colors text-zinc-300"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isOpen
                      ? 'M6 18L18 6M6 6l12 12'
                      : 'M4 6h16M4 12h16M4 18h16'
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-zinc-800">
            <Link
              href="/blogs"
              className="block py-2 text-zinc-400 hover:text-blue-400 transition-colors"
            >
              Explore
            </Link>

            {session?.user && (
              <>
                <Link
                  href="/dashboard"
                  className="block py-2 text-zinc-400 hover:text-blue-400 transition-colors"
                >
                  Dashboard
                </Link>

                <Link
                  href="/profile"
                  className="block py-2 text-zinc-400 hover:text-blue-400 transition-colors"
                >
                  Profile
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}