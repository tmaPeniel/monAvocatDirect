import { Link, useLocation } from 'react-router-dom'
import {
  Home,
  Briefcase,
  FileText,
  Users,
  Settings,
  ChevronRight,
  Shield,
  Scale,
  User,
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const sidebarLinks = {
  client: [
    { label: 'Dashboard', path: '/client/dashboard', icon: Home },
    { label: 'Mes dossiers', path: '/client/cases', icon: FileText },
  ],
  avocat: [
    { label: 'Dashboard', path: '/avocat/dashboard', icon: Home },
    { label: 'Mes dossiers', path: '/avocat/cases', icon: Briefcase },
    { label: 'Mon profil', path: '/avocat/profile', icon: User },
  ],
  admin: [
    { label: 'Dashboard', path: '/admin/dashboard', icon: Shield },
  ],
}

export default function Sidebar({ open, onClose }) {
  const { profile } = useAuth()
  const location = useLocation()

  const role = profile?.role || 'client'
  const links = sidebarLinks[role] || sidebarLinks.client

  const isActive = (path) => location.pathname === path

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-full w-64 bg-white border-r border-gray-200
          transform transition-transform duration-200 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center space-x-2 h-16 px-6 border-b border-gray-100">
          <Scale className="h-7 w-7 text-[#1a56db]" />
          <span className="text-lg font-bold">
            <span className="text-[#1a56db]">MonAvocat</span>
            <span className="text-[#c8a951]">Direct</span>
          </span>
        </div>

        {/* Profile Badge */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center space-x-3 px-2">
            <div className="w-9 h-9 rounded-full bg-[#1a56db] flex items-center justify-center text-white font-semibold text-sm">
              {profile?.prenom?.charAt(0)?.toUpperCase() ||
                profile?.email?.charAt(0)?.toUpperCase() ||
                'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {profile?.prenom
                  ? `${profile.prenom} ${profile.nom || ''}`
                  : profile?.email || 'Utilisateur'}
              </p>
              <p className="text-xs text-gray-500 capitalize">{role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-3 py-4 space-y-1">
          {links.map((link) => {
            const Icon = link.icon
            const active = isActive(link.path)

            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={onClose}
                className={`
                  flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${
                    active
                      ? 'bg-blue-50 text-[#1a56db]'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`h-5 w-5 ${active ? 'text-[#1a56db]' : 'text-gray-400'}`} />
                  <span>{link.label}</span>
                </div>
                {active && <ChevronRight className="h-4 w-4 text-[#1a56db]" />}
              </Link>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
          <Link
            to="/"
            onClick={onClose}
            className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <Home className="h-5 w-5 text-gray-400" />
            <span>Retour au site</span>
          </Link>
        </div>
      </aside>
    </>
  )
}
