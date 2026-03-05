import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { SPECIALITES, VILLES } from '../../lib/constants'
import toast from 'react-hot-toast'
import { useDropzone } from 'react-dropzone'
import {
  Camera,
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Shield,
  CreditCard,
  Video,
  Globe,
  ChevronRight,
  Plus,
} from 'lucide-react'

const LANGUES = [
  'Francais',
  'Anglais',
  'Espagnol',
  'Allemand',
  'Arabe',
  'Portugais',
  'Italien',
  'Chinois',
  'Russe',
  'Turc',
]

export default function LawyerProfileEdit() {
  const { user, profile, fetchProfile } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [activeTab, setActiveTab] = useState('general')

  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    specialite: '',
    ville: '',
    adresse: '',
    description: '',
    tarif: '',
    aide_juridictionnelle: false,
    cal_link: '',
  })

  const [paymentMethods, setPaymentMethods] = useState({
    carte: true,
    virement: true,
    cheque: false,
    especes: false,
  })

  const [visioOption, setVisioOption] = useState('both')
  const [selectedLangues, setSelectedLangues] = useState(['Francais'])

  useEffect(() => {
    if (profile) {
      setForm({
        nom: profile.nom || '',
        prenom: profile.prenom || '',
        email: profile.email || user?.email || '',
        telephone: profile.telephone || '',
        specialite: profile.specialite || '',
        ville: profile.ville || '',
        adresse: profile.adresse || '',
        description: profile.description || '',
        tarif: profile.tarif || '',
        aide_juridictionnelle: profile.aide_juridictionnelle || false,
        cal_link: profile.cal_link || '',
      })

      if (profile.photo_url) {
        setAvatarUrl(profile.photo_url)
      }

      setLoading(false)
    }
  }, [profile, user])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const toggleLangue = (langue) => {
    setSelectedLangues((prev) =>
      prev.includes(langue) ? prev.filter((l) => l !== langue) : [...prev, langue]
    )
  }

  const onDropAvatar = useCallback(
    async (acceptedFiles) => {
      if (acceptedFiles.length === 0) return

      const file = acceptedFiles[0]
      setUploadingPhoto(true)

      try {
        const fileExt = file.name.split('.').pop()
        const fileName = `${user.id}/avatar-${Date.now()}.${fileExt}`

        if (profile?.photo_url) {
          const oldPath = profile.photo_url.split('/avatars/')[1]
          if (oldPath) {
            await supabase.storage.from('avatars').remove([oldPath])
          }
        }

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, file, { upsert: true })

        if (uploadError) throw uploadError

        const { data: urlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName)

        const publicUrl = urlData.publicUrl

        const { error: updateError } = await supabase
          .from('profiles')
          .update({ photo_url: publicUrl })
          .eq('id', user.id)

        if (updateError) throw updateError

        setAvatarUrl(publicUrl)
        await fetchProfile(user.id)
        toast.success('Photo mise a jour')
      } catch (error) {
        console.error('Erreur lors du telechargement de la photo:', error)
        toast.error('Erreur lors du telechargement de la photo')
      } finally {
        setUploadingPhoto(false)
      }
    },
    [user, profile, fetchProfile]
  )

  const { getRootProps: getAvatarRootProps, getInputProps: getAvatarInputProps } = useDropzone({
    onDrop: onDropAvatar,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
    },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          nom: form.nom,
          prenom: form.prenom,
          telephone: form.telephone,
          specialite: form.specialite,
          ville: form.ville,
          description: form.description,
          tarif: form.tarif ? Number(form.tarif) : null,
          aide_juridictionnelle: form.aide_juridictionnelle,
          cal_link: form.cal_link,
        })
        .eq('id', user.id)

      if (error) throw error

      await fetchProfile(user.id)
      toast.success('Profil mis a jour')
    } catch (error) {
      console.error('Erreur lors de la mise a jour du profil:', error)
      toast.error('Erreur lors de la mise a jour du profil')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    )
  }

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'specialites', label: 'Specialite(s)' },
    { id: 'langues', label: 'Langue(s)' },
  ]

  return (
    <div className="space-y-0">
      {/* Header with dark banner */}
      <div className="bg-[#1a1a1a] rounded-t-xl px-6 pt-6 pb-20 relative">
        <h1 className="text-xl font-bold text-white">Mon Profil</h1>
        <p className="text-gray-400 text-sm mt-1">Modifiez vos informations personnelles</p>
      </div>

      {/* Avatar overlapping banner */}
      <div className="relative px-6 -mt-12 mb-6">
        <div
          {...getAvatarRootProps()}
          className="relative group cursor-pointer inline-block"
        >
          <input {...getAvatarInputProps()} />
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Photo de profil"
              className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div className="h-24 w-24 rounded-full bg-gray-300 flex items-center justify-center border-4 border-white shadow-lg">
              <User className="h-10 w-10 text-gray-500" />
            </div>
          )}
          <div className="absolute bottom-0 right-0 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center border-2 border-white shadow-md">
            <Camera className="h-4 w-4 text-white" />
          </div>
          {uploadingPhoto && (
            <div className="absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            </div>
          )}
        </div>
        <div className="inline-block ml-4 align-bottom pb-2">
          <p className="text-lg font-semibold text-gray-900">
            {form.prenom} {form.nom}
          </p>
          <p className="text-sm text-gray-500">Avocat</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 border-b border-gray-200">
        <div className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <form onSubmit={handleSubmit}>
        {activeTab === 'general' && (
          <div className="p-6 space-y-6">
            {/* Personal Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Prenom */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Prenom</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="prenom"
                    value={form.prenom}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                    required
                  />
                </div>
              </div>

              {/* Nom */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="nom"
                    value={form.nom}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 cursor-not-allowed"
                    readOnly
                  />
                </div>
              </div>

              {/* Telephone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Telephone</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="telephone"
                    value={form.telephone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                    placeholder="06 12 34 56 78"
                  />
                </div>
              </div>

              {/* Adresse */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Adresse du cabinet</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="adresse"
                    value={form.adresse}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                    placeholder="12 Rue de la Paix, 75002 Paris"
                  />
                </div>
              </div>
            </div>

            {/* Add RDV location */}
            <button
              type="button"
              className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Ajouter un lieu de RDV
            </button>

            {/* Separator */}
            <hr className="border-gray-200" />

            {/* Payment Methods */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Moyens de paiement acceptes</h3>
              <div className="flex flex-wrap gap-4">
                {[
                  { key: 'carte', label: 'Carte bancaire', icon: CreditCard },
                  { key: 'virement', label: 'Virement', icon: Globe },
                  { key: 'cheque', label: 'Cheque', icon: CreditCard },
                  { key: 'especes', label: 'Especes', icon: CreditCard },
                ].map((method) => (
                  <label
                    key={method.key}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={paymentMethods[method.key]}
                      onChange={() =>
                        setPaymentMethods((prev) => ({
                          ...prev,
                          [method.key]: !prev[method.key],
                        }))
                      }
                      className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-sm text-gray-700">{method.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Separator */}
            <hr className="border-gray-200" />

            {/* Visio Options */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Consultation en visio</h3>
              <div className="flex flex-wrap gap-6">
                {[
                  { value: 'visio_only', label: 'Visio uniquement' },
                  { value: 'cabinet_only', label: 'Cabinet uniquement' },
                  { value: 'both', label: 'Les deux' },
                ].map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="visio"
                      value={option.value}
                      checked={visioOption === option.value}
                      onChange={(e) => setVisioOption(e.target.value)}
                      className="h-4 w-4 border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Separator */}
            <hr className="border-gray-200" />

            {/* Security */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Securite</h3>
              <button
                type="button"
                className="flex items-center justify-between w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Lock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">Changer le mot de passe</span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>
            </div>

            {/* Data Protection Info */}
            <div className="bg-primary-50 border border-primary-100 rounded-lg p-4 flex gap-3">
              <Shield className="h-5 w-5 text-primary-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-primary-800">Protection des donnees</p>
                <p className="text-xs text-primary-600 mt-1">
                  Vos informations personnelles sont protegees conformement au RGPD. Elles ne sont
                  partagees qu'avec les clients qui prennent rendez-vous avec vous.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Enregistrement...' : 'Sauvegarder'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'specialites' && (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Specialite principale</h3>
              <p className="text-xs text-gray-500 mb-3">Selectionnez votre domaine d'expertise principal</p>
              <select
                name="specialite"
                value={form.specialite}
                onChange={handleChange}
                className="w-full md:w-1/2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">Selectionnez une specialite</option>
                {SPECIALITES.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Ville</h3>
              <p className="text-xs text-gray-500 mb-3">Ville ou vous exercez</p>
              <select
                name="ville"
                value={form.ville}
                onChange={handleChange}
                className="w-full md:w-1/2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">Selectionnez une ville</option>
                {VILLES.map((ville) => (
                  <option key={ville} value={ville}>
                    {ville}
                  </option>
                ))}
              </select>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Description</h3>
              <p className="text-xs text-gray-500 mb-3">Decrivez votre parcours et vos competences</p>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 resize-none"
                placeholder="Decrivez votre parcours, vos competences et votre approche..."
              />
            </div>

            <hr className="border-gray-200" />

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Tarif horaire</h3>
              <p className="text-xs text-gray-500 mb-3">Indiquez votre tarif de consultation</p>
              <div className="relative w-full md:w-1/3">
                <input
                  type="number"
                  name="tarif"
                  value={form.tarif}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm pr-12 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                  placeholder="150"
                  min="0"
                  step="1"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  €/h
                </span>
              </div>
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="aide_juridictionnelle"
                  checked={form.aide_juridictionnelle}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Accepte l'aide juridictionnelle
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Enregistrement...' : 'Sauvegarder'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'langues' && (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Langues parlees</h3>
              <p className="text-xs text-gray-500 mb-4">
                Selectionnez les langues dans lesquelles vous pouvez assurer des consultations
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {LANGUES.map((langue) => (
                  <label
                    key={langue}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedLangues.includes(langue)
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedLangues.includes(langue)}
                      onChange={() => toggleLangue(langue)}
                      className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-sm text-gray-700">{langue}</span>
                  </label>
                ))}
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Lien de reservation</h3>
              <p className="text-xs text-gray-500 mb-3">Lien Cal.com pour la prise de rendez-vous</p>
              <input
                type="url"
                name="cal_link"
                value={form.cal_link}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                placeholder="https://cal.com/votre-nom"
              />
              <p className="text-xs text-gray-400 mt-1">
                Ce lien sera utilise par les clients pour prendre rendez-vous avec vous.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Enregistrement...' : 'Sauvegarder'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
