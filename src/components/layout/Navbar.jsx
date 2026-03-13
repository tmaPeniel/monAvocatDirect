import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, Home, Search, User, LogOut } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
    setMenuOpen(false)
  }

  const getDashboardPath = () => {
    if (!profile) return '/client/dashboard'
    if (profile.role === 'admin') return '/admin/dashboard'
    if (profile.role === 'avocat') return '/avocat/dashboard'
    return '/client/dashboard'
  }

  return (
    <nav className="bg-black sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-14">
          {/* Left: Hamburger (mobile) / Nav links (desktop) */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-1.5 -ml-1.5 text-white hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Menu"
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <div className="hidden lg:flex items-center gap-6" />
          </div>

          {/* Center: Logo (absolutely centered) */}
          <Link to="/" className="absolute left-1/2 -translate-x-1/2">
            <img
              src="/Logo.png"
              alt="Mon Avocat Direct"
              className="h-8 w-auto"
            />
          </Link>

          {/* Right: Auth Buttons */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link
                  to={getDashboardPath()}
                  className="hidden lg:block text-sm font-bold text-white hover:text-red-500 transition-colors"
                >
                  Mon espace
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden lg:block text-sm font-bold text-white hover:text-red-500 transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="hidden lg:block px-5 py-2 rounded-full bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors"
                >
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {user ? (
              <>
                <hr className="my-2 border-gray-100" />
                <Link
                  to={getDashboardPath()}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium"
                >
                  <User className="h-5 w-5 text-gray-400" />
                  Mon espace
                </Link>
              </>
            ) : (
              <>
                <hr className="my-2 border-gray-100" />
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium"
                >
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
