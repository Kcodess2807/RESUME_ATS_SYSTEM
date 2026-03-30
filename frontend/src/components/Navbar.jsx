import { Link, useLocation } from 'react-router-dom'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'
import { Target } from 'lucide-react'
import Button from './ui/Button'

function Navbar() {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path ? 'text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-900 font-medium'
  }

  return (
    <nav className="bg-surface/80 backdrop-blur-md border-b border-secondary-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* ---- Left: Logo ---- */}
        <Link
          to="/"
          className="flex items-center gap-2.5 text-secondary-800 transition-colors group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-sm group-hover:shadow-glow transition-shadow">
            <Target className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-lg tracking-tight text-secondary-900 group-hover:text-primary-600 transition-colors">ATS Analyzer</span>
        </Link>

        {/* ---- Center: Next.js / SaaS style Links ---- */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className={`text-sm tracking-wide transition-colors ${isActive('/')}`}>
            Home
          </Link>
          <Link to="/analyze" className={`text-sm tracking-wide transition-colors ${isActive('/analyze')}`}>
            Analyzer
          </Link>
          <Link to="/profile" className={`flex items-center gap-1.5 text-sm tracking-wide transition-colors ${isActive('/profile')}`}>
            Profile
          </Link>
        </div>

        {/* ---- Right: Auth & Actions ---- */}
        <div className="flex items-center gap-4 border-l border-slate-200 pl-4">

          <SignedIn>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8 rounded-full shadow-sm border border-slate-200"
                }
              }}
            />
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="primary" size="sm">
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>

        </div>
      </div>
    </nav>
  )
}

export default Navbar
