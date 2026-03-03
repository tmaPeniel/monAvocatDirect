import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { CASE_STATUS, CASE_STATUS_LABELS, CASE_STATUS_COLORS } from '../../lib/constants'
import { Briefcase, Search } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const TABS = [
  { key: 'tous', label: 'Tous' },
  { key: CASE_STATUS.EN_ATTENTE, label: 'En attente' },
  { key: CASE_STATUS.EN_COURS, label: 'En cours' },
  { key: CASE_STATUS.TERMINE, label: 'Termine' },
]

export default function LawyerCases() {
  const { user } = useAuth()
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('tous')

  useEffect(() => {
    if (user) {
      fetchCases()
    }
  }, [user])

  const fetchCases = async () => {
    try {
      const { data, error } = await supabase
        .from('cases')
        .select('*, client:profiles!cases_client_id_fkey(nom, prenom, email)')
        .eq('avocat_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setCases(data || [])
    } catch (error) {
      console.error('Erreur lors du chargement des dossiers:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCases =
    activeTab === 'tous' ? cases : cases.filter((c) => c.statut === activeTab)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mes dossiers</h1>
        <p className="text-gray-500 mt-1">Gerez l'ensemble de vos dossiers clients</p>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.key
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.label}
            {tab.key === 'tous' ? (
              <span className="ml-1.5 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {cases.length}
              </span>
            ) : (
              <span className="ml-1.5 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {cases.filter((c) => c.statut === tab.key).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Cases list */}
      {filteredCases.length === 0 ? (
        <div className="card text-center py-12">
          <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun dossier</h3>
          <p className="text-gray-500">
            {activeTab === 'tous'
              ? "Vous n'avez pas encore de dossier."
              : `Aucun dossier avec le statut "${CASE_STATUS_LABELS[activeTab] || activeTab}".`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCases.map((caseItem) => (
            <Link
              key={caseItem.id}
              to={`/avocat/cases/${caseItem.id}`}
              className="card block hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {caseItem.titre}
                    </h3>
                    <span className={CASE_STATUS_COLORS[caseItem.statut]}>
                      {CASE_STATUS_LABELS[caseItem.statut]}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1">
                    <p className="text-sm text-gray-500">
                      Client : {caseItem.client?.prenom} {caseItem.client?.nom}
                    </p>
                    {caseItem.created_at && (
                      <p className="text-sm text-gray-400">
                        {format(new Date(caseItem.created_at), 'dd MMMM yyyy', { locale: fr })}
                      </p>
                    )}
                  </div>
                </div>
                <svg
                  className="h-5 w-5 text-gray-400 flex-shrink-0 ml-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
