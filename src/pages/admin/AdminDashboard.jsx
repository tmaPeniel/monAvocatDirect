import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { Users, Shield, Trash2, Search, UserCheck, UserX } from 'lucide-react'

export default function AdminDashboard() {
  const { profile } = useAuth()

  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    clients: 0,
    avocats: 0,
    dossiers: 0,
  })

  // ─── Fetch all users ───────────────────────────────────────────────
  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setUsers(data || [])
      setFilteredUsers(data || [])
    } catch (err) {
      toast.error('Erreur lors du chargement des utilisateurs')
      console.error(err)
    }
  }

  // ─── Fetch dashboard statistics ────────────────────────────────────
  const fetchStats = async () => {
    try {
      const [profilesRes, casesRes] = await Promise.all([
        supabase.from('profiles').select('role'),
        supabase.from('cases').select('id', { count: 'exact', head: true }),
      ])

      if (profilesRes.error) throw profilesRes.error

      const profiles = profilesRes.data || []

      setStats({
        totalUsers: profiles.length,
        clients: profiles.filter((p) => p.role === 'client').length,
        avocats: profiles.filter((p) => p.role === 'avocat').length,
        dossiers: casesRes.count || 0,
      })
    } catch (err) {
      toast.error('Erreur lors du chargement des statistiques')
      console.error(err)
    }
  }

  // ─── Initial data load ─────────────────────────────────────────────
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([fetchUsers(), fetchStats()])
      setLoading(false)
    }
    loadData()
  }, [])

  // ─── Search / filter ───────────────────────────────────────────────
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users)
      return
    }

    const q = searchQuery.toLowerCase()
    setFilteredUsers(
      users.filter(
        (u) =>
          (u.nom && u.nom.toLowerCase().includes(q)) ||
          (u.prenom && u.prenom.toLowerCase().includes(q)) ||
          (u.email && u.email.toLowerCase().includes(q))
      )
    )
  }, [searchQuery, users])

  // ─── Delete user ───────────────────────────────────────────────────
  const handleDeleteUser = async (userId, userName) => {
    const confirmed = window.confirm(
      `Êtes-vous sûr de vouloir supprimer l'utilisateur "${userName}" ? Cette action est irréversible.`
    )
    if (!confirmed) return

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId)

      if (error) throw error

      toast.success('Utilisateur supprimé avec succès')
      setUsers((prev) => prev.filter((u) => u.id !== userId))
      setStats((prev) => ({
        ...prev,
        totalUsers: prev.totalUsers - 1,
      }))
    } catch (err) {
      toast.error("Erreur lors de la suppression de l'utilisateur")
      console.error(err)
    }
  }

  // ─── Role badge helper ─────────────────────────────────────────────
  const roleBadge = (role) => {
    const config = {
      client: { label: 'Client', classes: 'bg-blue-100 text-blue-800' },
      avocat: { label: 'Avocat', classes: 'bg-green-100 text-green-800' },
      admin: { label: 'Admin', classes: 'bg-purple-100 text-purple-800' },
    }
    const c = config[role] || { label: role, classes: 'bg-gray-100 text-gray-800' }
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${c.classes}`}
      >
        {c.label}
      </span>
    )
  }

  // ─── Date formatter ────────────────────────────────────────────────
  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  // ─── Loading state ─────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  // ─── Render ────────────────────────────────────────────────────────
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Tableau de bord administrateur
        </h1>
        <p className="mt-1 text-gray-500">
          Bienvenue, {profile?.prenom || profile?.nom || 'Admin'}. Gérez les
          utilisateurs et consultez les statistiques de la plateforme.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card flex items-center gap-4">
          <div className="p-3 rounded-lg bg-primary-100">
            <Users className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total utilisateurs</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="p-3 rounded-lg bg-blue-100">
            <UserCheck className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Clients</p>
            <p className="text-2xl font-bold text-gray-900">{stats.clients}</p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="p-3 rounded-lg bg-green-100">
            <Shield className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Avocats</p>
            <p className="text-2xl font-bold text-gray-900">{stats.avocats}</p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="p-3 rounded-lg bg-yellow-100">
            <UserX className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Dossiers</p>
            <p className="text-2xl font-bold text-gray-900">{stats.dossiers}</p>
          </div>
        </div>
      </div>

      {/* Users section */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Gestion des utilisateurs
          </h2>

          {/* Search bar */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>

        {/* Users table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-3 text-sm font-medium text-gray-500">Nom</th>
                <th className="pb-3 text-sm font-medium text-gray-500">Email</th>
                <th className="pb-3 text-sm font-medium text-gray-500">Rôle</th>
                <th className="pb-3 text-sm font-medium text-gray-500">
                  Date inscription
                </th>
                <th className="pb-3 text-sm font-medium text-gray-500 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 text-center text-gray-400"
                  >
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 text-sm font-medium text-gray-900">
                      {u.prenom && u.nom
                        ? `${u.prenom} ${u.nom}`
                        : u.nom || '—'}
                    </td>
                    <td className="py-4 text-sm text-gray-600">{u.email}</td>
                    <td className="py-4">{roleBadge(u.role)}</td>
                    <td className="py-4 text-sm text-gray-500">
                      {formatDate(u.created_at)}
                    </td>
                    <td className="py-4 text-right">
                      <button
                        onClick={() =>
                          handleDeleteUser(
                            u.id,
                            u.prenom && u.nom
                              ? `${u.prenom} ${u.nom}`
                              : u.email
                          )
                        }
                        className="btn-danger inline-flex items-center gap-1.5 text-sm"
                        title="Supprimer l'utilisateur"
                      >
                        <Trash2 className="h-4 w-4" />
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Result count */}
        {filteredUsers.length > 0 && (
          <p className="mt-4 text-sm text-gray-400">
            {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''}{' '}
            affiché{filteredUsers.length > 1 ? 's' : ''}
          </p>
        )}
      </div>
    </div>
  )
}
