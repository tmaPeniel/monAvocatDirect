import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './contexts/AuthContext'

// Layouts
import MainLayout from './components/layout/MainLayout'
import DashboardLayout from './components/layout/DashboardLayout'

// Public pages
import Home from './pages/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import Search from './pages/Search'
import LawyerProfile from './pages/LawyerProfile'

// Client pages
import ClientDashboard from './pages/client/ClientDashboard'
import ClientCases from './pages/client/ClientCases'
import ClientCaseDetail from './pages/client/ClientCaseDetail'
import ClientNewCase from './pages/client/ClientNewCase'

// Lawyer pages
import LawyerDashboard from './pages/lawyer/LawyerDashboard'
import LawyerCases from './pages/lawyer/LawyerCases'
import LawyerCaseDetail from './pages/lawyer/LawyerCaseDetail'
import LawyerProfileEdit from './pages/lawyer/LawyerProfileEdit'

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard'

function ProtectedRoute({ children, allowedRoles }) {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" />

  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    return <Navigate to="/dashboard" />
  }

  return children
}

function DashboardRedirect() {
  const { profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (profile?.role === 'avocat') return <Navigate to="/avocat/dashboard" />
  if (profile?.role === 'admin') return <Navigate to="/admin/dashboard" />
  return <Navigate to="/client/dashboard" />
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: { style: { background: '#22c55e' } },
            error: { style: { background: '#ef4444' } },
          }}
        />
        <Routes>
          {/* Public routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/lawyer/:id" element={<LawyerProfile />} />
          </Route>

          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Dashboard redirect */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardRedirect />
              </ProtectedRoute>
            }
          />

          {/* Client routes */}
          <Route
            element={
              <ProtectedRoute allowedRoles={['client']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/client/dashboard" element={<ClientDashboard />} />
            <Route path="/client/cases" element={<ClientCases />} />
            <Route path="/client/cases/new" element={<ClientNewCase />} />
            <Route path="/client/cases/:id" element={<ClientCaseDetail />} />
          </Route>

          {/* Lawyer routes */}
          <Route
            element={
              <ProtectedRoute allowedRoles={['avocat']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/avocat/dashboard" element={<LawyerDashboard />} />
            <Route path="/avocat/cases" element={<LawyerCases />} />
            <Route path="/avocat/cases/:id" element={<LawyerCaseDetail />} />
            <Route path="/avocat/profile" element={<LawyerProfileEdit />} />
          </Route>

          {/* Admin routes */}
          <Route
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
