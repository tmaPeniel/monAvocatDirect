import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'
import {
  MapPin,
  Briefcase,
  Star,
  Scale,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  Clock,
  Shield,
  ArrowRight,
  FileText,
} from 'lucide-react'

export default function LawyerProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [lawyer, setLawyer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    fetchLawyer()
  }, [id])

  const fetchLawyer = async () => {
    setLoading(true)
    setNotFound(false)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      if (!data) {
        setNotFound(true)
        return
      }

      setLawyer(data)
    } catch (error) {
      setNotFound(true)
      toast.error('Erreur lors du chargement du profil')
    } finally {
      setLoading(false)
    }
  }

  const handleBookAppointment = () => {
    if (lawyer?.cal_link) {
      window.open(lawyer.cal_link, '_blank', 'noopener,noreferrer')
    } else {
      toast('Veuillez contacter l\'avocat directement par telephone ou email.', {
        icon: <Phone className="w-5 h-5 text-primary-500" />,
      })
    }
  }

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mb-4"></div>
        <p className="text-gray-500">Chargement du profil...</p>
      </div>
    )
  }

  // Not Found State
  if (notFound || !lawyer) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <Scale className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Profil introuvable</h2>
        <p className="text-gray-500 mb-6 text-center max-w-md">
          L'avocat que vous recherchez n'existe pas ou n'est plus disponible.
        </p>
        <Link
          to="/search"
          className="btn-primary inline-flex items-center gap-2"
        >
          Retour a la recherche
        </Link>
      </div>
    )
  }

  const initials = `${lawyer.prenom?.[0] || ''}${lawyer.nom?.[0] || ''}`.toUpperCase()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Link */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/search"
            className="text-sm text-primary-500 hover:text-primary-600 font-medium inline-flex items-center gap-1"
          >
            &larr; Retour a la recherche
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Photo + Contact */}
          <div className="lg:col-span-1">
            <div className="card text-center">
              {/* Photo */}
              {lawyer.photo_url ? (
                <img
                  src={lawyer.photo_url}
                  alt={`${lawyer.prenom} ${lawyer.nom}`}
                  className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-primary-100"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-primary-500 flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4">
                  {initials}
                </div>
              )}

              {/* Name */}
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {lawyer.prenom} {lawyer.nom}
              </h1>

              {/* Specialite Badge */}
              {lawyer.specialite && (
                <div className="mb-4">
                  <span className="badge-blue inline-flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5" />
                    {lawyer.specialite}
                  </span>
                </div>
              )}

              {/* Verified Badge */}
              {lawyer.is_verified && (
                <div className="flex items-center justify-center gap-1.5 text-green-600 text-sm mb-4">
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-medium">Profil verifie</span>
                </div>
              )}

              {/* Location */}
              {lawyer.ville && (
                <div className="flex items-center justify-center gap-2 text-gray-500 text-sm mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>{lawyer.ville}</span>
                </div>
              )}

              {/* Divider */}
              <hr className="my-4 border-gray-100" />

              {/* Contact Info */}
              <div className="space-y-3 text-left">
                {lawyer.telephone && (
                  <a
                    href={`tel:${lawyer.telephone}`}
                    className="flex items-center gap-3 text-gray-600 hover:text-primary-500 transition-colors text-sm"
                  >
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <span>{lawyer.telephone}</span>
                  </a>
                )}
                {lawyer.email && (
                  <a
                    href={`mailto:${lawyer.email}`}
                    className="flex items-center gap-3 text-gray-600 hover:text-primary-500 transition-colors text-sm"
                  >
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{lawyer.email}</span>
                  </a>
                )}
              </div>

              {/* Appointment Button */}
              <div className="mt-6">
                <button
                  onClick={handleBookAppointment}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  <Calendar className="w-5 h-5" />
                  {lawyer.cal_link ? 'Prendre rendez-vous' : 'Contactez l\'avocat'}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary-500" />
                Presentation
              </h2>
              {lawyer.description ? (
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {lawyer.description}
                </p>
              ) : (
                <p className="text-gray-400 italic">
                  Aucune description disponible pour le moment.
                </p>
              )}
            </div>

            {/* Tarifs & Details */}
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Scale className="w-5 h-5 text-primary-500" />
                Informations pratiques
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Tarif */}
                {lawyer.tarif && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                      <Clock className="w-4 h-4" />
                      <span>Tarif consultation</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">
                      {lawyer.tarif}
                    </p>
                  </div>
                )}

                {/* Aide Juridictionnelle */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <Shield className="w-4 h-4" />
                    <span>Aide juridictionnelle</span>
                  </div>
                  <p className={`text-lg font-semibold ${lawyer.aide_juridictionnelle ? 'text-green-600' : 'text-gray-400'}`}>
                    {lawyer.aide_juridictionnelle ? 'Acceptee' : 'Non renseignee'}
                  </p>
                </div>

                {/* Specialite */}
                {lawyer.specialite && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                      <Briefcase className="w-4 h-4" />
                      <span>Domaine de competence</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">
                      {lawyer.specialite}
                    </p>
                  </div>
                )}

                {/* Ville */}
                {lawyer.ville && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                      <MapPin className="w-4 h-4" />
                      <span>Localisation</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">
                      {lawyer.ville}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* CTA Card */}
            <div className="card bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Besoin d'un avis juridique ?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Prenez rendez-vous avec {lawyer.prenom} {lawyer.nom} pour discuter de votre situation.
                  </p>
                </div>
                <button
                  onClick={handleBookAppointment}
                  className="btn-primary flex items-center gap-2 whitespace-nowrap"
                >
                  <Calendar className="w-5 h-5" />
                  {lawyer.cal_link ? 'Prendre rendez-vous' : 'Contactez l\'avocat'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
