import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Scale, CheckCircle, AlertCircle, Info, FileText, ExternalLink, Search } from 'lucide-react'
import aideData from '../../data/static/aide-juridictionnelle.json'

const STEPS    = aideData.etapes_client
const PLAFONDS = aideData.plafonds

export default function ClientAide() {
  const [revenu, setRevenu] = useState('')
  const [result, setResult] = useState(null)

  const checkEligibility = () => {
    const montant = parseFloat(revenu.replace(',', '.'))
    if (isNaN(montant) || montant < 0) {
      setResult({ type: 'error', message: 'Veuillez entrer un revenu valide.' })
      return
    }
    if (montant < PLAFONDS.aide_totale) {
      setResult({
        type: 'total',
        title: 'Aide juridictionnelle totale (100 %)',
        message: "Vos ressources semblent vous permettre de bénéficier d'une prise en charge totale des frais d'avocat par l'État.",
        color: 'green',
      })
    } else if (montant < PLAFONDS.aide_partielle) {
      setResult({
        type: 'partielle',
        title: 'Aide juridictionnelle partielle (25 % à 55 %)',
        message: "Vos ressources semblent vous permettre de bénéficier d'une prise en charge partielle des frais d'avocat par l'État.",
        color: 'yellow',
      })
    } else {
      setResult({
        type: 'non',
        title: 'Non éligible',
        message: 'Vos ressources dépassent le plafond légal. Vous pouvez néanmoins consulter un avocat à tarif adapté.',
        color: 'red',
      })
    }
  }

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Aide Juridictionnelle</h1>
        <p className="text-gray-500 mt-1 text-sm">
          L'aide juridictionnelle permet aux personnes aux revenus modestes d'accéder à la justice.
        </p>
      </div>

      {/* Section 1 — Définition */}
      <div className="card space-y-4">
        <div className="flex items-center gap-2">
          <Scale className="h-5 w-5 text-primary-500" />
          <h2 className="text-base font-semibold text-gray-900">Qu'est-ce que l'aide juridictionnelle ?</h2>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          L'aide juridictionnelle (AJ) est un dispositif public qui permet à toute personne physique dont les ressources
          sont insuffisantes de bénéficier de l'assistance gratuite ou partiellement gratuite d'un avocat,
          ainsi que de la prise en charge des frais de justice (huissier, expert, etc.).
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: CheckCircle, color: 'green', label: "Honoraires d'avocat pris en charge" },
            { icon: CheckCircle, color: 'green', label: 'Frais de procédure couverts' },
            { icon: CheckCircle, color: 'green', label: 'Applicable à toutes les juridictions' },
          ].map(({ icon: Icon, color, label }) => (
            <div key={label} className={`flex items-start gap-2 p-3 rounded-lg bg-${color}-50`}>
              <Icon className={`h-4 w-4 text-${color}-600 flex-shrink-0 mt-0.5`} />
              <span className="text-xs text-gray-700">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2 — Simulateur */}
      <div className="card space-y-4">
        <div className="flex items-center gap-2">
          <Info className="h-5 w-5 text-primary-500" />
          <h2 className="text-base font-semibold text-gray-900">Simulateur d'éligibilité</h2>
        </div>
        <p className="text-xs text-gray-400">
          Estimation basée sur les plafonds de ressources mensuels nets 2024 (personne seule, sans personne à charge).
          Ce simulateur n'a pas de valeur légale.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="number"
              value={revenu}
              onChange={(e) => setRevenu(e.target.value)}
              placeholder="Revenu mensuel net (€)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              min="0"
            />
          </div>
          <button
            onClick={checkEligibility}
            className="bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium px-5 py-3 rounded-lg transition-colors flex-shrink-0"
          >
            Vérifier mon éligibilité
          </button>
        </div>

        {result && result.type !== 'error' && (
          <div className={`rounded-xl p-4 border flex items-start gap-3 ${
            result.color === 'green' ? 'bg-green-50 border-green-200' :
            result.color === 'yellow' ? 'bg-yellow-50 border-yellow-200' :
            'bg-red-50 border-red-200'
          }`}>
            {result.color === 'green' ? (
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className={`h-5 w-5 flex-shrink-0 mt-0.5 ${result.color === 'yellow' ? 'text-yellow-600' : 'text-red-600'}`} />
            )}
            <div>
              <p className={`text-sm font-semibold ${
                result.color === 'green' ? 'text-green-800' :
                result.color === 'yellow' ? 'text-yellow-800' : 'text-red-800'
              }`}>
                {result.title}
              </p>
              <p className={`text-sm mt-0.5 ${
                result.color === 'green' ? 'text-green-700' :
                result.color === 'yellow' ? 'text-yellow-700' : 'text-red-700'
              }`}>
                {result.message}
              </p>
            </div>
          </div>
        )}
        {result?.type === 'error' && (
          <p className="text-sm text-red-600">{result.message}</p>
        )}

        {/* Barème rapide */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-2 px-3 font-semibold text-gray-600 rounded-tl-lg">Revenu mensuel net</th>
                <th className="py-2 px-3 font-semibold text-gray-600">Type d'aide</th>
                <th className="py-2 px-3 font-semibold text-gray-600 rounded-tr-lg">Prise en charge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="bg-green-50">
                <td className="py-2 px-3 text-gray-700">Moins de {PLAFONDS.aide_totale.toLocaleString('fr-FR')} €</td>
                <td className="py-2 px-3 font-medium text-green-700">Aide totale</td>
                <td className="py-2 px-3 text-green-700">100 %</td>
              </tr>
              <tr className="bg-yellow-50">
                <td className="py-2 px-3 text-gray-700">De {PLAFONDS.aide_totale.toLocaleString('fr-FR')} € à {PLAFONDS.aide_partielle.toLocaleString('fr-FR')} €</td>
                <td className="py-2 px-3 font-medium text-yellow-700">Aide partielle</td>
                <td className="py-2 px-3 text-yellow-700">25 % à 55 %</td>
              </tr>
              <tr className="bg-red-50">
                <td className="py-2 px-3 text-gray-700">Plus de {PLAFONDS.aide_partielle.toLocaleString('fr-FR')} €</td>
                <td className="py-2 px-3 font-medium text-red-700">Non éligible</td>
                <td className="py-2 px-3 text-red-700">0 %</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 3 — Démarches */}
      <div className="card space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary-500" />
          <h2 className="text-base font-semibold text-gray-900">Comment faire la demande ?</h2>
        </div>

        <div className="space-y-3">
          {STEPS.map((step) => (
            <div key={step.num} className="flex gap-4">
              <div className="w-7 h-7 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                {step.num}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{step.title}</p>
                <p className="text-sm text-gray-500 mt-0.5">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <a
            href="https://www.service-public.fr/particuliers/vosdroits/R1444"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
          >
            Formulaire Cerfa n°15626*02
            <ExternalLink className="h-4 w-4" />
          </a>
          <a
            href="https://www.aide-juridictionnelle.justice.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
          >
            Site officiel AJ
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-primary-50 border border-primary-100 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <p className="font-semibold text-primary-800">Besoin d'un avocat spécialisé ?</p>
          <p className="text-sm text-primary-700 mt-0.5">
            Nos avocats partenaires acceptent les dossiers en aide juridictionnelle.
          </p>
        </div>
        <Link
          to="/search"
          className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors flex-shrink-0"
        >
          <Search className="h-4 w-4" />
          Trouver un avocat
        </Link>
      </div>
    </div>
  )
}
