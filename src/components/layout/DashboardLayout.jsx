import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu } from 'lucide-react'
import Sidebar from './Sidebar'

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="h-full flex bg-gray-50">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar — mobile uniquement */}
        <header className="lg:hidden bg-black h-16 flex items-center sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 ml-4 rounded-lg text-gray-300 hover:bg-white/10 transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1 flex justify-center">
            <img src="/Logo.png" alt="Mon Avocat Direct" className="h-8 w-auto" />
          </div>
          {/* Spacer symétrique du hamburger pour centrer le logo */}
          <div className="w-9 mr-4" />
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
