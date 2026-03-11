import { Link } from 'react-router-dom'
import { Calendar, ExternalLink, MessageSquare, Info, Search, AlertCircle } from 'lucide-react'
import mockLawyers from '../../data/mock/lawyers.json'

const MOCK_LAWYERS = mockLawyers

export default function ClientAppointments() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes Rendez-Vous</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Prenez rendez-vous directement avec vos avocats via Cal.com
          </p>
        </div>
        <Link to="/search" className="btn-primary inline-flex items-center gap-2 text-sm px-4 py-2">
          <Search className="h-4 w-4" />
          Trouver un avocat
        </Link>
      </div>

      {/* Bandeau informatif */}
      <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 flex items-start gap-3">
        <Info className="h-5 w-5 text-primary-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-primary-800">
            Comment prendre rendez-vous ?
          </p>
          <p className="text-sm text-primary-700 mt-0.5">
            Les rendez-vous sont gérés via <strong>Cal.com</strong>, la plateforme de calendrier de votre avocat.
            Cliquez sur "Prendre RDV" pour accéder à son calendrier et choisir un créneau disponible.
          </p>
        </div>
      </div>

      {/* Liste des avocats */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold text-gray-900">
          Vos avocats ({MOCK_LAWYERS.length})
        </h2>
        {MOCK_LAWYERS.map((lawyer) => {
          const initials = `${lawyer.prenom.charAt(0)}${lawyer.nom.charAt(0)}`
          return (
            <div key={lawyer.id} className="card flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Avatar */}
              <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-600 flex-shrink-0">
                {initials}
              </div>

              {/* Infos avocat */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900">
                  Me {lawyer.prenom} {lawyer.nom}
                </p>
                <p className="text-sm text-gray-500">{lawyer.specialite}</p>
                <p className="text-xs text-gray-400 mt-0.5">{lawyer.ville}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Dossier : <span className="text-gray-600">{lawyer.dossierTitre}</span>
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
                {lawyer.cal_link ? (
                  <button
                    onClick={() => window.open(lawyer.cal_link, '_blank')}
                    className="inline-flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                  >
                    <Calendar className="h-4 w-4" />
                    Prendre RDV
                    <ExternalLink className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                    <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                    Calendrier non configuré
                  </div>
                )}
                <Link
                  to="/client/messages"
                  className="inline-flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  <MessageSquare className="h-4 w-4" />
                  Contacter
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
