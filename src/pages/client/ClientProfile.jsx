import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Shield,
  ChevronRight,
  Check,
  Camera,
  CalendarDays,
  Briefcase,
} from 'lucide-react'

export default function ClientProfile() {
  const { user, profile, fetchProfile } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    adresse: '',
    date_naissance: '',
    metier: '',
  })

  useEffect(() => {
    if (profile) {
      setForm({
        prenom: profile.prenom || '',
        nom: profile.nom || '',
        email: profile.email || user?.email || '',
        telephone: profile.telephone || '',
        adresse: profile.adresse || '',
        date_naissance: profile.date_naissance || '',
        metier: profile.metier || '',
      })
      setLoading(false)
    }
  }, [profile, user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          prenom: form.prenom,
          nom: form.nom,
          telephone: form.telephone,
          adresse: form.adresse,
          date_naissance: form.date_naissance || null,
          metier: form.metier,
        })
        .eq('id', user.id)

      if (error) throw error

      await fetchProfile(user.id)
      toast.success('Profil mis à jour')
    } catch (error) {
      console.error('Erreur mise à jour profil:', error)
      toast.error('Erreur lors de la mise à jour du profil')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  const initials =
    (form.prenom?.charAt(0) || '') + (form.nom?.charAt(0) || '') || 'U'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mon profil</h1>
        <p className="text-sm text-gray-500 mt-1">
          Gérez vos informations personnelles
        </p>
      </div>

      {/* Profile card */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-visible">
        {/* Dark banner + photo overflow */}
        <div className="relative rounded-t-xl overflow-visible">
          <div className="bg-primary-800 rounded-t-xl px-6 py-5 flex items-center gap-5">
            {/* Spacer matching photo width so name isn't hidden behind it */}
            <div className="w-[76px] flex-shrink-0" />
            <p className="text-white font-bold text-xl tracking-wide">
              {form.prenom} {form.nom?.toUpperCase()}
            </p>
          </div>

          {/* Photo — absolutely positioned, half overflows below banner */}
          <div className="absolute bottom-0 left-6 translate-y-1/2">
            <div className="relative">
              <div className="w-[76px] h-[76px] rounded-full border-[3px] border-white overflow-hidden bg-gray-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                {profile?.photo_url ? (
                  <img src={profile.photo_url} alt="Photo de profil" className="w-full h-full object-cover" />
                ) : (
                  <span>{initials.toUpperCase()}</span>
                )}
              </div>
              {/* Camera button */}
              <button
                type="button"
                title="Changer la photo"
                className="absolute bottom-0.5 right-0 w-6 h-6 bg-primary-500 hover:bg-primary-600 rounded-full border-2 border-white flex items-center justify-center transition-colors"
              >
                <Camera className="h-3 w-3 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Form — pt-12 to clear the overflowing photo */}
        <form onSubmit={handleSubmit} className="px-6 pt-12 pb-6 space-y-5">
          {/* Prénom + Nom */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <User className="inline h-4 w-4 text-primary-500 mr-1.5" />
                Prénom(s)
              </label>
              <input
                type="text"
                name="prenom"
                value={form.prenom}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <User className="inline h-4 w-4 text-primary-500 mr-1.5" />
                Nom(s)
              </label>
              <input
                type="text"
                name="nom"
                value={form.nom}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <Mail className="inline h-4 w-4 text-primary-500 mr-1.5" />
              Adresse email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 cursor-not-allowed text-gray-500"
              readOnly
            />
          </div>

          {/* Téléphone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <Phone className="inline h-4 w-4 text-primary-500 mr-1.5" />
              Numéro de téléphone
            </label>
            <input
              type="tel"
              name="telephone"
              value={form.telephone}
              onChange={handleChange}
              placeholder="06 70 70 95 10"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {/* Adresse */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <MapPin className="inline h-4 w-4 text-primary-500 mr-1.5" />
              Adresse complète
            </label>
            <textarea
              name="adresse"
              value={form.adresse}
              onChange={handleChange}
              rows={3}
              placeholder="95 rue du Maréchal Pétain&#10;76000 ROUEN"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 resize-none"
            />
          </div>

          {/* Informations complémentaires */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Informations complémentaires
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <CalendarDays className="inline h-4 w-4 text-primary-500 mr-1.5" />
                  Date de naissance
                </label>
                <input
                  type="date"
                  name="date_naissance"
                  value={form.date_naissance}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <Briefcase className="inline h-4 w-4 text-primary-500 mr-1.5" />
                  Métier
                </label>
                <input
                  type="text"
                  name="metier"
                  value={form.metier}
                  onChange={handleChange}
                  placeholder="Chef de projet digital"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>
          </div>

          {/* Sécurité */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Sécurité</h3>
            <button
              type="button"
              className="flex items-center gap-2 text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors"
            >
              <Lock className="h-4 w-4" />
              Changer le mot de passe
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="h-4 w-4" />
              {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </div>
        </form>
      </div>

      {/* RGPD banner */}
      <div className="bg-primary-50 border border-primary-100 rounded-xl p-5 flex items-start gap-4">
        <Shield className="h-5 w-5 text-primary-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-primary-800">
            Protection des données :
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Vos informations personnelles sont sécurisées et ne seront jamais
            partagées avec des tiers sans votre consentement.
          </p>
          <button className="mt-2 text-xs font-semibold text-primary-500 hover:text-primary-600 flex items-center gap-1 transition-colors">
            Consultez notre politique de confidentialité
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  )
}
