import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import {
  Users,
  Shield,
  Trash2,
  Search,
  UserCheck,
  Briefcase,
  FileText,
  TrendingUp,
  Clock,
  Home,
} from 'lucide-react'

// ─── Helpers ────────────────────────────────────────────────────────────────
const roleBadge = (role) => {
  const config = {
    client: { label: 'Client', classes: 'bg-primary-100 text-primary-700' },
    avocat: { label: 'Avocat', classes: 'bg-green-100 text-green-800' },
    admin:  { label: 'Admin',  classes: 'bg-gray-100 text-gray-700' },
  }
  const c = config[role] || { label: role, classes: 'bg-gray-100 text-gray-700' }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${c.classes}`}>
      {c.label}
    </span>
  )
}

const caseStatusBadge = (statut) => {
  const config = {
    en_attente: { label: 'En attente', classes: 'bg-yellow-100 text-yellow-700' },
    en_cours:   { label: 'En cours',   classes: 'bg-primary-100 text-primary-600' },
    termine:    { label: 'Terminé',    classes: 'bg-green-100 text-green-700' },
  }
  const c = config[statut] || { label: statut, classes: 'bg-gray-100 text-gray-700' }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${c.classes}`}>
      {c.label}
    </span>
  )
}

const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return format(new Date(dateStr), 'dd MMM yyyy', { locale: fr })
}

// ─── Component ──────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { profile } = useAuth()

  const [users, setUsers]                 = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [recentCases, setRecentCases]     = useState([])
  const [searchQuery, setSearchQuery]     = useState('')
  const [loading, setLoading]             = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    clients:    0,
    avocats:    0,
    dossiers:   0,
    documents:  0,
    admins:     0,
  })

  // ─── Fetch ────────────────────────────────────────────────────────────────
  const fetchData = async () => {
    try {
      const [profilesRes, casesRes, docsRes] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase
          .from('cases')
          .select('*, client:client_id(nom, prenom), avocat:avocat_id(nom, prenom)')
          .order('created_at', { ascending: false }),
        supabase.from('documents').select('id', { count: 'exact', head: true }),
      ])

      if (profilesRes.error) throw profilesRes.error
      if (casesRes.error) throw casesRes.error

      const profiles = profilesRes.data || []
      const cases    = casesRes.data    || []

      setUsers(profiles)
      setFilteredUsers(profiles)
      setRecentCases(cases.slice(0, 5))

      setStats({
        totalUsers: profiles.length,
        clients:    profiles.filter((p) => p.role === 'client').length,
        avocats:    profiles.filter((p) => p.role === 'avocat').length,
        admins:     profiles.filter((p) => p.role === 'admin').length,
        dossiers:   cases.length,
        documents:  docsRes.count || 0,
      })
    } catch (err) {
      toast.error('Erreur lors du chargement des données')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  // ─── Search ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users)
      return
    }
    const q = searchQuery.toLowerCase()
    setFilteredUsers(
      users.filter(
        (u) =>
          (u.nom    && u.nom.toLowerCase().includes(q))    ||
          (u.prenom && u.prenom.toLowerCase().includes(q)) ||
          (u.email  && u.email.toLowerCase().includes(q))
      )
    )
  }, [searchQuery, users])

  // ─── Delete ───────────────────────────────────────────────────────────────
  const handleDeleteUser = async (userId, userName) => {
    const confirmed = window.confirm(
      `Supprimer l'utilisateur "${userName}" ? Cette action est irréversible.`
    )
    if (!confirmed) return

    try {
      const { error } = await supabase.from('profiles').delete().eq('id', userId)
      if (error) throw error

      toast.success('Utilisateur supprimé')
      setUsers((prev) => prev.filter((u) => u.id !== userId))
      setStats((prev) => ({ ...prev, totalUsers: prev.totalUsers - 1 }))
    } catch (err) {
      toast.error('Erreur lors de la suppression')
      console.error(err)
    }
  }

  // ─── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
      </div>
    )
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-500 text-sm mt-1">
            Bienvenue, {profile?.prenom || 'Admin'}. Vue d'ensemble de la plateforme.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs text-gray-400">
          <Clock className="h-3.5 w-3.5" />
          Mis à jour à l'instant
        </span>
      </div>

      {/* ── Stats cards ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="card flex items-center gap-4">
          <div className="p-3 rounded-lg bg-primary-100 flex-shrink-0">
            <Users className="h-6 w-6 text-primary-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Total utilisateurs</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="p-3 rounded-lg bg-primary-100 flex-shrink-0">
            <UserCheck className="h-6 w-6 text-primary-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Clients</p>
            <p className="text-2xl font-bold text-gray-900">{stats.clients}</p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="p-3 rounded-lg bg-green-100 flex-shrink-0">
            <Shield className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Avocats</p>
            <p className="text-2xl font-bold text-gray-900">{stats.avocats}</p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="p-3 rounded-lg bg-yellow-100 flex-shrink-0">
            <Briefcase className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Dossiers</p>
            <p className="text-2xl font-bold text-gray-900">{stats.dossiers}</p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="p-3 rounded-lg bg-purple-100 flex-shrink-0">
            <FileText className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Documents</p>
            <p className="text-2xl font-bold text-gray-900">{stats.documents}</p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="p-3 rounded-lg bg-orange-100 flex-shrink-0">
            <TrendingUp className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Dossiers / Avocat</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.avocats > 0 ? (stats.dossiers / stats.avocats).toFixed(1) : '—'}
            </p>
          </div>
        </div>
      </div>

      {/* ── Activité récente ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Derniers inscrits */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">Derniers inscrits</h2>
            <span className="text-xs text-gray-400">{users.length} au total</span>
          </div>
          <div className="space-y-3">
            {users.slice(0, 5).map((u) => (
              <div key={u.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 flex-shrink-0">
                  {(u.prenom?.charAt(0) || u.email?.charAt(0) || '?').toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {u.prenom && u.nom ? `${u.prenom} ${u.nom}` : u.email}
                  </p>
                  <p className="text-xs text-gray-400">{formatDate(u.created_at)}</p>
                </div>
                {roleBadge(u.role)}
              </div>
            ))}
            {users.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">Aucun utilisateur</p>
            )}
          </div>
        </div>

        {/* Derniers dossiers */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">Derniers dossiers</h2>
            <span className="text-xs text-gray-400">{stats.dossiers} au total</span>
          </div>
          <div className="space-y-3">
            {recentCases.map((c) => (
              <div key={c.id} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Briefcase className="h-4 w-4 text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{c.titre}</p>
                  <p className="text-xs text-gray-400">
                    {c.client?.prenom} {c.client?.nom}
                    {c.avocat?.nom && ` → Me ${c.avocat.prenom} ${c.avocat.nom}`}
                  </p>
                  <p className="text-xs text-gray-400">{formatDate(c.created_at)}</p>
                </div>
                {caseStatusBadge(c.statut)}
              </div>
            ))}
            {recentCases.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">Aucun dossier</p>
            )}
          </div>
        </div>
      </div>

      {/* ── Gestion des utilisateurs ─────────────────────────────────────── */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-base font-semibold text-gray-900">
            Gestion des utilisateurs
          </h2>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Utilisateur</th>
                <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</th>
                <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Rôle</th>
                <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Inscription</th>
                <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-400 text-sm">
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 flex-shrink-0">
                          {(u.prenom?.charAt(0) || u.email?.charAt(0) || '?').toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {u.prenom && u.nom ? `${u.prenom} ${u.nom}` : u.nom || '—'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{u.email}</td>
                    <td className="py-3 px-4">{roleBadge(u.role)}</td>
                    <td className="py-3 px-4 text-sm text-gray-500 hidden sm:table-cell">
                      {formatDate(u.created_at)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() =>
                          handleDeleteUser(
                            u.id,
                            u.prenom && u.nom ? `${u.prenom} ${u.nom}` : u.email
                          )
                        }
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-500 hover:text-primary-600 hover:bg-primary-50 transition-colors px-2 py-1 rounded"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredUsers.length > 0 && (
          <p className="mt-4 text-xs text-gray-400">
            {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''}{' '}
            affiché{filteredUsers.length > 1 ? 's' : ''}
          </p>
        )}
      </div>
    </div>
  )
}
