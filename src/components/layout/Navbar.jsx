import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Scale, Search, User, LogOut, Menu, X } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
    setMobileMenuOpen(false)
  }

  const getDashboardPath = () => {
    if (!profile) return '/client/dashboard'
    if (profile.role === 'admin') return '/admin/dashboard'
    if (profile.role === 'avocat') return '/avocat/dashboard'
    return '/client/dashboard'
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <Scale className="h-8 w-8 text-[#1a56db]" />
            <span className="text-xl font-bold">
              <span className="text-[#1a56db]">MonAvocat</span>
              <span className="text-[#c8a951]">Direct</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-600 hover:text-[#1a56db] transition-colors font-medium"
            >
              Accueil
            </Link>
            <Link
              to="/search"
              className="text-gray-600 hover:text-[#1a56db] transition-colors font-medium flex items-center space-x-1"
            >
              <Search className="h-4 w-4" />
              <span>Rechercher un avocat</span>
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to={getDashboardPath()}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-[#1a56db] hover:bg-blue-50 transition-colors font-medium"
                >
                  <User className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors font-medium"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Deconnexion</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-[#1a56db] hover:bg-blue-50 transition-colors font-medium"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg bg-[#1a56db] text-white hover:bg-blue-700 transition-colors font-medium"
                >
                  Inscription
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-4 space-y-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-[#1a56db] transition-colors font-medium"
            >
              Accueil
            </Link>
            <Link
              to="/search"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-[#1a56db] transition-colors font-medium"
            >
              <Search className="h-4 w-4" />
              <span>Rechercher un avocat</span>
            </Link>

            <hr className="my-2 border-gray-100" />

            {user ? (
              <>
                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 px-4 py-3 rounded-lg text-[#1a56db] hover:bg-blue-50 transition-colors font-medium"
                >
                  <User className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 w-full px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors font-medium"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Deconnexion</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-[#1a56db] hover:bg-blue-50 transition-colors font-medium text-center"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg bg-[#1a56db] text-white hover:bg-blue-700 transition-colors font-medium text-center"
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
