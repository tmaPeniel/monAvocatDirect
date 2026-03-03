import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'
import { SPECIALITES, VILLES } from '../lib/constants'
import {
  Search as SearchIcon,
  MapPin,
  Briefcase,
  Shield,
  ArrowRight,
  Users,
} from 'lucide-react'

function LawyerCard({ lawyer }) {
  const initials = `${lawyer.prenom?.[0] || ''}${lawyer.nom?.[0] || ''}`.toUpperCase()

  return (
    <div className="card hover:shadow-md transition-shadow duration-200 flex flex-col">
      <div className="flex items-center gap-4 mb-4">
        {lawyer.photo_url ? (
          <img
            src={lawyer.photo_url}
            alt={`${lawyer.prenom} ${lawyer.nom}`}
            className="w-16 h-16 rounded-full object-cover border-2 border-primary-100"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-primary-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
            {initials}
          </div>
        )}
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900 text-lg truncate">
            {lawyer.prenom} {lawyer.nom}
          </h3>
          {lawyer.specialite && (
            <span className="badge-blue text-xs mt-1">
              {lawyer.specialite}
            </span>
          )}
        </div>
      </div>

      {lawyer.ville && (
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span>{lawyer.ville}</span>
        </div>
      )}

      {lawyer.aide_juridictionnelle && (
        <div className="flex items-center gap-2 text-green-600 text-sm mb-3">
          <Shield className="w-4 h-4 flex-shrink-0" />
          <span className="font-medium">Aide juridictionnelle</span>
        </div>
      )}

      <div className="mt-auto pt-4 border-t border-gray-100">
        <Link
          to={`/lawyer/${lawyer.id}`}
          className="btn-primary w-full flex items-center justify-center gap-2 text-sm py-2.5"
        >
          Voir le profil
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [lawyers, setLawyers] = useState([])
  const [loading, setLoading] = useState(true)

  const ville = searchParams.get('ville') || ''
  const specialite = searchParams.get('specialite') || ''
  const aideJuridictionnelle = searchParams.get('aide_juridictionnelle') === 'true'

  useEffect(() => {
    fetchLawyers()
  }, [ville, specialite, aideJuridictionnelle])

  const fetchLawyers = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('profiles')
        .select('*')
        .eq('role', 'avocat')

      if (ville) {
        query = query.eq('ville', ville)
      }
      if (specialite) {
        query = query.eq('specialite', specialite)
      }
      if (aideJuridictionnelle) {
        query = query.eq('aide_juridictionnelle', true)
      }

      const { data, error } = await query

      if (error) throw error
      setLawyers(data || [])
    } catch (error) {
      toast.error('Erreur lors de la recherche des avocats')
    } finally {
      setLoading(false)
    }
  }

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    setSearchParams(params)
  }

  const clearFilters = () => {
    setSearchParams({})
  }

  const hasActiveFilters = ville || specialite || aideJuridictionnelle

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Filters */}
      <section className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Rechercher un avocat
            </h1>
            <p className="text-gray-500 mt-1">
              Trouvez l'avocat qui correspond a vos besoins
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
            {/* Ville Filter */}
            <div className="w-full sm:w-auto sm:min-w-[200px]">
              <label htmlFor="filter-ville" className="block text-sm font-medium text-gray-700 mb-1">
                Ville
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  id="filter-ville"
                  value={ville}
                  onChange={(e) => updateFilter('ville', e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white text-sm"
                >
                  <option value="">Toutes les villes</option>
                  {VILLES.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Specialite Filter */}
            <div className="w-full sm:w-auto sm:min-w-[240px]">
              <label htmlFor="filter-specialite" className="block text-sm font-medium text-gray-700 mb-1">
                Specialite
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  id="filter-specialite"
                  value={specialite}
                  onChange={(e) => updateFilter('specialite', e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white text-sm"
                >
                  <option value="">Toutes les specialites</option>
                  {SPECIALITES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Aide Juridictionnelle Checkbox */}
            <div className="flex items-center gap-2 py-2.5">
              <input
                type="checkbox"
                id="filter-aide"
                checked={aideJuridictionnelle}
                onChange={(e) => updateFilter('aide_juridictionnelle', e.target.checked ? 'true' : '')}
                className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="filter-aide" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Aide juridictionnelle
              </label>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-primary-500 hover:text-primary-600 font-medium whitespace-nowrap py-2.5"
              >
                Effacer les filtres
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Count */}
        {!loading && (
          <div className="mb-6 flex items-center justify-between">
            <p className="text-gray-600">
              <span className="font-semibold text-gray-900">{lawyers.length}</span>{' '}
              {lawyers.length === 1 ? 'avocat trouve' : 'avocats trouves'}
              {hasActiveFilters && (
                <span className="text-gray-400"> avec les filtres appliques</span>
              )}
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mb-4"></div>
            <p className="text-gray-500">Recherche en cours...</p>
          </div>
        ) : lawyers.length > 0 ? (
          /* Results Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {lawyers.map((lawyer) => (
              <LawyerCard key={lawyer.id} lawyer={lawyer} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun avocat trouve
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Aucun avocat ne correspond a vos criteres de recherche. Essayez de modifier vos filtres.
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="btn-primary inline-flex items-center gap-2"
              >
                <SearchIcon className="w-4 h-4" />
                Effacer les filtres et tout afficher
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  )
}
