import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { CASE_STATUS, CASE_STATUS_LABELS, CASE_STATUS_COLORS } from '../../lib/constants'
import { Briefcase, Clock, CheckCircle, Users, AlertCircle, ArrowRight } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function LawyerDashboard() {
  const { user, profile } = useAuth()
  const [cases, setCases] = useState([])
  const [stats, setStats] = useState({
    enAttente: 0,
    enCours: 0,
    termine: 0,
    totalClients: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      const { data: allCases, error } = await supabase
        .from('cases')
        .select('*, client:profiles!cases_client_id_fkey(nom, prenom, email)')
        .eq('avocat_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      const casesData = allCases || []
      setCases(casesData.slice(0, 5))

      const uniqueClients = new Set(casesData.map((c) => c.client_id))

      setStats({
        enAttente: casesData.filter((c) => c.statut === CASE_STATUS.EN_ATTENTE).length,
        enCours: casesData.filter((c) => c.statut === CASE_STATUS.EN_COURS).length,
        termine: casesData.filter((c) => c.statut === CASE_STATUS.TERMINE).length,
        totalClients: uniqueClients.size,
      })
    } catch (error) {
      console.error('Erreur lors du chargement du tableau de bord:', error)
    } finally {
      setLoading(false)
    }
  }

  const profileIncomplete = !profile?.specialite || !profile?.ville

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bienvenue, Me {profile?.prenom} {profile?.nom}
        </h1>
        <p className="text-gray-500 mt-1">Voici un apercu de votre activite</p>
      </div>

      {/* Profile incomplete alert */}
      {profileIncomplete && (
        <div className="card border-yellow-200 bg-yellow-50">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-800">
                Votre profil est incomplet
              </p>
              <p className="text-sm text-yellow-700 mt-0.5">
                Ajoutez votre specialite et votre ville pour apparaitre dans les resultats de recherche.
              </p>
            </div>
            <Link to="/avocat/profile" className="btn-primary text-sm px-4 py-2">
              Completer mon profil
            </Link>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Dossiers en attente</p>
              <p className="text-2xl font-bold text-gray-900">{stats.enAttente}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-100 rounded-lg">
              <Briefcase className="h-6 w-6 text-primary-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Dossiers en cours</p>
              <p className="text-2xl font-bold text-gray-900">{stats.enCours}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Dossiers termines</p>
              <p className="text-2xl font-bold text-gray-900">{stats.termine}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total clients</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalClients}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent cases */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Dossiers recents</h2>
          <Link
            to="/avocat/cases"
            className="text-primary-500 hover:text-primary-600 text-sm font-medium flex items-center gap-1"
          >
            Voir tous les dossiers
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {cases.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Aucun dossier pour le moment</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {cases.map((caseItem) => (
              <Link
                key={caseItem.id}
                to={`/avocat/cases/${caseItem.id}`}
                className="flex items-center justify-between py-3 hover:bg-gray-50 -mx-6 px-6 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 truncate">{caseItem.titre}</p>
                  <p className="text-sm text-gray-500">
                    {caseItem.client?.prenom} {caseItem.client?.nom}
                    {caseItem.created_at && (
                      <span className="ml-2">
                        — {format(new Date(caseItem.created_at), 'dd MMM yyyy', { locale: fr })}
                      </span>
                    )}
                  </p>
                </div>
                <span className={CASE_STATUS_COLORS[caseItem.statut]}>
                  {CASE_STATUS_LABELS[caseItem.statut]}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
