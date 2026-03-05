import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import {
  Calendar,
  ExternalLink,
  AlertCircle,
  Users,
  Briefcase,
  ArrowRight,
} from 'lucide-react'
import { CASE_STATUS_LABELS, CASE_STATUS_COLORS } from '../../lib/constants'
import rawCases    from '../../data/mock/cases.json'
import rawProfiles from '../../data/mock/profiles.json'

// Résolution des relations (client) — même logique que le mock Supabase
const MOCK_CASES = rawCases.map((c) => ({
  ...c,
  client: rawProfiles.find((p) => p.id === c.client_id) ?? null,
}))

const MOCK_STATS = {
  clients: new Set(rawCases.map((c) => c.client_id)).size,
  enCours: rawCases.filter((c) => c.statut === 'en_cours').length,
}

export default function LawyerAppointments() {
  const { profile } = useAuth()
  const calLink = profile?.cal_link || ''

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes Rendez-Vous</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Gérez vos disponibilités et suivez vos dossiers clients
          </p>
        </div>
        {calLink && (
          <button
            onClick={() => window.open(calLink, '_blank')}
            className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Calendar className="h-4 w-4" />
            Gérer mon calendrier
            <ExternalLink className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Alerte Cal.com non configuré */}
      {!calLink && (
        <div className="card border-amber-200 bg-amber-50">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-800">
                Calendrier Cal.com non configuré
              </p>
              <p className="text-sm text-amber-700 mt-0.5">
                Ajoutez votre lien Cal.com pour permettre à vos clients de prendre rendez-vous en ligne.
              </p>
            </div>
            <Link
              to="/avocat/availability"
              className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex-shrink-0"
            >
              Configurer
            </Link>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="card flex items-center gap-4">
          <div className="p-3 bg-primary-100 rounded-lg flex-shrink-0">
            <Users className="h-6 w-6 text-primary-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Clients actifs</p>
            <p className="text-2xl font-bold text-gray-900">{MOCK_STATS.clients}</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="p-3 bg-yellow-100 rounded-lg flex-shrink-0">
            <Briefcase className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Dossiers en cours</p>
            <p className="text-2xl font-bold text-gray-900">{MOCK_STATS.enCours}</p>
          </div>
        </div>
      </div>

      {/* Cal.com card si configuré */}
      {calLink && (
        <div className="card bg-gray-900 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="font-semibold">Votre calendrier Cal.com</p>
              <p className="text-gray-400 text-sm mt-0.5 truncate max-w-xs">{calLink}</p>
            </div>
            <button
              onClick={() => window.open(calLink, '_blank')}
              className="inline-flex items-center gap-2 bg-white text-gray-900 hover:bg-gray-100 text-sm font-medium px-4 py-2 rounded-lg transition-colors flex-shrink-0"
            >
              Ouvrir Cal.com
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Dossiers récents */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900">Dossiers récents</h2>
          <Link
            to="/avocat/cases"
            className="text-primary-500 hover:text-primary-600 text-sm font-medium flex items-center gap-1"
          >
            Tous les dossiers
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="divide-y divide-gray-100">
          {MOCK_CASES.map((c) => (
            <Link
              key={c.id}
              to={`/avocat/cases/${c.id}`}
              className="flex items-center justify-between py-3 hover:bg-gray-50 -mx-6 px-6 transition-colors"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900 truncate text-sm">{c.titre}</p>
                <p className="text-xs text-gray-500">
                  {c.client.prenom} {c.client.nom}
                  {c.updated_at && (
                    <span className="ml-2">
                      — {format(new Date(c.updated_at), 'dd MMM yyyy', { locale: fr })}
                    </span>
                  )}
                </p>
              </div>
              <span className={CASE_STATUS_COLORS[c.statut]}>
                {CASE_STATUS_LABELS[c.statut]}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
