import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ArrowLeft, Search, User, Briefcase } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { SPECIALITES, VILLES } from '../../lib/constants'

export default function ClientNewCase() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [titre, setTitre] = useState('')
  const [description, setDescription] = useState('')
  const [avocatId, setAvocatId] = useState('')
  const [avocats, setAvocats] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [loadingAvocats, setLoadingAvocats] = useState(true)

  useEffect(() => {
    fetchAvocats()
  }, [])

  const fetchAvocats = async () => {
    try {
      setLoadingAvocats(true)

      const { data, error } = await supabase
        .from('profiles')
        .select('id, nom, prenom, specialite, ville')
        .eq('role', 'avocat')
        .order('nom', { ascending: true })

      if (error) throw error
      setAvocats(data || [])
    } catch (error) {
      console.error('Error fetching avocats:', error)
    } finally {
      setLoadingAvocats(false)
    }
  }

  const filteredAvocats = avocats.filter((avocat) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      `${avocat.prenom || ''} ${avocat.nom || ''}`.toLowerCase().includes(query) ||
      avocat.specialite?.toLowerCase().includes(query) ||
      avocat.ville?.toLowerCase().includes(query)
    )
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!titre.trim()) {
      toast.error('Veuillez entrer un titre pour le dossier.')
      return
    }

    try {
      setSubmitting(true)

      const caseData = {
        titre: titre.trim(),
        description: description.trim(),
        client_id: user.id,
        statut: 'en_attente',
      }

      if (avocatId) {
        caseData.avocat_id = avocatId
      }

      const { error } = await supabase.from('cases').insert(caseData)

      if (error) throw error

      toast.success('Dossier cree avec succes')
      navigate('/client/cases')
    } catch (error) {
      console.error('Error creating case:', error)
      toast.error('Erreur lors de la creation du dossier.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back Link */}
      <Link
        to="/client/cases"
        className="inline-flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Retour aux dossiers</span>
      </Link>

      {/* Form Card */}
      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Nouveau dossier
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Titre */}
          <div>
            <label
              htmlFor="titre"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Titre du dossier <span className="text-red-500">*</span>
            </label>
            <input
              id="titre"
              type="text"
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              className="input-field"
              placeholder="Ex: Litige avec mon proprietaire"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field min-h-[120px] resize-y"
              placeholder="Decrivez votre situation en detail..."
              rows={5}
            />
          </div>

          {/* Avocat Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Selectionner un avocat
            </label>

            {/* Search */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10"
                placeholder="Rechercher par nom, specialite ou ville..."
              />
            </div>

            {/* Avocats List */}
            <div className="border border-gray-200 rounded-lg max-h-64 overflow-y-auto">
              {loadingAvocats ? (
                <div className="p-4 text-center text-gray-500 text-sm">
                  Chargement des avocats...
                </div>
              ) : filteredAvocats.length === 0 ? (
                <div className="p-4 text-center text-gray-500 text-sm">
                  Aucun avocat trouve.
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {/* Option: No avocat */}
                  <label
                    className={`flex items-center space-x-3 p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                      avocatId === '' ? 'bg-primary-50' : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="avocat"
                      value=""
                      checked={avocatId === ''}
                      onChange={() => setAvocatId('')}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-600 italic">
                      Sans avocat (assignation ulterieure)
                    </span>
                  </label>

                  {filteredAvocats.map((avocat) => (
                    <label
                      key={avocat.id}
                      className={`flex items-center space-x-3 p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                        avocatId === avocat.id ? 'bg-primary-50' : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name="avocat"
                        value={avocat.id}
                        checked={avocatId === avocat.id}
                        onChange={() => setAvocatId(avocat.id)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                      />
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="h-4 w-4 text-primary-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {avocat.prenom} {avocat.nom}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center space-x-2">
                            {avocat.specialite && (
                              <span className="flex items-center space-x-1">
                                <Briefcase className="h-3 w-3" />
                                <span>{avocat.specialite}</span>
                              </span>
                            )}
                            {avocat.ville && (
                              <span>- {avocat.ville}</span>
                            )}
                          </p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-100">
            <Link to="/client/cases" className="btn-secondary">
              Annuler
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Creation en cours...' : 'Creer le dossier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
