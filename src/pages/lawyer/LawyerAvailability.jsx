import { useState } from 'react'
import toast from 'react-hot-toast'
import { ExternalLink, Calendar, Save, Info } from 'lucide-react'
import availabilityData from '../../data/config/availability.json'

const DAYS  = availabilityData.days
const SLOTS = availabilityData.slots

const defaultSchedule = () =>
  Object.fromEntries(
    DAYS.map((d) => [d.key, Object.fromEntries(SLOTS.map((s) => [s.key, false]))])
  )

export default function LawyerAvailability() {
  const [calLink, setCalLink] = useState('')
  const [schedule, setSchedule] = useState(defaultSchedule())
  const [saving, setSaving] = useState(false)
  const [savingSchedule, setSavingSchedule] = useState(false)

  const handleSaveCalLink = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      toast.success('Lien Cal.com sauvegardé')
    }, 400)
  }

  const handleToggle = (dayKey, slotKey) => {
    setSchedule((prev) => ({
      ...prev,
      [dayKey]: { ...prev[dayKey], [slotKey]: !prev[dayKey][slotKey] },
    }))
  }

  const handleSaveSchedule = () => {
    setSavingSchedule(true)
    setTimeout(() => {
      setSavingSchedule(false)
      toast.success('Horaires sauvegardés')
    }, 400)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Disponibilités</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Gérez votre calendrier et vos horaires de consultation
        </p>
      </div>

      {/* Section 1 — Cal.com */}
      <div className="card space-y-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary-500" />
          <h2 className="text-base font-semibold text-gray-900">Intégration Cal.com</h2>
        </div>

        <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 flex items-start gap-3">
          <Info className="h-5 w-5 text-primary-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-primary-700">
            <p className="font-semibold">Comment configurer Cal.com ?</p>
            <ol className="mt-1 space-y-0.5 list-decimal list-inside text-primary-600">
              <li>Créez un compte gratuit sur <strong>cal.com</strong></li>
              <li>Configurez vos créneaux disponibles dans votre tableau de bord Cal.com</li>
              <li>Copiez votre lien de réservation (ex : https://cal.com/votre-nom)</li>
              <li>Collez-le dans le champ ci-dessous et sauvegardez</li>
            </ol>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="url"
            value={calLink}
            onChange={(e) => setCalLink(e.target.value)}
            placeholder="https://cal.com/votre-nom"
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSaveCalLink}
              disabled={saving}
              className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-200 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors flex-shrink-0"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
            {calLink && (
              <button
                onClick={() => window.open(calLink, '_blank')}
                className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors flex-shrink-0"
              >
                Ouvrir
                <ExternalLink className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Section 2 — Horaires indicatifs */}
      <div className="card space-y-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Horaires indicatifs</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Ces horaires sont affichés sur votre profil public pour informer les clients de vos disponibilités habituelles.
          </p>
        </div>

        {/* Grille */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left py-2 pr-4 font-medium text-gray-600 w-28">Jour</th>
                {SLOTS.map((s) => (
                  <th key={s.key} className="text-center px-3 py-2 font-medium text-gray-600">
                    <span className="block">{s.label}</span>
                    <span className="text-xs text-gray-400 font-normal">{s.sub}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {DAYS.map((day) => (
                <tr key={day.key} className="hover:bg-gray-50">
                  <td className="py-3 pr-4 font-medium text-gray-700">{day.label}</td>
                  {SLOTS.map((slot) => {
                    const active = schedule[day.key]?.[slot.key]
                    return (
                      <td key={slot.key} className="text-center px-3 py-3">
                        <button
                          onClick={() => handleToggle(day.key, slot.key)}
                          className={`w-8 h-8 rounded-lg border-2 transition-colors mx-auto flex items-center justify-center ${
                            active
                              ? 'bg-primary-500 border-primary-500 text-white'
                              : 'border-gray-200 text-gray-300 hover:border-gray-300'
                          }`}
                          title={active ? 'Disponible' : 'Non disponible'}
                        >
                          {active ? '✓' : ''}
                        </button>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleSaveSchedule}
            disabled={savingSchedule}
            className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-200 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            <Save className="h-4 w-4" />
            {savingSchedule ? 'Sauvegarde...' : 'Sauvegarder les horaires'}
          </button>
        </div>
      </div>
    </div>
  )
}
