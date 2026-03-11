<<<<<<< HEAD
import { useState } from 'react'
import toast from 'react-hot-toast'
=======
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
>>>>>>> c154d666e31668f2151903b2ae61c4263f9f7a1e
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import {
  Calendar,
<<<<<<< HEAD
  Clock,
  AlertTriangle,
  Plus,
  Bell,
  ChevronDown,
  Video,
  Building,
  MapPin,
  CheckCircle,
  TrendingUp,
} from 'lucide-react'
import appointmentsData from '../../data/mock/appointments.json'
import rdvConfig from '../../data/config/rdv-config.json'

const TYPE_ICONS = { en_ligne: Video, au_cabinet: Building, a_domicile: MapPin }

const TYPE_CONFIG = Object.fromEntries(
  Object.entries(rdvConfig.types).map(([k, v]) => [k, { ...v, icon: TYPE_ICONS[k] }])
)
const STATUT_CONFIG = rdvConfig.statuts

const stats = {
  total: 128,
  totalGrowth: '+11%',
  upcoming: 12,
  upcomingToday: 2,
  cancellationRate: '8%',
  cancellationGrowth: '1%',
}

export default function LawyerAppointments() {
  const [appointments, setAppointments] = useState(appointmentsData)
  const [filter, setFilter] = useState('a_venir')
  const [dateFilter, setDateFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [statutFilter, setStatutFilter] = useState('')

  const filteredAppointments = appointments.filter((apt) => {
    if (typeFilter && apt.type !== typeFilter) return false
    if (statutFilter && apt.statut !== statutFilter) return false
    return true
  })

  const handleCancel = (id) => {
    if (!confirm('Annuler ce rendez-vous ?')) return
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, statut: 'annule' } : a))
    )
    toast.success('Rendez-vous annulé')
  }
=======
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
>>>>>>> c154d666e31668f2151903b2ae61c4263f9f7a1e

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes Rendez-Vous</h1>
<<<<<<< HEAD
          <p className="text-gray-500 text-sm mt-1">Gérez vos consultations</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <button className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouveau Rendez-Vous
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500 font-medium">Total rendez-vous</span>
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-xs text-green-600 font-medium mt-1">{stats.totalGrowth} ce mois</p>
        </div>

        {/* À venir */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500 font-medium">À venir cette semaine</span>
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.upcoming}</p>
          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {stats.upcomingToday} aujourd'hui
          </p>
        </div>

        {/* Taux d'annulation */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500 font-medium">Total rendez-vous</span>
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.cancellationRate}</p>
          <p className="text-xs text-green-600 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            {stats.cancellationGrowth} en augmentation
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* À venir / Passés toggle */}
        <div className="flex bg-gray-100 rounded-lg p-0.5">
=======
          <p className="text-gray-500 mt-1 text-sm">
            Gérez vos disponibilités et suivez vos dossiers clients
          </p>
        </div>
        {calLink && (
>>>>>>> c154d666e31668f2151903b2ae61c4263f9f7a1e
          <button
            onClick={() => window.open(calLink, '_blank')}
            className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
<<<<<<< HEAD
            À venir
          </button>
          <button
            onClick={() => setFilter('passes')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'passes'
                ? 'bg-gray-900 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Passés
          </button>
        </div>
=======
            <Calendar className="h-4 w-4" />
            Gérer mon calendrier
            <ExternalLink className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
>>>>>>> c154d666e31668f2151903b2ae61c4263f9f7a1e

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

<<<<<<< HEAD
        {/* Type filter */}
        <div className="relative">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg pl-3 pr-8 py-2 text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
          >
            <option value="">Type de consultation</option>
            <option value="en_ligne">En ligne</option>
            <option value="au_cabinet">Au cabinet</option>
            <option value="a_domicile">À domicile</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Statut filter */}
        <div className="relative">
          <select
            value={statutFilter}
            onChange={(e) => setStatutFilter(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg pl-3 pr-8 py-2 text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
          >
            <option value="">Tous les statuts</option>
            <option value="confirme">Confirmé</option>
            <option value="en_attente">En attente</option>
            <option value="annule">Annulé</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Heure
                </th>
                <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    <Calendar className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                    <p className="font-medium">Aucun rendez-vous</p>
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((apt) => {
                  const typeConf = TYPE_CONFIG[apt.type] || TYPE_CONFIG.en_ligne
                  const statutConf = STATUT_CONFIG[apt.statut] || STATUT_CONFIG.confirme
                  const TypeIcon = typeConf.icon

                  return (
                    <tr key={apt.id} className="hover:bg-gray-50 transition-colors">
                      {/* Client */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full ${apt.client_color} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}
                          >
                            {apt.client_initials}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {apt.client_name}
                            </p>
                            <p className="text-xs text-gray-400">{apt.subtitle}</p>
                          </div>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-5">
                        <span className="text-sm text-gray-700">
                          {format(new Date(apt.date), 'dd MMM yyyy', { locale: fr })}
                        </span>
                      </td>

                      {/* Heure */}
                      <td className="py-4 px-5">
                        <span className="text-sm text-gray-700">{apt.heure}</span>
                      </td>

                      {/* Type */}
                      <td className="py-4 px-5">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${typeConf.color}`}
                        >
                          <TypeIcon className="h-3 w-3" />
                          {typeConf.label}
                        </span>
                      </td>

                      {/* Statut */}
                      <td className="py-4 px-5">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${statutConf.color}`}
                        >
                          {apt.statut === 'confirme' && <CheckCircle className="h-3 w-3" />}
                          {statutConf.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-4">
                          <button className="text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors">
                            Voir détails
                          </button>
                          {apt.statut !== 'annule' && (
                            <button
                              onClick={() => handleCancel(apt.id)}
                              className="text-xs font-medium text-red-600 hover:text-red-700 transition-colors"
                            >
                              Annuler
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
=======
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
>>>>>>> c154d666e31668f2151903b2ae61c4263f9f7a1e
        </div>
      </div>
    </div>
  )
}
