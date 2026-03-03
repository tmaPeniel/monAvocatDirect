import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { SPECIALITES, VILLES } from '../../lib/constants'
import toast from 'react-hot-toast'
import { useDropzone } from 'react-dropzone'
import { Save, Upload, Camera, User } from 'lucide-react'

export default function LawyerProfileEdit() {
  const { user, profile, fetchProfile } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(null)

  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    specialite: '',
    ville: '',
    description: '',
    tarif: '',
    aide_juridictionnelle: false,
    cal_link: '',
  })

  useEffect(() => {
    if (profile) {
      setForm({
        nom: profile.nom || '',
        prenom: profile.prenom || '',
        email: profile.email || user?.email || '',
        telephone: profile.telephone || '',
        specialite: profile.specialite || '',
        ville: profile.ville || '',
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

  const onDropAvatar = useCallback(
    async (acceptedFiles) => {
      if (acceptedFiles.length === 0) return

      const file = acceptedFiles[0]
      setUploadingPhoto(true)

      try {
        const fileExt = file.name.split('.').pop()
        const fileName = `${user.id}/avatar-${Date.now()}.${fileExt}`

        // Remove old avatar if exists
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

        // Update profile with new avatar URL
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
    maxSize: 5 * 1024 * 1024, // 5MB
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Modifier mon profil</h1>
        <p className="text-gray-500 mt-1">
          Mettez a jour vos informations pour apparaitre dans les resultats de recherche
        </p>
      </div>

      {/* Avatar upload */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Photo de profil</h2>
        <div className="flex items-center gap-6">
          <div
            {...getAvatarRootProps()}
            className="relative group cursor-pointer"
          >
            <input {...getAvatarInputProps()} />
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Photo de profil"
                className="h-24 w-24 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                <User className="h-10 w-10 text-gray-400" />
              </div>
            )}
            <div className="absolute inset-0 rounded-full bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="h-6 w-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600">
              Cliquez sur la photo pour la modifier
            </p>
            <p className="text-xs text-gray-400 mt-1">
              JPG, PNG ou WebP — 5 Mo max
            </p>
            {uploadingPhoto && (
              <p className="text-sm text-primary-500 mt-1">Telechargement en cours...</p>
            )}
          </div>
        </div>
      </div>

      {/* Profile form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations personnelles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-1">
                Prenom
              </label>
              <input
                type="text"
                id="prenom"
                name="prenom"
                value={form.prenom}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
                Nom
              </label>
              <input
                type="text"
                id="nom"
                name="nom"
                value={form.nom}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                className="input-field bg-gray-50 cursor-not-allowed"
                readOnly
              />
            </div>
            <div>
              <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-1">
                Telephone
              </label>
              <input
                type="tel"
                id="telephone"
                name="telephone"
                value={form.telephone}
                onChange={handleChange}
                className="input-field"
                placeholder="06 12 34 56 78"
              />
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations professionnelles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="specialite" className="block text-sm font-medium text-gray-700 mb-1">
                Specialite
              </label>
              <select
                id="specialite"
                name="specialite"
                value={form.specialite}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Selectionnez une specialite</option>
                {SPECIALITES.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="ville" className="block text-sm font-medium text-gray-700 mb-1">
                Ville
              </label>
              <select
                id="ville"
                name="ville"
                value={form.ville}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Selectionnez une ville</option>
                {VILLES.map((ville) => (
                  <option key={ville} value={ville}>
                    {ville}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={5}
                className="input-field resize-none"
                placeholder="Decrivez votre parcours, vos competences et votre approche..."
              />
            </div>
            <div>
              <label htmlFor="tarif" className="block text-sm font-medium text-gray-700 mb-1">
                Tarif horaire
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="tarif"
                  name="tarif"
                  value={form.tarif}
                  onChange={handleChange}
                  className="input-field pr-12"
                  placeholder="150"
                  min="0"
                  step="1"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  €/h
                </span>
              </div>
            </div>
            <div className="flex items-center pt-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="aide_juridictionnelle"
                  checked={form.aide_juridictionnelle}
                  onChange={handleChange}
                  className="h-5 w-5 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Accepte l'aide juridictionnelle
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Lien de reservation</h2>
          <div>
            <label htmlFor="cal_link" className="block text-sm font-medium text-gray-700 mb-1">
              Lien Cal.com
            </label>
            <input
              type="url"
              id="cal_link"
              name="cal_link"
              value={form.cal_link}
              onChange={handleChange}
              className="input-field"
              placeholder="https://cal.com/votre-nom"
            />
            <p className="text-xs text-gray-400 mt-1">
              Ce lien sera utilise par les clients pour prendre rendez-vous avec vous.
            </p>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </div>
      </form>
    </div>
  )
}
