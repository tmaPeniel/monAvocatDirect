import { Scale, BookOpen, CreditCard, ExternalLink, AlertCircle } from 'lucide-react'
import aideData from '../../data/static/aide-juridictionnelle.json'

const UV_TABLE      = aideData.bareme_uv
const RESOURCES     = aideData.ressources
const UV_VALUE      = aideData.valeur_uv_euros
const STEPS_RETRIB  = aideData.etapes_retribution

export default function LawyerAide() {
  return (
    <div className="space-y-8 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Aide Juridictionnelle</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Informations sur la désignation et la rémunération dans le cadre de l'aide juridictionnelle
        </p>
      </div>

      {/* Section 1 — Désignation */}
      <div className="card space-y-4">
        <div className="flex items-center gap-2">
          <Scale className="h-5 w-5 text-primary-500" />
          <h2 className="text-base font-semibold text-gray-900">Désignation par le Barreau</h2>
        </div>
        <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
          <p>
            Lorsqu'un justiciable bénéficie de l'aide juridictionnelle, il peut soit choisir son avocat,
            soit demander à être assisté d'un <strong>avocat commis d'office</strong> désigné par le bâtonnier.
          </p>
          <p>
            L'avocat désigné d'office a l'obligation d'accepter la mission, sauf motif légitime (conflit d'intérêts,
            surcharge de travail justifiée). Le refus injustifié est passible de sanctions disciplinaires.
          </p>
          <p>
            La désignation est effectuée par le <strong>bureau d'aide juridictionnelle (BAJ)</strong> du tribunal
            compétent, après vérification de l'éligibilité du demandeur.
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-700">
            <strong>Important :</strong> L'avocat doit informer son client que l'AJ peut être retirée si les ressources
            du bénéficiaire s'avèrent supérieures aux plafonds légaux ou en cas de gain du procès permettant
            le remboursement des frais.
          </p>
        </div>
      </div>

      {/* Section 2 — Barème UV */}
      <div className="card space-y-4">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary-500" />
          <h2 className="text-base font-semibold text-gray-900">Barème de rémunération (UV)</h2>
        </div>
        <p className="text-sm text-gray-500">
          La rémunération de l'avocat est calculée en <strong>unités de valeur (UV)</strong>.
          Depuis 2024, la valeur de l'UV est fixée à <strong>{UV_VALUE} €</strong> (hors TVA).
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-2.5 px-4 font-semibold text-gray-600 rounded-tl-lg">Type d'affaire</th>
                <th className="py-2.5 px-4 font-semibold text-gray-600 text-right">UV</th>
                <th className="py-2.5 px-4 font-semibold text-gray-600 text-right rounded-tr-lg">Montant (~)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {UV_TABLE.map((row) => (
                <tr key={row.type} className="hover:bg-gray-50">
                  <td className="py-2.5 px-4 text-gray-700">{row.type}</td>
                  <td className="py-2.5 px-4 text-gray-600 text-right font-medium">{row.uv} UV</td>
                  <td className="py-2.5 px-4 text-gray-500 text-right">{(row.uv * UV_VALUE).toLocaleString('fr-FR')} €</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-gray-400">
          * Barème indicatif basé sur la valeur UV 2024 à {UV_VALUE} €. Les montants réels peuvent varier selon les actes effectués
          et les éventuels compléments accordés par le BAJ.
        </p>
      </div>

      {/* Section 3 — Procédure de rétribution */}
      <div className="card space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary-500" />
          <h2 className="text-base font-semibold text-gray-900">Procédure de rétribution</h2>
        </div>
        <div className="space-y-3">
          {STEPS_RETRIB.map((step) => (
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
      </div>

      {/* Section 4 — Ressources */}
      <div className="card space-y-4">
        <h2 className="text-base font-semibold text-gray-900">Ressources officielles</h2>
        <div className="space-y-3">
          {RESOURCES.map((r) => (
            <a
              key={r.label}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-primary-200 hover:bg-primary-50 transition-colors group"
            >
              <div>
                <p className="text-sm font-semibold text-gray-900 group-hover:text-primary-600">{r.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{r.desc}</p>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-primary-500 flex-shrink-0 ml-4" />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
