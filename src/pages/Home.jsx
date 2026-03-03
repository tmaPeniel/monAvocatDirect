import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'
import { SPECIALITES, VILLES } from '../lib/constants'
import {
  Search,
  MapPin,
  Briefcase,
  Star,
  Scale,
  Calendar,
  CheckCircle,
  Shield,
  Users,
  FileText,
  ArrowRight,
} from 'lucide-react'

function LawyerCard({ lawyer }) {
  const initials = `${lawyer.prenom?.[0] || ''}${lawyer.nom?.[0] || ''}`.toUpperCase()

  return (
    <Link
      to={`/lawyer/${lawyer.id}`}
      className="card hover:shadow-md transition-shadow duration-200 flex flex-col"
    >
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
      <div className="mt-auto pt-3 border-t border-gray-100">
        <span className="text-primary-500 font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all">
          Voir le profil <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const [ville, setVille] = useState('')
  const [specialite, setSpecialite] = useState('')
  const [featuredLawyers, setFeaturedLawyers] = useState([])
  const [loadingLawyers, setLoadingLawyers] = useState(true)

  useEffect(() => {
    fetchFeaturedLawyers()
  }, [])

  const fetchFeaturedLawyers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'avocat')
        .eq('is_verified', true)
        .limit(6)

      if (error) throw error
      setFeaturedLawyers(data || [])
    } catch (error) {
      toast.error('Erreur lors du chargement des avocats')
    } finally {
      setLoadingLawyers(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (ville) params.set('ville', ville)
    if (specialite) params.set('specialite', specialite)
    navigate(`/search?${params.toString()}`)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Scale className="w-10 h-10 text-gold-300" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Trouvez l'avocat qu'il vous faut
            </h1>
            <p className="text-lg sm:text-xl text-primary-100 mb-10 leading-relaxed">
              MonAvocatDirect vous met en relation avec des avocats qualifies pres de chez vous
            </p>

            {/* Search Bar */}
            <form
              onSubmit={handleSearch}
              className="bg-white rounded-xl shadow-2xl p-4 sm:p-6 flex flex-col sm:flex-row gap-4"
            >
              <div className="flex-1">
                <label htmlFor="hero-ville" className="sr-only">Ville</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    id="hero-ville"
                    value={ville}
                    onChange={(e) => setVille(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">Toutes les villes</option>
                    {VILLES.map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex-1">
                <label htmlFor="hero-specialite" className="sr-only">Specialite</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    id="hero-specialite"
                    value={specialite}
                    onChange={(e) => setSpecialite(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">Toutes les specialites</option>
                    {SPECIALITES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="btn-primary flex items-center justify-center gap-2 sm:w-auto"
              >
                <Search className="w-5 h-5" />
                <span>Rechercher</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="w-6 h-6 text-primary-500" />
                <span className="text-3xl sm:text-4xl font-bold text-gray-900">500+</span>
              </div>
              <p className="text-gray-500 font-medium">Avocats</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="w-6 h-6 text-gold-400" />
                <span className="text-3xl sm:text-4xl font-bold text-gray-900">10 000+</span>
              </div>
              <p className="text-gray-500 font-medium">Clients satisfaits</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Briefcase className="w-6 h-6 text-primary-500" />
                <span className="text-3xl sm:text-4xl font-bold text-gray-900">50+</span>
              </div>
              <p className="text-gray-500 font-medium">Specialites</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Comment ca marche ?
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Trouvez et consultez un avocat en quelques etapes simples
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-primary-500" />
              </div>
              <div className="inline-block bg-primary-500 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Recherchez</h3>
              <p className="text-gray-500 leading-relaxed">
                Trouvez un avocat par specialite, ville ou nom. Consultez les profils detailles et les avis.
              </p>
            </div>
            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gold-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-8 h-8 text-gold-500" />
              </div>
              <div className="inline-block bg-primary-500 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Prenez rendez-vous</h3>
              <p className="text-gray-500 leading-relaxed">
                Reservez un creneau directement en ligne selon vos disponibilites et celles de l'avocat.
              </p>
            </div>
            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <div className="inline-block bg-primary-500 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Echangez</h3>
              <p className="text-gray-500 leading-relaxed">
                Discutez avec votre avocat en toute confidentialite et suivez l'evolution de votre dossier.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Lawyers Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Avocats en vedette
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Decouvrez nos avocats verifies et disponibles pour vous accompagner
            </p>
          </div>

          {loadingLawyers ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          ) : featuredLawyers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredLawyers.map((lawyer) => (
                <LawyerCard key={lawyer.id} lawyer={lawyer} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Aucun avocat disponible pour le moment.</p>
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              to="/search"
              className="btn-primary inline-flex items-center gap-2"
            >
              Voir tous les avocats
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="text-center max-w-3xl mx-auto">
            <Shield className="w-12 h-12 mx-auto mb-6 text-gold-300" />
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Vous etes avocat ?
            </h2>
            <p className="text-primary-100 text-lg mb-8 leading-relaxed">
              Rejoignez MonAvocatDirect et developpez votre clientele. Creez votre profil, gerez vos rendez-vous et vos dossiers en toute simplicite.
            </p>
            <Link
              to="/register"
              className="btn-gold inline-flex items-center gap-2 text-lg px-8 py-4"
            >
              <FileText className="w-5 h-5" />
              Creer mon profil avocat
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
