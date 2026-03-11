import { useState } from 'react'
import {
  Bell,
  Plus,
  CalendarDays,
  Clock,
  AlertTriangle,
  TrendingUp,
  CheckCircle,
  Video,
  Building2,
  Home,
  ChevronDown,
} from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import appointmentsData from '../../data/mock/appointments.json'
import rdvConfig from '../../data/config/rdv-config.json'

const TYPE_ICONS = { en_ligne: Video, au_cabinet: Building2, a_domicile: Home }
const APPOINTMENTS = appointmentsData
const { stats } = rdvConfig

export default function LawyerAppointments() {
  const [activeTab, setActiveTab] = useState('a_venir')

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes Rendez-Vous</h1>
          <p className="text-sm text-gray-500 mt-0.5">Gérez vos consultations</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Bell className="h-5 w-5 text-gray-500" />
          </button>
          <button className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            <Plus className="h-4 w-4" />
            Nouveau Rendez-Vous
          </button>
        </div>
      </div>

      {/* ── Stats ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Stat 1 — Total */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total rendez-vous</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total.value}</p>
            <p className="text-xs text-green-600 font-medium mt-1">{stats.total.growth}</p>
          </div>
          <div className="p-3 bg-indigo-100 rounded-xl flex-shrink-0">
            <CalendarDays className="h-6 w-6 text-indigo-500" />
          </div>
        </div>

        {/* Stat 2 — Semaine */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">À venir cette semaine</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.semaine.value}</p>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <CalendarDays className="h-3 w-3" />
              {stats.semaine.today}
            </p>
          </div>
          <div className="p-3 bg-purple-100 rounded-xl flex-shrink-0">
            <Clock className="h-6 w-6 text-purple-500" />
          </div>
        </div>

        {/* Stat 3 — Taux */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total rendez-vous</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.taux.value}</p>
            <p className="text-xs text-green-600 font-medium mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {stats.taux.growth}
            </p>
          </div>
          <div className="p-3 bg-orange-100 rounded-xl flex-shrink-0">
            <AlertTriangle className="h-6 w-6 text-orange-500" />
          </div>
        </div>
      </div>

      {/* ── Filtres + Tableau ──────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-xl">
        {/* Barre de filtres */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3 border-b border-gray-100">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('a_venir')}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'a_venir'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              À venir
            </button>
            <button
              onClick={() => setActiveTab('passes')}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'passes'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              Passés
            </button>
          </div>

          <div className="flex flex-wrap gap-2 sm:ml-auto">
            {['Toutes les dates', 'Type de consultation', 'Tous les statuts'].map((label) => (
              <div key={label} className="relative">
                <select className="appearance-none text-sm text-gray-600 border border-gray-200 rounded-lg pl-3 pr-8 py-1.5 bg-white hover:bg-gray-50 cursor-pointer focus:outline-none focus:ring-1 focus:ring-gray-300">
                  <option>{label}</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
              </div>
            ))}
          </div>
        </div>

        {/* Tableau */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {['CLIENT', 'DATE', 'HEURE', 'TYPE', 'STATUT', 'ACTIONS'].map((col) => (
                  <th
                    key={col}
                    className="text-left text-xs font-semibold text-gray-400 tracking-wider px-4 py-3"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {APPOINTMENTS.map((apt) => {
                const typeConf = rdvConfig.types[apt.type]
                const statutConf = rdvConfig.statuts[apt.statut]
                const TypeIcon = TYPE_ICONS[apt.type]
                return (
                  <tr key={apt.id} className="hover:bg-gray-50 transition-colors">
                    {/* CLIENT */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full ${apt.client_color} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}
                        >
                          {apt.client_initials}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{apt.client_name}</p>
                          <p className="text-xs text-gray-400">{apt.subtitle}</p>
                        </div>
                      </div>
                    </td>

                    {/* DATE */}
                    <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                      {format(new Date(apt.date), 'dd MMMM yyyy', { locale: fr })}
                    </td>

                    {/* HEURE */}
                    <td className="px-4 py-3 text-sm text-gray-600">{apt.heure}</td>

                    {/* TYPE */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${typeConf.color}`}
                      >
                        {TypeIcon && <TypeIcon className="h-3 w-3" />}
                        {typeConf.label}
                      </span>
                    </td>

                    {/* STATUT */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${statutConf.color}`}
                      >
                        {apt.statut === 'confirme' && <CheckCircle className="h-3 w-3" />}
                        {statutConf.label}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-4">
                        <button className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                          Voir détails
                        </button>
                        {apt.statut !== 'annule' && (
                          <button className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors">
                            Annuler
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
