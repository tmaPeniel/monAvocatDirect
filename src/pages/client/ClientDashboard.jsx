import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FolderOpen, CheckCircle, FileText, Plus, Search } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { CASE_STATUS_LABELS, CASE_STATUS_COLORS } from '../../lib/constants'

export default function ClientDashboard() {
  const { user, profile } = useAuth()
  const [cases, setCases] = useState([])
  const [stats, setStats] = useState({
    enCours: 0,
    termines: 0,
    documents: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Fetch all cases for the client
      const { data: casesData, error: casesError } = await supabase
        .from('cases')
        .select('*, avocat:avocat_id(id, nom, prenom, specialite)')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false })

      if (casesError) throw casesError

      const allCases = casesData || []
      setCases(allCases.slice(0, 5))

      // Calculate stats
      const enCours = allCases.filter(
        (c) => c.statut === 'en_attente' || c.statut === 'en_cours'
      ).length
      const termines = allCases.filter((c) => c.statut === 'termine').length

      // Count documents
      const { count: documentsCount, error: docsError } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true })
        .in(
          'case_id',
          allCases.map((c) => c.id)
        )

      if (docsError) throw docsError

      setStats({
        enCours,
        termines,
        documents: documentsCount || 0,
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Message */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bienvenue, {profile?.prenom ? `${profile.prenom} ${profile.nom || ''}` : 'Client'}
        </h1>
        <p className="text-gray-600 mt-1">
          Voici un apercu de vos dossiers et activites.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card flex items-center space-x-4">
          <div className="p-3 bg-primary-100 rounded-lg">
            <FolderOpen className="h-6 w-6 text-primary-500" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Dossiers en cours</p>
            <p className="text-2xl font-bold text-gray-900">{stats.enCours}</p>
          </div>
        </div>

        <div className="card flex items-center space-x-4">
          <div className="p-3 bg-green-100 rounded-lg">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Dossiers termines</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.termines}
            </p>
          </div>
        </div>

        <div className="card flex items-center space-x-4">
          <div className="p-3 bg-purple-100 rounded-lg">
            <FileText className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Documents</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.documents}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <Link to="/client/cases/new" className="btn-primary inline-flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Nouveau dossier</span>
        </Link>
        <Link to="/search" className="btn-secondary inline-flex items-center space-x-2">
          <Search className="h-5 w-5" />
          <span>Rechercher un avocat</span>
        </Link>
      </div>

      {/* Recent Cases */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Dossiers recents
          </h2>
          <Link
            to="/client/cases"
            className="text-primary-500 hover:text-primary-600 text-sm font-medium"
          >
            Voir tous les dossiers
          </Link>
        </div>

        {cases.length === 0 ? (
          <div className="text-center py-8">
            <FolderOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Aucun dossier pour le moment.</p>
            <Link
              to="/client/cases/new"
              className="text-primary-500 hover:text-primary-600 text-sm font-medium mt-2 inline-block"
            >
              Creer votre premier dossier
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {cases.map((caseItem) => (
              <Link
                key={caseItem.id}
                to={`/client/cases/${caseItem.id}`}
                className="block p-4 rounded-lg border border-gray-100 hover:border-primary-200 hover:bg-primary-50/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {caseItem.titre}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {caseItem.avocat?.prenom
                        ? `Avocat: ${caseItem.avocat.prenom} ${caseItem.avocat.nom || ''}`
                        : 'Aucun avocat assigne'}
                      {' - '}
                      {format(new Date(caseItem.created_at), 'dd MMM yyyy', {
                        locale: fr,
                      })}
                    </p>
                  </div>
                  <span className={CASE_STATUS_COLORS[caseItem.statut]}>
                    {CASE_STATUS_LABELS[caseItem.statut]}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
