import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, FolderOpen, ChevronRight } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import {
  CASE_STATUS_LABELS,
  CASE_STATUS_COLORS,
} from '../../lib/constants'

const STATUS_TABS = [
  { key: 'tous', label: 'Tous' },
  { key: 'en_attente', label: 'En attente' },
  { key: 'en_cours', label: 'En cours' },
  { key: 'termine', label: 'Termine' },
]

export default function ClientCases() {
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
      setLoading(true)

      const { data, error } = await supabase
        .from('cases')
        .select('*, avocat:avocat_id(id, nom, prenom, specialite)')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setCases(data || [])
    } catch (error) {
      console.error('Error fetching cases:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCases =
    activeTab === 'tous'
      ? cases
      : cases.filter((c) => c.statut === activeTab)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Mes dossiers</h1>
        <Link
          to="/client/cases/new"
          className="btn-primary inline-flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Nouveau dossier</span>
        </Link>
      </div>

      {/* Status Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              {tab.key === 'tous' && (
                <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                  {cases.length}
                </span>
              )}
              {tab.key !== 'tous' && (
                <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                  {cases.filter((c) => c.statut === tab.key).length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Cases List */}
      {filteredCases.length === 0 ? (
        <div className="card text-center py-12">
          <FolderOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun dossier
          </h3>
          <p className="text-gray-500 mb-6">
            {activeTab === 'tous'
              ? "Vous n'avez pas encore de dossier. Commencez par en creer un."
              : "Aucun dossier avec le statut selectionne."}
          </p>
          {activeTab === 'tous' && (
            <Link
              to="/client/cases/new"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Creer un dossier</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Titre
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Avocat
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Date de creation
                </th>
                <th className="py-3 px-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCases.map((caseItem) => (
                <tr
                  key={caseItem.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-6">
                    <Link
                      to={`/client/cases/${caseItem.id}`}
                      className="text-sm font-medium text-gray-900 hover:text-primary-600"
                    >
                      {caseItem.titre}
                    </Link>
                  </td>
                  <td className="py-4 px-6">
                    <span className={CASE_STATUS_COLORS[caseItem.statut]}>
                      {CASE_STATUS_LABELS[caseItem.statut]}
                    </span>
                  </td>
                  <td className="py-4 px-6 hidden md:table-cell">
                    <span className="text-sm text-gray-600">
                      {caseItem.avocat?.prenom ? `${caseItem.avocat.prenom} ${caseItem.avocat.nom || ''}` : 'Non assigne'}
                    </span>
                  </td>
                  <td className="py-4 px-6 hidden sm:table-cell">
                    <span className="text-sm text-gray-500">
                      {format(
                        new Date(caseItem.created_at),
                        'dd MMM yyyy',
                        { locale: fr }
                      )}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Link
                      to={`/client/cases/${caseItem.id}`}
                      className="text-gray-400 hover:text-primary-500"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
