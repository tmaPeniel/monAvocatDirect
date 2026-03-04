import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import {
  Calendar,
  Clock,
  AlertTriangle,
  Plus,
  Bell,
  ChevronDown,
  Eye,
  X,
  Video,
  Building,
  MapPin,
} from 'lucide-react'

const MOCK_APPOINTMENTS = [
  {
    id: '1',
    client_name: 'Sophie Martin',
    client_initials: 'SM',
    date: '2025-03-15',
    heure: '09:00',
    type: 'en_ligne',
    statut: 'confirme',
  },
  {
    id: '2',
    client_name: 'Jean Dupont',
    client_initials: 'JD',
    date: '2025-03-15',
    heure: '10:30',
    type: 'au_cabinet',
    statut: 'confirme',
  },
  {
    id: '3',
    client_name: 'Marie Lefevre',
    client_initials: 'ML',
    date: '2025-03-16',
    heure: '14:00',
    type: 'a_domicile',
    statut: 'confirme',
  },
  {
    id: '4',
    client_name: 'Pierre Moreau',
    client_initials: 'PM',
    date: '2025-03-17',
    heure: '11:00',
    type: 'en_ligne',
    statut: 'confirme',
  },
  {
    id: '5',
    client_name: 'Claire Bernard',
    client_initials: 'CB',
    date: '2025-03-18',
    heure: '09:30',
    type: 'au_cabinet',
    statut: 'confirme',
  },
]

const TYPE_CONFIG = {
  en_ligne: { label: 'En ligne', icon: Video, color: 'bg-blue-100 text-blue-700' },
  au_cabinet: { label: 'Au cabinet', icon: Building, color: 'bg-purple-100 text-purple-700' },
  a_domicile: { label: 'A domicile', icon: MapPin, color: 'bg-green-100 text-green-700' },
}

const STATUT_CONFIG = {
  confirme: { label: 'Confirme', color: 'bg-green-100 text-green-700' },
  en_attente: { label: 'En attente', color: 'bg-yellow-100 text-yellow-700' },
  annule: { label: 'Annule', color: 'bg-red-100 text-red-700' },
}

export default function LawyerAppointments() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS)
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('a_venir')
  const [dateFilter, setDateFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [statutFilter, setStatutFilter] = useState('')

  const stats = {
    total: 128,
    totalGrowth: '+11%',
    upcoming: 12,
    upcomingToday: 2,
    cancellationRate: '8%',
    cancellationGrowth: '1%',
  }

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
    toast.success('Rendez-vous annule')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes Rendez-Vous</h1>
          <p className="text-gray-500 text-sm mt-1">Gerez vos consultations</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
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

        {/* A venir */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500 font-medium">A venir cette semaine</span>
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.upcoming}</p>
          <p className="text-xs text-gray-500 mt-1">{stats.upcomingToday} aujourd'hui</p>
        </div>

        {/* Annulations */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500 font-medium">Taux d'annulation</span>
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.cancellationRate}</p>
          <p className="text-xs text-green-600 font-medium mt-1">{stats.cancellationGrowth} en augmentation</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* A venir / Passes toggle */}
        <div className="flex bg-gray-100 rounded-lg p-0.5">
          <button
            onClick={() => setFilter('a_venir')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'a_venir'
                ? 'bg-gray-900 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            A venir
          </button>
          <button
            onClick={() => setFilter('passes')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'passes'
                ? 'bg-gray-900 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Passes
          </button>
        </div>

        {/* Date filter */}
        <div className="relative">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg pl-3 pr-8 py-2 text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
          >
            <option value="">Toutes les dates</option>
            <option value="today">Aujourd'hui</option>
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>

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
            <option value="a_domicile">A domicile</option>
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
            <option value="confirme">Confirme</option>
            <option value="en_attente">En attente</option>
            <option value="annule">Annule</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
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
                <th className="text-right py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
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
                          <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 flex-shrink-0">
                            {apt.client_initials}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {apt.client_name}
                            </p>
                            <p className="text-xs text-gray-400">Consultation</p>
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
                          className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${statutConf.color}`}
                        >
                          {statutConf.label}
                        </span>
                      </td>
                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button className="text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1">
                            <Eye className="h-3.5 w-3.5" />
                            Voir details
                          </button>
                          {apt.statut !== 'annule' && (
                            <button
                              onClick={() => handleCancel(apt.id)}
                              className="text-xs font-medium text-red-600 hover:text-red-700 transition-colors flex items-center gap-1"
                            >
                              <X className="h-3.5 w-3.5" />
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
        </div>
      </div>
    </div>
  )
}
