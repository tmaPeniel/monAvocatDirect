import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SPECIALITES, VILLES } from '../lib/constants'
import {
  MapPin,
  Search,
  Users,
  Briefcase,
  Globe,
  Check,
} from 'lucide-react'

export default function Home() {
  const navigate = useNavigate()
  const [ville, setVille] = useState('')
  const [specialite, setSpecialite] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (ville) params.set('ville', ville)
    if (specialite) params.set('specialite', specialite)
    navigate(`/search?${params.toString()}`)
  }

  return (
    <div className="bg-white">
      {/* ================================================================
          SECTION 1 — Titre principal
          ================================================================ */}
      <section className="text-center pt-10 pb-6 px-4">
        <h1
          className="text-[26px] sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-tight"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          Mon Avocat Direct{' '}
          <sup className="text-[13px] sm:text-sm align-super font-normal">©</sup>
        </h1>
        <p className="text-gray-500 text-[13px] sm:text-sm md:text-base mt-3 max-w-md mx-auto leading-relaxed">
          Divorce, garde d'enfant, titre de sejour : trouvez un avocat
          specialise en moins de 24h!
        </p>
      </section>

      {/* ================================================================
          SECTION 2 — Banniere de recherche avec image de fond
          ================================================================ */}
      <section className="relative mx-4 sm:mx-6 lg:mx-auto lg:max-w-5xl">
        {/* REMPLACER IMAGE_PLACEHOLDER_1 PAR L'IMAGE FINALE (bureau d'avocat avec marteau de justice, tons bruns) */}
        <div className="w-full h-48 sm:h-56 md:h-64 rounded-xl bg-gray-200 flex items-center justify-center overflow-hidden">
          <span className="text-gray-400 text-sm font-medium tracking-wider select-none">
            IMAGE_PLACEHOLDER_1
          </span>
        </div>

        {/* Carte de recherche en overlay */}
        <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-8">
          <div className="bg-white rounded-lg shadow-xl p-4 sm:p-5 w-full max-w-[500px]">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3">
              Trouver un avocat
            </h2>
            <form
              onSubmit={handleSearch}
              className="flex flex-col sm:flex-row gap-2"
            >
              {/* Ville */}
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
                <select
                  value={ville}
                  onChange={(e) => setVille(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded text-sm bg-white appearance-none focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 ${
                    ville ? 'text-gray-900' : 'text-gray-400'
                  }`}
                >
                  <option value="">Ville ou code postal</option>
                  {VILLES.map((v) => (
                    <option key={v} value={v} className="text-gray-900">
                      {v}
                    </option>
                  ))}
                </select>
              </div>

              {/* Specialite */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
                <select
                  value={specialite}
                  onChange={(e) => setSpecialite(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded text-sm bg-white appearance-none focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 ${
                    specialite ? 'text-gray-900' : 'text-gray-400'
                  }`}
                >
                  <option value="">Specialite</option>
                  {SPECIALITES.map((s) => (
                    <option key={s} value={s} className="text-gray-900">
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bouton Rechercher */}
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded text-sm font-semibold transition-colors whitespace-nowrap"
              >
                Rechercher
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 3 — Nos specialites juridiques
          ================================================================ */}
      <section className="pt-12 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-red-600 font-bold text-[15px] sm:text-base mb-5">
            Nos specialites juridiques
          </h3>
          <div className="flex flex-wrap gap-y-3 gap-x-8 sm:gap-x-12">
            <div className="flex items-center gap-2.5">
              <Users className="w-5 h-5 text-gray-700 flex-shrink-0" />
              <span className="text-sm font-medium text-gray-800">
                Droit de la famille
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <Briefcase className="w-5 h-5 text-gray-700 flex-shrink-0" />
              <span className="text-sm font-medium text-gray-800">
                Droit du travail
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <Globe className="w-5 h-5 text-gray-700 flex-shrink-0" />
              <span className="text-sm font-medium text-gray-800">
                Droit des etrangers
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 4 — Experts / Comment ca fonctionne
          ================================================================ */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-14">
          {/* Image circulaire */}
          {/* REMPLACER IMAGE_PLACEHOLDER_2 PAR L'IMAGE FINALE (avocat tenant la balance de la justice, fond rouge) */}
          <div className="flex-shrink-0">
            <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-gray-200 border-[5px] border-red-600 flex items-center justify-center">
              <span className="text-gray-400 text-[11px] font-medium text-center px-6 select-none">
                IMAGE_PLACEHOLDER_2
              </span>
            </div>
          </div>

          {/* Contenu texte */}
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug mb-2">
              Des experts dans tous les domaines du droit pour vous
              accompagner.
            </h3>
            <p className="text-gray-400 font-semibold text-sm sm:text-base mb-5">
              Comment ca fonctionne ?
            </p>
            <div className="space-y-3 inline-block text-left">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                  1
                </span>
                <span className="text-gray-700 text-sm font-medium">
                  Creer un profil
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                  2
                </span>
                <span className="text-gray-700 text-sm font-medium">
                  Rechercher un avocat
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                  3
                </span>
                <span className="text-gray-700 text-sm font-medium">
                  Prendre rendez-vous
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 5 — Pourquoi nous choisir
          ================================================================ */}
      <section className="bg-[#2B2B2B] py-14 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 leading-tight"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            Pourquoi nous choisir ?
          </h2>
          <p className="text-gray-300 text-sm sm:text-base font-medium mb-12">
            Avec Mon Avocat Direct, choisir un avocat devient :
          </p>

          <div className="grid grid-cols-3 gap-4 sm:gap-8 md:gap-12">
            {/* Rapide */}
            <div className="flex flex-col items-center">
              {/* REMPLACER IMAGE_PLACEHOLDER_3 PAR L'IMAGE FINALE (icone chronometre/vitesse, style outline blanc) */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-[#3A3A3A] rounded-full flex items-center justify-center mb-4">
                <span className="text-gray-500 text-[9px] sm:text-[10px] font-medium text-center leading-tight select-none">
                  IMAGE
                  <br />
                  PLACEHOLDER_3
                </span>
              </div>
              <span className="bg-red-600 text-white text-xs sm:text-sm font-semibold px-4 sm:px-6 py-1.5 sm:py-2 rounded-full">
                Rapide
              </span>
            </div>

            {/* Facile */}
            <div className="flex flex-col items-center">
              {/* REMPLACER IMAGE_PLACEHOLDER_4 PAR L'IMAGE FINALE (icone main avec check, style outline blanc) */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-[#3A3A3A] rounded-full flex items-center justify-center mb-4">
                <span className="text-gray-500 text-[9px] sm:text-[10px] font-medium text-center leading-tight select-none">
                  IMAGE
                  <br />
                  PLACEHOLDER_4
                </span>
              </div>
              <span className="bg-red-600 text-white text-xs sm:text-sm font-semibold px-4 sm:px-6 py-1.5 sm:py-2 rounded-full">
                Facile
              </span>
            </div>

            {/* Efficace */}
            <div className="flex flex-col items-center">
              {/* REMPLACER IMAGE_PLACEHOLDER_5 PAR L'IMAGE FINALE (icone engrenages/rouages, style outline blanc) */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-[#3A3A3A] rounded-full flex items-center justify-center mb-4">
                <span className="text-gray-500 text-[9px] sm:text-[10px] font-medium text-center leading-tight select-none">
                  IMAGE
                  <br />
                  PLACEHOLDER_5
                </span>
              </div>
              <span className="bg-red-600 text-white text-xs sm:text-sm font-semibold px-4 sm:px-6 py-1.5 sm:py-2 rounded-full">
                Efficace
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 6 — CTA Espace Avocats
          ================================================================ */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Image */}
          {/* REMPLACER IMAGE_PLACEHOLDER_6 PAR L'IMAGE FINALE (personne travaillant sur un laptop, tons rouges/chauds) */}
          <div className="flex-shrink-0">
            <div className="w-52 h-60 sm:w-56 sm:h-64 md:w-60 md:h-72 rounded-2xl bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-[11px] font-medium text-center px-4 select-none">
                IMAGE_PLACEHOLDER_6
              </span>
            </div>
          </div>

          {/* Contenu */}
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
              Vous etes avocat ?
            </h3>
            <p className="text-gray-700 font-semibold text-sm mb-6">
              Decouvrez l'espace professionnel de Mon Avocat Direct
            </p>

            <div className="space-y-3 mb-7 inline-block text-left">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                </div>
                <span className="text-gray-700 text-sm">
                  Des demandes client pre-qualifiees
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                </div>
                <span className="text-gray-700 text-sm">
                  Des rendez-vous positionnes en un clic
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                </div>
                <span className="text-gray-700 text-sm">
                  Une activite optimisee
                </span>
              </div>
            </div>

            <div>
              <Link
                to="/register"
                className="inline-block bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-8 py-3 rounded transition-colors"
              >
                Espace avocats
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
