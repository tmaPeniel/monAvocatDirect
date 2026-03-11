import { useState } from 'react'
import { Plus, CalendarDays, Clock, MapPin, Pencil, Info, ChevronRight } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import appointmentsData from '../../data/mock/client-appointments.json'

const TABS = [
  { key: 'tous',    label: 'Tous' },
  { key: 'a_venir', label: 'À venir' },
  { key: 'passes',  label: 'Passés' },
  { key: 'annules', label: 'Annulés' },
]

export default function ClientAppointments() {
  const [activeTab, setActiveTab] = useState('tous')

  const filtered = activeTab === 'tous'
    ? appointmentsData
    : appointmentsData.filter((r) => r.statut === activeTab)

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes Rendez-Vous</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Gérez vos consultations avec vos avocats.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          <Plus className="h-4 w-4" />
          Nouveau Rendez-Vous
        </button>
      </div>

      {/* ── Tabs ───────────────────────────────────────────────── */}
      <div className="flex gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              activeTab === tab.key
                ? 'bg-gray-900 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Cards ──────────────────────────────────────────────── */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-400 text-sm">
            Aucun rendez-vous dans cette catégorie.
          </div>
        ) : (
          filtered.map((rdv) => (
            <div
              key={rdv.id}
              className="bg-white border border-gray-200 rounded-xl p-4 flex items-start gap-4"
            >
              {/* Avatar */}
              <div
                className={`w-12 h-12 rounded-full ${rdv.avocat_color} flex items-center justify-center text-sm font-bold text-white flex-shrink-0`}
              >
                {rdv.avocat_initials}
              </div>

              {/* Contenu central */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900">{rdv.titre}</p>
                <p className="text-sm text-gray-700 mt-0.5">{rdv.avocat_name}</p>
                <p className="text-xs text-gray-500">{rdv.avocat_specialite}</p>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {format(new Date(rdv.date), 'dd.MM.yyyy', { locale: fr })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {rdv.heure}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {rdv.lieu}
                  </span>
                  <button className="flex items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors">
                    <Pencil className="h-3 w-3" />
                    Modifier
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 flex-shrink-0">
                {rdv.statut === 'confirme' ? (
                  <button className="text-xs font-medium px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                    Annuler
                  </button>
                ) : (
                  <button className="text-xs font-medium px-3 py-1.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                    Nouveau RDV
                  </button>
                )}
                <button className="text-xs font-medium px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                  Contacter
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Bannière aide ───────────────────────────────────────── */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-blue-900">
            Besoin d'aide pour prendre Rendez-Vous ?
          </p>
          <p className="text-xs text-blue-700 mt-0.5">
            Notre équipe dédiée peut vous assister pour prendre vos rendez-vous juridiques.
          </p>
          <button className="mt-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 transition-colors">
            Contacter le support
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  )
}
