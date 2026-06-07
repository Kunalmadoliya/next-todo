import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-zinc-800/60 bg-zinc-950 mt-20 relative overflow-hidden">
      {/* Ambient Top Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[150px] bg-gradient-to-b from-blue-500/5 via-transparent to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 group w-fit mb-5">
              <div className="w-6 h-6 rounded bg-zinc-100 flex items-center justify-center">
                <span className="text-[10px] font-bold text-zinc-950 tracking-tighter">DF</span>
              </div>
              <span className="text-sm font-medium tracking-tight text-zinc-100 group-hover:text-zinc-300 transition-colors">
                DevFlow
              </span>
            </Link>
            <p className="text-sm text-zinc-500 leading-relaxed pr-4">
              A modern, production-grade platform for developers to share technical insights, architectures, and stories.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-100 mb-5 tracking-tight">Product</h3>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li>
                <Link href="/blogs" className="hover:text-blue-400 transition-colors">
                  Explore Blogs
                </Link>
              </li>
              <li>
                <Link href="/auth/signup" className="hover:text-blue-400 transition-colors">
                  Start Writing
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-blue-400 transition-colors">
                  Features
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-100 mb-5 tracking-tight">Community</h3>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  Discord
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  X / Twitter
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  GitHub
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-100 mb-5 tracking-tight">Legal</h3>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="border-t border-zinc-800/60 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-zinc-500">
            &copy; {currentYear} DevFlow. All rights reserved.
          </p>
          
          {/* Status Indicator */}
          <div className="flex items-center gap-3 bg-zinc-900/50 border border-zinc-800/80 px-3 py-1.5 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}