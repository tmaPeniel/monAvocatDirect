import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Menu, LogOut, Scale } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import Sidebar from './Sidebar'

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center space-x-4">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Mobile logo (visible only when sidebar is hidden) */}
            <div className="lg:hidden flex items-center space-x-2">
              <Scale className="h-6 w-6 text-[#1a56db]" />
              <span className="text-lg font-bold">
                <span className="text-[#1a56db]">MonAvocat</span>
                <span className="text-[#c8a951]">Direct</span>
              </span>
            </div>
          </div>

          {/* Sign out button */}
          <button
            onClick={handleSignOut}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors text-sm font-medium"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Deconnexion</span>
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
