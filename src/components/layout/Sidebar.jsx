import { Link, useLocation } from 'react-router-dom'
import {
  Calendar,
  MessageSquare,
  User,
  FileText,
  Clock,
  Scale,
  Home,
  Briefcase,
  Shield,
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const sidebarLinks = {
  client: [
    { label: 'Dashboard',       path: '/client/dashboard',    icon: Home },
    { label: 'Mes Rendez-Vous', path: '/client/appointments', icon: Calendar },
    { label: 'Messages',        path: '/client/messages',     icon: MessageSquare, badge: '2' },
    { label: 'Mon profil',      path: '/client/profile',      icon: User },
    { label: 'Documents',       path: '/client/cases',        icon: FileText },
    { label: 'Aide juridictionnelle', path: '/client/aide',   icon: Scale },
  ],
  avocat: [
    { label: 'Dashboard',       path: '/avocat/dashboard',    icon: Home },
    { label: 'Mes Rendez-Vous', path: '/avocat/appointments', icon: Calendar },
    { label: 'Messages', path: '/avocat/messages', icon: MessageSquare, badge: '2' },
    { label: 'Mon profil', path: '/avocat/profile', icon: User },
    { label: 'Documents', path: '/avocat/cases', icon: FileText },
    { label: 'Disponibilites', path: '/avocat/availability', icon: Clock },
    { label: 'Aide juridictionnelle', path: '/avocat/aide', icon: Scale },
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

  const initials =
    profile?.prenom?.charAt(0)?.toUpperCase() ||
    profile?.email?.charAt(0)?.toUpperCase() ||
    'U'

  const displayName = profile?.prenom
    ? `${profile.prenom} ${profile.nom || ''}`
    : profile?.email || 'Utilisateur'

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
          fixed top-0 left-0 z-40 h-full w-64 flex flex-col
          bg-[#1a1a1a]
          transform transition-transform duration-200 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-5 border-b border-gray-800">
          <Link to="/" className="flex items-center" onClick={onClose}>
            <img src="/Logo.png" alt="Mon Avocat Direct" className="h-8 w-auto" />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
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
                  ${active
                    ? 'bg-red-600/20 text-red-400'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-5 w-5 ${active ? 'text-red-400' : 'text-gray-500'}`} />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                    {link.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* User info at bottom */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 px-2">
            {profile?.photo_url ? (
              <img
                src={profile.photo_url}
                alt=""
                className="w-9 h-9 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gray-700 text-gray-300 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                {initials}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-gray-200">{displayName}</p>
              <p className="text-xs capitalize text-gray-500">{role}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
