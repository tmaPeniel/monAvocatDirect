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
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-14">
          {/* Left: Hamburger (mobile) / Nav links (desktop) */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-1.5 -ml-1.5 text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Menu"
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <div className="hidden lg:flex items-center gap-6">
              <Link
                to="/"
                className="text-gray-700 hover:text-red-600 text-sm font-medium transition-colors"
              >
                Accueil
              </Link>
              <Link
                to="/search"
                className="text-gray-700 hover:text-red-600 text-sm font-medium transition-colors flex items-center gap-1"
              >
                <Search className="h-4 w-4" />
                Rechercher un avocat
              </Link>
            </div>
          </div>

          {/* Center: Logo (absolutely centered) */}
          {/* REMPLACER LOGO_PLACEHOLDER PAR LE LOGO FINAL (marque "A" stylisee) */}
          <Link to="/" className="absolute left-1/2 -translate-x-1/2">
            <svg
              width="26"
              height="32"
              viewBox="0 0 26 32"
              fill="none"
              className="h-8 w-auto"
              aria-label="Mon Avocat Direct"
            >
              <path
                d="M13 0L0 32h5l2.8-7h10.4l2.8 7h5L13 0z"
                fill="#1a1a1a"
              />
              <path
                d="M9 22l4-10.5L17 22H9z"
                fill="#DC2626"
              />
            </svg>
          </Link>

          {/* Right: Auth Buttons */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link
                  to={getDashboardPath()}
                  className="text-sm font-bold text-gray-900 hover:text-red-600 transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Deconnexion"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-bold text-gray-900 hover:text-red-600 transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 rounded-full bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors"
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
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium"
            >
              <Home className="h-5 w-5 text-gray-400" />
              Accueil
            </Link>
            <Link
              to="/search"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium"
            >
              <Search className="h-5 w-5 text-gray-400" />
              Rechercher un avocat
            </Link>
            {user && (
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
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium"
                >
                  <LogOut className="h-5 w-5 text-gray-400" />
                  Deconnexion
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
