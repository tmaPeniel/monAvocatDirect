import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

const IS_MOCK = import.meta.env.VITE_MOCK_MODE === 'true'

const MOCK_USERS = {
  'client@test.com': { id: 'mock-client-001', email: 'client@test.com', role: 'client', prenom: 'Sophie', nom: 'Dupont' },
  'avocat@test.com': { id: 'mock-avocat-001', email: 'avocat@test.com', role: 'avocat', prenom: 'Alexandre', nom: 'Martin' },
  'admin@test.com':  { id: 'mock-admin-001',  email: 'admin@test.com',  role: 'admin',  prenom: 'Admin', nom: '' },
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (userId) => {
    if (IS_MOCK) return
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    setProfile(data)
    return data
  }

  useEffect(() => {
    if (IS_MOCK) {
      const savedEmail = localStorage.getItem('mock_user')
      if (savedEmail && MOCK_USERS[savedEmail]) {
        const mockUser = MOCK_USERS[savedEmail]
        setUser({ id: mockUser.id, email: mockUser.email })
        setProfile(mockUser)
      }
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email, password, role, metadata = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role, ...metadata } },
    })
    if (error) throw error
    return data
  }

  const signIn = async (email, password) => {
    if (IS_MOCK) {
      const mockUser = MOCK_USERS[email]
      if (!mockUser || password !== 'password') throw new Error('Identifiants incorrects')
      localStorage.setItem('mock_user', email)
      setUser({ id: mockUser.id, email: mockUser.email })
      setProfile(mockUser)
      return
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  const signOut = async () => {
    if (IS_MOCK) {
      localStorage.removeItem('mock_user')
      setUser(null)
      setProfile(null)
      return
    }
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setUser(null)
    setProfile(null)
  }

  const resetPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) throw error
  }

  const updatePassword = async (newPassword) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) throw error
  }

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    fetchProfile,
    isClient: profile?.role === 'client',
    isAvocat: profile?.role === 'avocat',
    isAdmin: profile?.role === 'admin',
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
